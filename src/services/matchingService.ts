
import { supabase } from '../lib/supabase';
import { Item } from '../types/database.types';
import { notificationService } from './notificationService';
import { aiService } from './aiService';

export const matchingService = {
  // Find potential matches for an item
  async findPotentialMatches(itemId: string): Promise<Item[]> {
    try {
      // First, get the item details
      const { data: item, error: itemError } = await supabase
        .from('items')
        .select('*')
        .eq('id', itemId)
        .single();

      if (itemError || !item) {
        console.error('Error fetching item:', itemError);
        return [];
      }

      // Determine if we're looking for lost or found items
      const oppositeStatus = item.status === 'lost' ? 'found' : 'lost';
      
      // Search for items with opposite status and similar location
      const { data: matches, error: matchError } = await supabase
        .from('items')
        .select('*')
        .eq('status', oppositeStatus)
        .ilike('location', `%${item.location}%`)
        .neq('id', itemId);

      if (matchError) {
        console.error('Error finding matches:', matchError);
        return [];
      }

      const potentialMatches = matches as Item[];
      
      // If we have matches by location, now try to match by image similarity using AI
      if (potentialMatches.length > 0) {
        console.log(`Found ${potentialMatches.length} location-based matches for item ${itemId}`);
        
        try {
          // Get image features for current item
          const currentItemFeatures = await aiService.extractImageFeatures(item.image_url);
          if (currentItemFeatures) {
            // Filter matches by image similarity
            const similarityResults = await Promise.all(
              potentialMatches.map(async (match) => {
                const matchFeatures = await aiService.extractImageFeatures(match.image_url);
                if (!matchFeatures) return { item: match, similarity: 0 };
                
                const similarity = aiService.calculateSimilarity(currentItemFeatures, matchFeatures);
                return { item: match, similarity };
              })
            );
            
            // Sort matches by similarity (highest first) and filter out low similarity matches
            const highConfidenceMatches = similarityResults
              .filter(result => result.similarity > 0.6) // Threshold for similarity
              .sort((a, b) => b.similarity - a.similarity)
              .map(result => result.item);
              
            console.log(`Found ${highConfidenceMatches.length} high-confidence matches based on image similarity`);
            
            // Send notifications for high confidence matches
            if (highConfidenceMatches.length > 0) {
              await this.sendDetailedMatchNotifications(item, highConfidenceMatches);
              return highConfidenceMatches;
            }
          }
        } catch (aiError) {
          console.error('Error during AI similarity matching:', aiError);
          // Fall back to location-based matches if AI matching fails
        }
        
        // Send notifications for all location-based matches if AI matching wasn't successful
        await this.sendDetailedMatchNotifications(item, potentialMatches);
      }

      return potentialMatches;
    } catch (error) {
      console.error('Error in findPotentialMatches:', error);
      return [];
    }
  },
  
  // Send detailed notifications for matching items
  async sendDetailedMatchNotifications(currentItem: Item, matchedItems: Item[]): Promise<void> {
    try {
      // Get current user info (we need their email)
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('User authentication error:', userError);
        return;
      }
      
      // For the current item owner
      const currentItemTitle = currentItem.title;
      const matchCount = matchedItems.length;
      const currentItemStatus = currentItem.status;
      
      // Create notification for current user
      const notificationTitle = `Potential match${matchCount > 1 ? 'es' : ''} found!`;
      const notificationMessage = `We found ${matchCount} potential match${matchCount > 1 ? 'es' : ''} for your ${currentItemStatus} item "${currentItemTitle}".`;
      
      await notificationService.createNotification(
        user.id,
        notificationTitle,
        notificationMessage,
        currentItem.id
      );
      
      // Send email to current user if they have an email
      if (user.email) {
        const emailSubject = notificationTitle;
        let emailBody = `
          Hello,
          
          Good news! ${notificationMessage}
          
          Here are the details of the potential match${matchCount > 1 ? 'es' : ''}:
        `;
        
        // Add details of each match
        matchedItems.forEach((match, index) => {
          emailBody += `
          Match #${index + 1}:
          - Item: ${match.title}
          - Category: ${match.category}
          - Location: ${match.location}
          - Date: ${new Date(match.date_reported).toLocaleDateString()}
          - Description: ${match.description}
          
          `;
        });
        
        emailBody += `
          Please log in to your account to view the potential matches and take further action.
          
          Thank you,
          Lost & Found Team
        `;
        
        await notificationService.sendEmailNotification(
          user.email,
          emailSubject,
          emailBody
        );
      }
      
      // Now notify the owners of the matched items
      for (const matchedItem of matchedItems) {
        // Get the user ID of the matched item owner
        const matchedUserId = matchedItem.user_id;
        
        if (matchedUserId) {
          // Get user information to get their email
          const { data: matchedUserData, error: matchedUserError } = await supabase
            .from('profiles')
            .select('email')
            .eq('id', matchedUserId)
            .single();
            
          if (matchedUserError) {
            // If profiles table doesn't exist, try to get the email from auth.users
            const { data: { user: matchedUser }, error: authError } = await supabase.auth.admin.getUserById(matchedUserId);
            
            if (!authError && matchedUser && matchedUser.email) {
              // Create notification for the matched item owner
              const matchNotificationTitle = "Item match found!";
              const matchNotificationMessage = `Your ${matchedItem.status} item "${matchedItem.title}" may match someone's ${currentItemStatus} item "${currentItemTitle}".`;
              
              await notificationService.createNotification(
                matchedUserId,
                matchNotificationTitle,
                matchNotificationMessage,
                matchedItem.id
              );
              
              // Send email with detailed information
              const matchedEmailSubject = matchNotificationTitle;
              const matchedEmailBody = `
                Hello,
                
                ${matchNotificationMessage}
                
                Here are the details of the match:
                
                Your item:
                - Item: ${matchedItem.title}
                - Category: ${matchedItem.category}
                - Location: ${matchedItem.location}
                - Date: ${new Date(matchedItem.date_reported).toLocaleDateString()}
                
                Matched item:
                - Item: ${currentItem.title}
                - Category: ${currentItem.category}
                - Location: ${currentItem.location}
                - Date: ${new Date(currentItem.date_reported).toLocaleDateString()}
                - Description: ${currentItem.description}
                
                Please log in to your account to view the potential match and take further action.
                
                Thank you,
                Lost & Found Team
              `;
              
              await notificationService.sendEmailNotification(
                matchedUser.email,
                matchedEmailSubject,
                matchedEmailBody
              );
            }
          } else if (matchedUserData && matchedUserData.email) {
            // Create notification for the matched item owner
            const matchNotificationTitle = "Item match found!";
            const matchNotificationMessage = `Your ${matchedItem.status} item "${matchedItem.title}" may match someone's ${currentItemStatus} item "${currentItemTitle}".`;
            
            await notificationService.createNotification(
              matchedUserId,
              matchNotificationTitle,
              matchNotificationMessage,
              matchedItem.id
            );
            
            // Send email to matched user with more detailed information
            const matchedEmailSubject = matchNotificationTitle;
            const matchedEmailBody = `
              Hello,
              
              ${matchNotificationMessage}
              
              Here are the details of the match:
              
              Your item:
              - Item: ${matchedItem.title}
              - Category: ${matchedItem.category}
              - Location: ${matchedItem.location}
              - Date: ${new Date(matchedItem.date_reported).toLocaleDateString()}
              
              Matched item:
              - Item: ${currentItem.title}
              - Category: ${currentItem.category}
              - Location: ${currentItem.location}
              - Date: ${new Date(currentItem.date_reported).toLocaleDateString()}
              - Description: ${currentItem.description}
              
              Please log in to your account to view the potential match and take further action.
              
              Thank you,
              Lost & Found Team
            `;
            
            await notificationService.sendEmailNotification(
              matchedUserData.email,
              matchedEmailSubject,
              matchedEmailBody
            );
          }
        }
      }
    } catch (error) {
      console.error('Error sending match notifications:', error);
    }
  }
};

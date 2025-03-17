
import { supabase } from '../lib/supabase';
import { Item } from '../types/database.types';
import { notificationService } from './notificationService';

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
      
      if (potentialMatches.length > 0) {
        console.log(`Found ${potentialMatches.length} potential matches for item ${itemId}`);
        
        // Send notifications for each match
        await this.sendMatchNotifications(item, potentialMatches);
      }

      return potentialMatches;
    } catch (error) {
      console.error('Error in findPotentialMatches:', error);
      return [];
    }
  },
  
  // Send notifications for matching items
  async sendMatchNotifications(currentItem: Item, matchedItems: Item[]): Promise<void> {
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
        const emailBody = `
          Hello,
          
          Good news! ${notificationMessage}
          
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
          
          if (!matchedUserError && matchedUserData) {
            // Create notification for the matched item owner
            const matchNotificationTitle = "Item match found!";
            const matchNotificationMessage = `Your ${matchedItem.status} item "${matchedItem.title}" may match someone's ${currentItemStatus} item "${currentItemTitle}".`;
            
            await notificationService.createNotification(
              matchedUserId,
              matchNotificationTitle,
              matchNotificationMessage,
              matchedItem.id
            );
            
            // Send email to matched user if we have their email
            if (matchedUserData.email) {
              const matchedEmailSubject = matchNotificationTitle;
              const matchedEmailBody = `
                Hello,
                
                ${matchNotificationMessage}
                
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
      }
    } catch (error) {
      console.error('Error sending match notifications:', error);
    }
  }
};

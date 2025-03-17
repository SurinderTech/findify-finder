
import { supabase } from '../lib/supabase';
import { Item, Match } from '../types/database.types';
import { aiService } from './aiService';
import { toast } from 'sonner';

export const matchingService = {
  // Find potential matches for a lost item
  async findPotentialMatches(itemId: string): Promise<Match[]> {
    try {
      // Get the item details
      const { data: item, error: itemError } = await supabase
        .from('items')
        .select('*')
        .eq('id', itemId)
        .single();

      if (itemError || !item) {
        console.error('Error fetching item:', itemError);
        return [];
      }

      // Use AI service to find potential matches
      console.log('Finding matches for item:', itemId);
      let matchingItemIds: string[] = [];
      
      try {
        matchingItemIds = await aiService.checkForMatches(itemId);
      } catch (aiError) {
        console.error('Error checking for matches:', aiError);
        return [];
      }
      
      if (matchingItemIds.length === 0) {
        console.log('No matching items found');
        return [];
      }
      
      console.log('Found potential matches:', matchingItemIds);
      
      // Create match records for each potential match
      const matches: Match[] = [];
      
      for (const matchingItemId of matchingItemIds) {
        try {
          // Check if we already have this match
          const { data: existingMatches } = await supabase
            .from('matches')
            .select('id')
            .or(`lost_item_id.eq.${itemId},found_item_id.eq.${itemId}`)
            .or(`lost_item_id.eq.${matchingItemId},found_item_id.eq.${matchingItemId}`)
            .limit(1);
            
          if (existingMatches && existingMatches.length > 0) {
            console.log('Match already exists:', existingMatches[0].id);
            continue;
          }
          
          // Get the match score using AI
          const { data: matchItem } = await supabase
            .from('items')
            .select('*')
            .eq('id', matchingItemId)
            .single();
            
          if (!matchItem) continue;
          
          // Calculate similarity if features exist
          let matchScore = 0;
          try {
            // Extract features for both items and calculate similarity
            const features1 = await aiService.extractImageFeatures(item.image_url);
            const features2 = await aiService.extractImageFeatures(matchItem.image_url);
            
            if (features1 && features2) {
              const similarity = aiService.calculateSimilarity(features1, features2);
              matchScore = Math.round(similarity * 100);
            }
          } catch (featureError) {
            console.error('Error calculating similarity:', featureError);
            matchScore = 50; // Default score if calculation fails
          }
          
          // Create a new match record
          const lostItemId = item.status === 'lost' ? item.id : matchingItemId;
          const foundItemId = item.status === 'found' ? item.id : matchingItemId;
          
          const { data: newMatch, error: matchError } = await supabase
            .from('matches')
            .insert({
              lost_item_id: lostItemId,
              found_item_id: foundItemId,
              match_score: matchScore,
              status: 'pending',
              created_at: new Date().toISOString()
            })
            .select()
            .single();
            
          if (matchError) {
            console.error('Error creating match record:', matchError);
            continue;
          }
          
          if (newMatch) {
            matches.push(newMatch as Match);
            
            // Get user details for both item owners
            const [lostItem, foundItem] = await Promise.all([
              supabase.from('items').select('user_id, title').eq('id', lostItemId).single(),
              supabase.from('items').select('user_id, title').eq('id', foundItemId).single()
            ]);
            
            if (lostItem.data && foundItem.data) {
              const [lostUser, foundUser] = await Promise.all([
                supabase.from('profiles').select('email, full_name').eq('id', lostItem.data.user_id).single(),
                supabase.from('profiles').select('email, full_name').eq('id', foundItem.data.user_id).single()
              ]);
              
              // Show toast notification in UI
              toast.success(`Found a potential match with ${matchScore}% similarity!`, {
                description: `Match found between "${lostItem.data.title}" and "${foundItem.data.title}"`,
                duration: 10000,
              });
              
              // Send email notifications to both users
              await this.sendMatchNotificationEmails(
                lostUser.data?.email,
                foundUser.data?.email,
                lostItem.data.title,
                foundItem.data.title,
                matchScore,
                newMatch.id
              );
              
              // Send in-app notifications too if there's a notification system
              await this.createInAppNotification(
                lostItem.data.user_id,
                `Potential match found for your lost item "${lostItem.data.title}" with ${matchScore}% similarity!`,
                `/matches/${newMatch.id}`
              );
              
              await this.createInAppNotification(
                foundItem.data.user_id,
                `Your found item "${foundItem.data.title}" potentially matches someone's lost item with ${matchScore}% similarity!`,
                `/matches/${newMatch.id}`
              );
            }
          }
        } catch (matchProcessError) {
          console.error('Error processing potential match:', matchProcessError);
          // Continue to next match
        }
      }
      
      return matches;
    } catch (error) {
      console.error('Error in findPotentialMatches:', error);
      return [];
    }
  },

  // Send email notifications to both users about a potential match
  async sendMatchNotificationEmails(
    lostUserEmail?: string,
    foundUserEmail?: string,
    lostItemTitle?: string,
    foundItemTitle?: string,
    matchScore?: number,
    matchId?: string
  ): Promise<boolean> {
    try {
      if (!lostUserEmail || !foundUserEmail) {
        console.error('Missing email addresses for match notification');
        return false;
      }

      const matchUrl = `${window.location.origin}/matches/${matchId}`;
      
      // Send email to the user who lost the item
      await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: lostUserEmail,
          subject: 'Good News! Potential Match Found for Your Lost Item',
          html: `
            <h1>We Found a Potential Match!</h1>
            <p>Good news! Your lost item "${lostItemTitle}" has a <strong>${matchScore}%</strong> match with a found item "${foundItemTitle}".</p>
            <p>To view the match details and connect with the finder, please click the button below:</p>
            <p><a href="${matchUrl}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View Match Details</a></p>
            <p>Thank you for using our Lost & Found platform!</p>
          `,
        }),
      });
      
      // Send email to the user who found the item
      await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: foundUserEmail,
          subject: 'Good News! Your Found Item Matches Someone\'s Lost Item',
          html: `
            <h1>Match Found!</h1>
            <p>The item you found "${foundItemTitle}" has a <strong>${matchScore}%</strong> match with someone's lost item "${lostItemTitle}".</p>
            <p>To view the match details and connect with the owner, please click the button below:</p>
            <p><a href="${matchUrl}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View Match Details</a></p>
            <p>Thank you for helping reunite lost items with their owners!</p>
          `,
        }),
      });
      
      console.log('Match notification emails sent successfully');
      return true;
    } catch (error) {
      console.error('Error sending match notification emails:', error);
      return false;
    }
  },

  // Create in-app notification for real-time notification system
  async createInAppNotification(
    userId: string,
    message: string,
    link: string
  ): Promise<boolean> {
    try {
      // Check if notifications table exists
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          message: message,
          link: link,
          is_read: false,
          created_at: new Date().toISOString()
        });
      
      if (notificationError) {
        console.error('Error creating notification:', notificationError);
        
        // If table doesn't exist, log helpful message but don't fail
        if (notificationError.message.includes('relation "notifications" does not exist')) {
          console.warn('Notifications table does not exist. Create it to enable in-app notifications.');
          console.warn('Required columns: id, user_id, message, link, is_read, created_at');
        }
        
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error creating in-app notification:', error);
      return false;
    }
  },

  // Confirm a match
  async confirmMatch(matchId: string): Promise<boolean> {
    try {
      // Update the match status
      const { error: matchError } = await supabase
        .from('matches')
        .update({ status: 'confirmed' })
        .eq('id', matchId);

      if (matchError) {
        console.error('Error confirming match:', matchError);
        return false;
      }

      // Get the match details
      const { data: match, error: getMatchError } = await supabase
        .from('matches')
        .select('*')
        .eq('id', matchId)
        .single();

      if (getMatchError || !match) {
        console.error('Error fetching match details:', getMatchError);
        return false;
      }

      // Update the status of both items
      const { error: lostItemError } = await supabase
        .from('items')
        .update({ status: 'claimed' })
        .eq('id', match.lost_item_id);

      if (lostItemError) {
        console.error('Error updating lost item status:', lostItemError);
        return false;
      }

      const { error: foundItemError } = await supabase
        .from('items')
        .update({ status: 'returned' })
        .eq('id', match.found_item_id);

      if (foundItemError) {
        console.error('Error updating found item status:', foundItemError);
        return false;
      }

      // Get details for both items to send confirmation notifications
      const [lostItem, foundItem] = await Promise.all([
        supabase.from('items').select('user_id, title').eq('id', match.lost_item_id).single(),
        supabase.from('items').select('user_id, title').eq('id', match.found_item_id).single()
      ]);
      
      if (lostItem.data && foundItem.data) {
        const [lostUser, foundUser] = await Promise.all([
          supabase.from('profiles').select('email, full_name').eq('id', lostItem.data.user_id).single(),
          supabase.from('profiles').select('email, full_name').eq('id', foundItem.data.user_id).single()
        ]);
        
        // Show toast notification for match confirmation
        toast.success('Match confirmed! Item will be returned to owner', {
          description: 'Thank you for helping reunite lost items with their owners!',
          duration: 5000,
        });
        
        // Send confirmation emails to both users
        this.sendMatchConfirmationEmails(
          lostUser.data?.email,
          foundUser.data?.email,
          lostItem.data.title,
          foundItem.data.title
        );
        
        // Create in-app notifications for match confirmation
        this.createInAppNotification(
          lostItem.data.user_id,
          `Great news! Your item "${lostItem.data.title}" has been found and will be returned to you.`,
          `/items/${match.lost_item_id}`
        );
        
        this.createInAppNotification(
          foundItem.data.user_id,
          `Thank you! You successfully returned "${foundItem.data.title}" to its owner.`,
          `/items/${match.found_item_id}`
        );
      }

      // Get the found item to find its user
      const { data: foundItemData, error: foundItemFetchError } = await supabase
        .from('items')
        .select('user_id')
        .eq('id', match.found_item_id)
        .single();

      if (foundItemFetchError || !foundItemData) {
        console.error('Error fetching found item details:', foundItemFetchError);
        return false;
      }

      // Award points to the user who found the item
      // This will call our user service addReturnPoints
      await fetch('/api/award-points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: foundItemData.user_id,
          points: 10,
        }),
      });

      return true;
    } catch (error) {
      console.error('Error in confirmMatch:', error);
      return false;
    }
  },
  
  // Send confirmation emails when a match is confirmed
  async sendMatchConfirmationEmails(
    lostUserEmail?: string,
    foundUserEmail?: string,
    lostItemTitle?: string,
    foundItemTitle?: string
  ): Promise<boolean> {
    try {
      if (!lostUserEmail || !foundUserEmail) {
        console.error('Missing email addresses for match confirmation');
        return false;
      }
      
      // Send email to the user who lost the item
      await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: lostUserEmail,
          subject: 'Great News! Your Lost Item Has Been Found',
          html: `
            <h1>Your Item Has Been Found!</h1>
            <p>Wonderful news! Your lost item "${lostItemTitle}" has been confirmed as found and will be returned to you.</p>
            <p>The finder has been notified and will contact you soon to arrange the return.</p>
            <p>Thank you for using our Lost & Found platform!</p>
          `,
        }),
      });
      
      // Send email to the user who found the item
      await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: foundUserEmail,
          subject: 'Thank You for Returning a Lost Item',
          html: `
            <h1>Thank You for Your Kindness!</h1>
            <p>Your found item "${foundItemTitle}" has been confirmed as a match with its owner!</p>
            <p>You've been awarded points for your good deed, and the owner has been notified.</p>
            <p>Please arrange to return the item to its rightful owner.</p>
            <p>Thank you for making someone's day better!</p>
          `,
        }),
      });
      
      console.log('Match confirmation emails sent successfully');
      return true;
    } catch (error) {
      console.error('Error sending match confirmation emails:', error);
      return false;
    }
  }
};

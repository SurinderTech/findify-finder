
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
            .select('image_url')
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
            
            // Notify both item owners
            toast.success(`Found a potential match with ${matchScore}% similarity!`);
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

      // Get the found item to find its user
      const { data: foundItem, error: foundItemFetchError } = await supabase
        .from('items')
        .select('user_id')
        .eq('id', match.found_item_id)
        .single();

      if (foundItemFetchError || !foundItem) {
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
          userId: foundItem.user_id,
          points: 10,
        }),
      });

      return true;
    } catch (error) {
      console.error('Error in confirmMatch:', error);
      return false;
    }
  }
};

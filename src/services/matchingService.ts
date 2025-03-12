
import { supabase } from '../lib/supabase';
import { Item, Match } from '../types/database.types';

export const matchingService = {
  // Find potential matches for a lost item
  async findPotentialMatches(lostItemId: string): Promise<Match[]> {
    try {
      // Get the lost item details
      const { data: lostItem, error: itemError } = await supabase
        .from('items')
        .select('*')
        .eq('id', lostItemId)
        .eq('status', 'lost')
        .single();

      if (itemError || !lostItem) {
        console.error('Error fetching lost item:', itemError);
        return [];
      }

      // Call the Supabase Edge Function to find matches using AI
      // This will be implemented later
      const { data: matches, error: matchError } = await supabase.functions.invoke('find-matches', {
        body: { lostItemId },
      });

      if (matchError) {
        console.error('Error finding matches:', matchError);
        return [];
      }

      return matches as Match[];
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

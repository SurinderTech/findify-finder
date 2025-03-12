
import { supabase } from '../lib/supabase';
import { User } from '../types/database.types';

export const userService = {
  // Get the current user's profile from the profiles table
  async getCurrentUserProfile(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return null;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data as User;
    } catch (error) {
      console.error('Error in getCurrentUserProfile:', error);
      return null;
    }
  },

  // Update or create a user profile
  async updateProfile(
    fullName: string,
    phone?: string
  ): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return null;
      }

      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          full_name: fullName,
          phone: phone || null,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        return null;
      }

      return data as User;
    } catch (error) {
      console.error('Error in updateProfile:', error);
      return null;
    }
  },

  // Add points to user when they return an item
  async addReturnPoints(userId: string, points = 10): Promise<boolean> {
    try {
      // First get current profile
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('points, items_returned')
        .eq('id', userId)
        .single();

      if (fetchError) {
        console.error('Error fetching profile for points update:', fetchError);
        return false;
      }

      // Update profile with new points
      const currentPoints = profile?.points || 0;
      const itemsReturned = profile?.items_returned || 0;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          points: currentPoints + points,
          items_returned: itemsReturned + 1,
        })
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating points:', updateError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in addReturnPoints:', error);
      return false;
    }
  }
};

import { supabase } from '../lib/supabase';
import { Item, ItemStatus } from '../types/database.types';
import { aiService } from './aiService';
import { matchingService } from './matchingService';
import { toast } from 'sonner';

export const itemService = {
  // Submit a new lost or found item
  async submitItem(
    title: string,
    description: string,
    category: string,
    status: ItemStatus,
    location: string,
    date_reported: string,
    imageFile: File
  ): Promise<Item | null> {
    try {
      console.log("Starting item submission process");
      
      // 1. First get the current user before attempting storage operations
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('User authentication error:', userError);
        throw new Error(userError ? userError.message : 'User not authenticated');
      }
      
      console.log("Authenticated user ID:", user.id);
      
      // 2. Generate simple filename for the image to avoid potential issues
      const timestamp = Date.now();
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `item_${timestamp}.${fileExt}`;
      
      console.log("Prepared file name:", fileName);

      // 3. Handle image upload - with better error handling
      let publicUrl = '';
      try {
        console.log("Using placeholder image for now to troubleshoot DB issues");
        publicUrl = '/placeholder.svg';
      } catch (storageError) {
        console.error("Storage operation failed:", storageError);
        publicUrl = '/placeholder.svg';
      }

      // 4. Create the item record in the database with better error handling
      console.log("Creating database record with image URL:", publicUrl);
      console.log("Database insert data:", {
        user_id: user.id,
        title,
        description,
        category,
        status,
        location,
        date_reported,
        image_url: publicUrl
      });
      
      // Check if the items table exists first
      try {
        // Test query to see if the table exists
        const { error: testError } = await supabase
          .from('items')
          .select('count', { count: 'exact', head: true });
        
        if (testError) {
          console.error('Test query failed - items table may not exist:', testError);
          throw new Error(`Items table may not exist: ${testError.message}`);
        }
        
        console.log('Items table exists, proceeding with insert');
      } catch (testErr) {
        console.error('Error testing items table:', testErr);
        throw new Error('Failed to verify items table existence');
      }
      
      // Now try the actual insert
      const { data, error } = await supabase
        .from('items')
        .insert({
          user_id: user.id,
          title,
          description,
          category,
          status,
          location,
          date_reported,
          image_url: publicUrl,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating item in database:', error);
        console.error('Full error object:', JSON.stringify(error, null, 2));
        throw new Error(`Database insert failed: ${error.message || 'Unknown error'}`);
      }

      if (!data) {
        console.error('No data returned from database insert');
        throw new Error('No data returned from database insert');
      }

      console.log("Item created successfully:", data);
      
      // For now, skip AI processing while we debug the database issue
      return data as Item;
    } catch (error: any) {
      console.error('Error in submitItem:', error);
      
      // Log detailed information about the error
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      } else {
        console.error('Unknown error type:', typeof error);
        console.error('Error stringified:', JSON.stringify(error, null, 2));
      }
      
      throw error; // Re-throw to allow proper error handling in the UI
    }
  },

  // Get items based on status (lost or found)
  async getItems(status: ItemStatus): Promise<Item[]> {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching items:', error);
      return [];
    }

    return data as Item[];
  },

  // Get a specific item by ID
  async getItemById(itemId: string): Promise<Item | null> {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('id', itemId)
      .single();

    if (error) {
      console.error('Error fetching item:', error);
      return null;
    }

    return data as Item;
  },

  // Get items for the current user
  async getUserItems(): Promise<Item[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return [];
    }

    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user items:', error);
      return [];
    }

    return data as Item[];
  }
};

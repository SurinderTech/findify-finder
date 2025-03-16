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

      // 3. Handle image upload - using placeholder for now
      let publicUrl = '/placeholder.svg';
      
      // 4. Create the item record in the database
      console.log("Creating database record with image URL:", publicUrl);
      
      // First, check if the items table exists before attempting insertion
      try {
        // Create an entry with more debugging information to help diagnose the issue
        console.log("Checking if items table exists and attempting to create record");
        
        // Log all fields being submitted for debugging
        console.log("Full item data being inserted:", {
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
        });
        
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
          console.error('Error code:', error.code);
          console.error('Error message:', error.message);
          console.error('Error details:', error.details);
          
          if (error.message.includes('relation "items" does not exist')) {
            toast.error("Database table 'items' doesn't exist. Please create it in your Supabase dashboard.");
            throw new Error("The 'items' table doesn't exist in the database. Please create it in your Supabase dashboard.");
          } else {
            throw new Error(`Database insert failed: ${error.message}`);
          }
        }

        if (!data) {
          console.error('No data returned from database insert');
          throw new Error('No data returned from database insert');
        }

        console.log("Item created successfully:", data);
        return data as Item;
        
      } catch (dbError: any) {
        console.error('Database operation failed:', dbError);
        
        // If it's a missing table error, provide clear instructions
        if (dbError.message && dbError.message.includes("items")) {
          const errorMessage = `
            Database error: The 'items' table is missing. Please create it in your Supabase dashboard with these columns:
            - id (uuid, primary key)
            - user_id (uuid, foreign key to auth.users)
            - title (text)
            - description (text)
            - category (text)
            - status (text, either "lost" or "found")
            - location (text)
            - date_reported (timestamp)
            - image_url (text)
            - created_at (timestamp)
            - updated_at (timestamp)
          `;
          console.error(errorMessage);
          toast.error("Database setup issue. Please check the console for details.");
          throw new Error(errorMessage);
        }
        
        throw dbError;
      }
      
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

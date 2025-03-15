
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('User not authenticated');
        throw new Error('User not authenticated');
      }
      
      // 2. Generate simple filename for the image to avoid potential issues
      const timestamp = Date.now();
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `item_${timestamp}.${fileExt}`;
      
      console.log("Prepared file name:", fileName);

      // 3. Attempt to upload the image directly
      let publicUrl = '';
      try {
        // Check if bucket exists
        const { data: buckets } = await supabase.storage.listBuckets();
        const bucketExists = buckets?.some(bucket => bucket.name === 'item-images');
        
        // Create bucket if it doesn't exist
        if (!bucketExists) {
          console.log("Bucket doesn't exist, creating it now");
          const { error: createError } = await supabase.storage.createBucket('item-images', {
            public: true,
            fileSizeLimit: 10485760 // 10MB
          });
          
          if (createError) {
            console.error("Failed to create bucket:", createError);
            throw new Error(`Failed to create bucket: ${createError.message}`);
          }
          
          console.log("Bucket created successfully");
        }
        
        // Try to upload the file
        console.log("Attempting to upload image");
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('item-images')
          .upload(fileName, imageFile, {
            cacheControl: '3600',
            upsert: true
          });
          
        if (uploadError) {
          console.error("Upload failed:", uploadError);
          throw new Error(`Upload failed: ${uploadError.message}`);
        }
        
        // Get the public URL
        const { data: urlData } = supabase.storage
          .from('item-images')
          .getPublicUrl(fileName);
          
        publicUrl = urlData.publicUrl;
        console.log("Generated public URL:", publicUrl);
        
      } catch (storageError) {
        console.error("Storage operation failed:", storageError);
        publicUrl = '/placeholder.svg';
        console.log("Using placeholder image due to storage error");
      }

      // 4. Create the item record in the database
      console.log("Creating database record with image URL:", publicUrl);
      
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
        throw new Error(`Database insert failed: ${error.message}`);
      }

      console.log("Item created successfully:", data);
      
      // 5. Process the image with AI to extract features
      if (data && publicUrl !== '/placeholder.svg') {
        console.log("Processing image for AI matching");
        await aiService.processNewItem(data.id, publicUrl);
        
        // 6. Check for matches
        console.log("Checking for potential matches");
        const matches = await matchingService.findPotentialMatches(data.id);
        
        if (matches.length > 0) {
          toast.success(`Found ${matches.length} potential matches! Check the matches page.`);
        }
      }
      
      return data as Item;
    } catch (error) {
      console.error('Error in submitItem:', error);
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

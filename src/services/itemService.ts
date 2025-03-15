
import { supabase } from '../lib/supabase';
import { Item, ItemStatus } from '../types/database.types';

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

      // 3. Check if bucket exists first
      let publicUrl = '';
      try {
        // Check if the bucket exists
        const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
        
        console.log("Available buckets:", buckets);
        
        // Create bucket if it doesn't exist
        if (!buckets?.find(b => b.name === 'item-images')) {
          console.log("Bucket 'item-images' doesn't exist, creating it...");
          
          const { data: newBucket, error: createError } = await supabase.storage.createBucket('item-images', {
            public: true,
            fileSizeLimit: 10485760 // 10MB
          });
          
          if (createError) {
            console.error("Failed to create bucket:", createError);
            // Continue anyway - bucket might already exist but not be visible to this user
          } else {
            console.log("Successfully created bucket:", newBucket);
          }
        }
        
        // 4. Upload the image
        console.log("Attempting to upload image to 'item-images' bucket...");
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('item-images')
          .upload(fileName, imageFile, {
            cacheControl: '3600',
            upsert: true
          });
          
        if (uploadError) {
          console.error("Upload failed:", uploadError);
          
          // If we failed to upload, use a placeholder image
          publicUrl = '/placeholder.svg';
          console.log("Using placeholder image instead");
        } else {
          console.log("Upload successful:", uploadData);
          
          // Get the public URL
          const { data: urlData } = supabase.storage
            .from('item-images')
            .getPublicUrl(fileName);
            
          publicUrl = urlData.publicUrl;
          console.log("Generated public URL:", publicUrl);
        }
      } catch (storageError) {
        console.error("Storage operation failed:", storageError);
        publicUrl = '/placeholder.svg';
        console.log("Using placeholder image after storage error");
      }

      // 5. Create the item record in the database
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
      return data as Item;
    } catch (error) {
      console.error('Error in submitItem:', error);
      return null;
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

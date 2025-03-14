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
      
      // 2. Generate unique, safe filename for the image
      const timestamp = Date.now();
      const fileExt = imageFile.name.split('.').pop();
      const sanitizedName = `${timestamp}-${user.id.substring(0, 8)}.${fileExt}`;
      
      console.log("Prepared file name:", sanitizedName);

      // 3. Try to upload directly to the public bucket
      console.log("Attempting direct upload to storage...");
      
      let publicUrl = '';
      try {
        // Try uploaded to public bucket directly
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('item-images')
          .upload(sanitizedName, imageFile, {
            cacheControl: '3600',
            upsert: true
          });

        if (uploadError) {
          // If error includes "bucket not found", try creating the bucket
          if (uploadError.message.includes('bucket') && uploadError.message.includes('not found')) {
            console.log("Bucket not found, attempting to create...");
            
            // Try creating the bucket
            const { error: bucketError } = await supabase.storage.createBucket('item-images', {
              public: true
            });
            
            if (bucketError) {
              console.error("Failed to create bucket:", bucketError);
              throw new Error(`Bucket creation failed: ${bucketError.message}`);
            } else {
              console.log("Bucket created, retrying upload...");
              
              // Retry upload after bucket creation
              const { data: retryData, error: retryError } = await supabase.storage
                .from('item-images')
                .upload(sanitizedName, imageFile, {
                  cacheControl: '3600',
                  upsert: true
                });
                
              if (retryError) {
                console.error("Upload retry failed:", retryError);
                throw new Error(`Image upload failed even after bucket creation: ${retryError.message}`);
              }
            }
          } else {
            console.error("Upload failed with error:", uploadError);
            throw new Error(`Upload failed: ${uploadError.message}`);
          }
        }
        
        console.log("Image uploaded successfully");
        
        // Get the public URL
        const { data: urlData } = supabase.storage
          .from('item-images')
          .getPublicUrl(sanitizedName);
          
        publicUrl = urlData.publicUrl;
        console.log("Public URL generated:", publicUrl);
        
      } catch (uploadErr) {
        console.error("Complete upload error:", uploadErr);
        
        // If we completely failed to upload, use a placeholder image
        publicUrl = '/placeholder.svg';
        console.log("Using placeholder image instead");
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
      return data as Item;
    } catch (error) {
      console.error('Error in submitItem:', error);
      // Return null so the UI can handle the error
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

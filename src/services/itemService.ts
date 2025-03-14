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
      // 1. Create bucket or ensure it exists first
      try {
        console.log("Attempting to create item-images bucket...");
        const { error: createBucketError } = await supabase.storage.createBucket('item-images', {
          public: true,
          fileSizeLimit: 10485760, // 10MB limit
        });
        
        if (createBucketError) {
          // If error is not "Bucket already exists", log it but continue
          if (!createBucketError.message.includes('already exists')) {
            console.log("Bucket creation error (continuing anyway):", createBucketError);
          } else {
            console.log("Bucket already exists, continuing...");
          }
        } else {
          console.log("Bucket 'item-images' created successfully");
        }
      } catch (bucketError) {
        console.log("Trying to continue despite bucket error:", bucketError);
        // Continue anyway, the bucket might already exist
      }

      // 2. Upload the image to Supabase Storage
      console.log("Attempting to upload image:", imageFile.name);
      const fileName = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('item-images')
        .upload(fileName, imageFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        return null;
      }

      console.log("Image uploaded successfully:", fileName);
      
      // 3. Get the public URL for the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('item-images')
        .getPublicUrl(fileName);

      // 4. Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // 5. Create the item record in the database
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
        console.error('Error creating item:', error);
        return null;
      }

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

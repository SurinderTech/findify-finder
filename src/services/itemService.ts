
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
      // 1. Check if bucket exists and create if not
      const bucketName = 'item-images';
      
      // First, check if the bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
      
      console.log("Bucket exists check:", bucketExists);
      
      if (!bucketExists) {
        console.log("Attempting to create bucket...");
        const { error: createError } = await supabase.storage.createBucket(bucketName, {
          public: true,
          fileSizeLimit: 10485760, // 10MB
        });
        
        if (createError) {
          console.error("Error creating bucket:", createError);
          throw new Error(`Failed to create bucket: ${createError.message}`);
        }
        console.log("Bucket created successfully");
      } else {
        console.log("Bucket already exists, skipping creation");
      }
      
      // 2. Sanitize filename and upload the image
      const sanitizedName = imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${Date.now()}-${sanitizedName}`;
      
      console.log("Attempting to upload file:", fileName);
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, imageFile, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      console.log("Image uploaded successfully:", fileName);
      
      // 3. Get the public URL for the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
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
        throw new Error(`Database insert failed: ${error.message}`);
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

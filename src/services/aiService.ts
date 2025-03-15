
import { pipeline, env } from '@huggingface/transformers';
import { supabase } from '../lib/supabase';

// Configure transformers.js to use webgpu if available
env.allowLocalModels = false;
env.useBrowserCache = false;

const MAX_IMAGE_DIMENSION = 1024;

// Resize image if needed to prevent performance issues
function resizeImageIfNeeded(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, image: HTMLImageElement) {
  let width = image.naturalWidth;
  let height = image.naturalHeight;

  if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
    if (width > height) {
      height = Math.round((height * MAX_IMAGE_DIMENSION) / width);
      width = MAX_IMAGE_DIMENSION;
    } else {
      width = Math.round((width * MAX_IMAGE_DIMENSION) / height);
      height = MAX_IMAGE_DIMENSION;
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, 0, 0, width, height);
    return true;
  }

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(image, 0, 0);
  return false;
}

export const aiService = {
  // Extract features from an image using a pre-trained model
  async extractImageFeatures(imageUrl: string): Promise<number[] | null> {
    try {
      console.log('Starting feature extraction for:', imageUrl);
      
      // Load the image
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.crossOrigin = 'anonymous';
        img.src = imageUrl;
      });
      
      // Convert image to canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        console.error('Could not get canvas context');
        return null;
      }
      
      // Resize and draw image
      resizeImageIfNeeded(canvas, ctx, img);
      
      // Load the image classification model
      console.log('Loading image classification model...');
      const classifier = await pipeline('image-classification', 'Xenova/vit-base-patch16-224');
      
      // Get image data
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      
      // Run the model
      console.log('Running classification model...');
      const result = await classifier(imageData, { topk: 10 });
      
      console.log('Classification results:', result);
      
      // Convert model outputs to a feature vector
      const features = result.map((item: any) => item.score);
      
      // Normalize and pad to ensure consistent length
      const paddedFeatures = [...features];
      while (paddedFeatures.length < 10) {
        paddedFeatures.push(0); // Pad with zeros
      }
      
      console.log('Extracted features:', paddedFeatures);
      return paddedFeatures;
    } catch (error) {
      console.error('Error extracting image features:', error);
      return null;
    }
  },
  
  // Compare two feature vectors to calculate similarity
  calculateSimilarity(features1: number[], features2: number[]): number {
    // Simple cosine similarity implementation
    if (features1.length !== features2.length) {
      console.error('Feature vectors must have the same length');
      return 0;
    }
    
    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;
    
    for (let i = 0; i < features1.length; i++) {
      dotProduct += features1[i] * features2[i];
      magnitude1 += features1[i] * features1[i];
      magnitude2 += features2[i] * features2[i];
    }
    
    magnitude1 = Math.sqrt(magnitude1);
    magnitude2 = Math.sqrt(magnitude2);
    
    if (magnitude1 === 0 || magnitude2 === 0) {
      return 0;
    }
    
    // Return similarity score (0-1)
    return dotProduct / (magnitude1 * magnitude2);
  },
  
  // Store feature vector in Supabase
  async storeImageFeatures(itemId: string, features: number[]): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('item_features')
        .insert({
          item_id: itemId,
          features: features,
          created_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Error storing features:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Exception storing features:', error);
      return false;
    }
  },
  
  // Find potential matches based on image similarity
  async findPotentialMatches(imageUrl: string, itemStatus: 'lost' | 'found'): Promise<string[]> {
    try {
      // Extract features from the current image
      const features = await this.extractImageFeatures(imageUrl);
      if (!features) return [];
      
      // Get all items with opposite status (lost/found)
      const oppositeStatus = itemStatus === 'lost' ? 'found' : 'lost';
      const { data: items, error } = await supabase
        .from('items')
        .select('id, image_url')
        .eq('status', oppositeStatus);
      
      if (error || !items) {
        console.error('Error fetching items:', error);
        return [];
      }
      
      // Process each item
      const matches = [];
      for (const item of items) {
        const itemFeatures = await this.extractImageFeatures(item.image_url);
        if (!itemFeatures) continue;
        
        const similarity = this.calculateSimilarity(features, itemFeatures);
        console.log(`Similarity with item ${item.id}: ${similarity}`);
        
        // Add to matches if similarity is above threshold
        if (similarity > 0.7) {
          matches.push(item.id);
        }
      }
      
      return matches;
    } catch (error) {
      console.error('Error finding matches:', error);
      return [];
    }
  }
};

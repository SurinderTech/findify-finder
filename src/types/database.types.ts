
export type ItemStatus = 'lost' | 'found' | 'claimed' | 'returned';

export interface Item {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  status: ItemStatus;
  date_reported: string;
  location: string;
  image_url: string;
  image_features?: string; // Stored AI feature vector for image matching
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  points: number; // For rewards system
  items_returned: number;
  created_at: string;
}

export interface Match {
  id: string;
  lost_item_id: string;
  found_item_id: string;
  match_score: number;
  status: 'pending' | 'confirmed' | 'rejected';
  created_at: string;
}

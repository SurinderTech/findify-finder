
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
}

console.log('Initializing Supabase client with URL:', supabaseUrl);

export const supabase = createClient(
  supabaseUrl || 'https://your-project.supabase.co',
  supabaseAnonKey || 'your-anon-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true
    },
    global: {
      fetch: (url: RequestInfo | URL, options?: RequestInit) => {
        console.log('Supabase fetch:', url.toString());
        return fetch(url, options);
      }
    }
  }
);

// Test connection on initialization
(async () => {
  try {
    // Let's verify the connection and check if the 'items' table exists
    const { data, error } = await supabase.rpc('get_schema_info');
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      
      // Let's try a simpler check just to see if we can connect
      const { error: basicError } = await supabase.from('items').select('count', { count: 'exact', head: true });
      if (basicError) {
        console.error('Basic connection test failed:', basicError);
        
        // Specifically test for table existence
        if (basicError.message.includes('relation "items" does not exist')) {
          console.error('ERROR: "items" table does not exist in the database!');
          console.error('Please create the "items" table in your Supabase database with these columns:');
          console.error('- id (uuid, primary key)');
          console.error('- user_id (uuid, foreign key to auth.users)');
          console.error('- title (text)');
          console.error('- description (text)');
          console.error('- category (text)');
          console.error('- status (text, either "lost" or "found")');
          console.error('- location (text)');
          console.error('- date_reported (timestamp)');
          console.error('- image_url (text)');
          console.error('- created_at (timestamp)');
          console.error('- updated_at (timestamp)');
        }
      } else {
        console.log('Basic connection successful, but schema check failed');
      }
    } else {
      console.log('Supabase connection successful');
      const tables = data.map((row: any) => row.table_name);
      console.log('Available tables:', tables);
      
      if (!tables.includes('items')) {
        console.error('ERROR: "items" table does not exist in the database!');
      }
    }
  } catch (err) {
    console.error('Error testing Supabase connection:', err);
  }
})();

// Helper function to get user
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error getting current user:', error);
      return null;
    }
    return user;
  } catch (err) {
    console.error('Exception getting current user:', err);
    return null;
  }
};

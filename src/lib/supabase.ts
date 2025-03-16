
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
    console.log('Testing Supabase connection and database setup...');
    
    // Let's verify the connection with a direct query to check if the 'items' table exists
    const { error: itemsTableError } = await supabase
      .from('items')
      .select('count', { count: 'exact', head: true });
    
    if (itemsTableError) {
      console.error('Error checking items table:', itemsTableError);
      
      if (itemsTableError.message.includes('relation "items" does not exist')) {
        console.error('=====================================================');
        console.error('IMPORTANT: The "items" table does not exist in your Supabase database!');
        console.error('=====================================================');
        console.error('Please create the "items" table in your Supabase dashboard with these columns:');
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
        console.error('=====================================================');
        
        // Let's also check what tables do exist to provide helpful information
        try {
          const { data, error } = await supabase.rpc('get_schema_info');
          if (error) {
            console.log('Unable to list existing tables using RPC');
            
            // Try a different approach to list tables
            const { data: tables, error: tablesError } = await supabase
              .from('pg_tables')
              .select('tablename')
              .eq('schemaname', 'public');
              
            if (tablesError) {
              console.log('Unable to list existing tables through direct query');
            } else if (tables) {
              console.log('Available tables:', tables.map((t: any) => t.tablename));
            }
          } else {
            console.log('Available tables:', data);
          }
        } catch (e) {
          console.error('Error trying to list tables:', e);
        }
      }
    } else {
      console.log('✅ "items" table exists in the database');
    }
    
    // Let's also verify auth is working correctly
    const { data: authData, error: authError } = await supabase.auth.getSession();
    if (authError) {
      console.error('Auth system error:', authError);
    } else {
      console.log('Auth system is working correctly');
      if (authData.session) {
        console.log('User is authenticated');
      } else {
        console.log('No active session (user not logged in)');
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


import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Item } from '../types/database.types';
import { itemService } from '../services/itemService';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Eye, Search, Plus } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [userItems, setUserItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserItems = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const items = await itemService.getUserItems();
        setUserItems(items);
      } catch (error) {
        console.error('Error fetching user items:', error);
        toast({
          title: "Error",
          description: "Failed to load your items.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserItems();
  }, [user, navigate, toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <div className="container px-4 mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Your Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Submit buttons */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Submit an Item</h2>
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => navigate('/submit-lost')}
              className="flex items-center justify-center py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-md hover:from-red-600 hover:to-red-700 transition-colors"
            >
              <Plus size={20} className="mr-2" />
              Report a Lost Item
            </button>
            <button
              onClick={() => navigate('/submit-found')}
              className="flex items-center justify-center py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-md hover:from-green-600 hover:to-green-700 transition-colors"
            >
              <Plus size={20} className="mr-2" />
              Report a Found Item
            </button>
          </div>
        </div>

        {/* Search section */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Search Items</h2>
          <p className="text-gray-600 mb-4">
            Looking for an item? Search our database of lost and found items.
          </p>
          <button
            onClick={() => navigate('/search')}
            className="flex items-center justify-center w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-md hover:from-blue-700 hover:to-indigo-800 transition-colors"
          >
            <Search size={20} className="mr-2" />
            Search Items
          </button>
        </div>
      </div>

      {/* User's items */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">Your Items</h2>
        
        {userItems.length === 0 ? (
          <div className="glass-card rounded-xl p-8 text-center">
            <p className="text-gray-600 mb-4">You haven't submitted any items yet.</p>
            <p className="text-gray-600">
              Use the buttons above to report a lost or found item.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userItems.map((item) => (
              <div key={item.id} className="glass-card rounded-xl overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={item.image_url || '/placeholder.svg'} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      item.status === 'lost' ? 'bg-red-100 text-red-800' : 
                      item.status === 'found' ? 'bg-green-100 text-green-800' :
                      item.status === 'claimed' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    {item.location} • {new Date(item.date_reported).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => navigate(`/items/${item.id}`)}
                    className="flex items-center text-blue-600 text-sm font-medium hover:text-blue-800"
                  >
                    <Eye size={16} className="mr-1" />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

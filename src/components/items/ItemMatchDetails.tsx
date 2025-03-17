
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Item } from '@/types/database.types';
import { itemService } from '@/services/itemService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Phone, Mail, MapPin, Calendar, Info } from 'lucide-react';

interface ItemMatchDetailsProps {
  itemId: string;
  matchId: string;
}

const ItemMatchDetails: React.FC<ItemMatchDetailsProps> = ({ itemId, matchId }) => {
  const [item, setItem] = useState<Item | null>(null);
  const [matchedItem, setMatchedItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const [itemData, matchData] = await Promise.all([
          itemService.getItemById(itemId),
          itemService.getItemById(matchId)
        ]);
        
        setItem(itemData);
        setMatchedItem(matchData);
      } catch (error) {
        console.error('Error fetching item details:', error);
        toast({
          title: 'Error',
          description: 'Could not load item details',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    if (itemId && matchId) {
      fetchItems();
    }
  }, [itemId, matchId, toast]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!item || !matchedItem) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center p-4">
            <AlertCircle className="text-red-500 mr-2" />
            <p>Items not found or may have been removed.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your {item.status} Item</CardTitle>
            <CardDescription>Details of your reported item</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="aspect-w-16 aspect-h-9 rounded-md overflow-hidden">
                <img 
                  src={item.image_url} 
                  alt={item.title}
                  className="object-cover w-full h-full"
                />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-500">Category: {item.category}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <span>{item.location}</span>
                </div>
                
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <span>{formatDate(item.date_reported)}</span>
                </div>
                
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <p className="text-sm">{item.description}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800">
          <CardHeader>
            <CardTitle>Matched {matchedItem.status} Item</CardTitle>
            <CardDescription>This item matches yours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="aspect-w-16 aspect-h-9 rounded-md overflow-hidden">
                <img 
                  src={matchedItem.image_url} 
                  alt={matchedItem.title}
                  className="object-cover w-full h-full"
                />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold">{matchedItem.title}</h3>
                <p className="text-sm text-gray-500">Category: {matchedItem.category}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <span>{matchedItem.location}</span>
                </div>
                
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <span>{formatDate(matchedItem.date_reported)}</span>
                </div>
                
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <p className="text-sm">{matchedItem.description}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
          <CardDescription>Contact information and recovery steps</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              To recover your item, you can contact the {matchedItem.status === 'lost' ? 'owner' : 'finder'} 
              through our secure messaging system or use the contact information below:
            </p>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
              <h4 className="font-medium mb-2">Contact Options:</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="mr-2 h-4 w-4" />
                  Send a Message
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="mr-2 h-4 w-4" />
                  Request Phone Number
                </Button>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
              <h4 className="font-medium mb-2">Safety Tips:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Meet in a public place</li>
                <li>Bring identification</li>
                <li>Verify the item details before taking possession</li>
                <li>Report any issues to our support team</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ItemMatchDetails;

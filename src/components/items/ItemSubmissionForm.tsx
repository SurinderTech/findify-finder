import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { itemService } from '../../services/itemService';
import { ItemStatus } from '../../types/database.types';
import ImageUploader from '../ImageUploader';

interface ItemSubmissionFormProps {
  type: 'lost' | 'found';
}

const ItemSubmissionForm: React.FC<ItemSubmissionFormProps> = ({ type }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!image) {
      toast({
        title: "Image required",
        description: "Please upload an image of the item",
        variant: "destructive",
      });
      return;
    }

    if (!date) {
      toast({
        title: "Date required",
        description: "Please select the date when the item was " + (type === 'lost' ? 'lost' : 'found'),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const status: ItemStatus = type === 'lost' ? 'lost' : 'found';
      
      // Combine date and time or use just date if time is not provided
      let dateReported = date;
      if (time) {
        dateReported = `${date}T${time}`;
      }
      
      const result = await itemService.submitItem(
        title,
        description,
        category,
        status,
        location,
        dateReported,
        image
      );

      if (result) {
        toast({
          title: "Item submitted successfully",
          description: `Your ${type} item report has been submitted.`,
        });
        navigate('/dashboard');
      } else {
        throw new Error("Failed to submit item");
      }
    } catch (error: any) {
      console.error('Error submitting item:', error);
      toast({
        title: "Error submitting item",
        description: error.message || "There was a problem submitting your item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden animate-scale-in">
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6">
          {type === 'lost' ? 'Report a Lost Item' : 'Report a Found Item'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="mb-8">
              <label className="block text-sm font-medium mb-2">Item Image</label>
              <ImageUploader onImageChange={setImage} />
              <p className="mt-2 text-xs text-gray-500">
                Upload a clear image of the {type} item to help with identification
              </p>
            </div>

            <div>
              <label htmlFor="itemName" className="block text-sm font-medium mb-2">
                Item Name/Title
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Info size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="itemName"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="pl-10 w-full rounded-lg border border-gray-300 py-3 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g. Blue Wallet, Gold Watch"
                />
              </div>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-2">
                Category
              </label>
              <select 
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 py-3 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Select a category</option>
                <option value="electronics">Electronics</option>
                <option value="jewelry">Jewelry</option>
                <option value="clothing">Clothing</option>
                <option value="accessories">Accessories</option>
                <option value="documents">Documents</option>
                <option value="pets">Pets</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium mb-2">
                  Date {type === 'lost' ? 'Lost' : 'Found'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="pl-10 w-full rounded-lg border border-gray-300 py-3 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium mb-2">
                  Approximate Time
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="time"
                    id="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="pl-10 w-full rounded-lg border border-gray-300 py-3 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium mb-2">
                Location {type === 'lost' ? 'Lost' : 'Found'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  className="pl-10 w-full rounded-lg border border-gray-300 py-3 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g. Central Park, Main Street Coffee Shop"
                />
              </div>
            </div>

            <div>
              <label htmlFor="details" className="block text-sm font-medium mb-2">
                Additional Details
              </label>
              <textarea
                id="details"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-gray-300 py-3 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Provide any additional details that might help identify the item..."
              ></textarea>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-md hover:from-blue-700 hover:to-indigo-800 transition-colors flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                `Submit ${type === 'lost' ? 'Lost' : 'Found'} Item Report`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemSubmissionForm;

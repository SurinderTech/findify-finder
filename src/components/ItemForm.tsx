
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Info, User, Phone } from 'lucide-react';
import ImageUploader from './ImageUploader';
import { toast } from 'sonner';

interface ItemFormProps {
  type: 'lost' | 'found';
}

const ItemForm = ({ type }: ItemFormProps) => {
  const navigate = useNavigate();
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(`Your ${type} item report has been submitted successfully!`);
      navigate('/');
    }, 1500);
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
                Item Name/Description
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Info size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="itemName"
                  required
                  className="pl-10 w-full rounded-lg border border-gray-300 py-3 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g. Blue Wallet, Gold Watch"
                />
              </div>
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
                rows={4}
                className="w-full rounded-lg border border-gray-300 py-3 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Provide any additional details that might help identify the item..."
              ></textarea>
            </div>

            {/* Contact Information */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-lg font-medium mb-4">Your Contact Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Your Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      required
                      className="pl-10 w-full rounded-lg border border-gray-300 py-3 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      required
                      className="pl-10 w-full rounded-lg border border-gray-300 py-3 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full rounded-lg border border-gray-300 py-3 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`btn-primary w-full flex items-center justify-center ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
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

export default ItemForm;

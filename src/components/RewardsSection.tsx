
import React from 'react';
import { Award, Gift, TrendingUp, Star, Shield } from 'lucide-react';

const RewardsSection = () => {
  const rewards = [
    {
      icon: <Gift size={24} />,
      title: 'Prize Money',
      description: 'Earn cash rewards for returning valuable items to their owners.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <Award size={24} />,
      title: 'Gold Tokens',
      description: 'Collect digital gold tokens that can be redeemed for exclusive prizes.',
      color: 'from-yellow-500 to-amber-500'
    },
    {
      icon: <TrendingUp size={24} />,
      title: 'Status Tiers',
      description: 'Progress through different levels with increasing reward values.',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: <Star size={24} />,
      title: 'Community Recognition',
      description: 'Get featured on our platform as a community hero.',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const tiers = [
    {
      name: 'Bronze',
      returns: '1-2 items',
      rewards: 'Badge + $10 gift card',
      color: 'bg-amber-100 text-amber-800 border-amber-200'
    },
    {
      name: 'Silver',
      returns: '3-4 items',
      rewards: 'Badge + $25 gift card',
      color: 'bg-gray-100 text-gray-800 border-gray-200'
    },
    {
      name: 'Gold',
      returns: '5+ items',
      rewards: 'Badge + $50 cash + Gold token',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    },
    {
      name: 'Platinum',
      returns: '10+ items',
      rewards: 'Badge + $100 cash + Premium membership',
      color: 'bg-blue-100 text-blue-800 border-blue-200'
    }
  ];

  return (
    <section className="py-24">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in">
          <div className="chip mb-4 mx-auto">
            <Award size={14} className="mr-1" /> Rewards Program
          </div>
          <h2 className="section-title">Get Rewarded for Returning Items</h2>
          <p className="text-gray-600">
            We believe in rewarding honesty and kindness. Our tiered rewards system
            recognizes and compensates community members who help return lost items.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          <div className="lg:w-1/2">
            <div className="h-full glass-card rounded-2xl p-8 animate-fade-in">
              <h3 className="text-xl font-bold mb-4">Reward Types</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rewards.map((reward, index) => (
                  <div key={index} className="flex flex-col">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-r ${reward.color} mb-4`}>
                      {reward.icon}
                    </div>
                    <h4 className="text-lg font-semibold mb-2">{reward.title}</h4>
                    <p className="text-gray-600 text-sm">{reward.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:w-1/2">
            <div className="h-full glass-card rounded-2xl p-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-xl font-bold mb-4">Reward Tiers</h3>
              <div className="space-y-4">
                {tiers.map((tier, index) => (
                  <div 
                    key={index} 
                    className={`border rounded-xl p-4 ${tier.color} transition-all duration-300 hover:shadow-md`}
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold">{tier.name}</h4>
                      <span className="text-xs px-2 py-1 rounded-full bg-white/50">
                        {tier.returns}
                      </span>
                    </div>
                    <p className="mt-2 text-sm">{tier.rewards}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Help Others?</h3>
              <p className="mb-4">
                When you find a lost item, report it through our platform. Not only will you be
                helping someone in need, but you'll also be rewarded for your honesty and effort.
              </p>
              <div className="flex items-center text-blue-100">
                <Shield size={20} className="mr-2" />
                <span className="text-sm">All rewards are processed securely once item return is confirmed</span>
              </div>
            </div>
            <div className="md:w-1/3 flex justify-center md:justify-end">
              <a 
                href="/submit-found" 
                className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
              >
                Report a Found Item
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RewardsSection;

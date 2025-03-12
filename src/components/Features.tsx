
import React from 'react';
import { Upload, Map, Search, Award, Shield, Clock } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Upload size={24} />,
      title: 'Easy Item Submission',
      description: 'Upload photos and details of lost or found items in seconds.',
      color: 'from-blue-500 to-blue-600',
      delay: 0.1
    },
    {
      icon: <Map size={24} />,
      title: 'Location Tracking',
      description: 'Pinpoint exactly where items were lost or found for better matching.',
      color: 'from-indigo-500 to-indigo-600',
      delay: 0.2
    },
    {
      icon: <Search size={24} />,
      title: 'AI Image Recognition',
      description: 'Our AI technology matches photos of lost items with found ones.',
      color: 'from-purple-500 to-purple-600',
      delay: 0.3
    },
    {
      icon: <Award size={24} />,
      title: 'Rewards Program',
      description: 'Return 5 items and receive rewards including prize money or gold.',
      color: 'from-pink-500 to-pink-600',
      delay: 0.4
    },
    {
      icon: <Shield size={24} />,
      title: 'Secure & Private',
      description: 'Your personal information is kept secure and never shared publicly.',
      color: 'from-cyan-500 to-cyan-600',
      delay: 0.5
    },
    {
      icon: <Clock size={24} />,
      title: 'Real-time Updates',
      description: 'Receive notifications when potential matches are found.',
      color: 'from-blue-500 to-indigo-500',
      delay: 0.6
    }
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in">
          <div className="chip mb-4 mx-auto">
            Our Features
          </div>
          <h2 className="section-title">
            How FindIt Works
          </h2>
          <p className="text-gray-600">
            Our platform uses cutting-edge technology to help reunite people with their lost belongings
            while rewarding those who help.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              color={feature.color}
              delay={feature.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  color,
  delay
}: { 
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  delay: number;
}) => {
  return (
    <div 
      className="glass-card rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px] animate-fade-in"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-r ${color} mb-5`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default Features;


import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Search, Award } from 'lucide-react';

const Hero = () => {
  return (
    <section className="pt-32 pb-20 overflow-hidden">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Text Content */}
          <div className="lg:w-1/2 mb-12 lg:mb-0 animate-fade-in">
            <div className="chip mb-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <span className="mr-1">✨</span> AI-Powered Lost & Found
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              Reconnect with your 
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> lost treasures</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg animate-fade-in" style={{ animationDelay: '0.4s' }}>
              Our AI-powered platform makes finding your lost items easier than ever, 
              while rewarding those who help return items to their rightful owners.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <Link to="/submit-lost" className="btn-primary">
                Report Lost Item
              </Link>
              <Link to="/submit-found" className="btn-secondary">
                I Found Something
              </Link>
            </div>
          </div>

          {/* Visual/Image Side */}
          <div className="lg:w-1/2 relative">
            <div className="relative z-10 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl p-6 md:p-10 shadow-xl overflow-hidden relative">
                {/* Abstract shapes */}
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-400/10 rounded-full"></div>
                <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-indigo-400/10 rounded-full"></div>
                
                {/* Feature highlights */}
                <div className="relative z-10 space-y-6">
                  <FeatureCard
                    icon={<Search className="text-blue-500" />}
                    title="AI Matching Technology"
                    description="Our advanced AI compares images of lost and found items for faster reconnection."
                    delay={0.7}
                  />
                  
                  <FeatureCard
                    icon={<MapPin className="text-blue-500" />}
                    title="Location-Based Search"
                    description="Find items lost or found near you with precise location tracking."
                    delay={0.8}
                  />
                  
                  <FeatureCard
                    icon={<Award className="text-blue-500" />}
                    title="Rewards Program"
                    description="Earn rewards for returning items - get prizes after 5 successful returns."
                    delay={0.9}
                  />
                </div>
              </div>
            </div>
            
            {/* Background decorative elements */}
            <div className="absolute top-20 -right-16 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 -left-16 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  delay 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  delay: number;
}) => {
  return (
    <div 
      className="flex gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm animate-fade-in"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-blue-50 rounded-lg">
        {icon}
      </div>
      <div>
        <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default Hero;

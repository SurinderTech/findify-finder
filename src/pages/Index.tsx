
import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import RewardsSection from '../components/RewardsSection';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="page-transition">
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Features />

      {/* How It Works Section */}
      <section className="py-24">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in">
            <div className="chip mb-4 mx-auto">
              Simple Process
            </div>
            <h2 className="section-title">
              How It Works
            </h2>
            <p className="text-gray-600">
              Our platform makes it easy to report and recover lost items through a few simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                number: '01',
                title: 'Report Your Item',
                description: 'Submit details and a photo of your lost item or an item you found',
                delay: 0.1
              },
              {
                number: '02',
                title: 'AI Matching Technology',
                description: 'Our AI algorithms compare images and details to find potential matches',
                delay: 0.2
              },
              {
                number: '03',
                title: 'Connect & Recover',
                description: 'Get notified of matches and safely coordinate item return',
                delay: 0.3
              }
            ].map((step, index) => (
              <div 
                key={index} 
                className="glass-card rounded-2xl p-8 relative animate-fade-in"
                style={{ animationDelay: `${step.delay}s` }}
              >
                <span className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-lg">
                  {step.number}
                </span>
                <h3 className="text-xl font-semibold mb-3 mt-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Link 
              to="/services" 
              className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors"
            >
              Learn more about our services
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Rewards Section */}
      <RewardsSection />

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-fade-in">
            Ready to Find What You've Lost?
          </h2>
          <p className="max-w-2xl mx-auto mb-8 opacity-90 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Join thousands of users who have successfully recovered their lost items
            using our AI-powered platform. It only takes a minute to get started.
          </p>
          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            <Link 
              to="/submit-lost" 
              className="px-8 py-3 bg-white text-blue-700 font-medium rounded-full hover:bg-blue-50 transition-colors shadow-md"
            >
              Report Lost Item
            </Link>
            <Link 
              to="/submit-found" 
              className="px-8 py-3 bg-transparent text-white font-medium rounded-full border border-white hover:bg-white/10 transition-colors"
            >
              Report Found Item
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;

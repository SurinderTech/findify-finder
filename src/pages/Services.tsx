
import React from 'react';
import { ArrowRight, Check, Search, Tablet, MapPin, Clock, Shield, Image } from 'lucide-react';
import { Link } from 'react-router-dom';

const Services = () => {
  return (
    <div className="pt-24 page-transition">
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <div className="chip mb-4 mx-auto">
              Our Services
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              How We Help You Find What Matters
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Our comprehensive platform offers a range of services designed to reconnect
              people with their lost possessions quickly and efficiently.
            </p>
          </div>
        </div>
      </section>

      {/* Core Services */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in">
            <div className="chip mb-4 mx-auto">
              Core Offerings
            </div>
            <h2 className="section-title">
              Our Main Services
            </h2>
            <p className="text-gray-600">
              We've developed specialized tools to make the lost and found process as seamless as possible
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Image size={24} />,
                title: 'AI Image Matching',
                description: 'Our powerful AI algorithms compare images of lost and found items to identify potential matches with high accuracy.',
                color: 'from-blue-500 to-indigo-500',
                delay: 0.1
              },
              {
                icon: <MapPin size={24} />,
                title: 'Location-Based Search',
                description: 'Search for lost or found items within specific geographic areas to narrow down potential matches.',
                color: 'from-red-500 to-pink-500',
                delay: 0.2
              },
              {
                icon: <Clock size={24} />,
                title: 'Real-Time Notifications',
                description: 'Receive instant alerts when potential matches for your lost or found item are identified in the system.',
                color: 'from-amber-500 to-orange-500',
                delay: 0.3
              },
              {
                icon: <Shield size={24} />,
                title: 'Secure Meetup Coordination',
                description: 'Arrange safe item returns with our built-in messaging and verification system to ensure security.',
                color: 'from-green-500 to-emerald-500',
                delay: 0.4
              },
              {
                icon: <Search size={24} />,
                title: 'Advanced Item Description',
                description: 'Our guided form helps you provide detailed descriptions that improve matching accuracy.',
                color: 'from-purple-500 to-violet-500',
                delay: 0.5
              },
              {
                icon: <Tablet size={24} />,
                title: 'Mobile Accessibility',
                description: 'Report lost or found items on the go with our fully responsive mobile platform.',
                color: 'from-cyan-500 to-blue-500',
                delay: 0.6
              }
            ].map((service, index) => (
              <div 
                key={index} 
                className="glass-card rounded-2xl p-8 hover:shadow-lg transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${service.delay}s` }}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-r ${service.color} mb-5`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-5">{service.description}</p>
                <Link 
                  to="#" 
                  className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors"
                >
                  Learn more
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Use */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2 animate-fade-in">
              <div className="chip mb-4">Getting Started</div>
              <h2 className="section-title">How to Use Our Services</h2>
              <p className="text-gray-600 mb-6">
                Whether you've lost something valuable or found an item that belongs to someone else,
                our platform makes it easy to take action and get results.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  'Create a free account to access all features',
                  'Upload clear photos of lost or found items',
                  'Provide detailed descriptions for better matching',
                  'Specify location information to narrow the search',
                  'Receive notifications when potential matches are found',
                  'Coordinate safe returns through our secure system'
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                      <Check size={14} />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/submit-lost" className="btn-primary">
                  Report Lost Item
                </Link>
                <Link to="/submit-found" className="btn-secondary">
                  Report Found Item
                </Link>
              </div>
            </div>

            <div className="lg:w-1/2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl transform rotate-3"></div>
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="Using the app" 
                  className="relative z-10 rounded-2xl shadow-lg w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Services */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in">
            <div className="chip mb-4 mx-auto">
              Premium Features
            </div>
            <h2 className="section-title">
              Enhanced Service Options
            </h2>
            <p className="text-gray-600">
              For those seeking additional assistance, we offer premium services to maximize your chances of recovery
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card rounded-2xl p-8 border-t-4 border-blue-500 animate-fade-in">
              <div className="chip mb-4 bg-blue-100 text-blue-700">Basic</div>
              <h3 className="text-2xl font-bold mb-2">Standard Service</h3>
              <p className="text-gray-600 mb-6">
                Our free tier provides essential tools for lost and found reporting
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'AI-powered image matching',
                  'Basic item description forms',
                  'Location-based filtering',
                  'Email notifications for potential matches',
                  'Standard support'
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                      <Check size={12} />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <p className="text-2xl font-bold mb-6">Free</p>
              <Link to="/register" className="btn-secondary w-full block text-center">
                Get Started
              </Link>
            </div>

            <div className="glass-card rounded-2xl p-8 border-t-4 border-indigo-600 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="chip mb-4 bg-indigo-100 text-indigo-700">Premium</div>
              <h3 className="text-2xl font-bold mb-2">Premium Service</h3>
              <p className="text-gray-600 mb-6">
                Enhanced features to maximize your chances of recovery
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Everything in Standard',
                  'Enhanced AI image recognition',
                  'Priority matching in the system',
                  'Push notifications on mobile',
                  'Extended search radius',
                  'Premium customer support',
                  'Verified user badge'
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                      <Check size={12} />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <p className="text-2xl font-bold mb-6">$4.99/month</p>
              <Link to="/premium" className="btn-primary w-full block text-center">
                Upgrade Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-fade-in">
            Start Using FindIt Today
          </h2>
          <p className="max-w-2xl mx-auto mb-8 opacity-90 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Whether you've lost something important or found an item that needs to be returned,
            our platform makes the process simple, secure, and rewarding.
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

export default Services;

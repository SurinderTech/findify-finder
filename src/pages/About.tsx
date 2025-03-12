
import React from 'react';
import { Award, Heart, Shield, Users } from 'lucide-react';

const About = () => {
  return (
    <div className="pt-24 page-transition">
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <div className="chip mb-4 mx-auto">
              About Us
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Our Mission & Story
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              FindIt was created with a simple goal: to reunite people with their lost 
              belongings while rewarding those who help make it happen.
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2 animate-fade-in">
              <img 
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                alt="Our Team" 
                className="rounded-2xl shadow-lg w-full h-auto object-cover"
              />
            </div>
            <div className="md:w-1/2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h2 className="section-title">Our Story</h2>
              <p className="text-gray-600 mb-6">
                FindIt began when our founder lost a precious family heirloom in a public park. 
                Despite posting signs and checking with local lost and found services, it seemed 
                impossible to recover the item.
              </p>
              <p className="text-gray-600 mb-6">
                This experience revealed a fundamental problem: the lack of an efficient system 
                to connect those who lose items with those who find them. Many valuable items 
                go unclaimed simply because there's no effective way to match them with their owners.
              </p>
              <p className="text-gray-600">
                With backgrounds in AI technology and service design, our team built FindIt to 
                bridge this gap. We developed a platform that uses advanced image recognition to 
                match lost items with found ones, while encouraging good samaritans with a 
                rewarding incentive system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in">
            <div className="chip mb-4 mx-auto">
              Our Values
            </div>
            <h2 className="section-title">
              What Drives Us
            </h2>
            <p className="text-gray-600">
              These core principles guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: <Heart size={24} />,
                title: 'Compassion',
                description: 'We understand the emotional attachment people have to their possessions and strive to reunite them with care.',
                color: 'from-pink-500 to-rose-500',
                delay: 0.1
              },
              {
                icon: <Shield size={24} />,
                title: 'Trust & Safety',
                description: 'We prioritize user privacy and create secure channels for returning items without compromising personal information.',
                color: 'from-blue-500 to-indigo-500',
                delay: 0.2
              },
              {
                icon: <Award size={24} />,
                title: 'Recognition',
                description: 'We believe good deeds should be rewarded, which is why we offer incentives for those who help return lost items.',
                color: 'from-amber-500 to-orange-500',
                delay: 0.3
              },
              {
                icon: <Users size={24} />,
                title: 'Community',
                description: 'We're building a global community of people who look out for each other and help reconnect lost items with their owners.',
                color: 'from-green-500 to-emerald-500',
                delay: 0.4
              }
            ].map((value, index) => (
              <div 
                key={index} 
                className="glass-card rounded-2xl p-8 flex animate-fade-in"
                style={{ animationDelay: `${value.delay}s` }}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-r ${value.color} mr-5 flex-shrink-0`}>
                  {value.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in">
            <div className="chip mb-4 mx-auto">
              Our Team
            </div>
            <h2 className="section-title">
              The People Behind FindIt
            </h2>
            <p className="text-gray-600">
              Meet our dedicated team of experts working to reunite people with their lost items
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Founder & CEO',
                image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80',
                delay: 0.1
              },
              {
                name: 'David Chen',
                role: 'CTO & AI Lead',
                image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80',
                delay: 0.2
              },
              {
                name: 'Maya Patel',
                role: 'Head of Operations',
                image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=988&q=80',
                delay: 0.3
              },
              {
                name: 'James Wilson',
                role: 'UX/UI Designer',
                image: 'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
                delay: 0.4
              }
            ].map((member, index) => (
              <div 
                key={index} 
                className="glass-card rounded-2xl overflow-hidden animate-fade-in"
                style={{ animationDelay: `${member.delay}s` }}
              >
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-64 object-cover object-center"
                />
                <div className="p-6">
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

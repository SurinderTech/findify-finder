
import React, { useState } from 'react';
import { Mail, MapPin, Phone, MessageSquare, Send, Clock } from 'lucide-react';
import { toast } from 'sonner';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Your message has been sent successfully!');
      // Reset form
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  const contactInfo = [
    {
      icon: <Mail size={24} />,
      title: 'Email Us',
      details: 'contact@finditapp.com',
      description: 'For general inquiries',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: <Phone size={24} />,
      title: 'Call Us',
      details: '+1 (555) 123-4567',
      description: 'Mon-Fri, 9am-5pm EST',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <MapPin size={24} />,
      title: 'Visit Us',
      details: '123 Innovation Way',
      description: 'Tech City, CA 90210',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: <Clock size={24} />,
      title: 'Business Hours',
      details: 'Mon-Fri: 9am-5pm',
      description: 'Sat-Sun: Closed',
      color: 'from-amber-500 to-orange-500'
    }
  ];

  return (
    <div className="pt-24 page-transition">
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <div className="chip mb-4 mx-auto">
              Contact Us
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Get in Touch
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Have questions about our services or need assistance with a lost or found item?
              We're here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((item, index) => (
              <div 
                key={index} 
                className="glass-card rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-12 h-12 rounded-xl mx-auto flex items-center justify-center text-white bg-gradient-to-r ${item.color} mb-4`}>
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="font-medium text-gray-800">{item.details}</p>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form and Map */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Contact Form */}
            <div className="lg:w-1/2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="glass-card rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <MessageSquare size={24} className="mr-3 text-blue-500" />
                  Send Us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        className="w-full rounded-lg border border-gray-300 py-3 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
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
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      required
                      className="w-full rounded-lg border border-gray-300 py-3 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      rows={6}
                      required
                      className="w-full rounded-lg border border-gray-300 py-3 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    ></textarea>
                  </div>
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
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={18} className="mr-2" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Map or Image */}
            <div className="lg:w-1/2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="glass-card rounded-2xl p-4 h-full">
                <div className="h-full rounded-xl overflow-hidden">
                  {/* Placeholder for a map (in a real app, you'd use Google Maps or similar) */}
                  <div className="w-full h-full min-h-[400px] bg-blue-50 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-blue-500 to-indigo-500"></div>
                    <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center z-10">
                      <MapPin size={40} className="text-blue-500" />
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute top-20 left-20 w-10 h-10 rounded-full bg-blue-100"></div>
                    <div className="absolute bottom-40 right-30 w-16 h-16 rounded-full bg-indigo-100"></div>
                    <div className="absolute bottom-20 left-40 w-8 h-8 rounded-full bg-purple-100"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in">
            <div className="chip mb-4 mx-auto">
              FAQ
            </div>
            <h2 className="section-title">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">
              Find quick answers to common questions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                question: 'How do I report a lost item?',
                answer: 'Navigate to the "Report Lost Item" page from the navigation menu and fill out the form with details about your lost item, including photos and location information.'
              },
              {
                question: 'How does the rewards system work?',
                answer: 'When you return a found item, you earn points towards rewards. After 5 successful returns, you become eligible for various rewards including cash prizes and gold tokens.'
              },
              {
                question: 'Is my personal information kept private?',
                answer: 'Yes, we prioritize your privacy. Your contact details are only shared with matched users when both parties agree to coordinate an item return.'
              },
              {
                question: 'How accurate is the AI matching technology?',
                answer: 'Our AI system has a high success rate in matching lost and found items based on visual similarities and description details, but the accuracy depends on the quality of images and information provided.'
              }
            ].map((faq, index) => (
              <div 
                key={index} 
                className="glass-card rounded-xl p-6 hover:shadow-md transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1 + 0.4}s` }}
              >
                <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

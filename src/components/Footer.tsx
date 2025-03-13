
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 pt-16 pb-8">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {/* Company Info */}
          <div>
            <h2 className="text-lg font-bold mb-4 text-blue-600">FindIt</h2>
            <p className="text-gray-600 mb-4">
              We help reconnect people with their lost possessions through 
              AI-powered matching technology and a supportive community network.
            </p>
            <div className="flex space-x-4">
              <SocialLink icon={<Facebook size={18} />} href="#" />
              <SocialLink icon={<Twitter size={18} />} href="#" />
              <SocialLink icon={<Instagram size={18} />} href="#" />
              <SocialLink icon={<Linkedin size={18} />} href="#" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { label: 'Home', href: '/' },
                { label: 'About Us', href: '/about' },
                { label: 'Services', href: '/services' },
                { label: 'Contact', href: '/contact' },
                { label: 'Report Lost Item', href: '/submit-lost' },
                { label: 'Report Found Item', href: '/submit-found' },
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.href}
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="text-blue-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-600">
                  Pathankot, Punjab, India
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="text-blue-500 mr-3 flex-shrink-0" />
                <span className="text-gray-600">+91 9797486509</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="text-blue-500 mr-3 flex-shrink-0" />
                <span className="text-gray-600">surinderkumar3182@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">
              Subscribe
            </h3>
            <p className="text-gray-600 mb-4">
              Stay updated with our latest features and success stories.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-grow px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors"
              >
                Send
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} FindIt. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-6">
            <Link to="/privacy" className="hover:text-blue-600 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-blue-600 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialLink = ({ icon, href }: { icon: React.ReactNode; href: string }) => {
  return (
    <a
      href={href}
      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-blue-500 hover:text-white transition-all duration-300"
    >
      {icon}
    </a>
  );
};

export default Footer;

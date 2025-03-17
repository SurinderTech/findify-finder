import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { NotificationCenter } from './notifications/NotificationCenter';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { text: 'Home', href: '/' },
    { text: 'About', href: '/about' },
    { text: 'Services', href: '/services' },
    { text: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'py-3 bg-white/80 backdrop-blur-md shadow-sm'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="container px-4 mx-auto flex justify-between items-center">
        <Link 
          to="/" 
          className="text-xl font-bold text-blue-600 flex items-center"
        >
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            FindIt
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`nav-link ${
                isActive(link.href) ? 'text-blue-600 after:scale-x-100' : ''
              }`}
            >
              {link.text}
            </Link>
          ))}
          <Link
            to="/submit-lost"
            className="btn-primary py-2 text-sm"
          >
            Report Lost Item
          </Link>
          
          {user && <NotificationCenter />}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          {user && <NotificationCenter />}
          <button
            className="text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden fixed inset-0 bg-white z-40 transition-transform duration-300 transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } pt-20`}
      >
        <nav className="flex flex-col px-8 py-4 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-lg font-medium ${
                isActive(link.href) ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              {link.text}
            </Link>
          ))}
          <div className="pt-4">
            <Link
              to="/submit-lost"
              className="btn-primary block text-center"
            >
              Report Lost Item
            </Link>
            <Link
              to="/submit-found"
              className="btn-secondary block text-center mt-3"
            >
              Report Found Item
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

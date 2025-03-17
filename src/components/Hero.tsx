
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Hero = () => {
  const { user } = useAuth();
  
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.2] dark:opacity-[0.1]"></div>
      </div>
      
      <div className="container px-4 mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left animate-fade-in">
            <div className="chip mb-4 inline-block">
              AI-Powered Lost & Found
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Reunite with Your Lost Items
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0">
              Our AI-powered platform connects people who have lost items with those who have found them, making recovery quick and easy.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {!user ? (
                <>
                  <Link 
                    to="/login" 
                    className="btn-primary"
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/register" 
                    className="btn-secondary"
                  >
                    Create Account
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    to="/submit-lost" 
                    className="btn-primary"
                  >
                    Report Lost Item
                  </Link>
                  <Link 
                    to="/submit-found" 
                    className="btn-secondary"
                  >
                    Report Found Item
                  </Link>
                </>
              )}
            </div>
          </div>
          
          <div className="relative animate-float">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform rotate-1">
              <img 
                src="https://images.unsplash.com/photo-1627163439134-7a8c47e08208?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2532&q=80" 
                alt="Lost and Found Items" 
                className="w-full h-auto"
              />
            </div>
            
            <div className="absolute -bottom-6 -left-6 bg-blue-100 dark:bg-blue-900 rounded-lg p-4 shadow-lg transform -rotate-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Item Match</p>
                  <p className="text-sm font-bold">Found in 24hrs!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;


import React from 'react';
import SignInForm from '../components/auth/SignInForm';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="container px-4 mx-auto py-12">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
        <p className="text-gray-600 mb-8">Sign in to access your account</p>
        
        <SignInForm />
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

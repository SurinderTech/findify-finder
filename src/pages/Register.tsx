
import React from 'react';
import SignUpForm from '../components/auth/SignUpForm';
import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div className="container px-4 mx-auto py-12">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-3xl font-bold mb-2">Create an Account</h1>
        <p className="text-gray-600 mb-8">Join our community to report and find lost items</p>
        
        <SignUpForm />
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

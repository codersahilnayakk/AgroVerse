import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';
import Spinner from '../components/Spinner';
import handleApiError from '../utils/handleApiError';

const Register = () => {
  const { register, user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    phone: '',
    location: '',
    userType: 'farmer'
  });
  
  const [submitting, setSubmitting] = useState(false);
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);
  
  const { name, email, password, password2, phone, location, userType } = formData;
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!name || !email || !password) {
      toast.error('Please provide all required fields');
      return;
    }
    
    if (password !== password2) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Remove password2 from data sent to server
      const { password2: _, ...registrationData } = formData;
      
      await register(registrationData);
      toast.success('Registration successful!');
      navigate('/');
    } catch (error) {
      handleApiError(error, {
        defaultMessage: 'Registration failed. Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return <Spinner />;
  }
  
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mt-8">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Create an Account</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="text-gray-400" />
            </div>
            <input
              type="text"
              name="name"
              value={name}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your full name"
              required
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEnvelope className="text-gray-400" />
            </div>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="text-gray-400" />
            </div>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Create a password"
              required
              minLength="6"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="text-gray-400" />
            </div>
            <input
              type="password"
              name="password2"
              value={password2}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Confirm your password"
              required
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaPhone className="text-gray-400" />
            </div>
            <input
              type="tel"
              name="phone"
              value={phone}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your phone number"
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Location
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaMapMarkerAlt className="text-gray-400" />
            </div>
            <input
              type="text"
              name="location"
              value={location}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Village, District, State"
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Register as <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="userType"
                value="farmer"
                checked={userType === 'farmer'}
                onChange={handleChange}
                className="form-radio text-green-600"
              />
              <span className="ml-2">Farmer</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="userType"
                value="advisor"
                checked={userType === 'advisor'}
                onChange={handleChange}
                className="form-radio text-green-600"
              />
              <span className="ml-2">Agricultural Advisor</span>
            </label>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 mb-4 disabled:opacity-50"
        >
          {submitting ? <Spinner size="sm" color="white" /> : 'Sign Up'}
        </button>
      </form>
      
      <p className="text-center text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-green-600 hover:text-green-700 font-medium">
          Log In
        </Link>
      </p>
    </div>
  );
};

export default Register; 
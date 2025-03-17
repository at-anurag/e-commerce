import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      setLoading(true);
      await register(formData);
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <div className="auth-header">
          <h1 className="auth-title">Join ShopEase</h1>
          <p className="auth-subtitle">
            Create your account and start shopping
          </p>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-input-group">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
              <input
                type="text"
                name="name"
                id="name"
                className="auth-input"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                type="email"
                name="email"
                id="email"
                className="auth-input"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                className="auth-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
              />
              <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
            </div>
          </div>
          
          <div className="flex items-center mt-4">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              required
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              I agree to the <a href="#" className="text-indigo-600 hover:text-indigo-800">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:text-indigo-800">Privacy Policy</a>
            </label>
          </div>
          
          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </span>
            ) : (
              'Create account'
            )}
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="auth-toggle-link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register; 
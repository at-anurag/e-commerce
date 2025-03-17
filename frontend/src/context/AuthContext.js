import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create context
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configure axios
  axios.defaults.withCredentials = true;

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/auth/register`, userData, {
      withCredentials: true, // ✅ Include credentials
    });
      setUser(response.data.user);
      toast.success('Registration successful!');
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (userData) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/auth/login`, userData, {
      withCredentials: true, // ✅ Include credentials
    });
      setUser(response.data.user);
      toast.success('Login successful!');
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      setLoading(true);
      await axios.get(`${API_URL}/auth/logout`);
      setUser(null);
      toast.success('Logout successful!');
    } catch (error) {
      setError(error.response?.data?.message || 'Logout failed');
      toast.error(error.response?.data?.message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  // Check if user is authenticated
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/auth/me`, {
      withCredentials: true, // ✅ Include credentials
    });
      setUser(response.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check if user is admin
  const isAdmin = user && user.role === 'admin';

  // Context value
  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isAdmin,
    register,
    login,
    logout,
    checkAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 

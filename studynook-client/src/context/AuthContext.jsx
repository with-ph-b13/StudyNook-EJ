import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in (verify HTTP-Only cookie token)
  const checkUserStatus = async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data?.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      // Quietly fail as it just means the user has no cookie token
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUserStatus();
  }, []);

  // Register user
  const register = async (name, email, photoUrl, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, photoUrl, password });
      if (response.data?.success) {
        toast.success(response.data.message || 'Registration successful! Please login.');
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data?.success) {
        setUser(response.data.user);
        toast.success('Welcome back to StudyNook!');
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Invalid email or password';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  // Login with Google (Simulated/Mocked)
  const loginWithGoogle = async () => {
    try {
      const response = await api.post('/auth/google-mock');
      if (response.data?.success) {
        setUser(response.data.user);
        toast.success(response.data.message || 'Google authentication successful!');
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Google login failed';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, loginWithGoogle, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

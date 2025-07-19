import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile on app start if token exists
  useEffect(() => {
    const token = localStorage.getItem('brainbuddy_token');
    if (token) {
      api.getProfile()
        .then(profile => {
          setUser(profile);
        })
        .catch(() => {
          setUser(null);
          localStorage.removeItem('brainbuddy_token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    try {
      const result = await api.login(credentials);
      if (result.token) {
        localStorage.setItem('brainbuddy_token', result.token);
        setUser(result.user);
        return { success: true, user: result.user };
      } else {
        return { success: false, error: result.error || 'Login failed' };
      }
    } catch (error) {
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const signup = async (userData) => {
    try {
      const result = await api.signup(userData);
      if (result.token) {
        localStorage.setItem('brainbuddy_token', result.token);
        setUser(result.user);
        return { success: true, user: result.user };
      } else {
        return { success: false, error: result.error || 'Signup failed' };
      }
    } catch (error) {
      return { success: false, error: error.message || 'Signup failed' };
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {}
    setUser(null);
    localStorage.removeItem('brainbuddy_token');
  };

  const updateUser = async (userData) => {
    try {
      const updated = await api.updateProfile(userData);
      setUser(updated);
      return { success: true, user: updated };
    } catch (error) {
      return { success: false, error: error.message || 'Update failed' };
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    updateUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


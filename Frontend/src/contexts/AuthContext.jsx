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

// Helper function to decode JWT token and get user info
const decodeToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (error) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile on app start if token exists
  useEffect(() => {
    const token = localStorage.getItem('brainbuddy_token');
    if (token) {
      const tokenData = decodeToken(token);
      if (tokenData) {
        // Determine which endpoint to call based on user role
        const isAdmin = tokenData.role?.toLowerCase() === 'admin';
        const profilePromise = isAdmin ? api.getAdminProfile() : api.getProfile();
        
        profilePromise
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
        console.log(result.user.role)
        return { success: true, user: result.user.role };
      } else {
        return { success: false, error: result.error || 'Login failed' };
      }
    } catch (error) {
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const adminLogin = async (credentials) => {
    try {
      const result = await api.adminLogin(credentials);
      if (result.token) {
        localStorage.setItem('brainbuddy_token', result.token);
        setUser(result.user);
        return { success: true, user: result.user };
      } else {
        return { success: false, error: result.error || 'Admin login failed' };
      }
    } catch (error) {
      return { success: false, error: error.message || 'Admin login failed' };
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
    adminLogin,
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


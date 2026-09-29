import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUser = async () => {
    try {
      const { data } = await authAPI.getProfile();
      if (data.success) {
        setUser(data.user);
      } else {
        // Handle API returning success: false
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await authAPI.login({ email, password });
      
      if (data.success) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        return { success: true };
      } else {
        // Handle when API returns success: false but with data
        return {
          success: false,
          error: data.message || data.error || 'Login failed'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data?.error || 'Login failed'
      };
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await authAPI.register(userData);
      
      if (data.success) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        return { success: true };
      } else {
        return {
          success: false,
          error: data.message || data.error || 'Registration failed'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data?.error || 'Registration failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateProfile = async (userData) => {
    try {
      const { data } = await authAPI.updateProfile(userData);
      
      if (data.success) {
        setUser(data.user);
        return { success: true };
      } else {
        return {
          success: false,
          error: data.message || data.error || 'Update failed'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data?.error || 'Update failed'
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('singodhia_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(localStorage.getItem('singodhia_token') || null);
  const [loading, setLoading] = useState(!user);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await authAPI.getProfile();
          if (res.user) {
            setUser(res.user);
            localStorage.setItem('singodhia_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('Profile fetch notice:', err.message || err);
          // Only invalidate session on genuine 401 Unauthenticated error
          if (err?.response?.status === 401 || err?.status === 401) {
            logout();
          }
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.token) {
      localStorage.setItem('singodhia_token', res.token);
      localStorage.setItem('singodhia_user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const register = async (name, email, password, phone) => {
    const res = await authAPI.register({ name, email, password, phone });
    if (res.token) {
      localStorage.setItem('singodhia_token', res.token);
      localStorage.setItem('singodhia_user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem('singodhia_token');
    localStorage.removeItem('singodhia_user');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (data) => {
    const res = await authAPI.updateProfile(data);
    if (res.user) {
      setUser(res.user);
      localStorage.setItem('singodhia_user', JSON.stringify(res.user));
    }
    return res;
  };

  const addAddress = async (addrData) => {
    const res = await authAPI.addAddress(addrData);
    if (res.addresses) {
      setUser(prev => ({ ...prev, addresses: res.addresses }));
    }
    return res;
  };

  const deleteAddress = async (addrId) => {
    const res = await authAPI.deleteAddress(addrId);
    if (res.addresses) {
      setUser(prev => ({ ...prev, addresses: res.addresses }));
    }
    return res;
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateProfile,
    addAddress,
    deleteAddress
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


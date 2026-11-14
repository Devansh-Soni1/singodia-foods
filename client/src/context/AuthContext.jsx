import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';
import { getCookie, setCookie, deleteCookie } from '../utils/cookieUtils';

const AuthContext = createContext(null);

// 15 Minutes Inactivity Limit for Store Administrator (in milliseconds)
const ADMIN_INACTIVITY_LIMIT_MS = 15 * 60 * 1000;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('singodia_user') || localStorage.getItem('singodhia_user') || getCookie('singodia_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(
    localStorage.getItem('singodia_token') || 
    localStorage.getItem('singodhia_token') || 
    getCookie('singodia_token') || 
    null
  );
  const [loading, setLoading] = useState(!user);

  const logout = () => {
    localStorage.removeItem('singodia_token');
    localStorage.removeItem('singodia_user');
    localStorage.removeItem('singodia_admin_last_activity');
    localStorage.removeItem('singodhia_token');
    localStorage.removeItem('singodhia_user');
    localStorage.removeItem('singodhia_admin_last_activity');
    deleteCookie('singodia_token');
    deleteCookie('singodia_user');
    setToken(null);
    setUser(null);
  };

  // Admin Inactivity Auto-Logout Mechanism
  useEffect(() => {
    if (!user || user.role !== 'admin') return;

    let timeoutId;

    const performAutoLogout = () => {
      logout();
      toast.error('निष्क्रिय रहने के कारण एडमिन सेशन समाप्त हो गया है। कृपया दोबारा लॉगिन करें।', {
        id: 'admin-session-expired',
        duration: 5000
      });
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    };

    const resetTimer = () => {
      localStorage.setItem('singodia_admin_last_activity', Date.now().toString());
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(performAutoLogout, ADMIN_INACTIVITY_LIMIT_MS);
    };

    // Check if session has already expired while browser or tab was inactive/asleep
    const lastActivity = Number(localStorage.getItem('singodia_admin_last_activity') || localStorage.getItem('singodhia_admin_last_activity') || Date.now());
    if (Date.now() - lastActivity > ADMIN_INACTIVITY_LIMIT_MS) {
      performAutoLogout();
      return;
    }

    resetTimer();

    // User activity listeners
    const activityEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    let lastRecorded = Date.now();
    const handleUserActivity = () => {
      const now = Date.now();
      if (now - lastRecorded > 3000) { // Throttle every 3 seconds
        lastRecorded = now;
        resetTimer();
      }
    };

    activityEvents.forEach(evt => window.addEventListener(evt, handleUserActivity, { passive: true }));

    // Periodic check every 15 seconds (handles tab wake-up and laptop sleep)
    const intervalId = setInterval(() => {
      const currentLast = Number(localStorage.getItem('singodia_admin_last_activity') || localStorage.getItem('singodhia_admin_last_activity') || Date.now());
      if (Date.now() - currentLast > ADMIN_INACTIVITY_LIMIT_MS) {
        performAutoLogout();
      }
    }, 15000);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      clearInterval(intervalId);
      activityEvents.forEach(evt => window.removeEventListener(evt, handleUserActivity));
    };
  }, [user]);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await authAPI.getProfile();
          if (res.user) {
            setUser(res.user);
            localStorage.setItem('singodia_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('Profile fetch notice:', err.message || err);
          if (err?.response?.status === 401 || err?.status === 401) {
            logout();
          }
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  const login = async (email, password, loginType = 'customer') => {
    const res = await authAPI.login({ email, password, loginType });
    if (res.token) {
      localStorage.setItem('singodia_token', res.token);
      localStorage.setItem('singodia_user', JSON.stringify(res.user));
      setCookie('singodia_token', res.token, 30);
      setCookie('singodia_user', JSON.stringify(res.user), 30);
      if (res.user?.role === 'admin') {
        localStorage.setItem('singodia_admin_last_activity', Date.now().toString());
      }
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const adminRequestOtp = async (password) => {
    return await authAPI.adminRequestOtp({ password });
  };

  const adminVerifyOtp = async (password, otp) => {
    const res = await authAPI.adminVerifyOtp({ password, otp });
    if (res.token) {
      localStorage.setItem('singodia_token', res.token);
      localStorage.setItem('singodia_user', JSON.stringify(res.user));
      setCookie('singodia_token', res.token, 30);
      setCookie('singodia_user', JSON.stringify(res.user), 30);
      if (res.user?.role === 'admin') {
        localStorage.setItem('singodia_admin_last_activity', Date.now().toString());
      }
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const register = async (name, email, password, phone) => {
    const res = await authAPI.register({ name, email, password, phone });
    if (res.token) {
      localStorage.setItem('singodia_token', res.token);
      localStorage.setItem('singodia_user', JSON.stringify(res.user));
      setCookie('singodia_token', res.token, 30);
      setCookie('singodia_user', JSON.stringify(res.user), 30);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const googleLogin = async (credential) => {
    const res = await authAPI.googleLogin({ credential });
    if (res.token) {
      localStorage.setItem('singodia_token', res.token);
      localStorage.setItem('singodia_user', JSON.stringify(res.user));
      setCookie('singodia_token', res.token, 30);
      setCookie('singodia_user', JSON.stringify(res.user), 30);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const updateProfile = async (data) => {
    const res = await authAPI.updateProfile(data);
    if (res.user) {
      setUser(res.user);
      localStorage.setItem('singodia_user', JSON.stringify(res.user));
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

  const setDefaultAddress = async (addrId) => {
    const res = await authAPI.setDefaultAddress(addrId);
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
    adminRequestOtp,
    adminVerifyOtp,
    register,
    googleLogin,
    logout,
    updateProfile,
    addAddress,
    deleteAddress,
    setDefaultAddress
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


import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { authAPI } from '../services/api';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('singodhia_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('singodhia_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  const toggleWishlist = async (product) => {
    const id = product._id || product.slug;
    const exists = wishlist.some(item => (item._id || item.slug) === id);

    if (exists) {
      setWishlist(prev => prev.filter(item => (item._id || item.slug) !== id));
    } else {
      setWishlist(prev => [...prev, product]);
    }

    if (isAuthenticated) {
      try {
        await authAPI.toggleWishlist(id);
      } catch (err) {
        // quiet fallback
      }
    }
  };

  const isInWishlist = (id) => {
    return wishlist.some(item => item._id === id || item.slug === id);
  };

  const value = {
    wishlist,
    wishlistCount: wishlist.length,
    toggleWishlist,
    isInWishlist
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};


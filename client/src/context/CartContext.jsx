import React, { createContext, useContext, useState, useEffect } from 'react';
import { couponAPI, adminAPI } from '../services/api';
import { resolveProductImage } from '../utils/imageUtils';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('singodhia_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem('singodhia_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Dynamic shipping settings from admin configuration
  const [storeSettings, setStoreSettings] = useState({
    freeShippingEnabled: false,
    freeShippingThreshold: 499,
    standardShippingFee: 60
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await adminAPI.getSettings();
        if (res?.settings) {
          setStoreSettings({
            freeShippingEnabled: res.settings.freeShippingEnabled === true,
            freeShippingThreshold: Number(res.settings.freeShippingThreshold) || 499,
            standardShippingFee: Number(res.settings.standardShippingFee) || 60
          });
        }
      } catch (err) {
        // Fallback default
      }
    };
    fetchSettings();
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('singodhia_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem('singodhia_coupon', JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem('singodhia_coupon');
      }
    } catch (e) {
      console.error(e);
    }
  }, [appliedCoupon]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const addToCart = (product, variant, quantity = 1) => {
    const selectedVariant = variant || product.variants?.[0] || { weight: '250g', price: 249 };
    const cartItemId = `${product._id || product.slug}-${selectedVariant.weight}`;

    setCartItems(prev => {
      const existing = prev.find(item => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map(item =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prev,
          {
            cartItemId,
            productId: product._id || product.slug,
            name: product.name,
            hindiName: product.hindiName,
            slug: product.slug,
            image: resolveProductImage(product.images?.[0]),
            weight: selectedVariant.weight,
            price: selectedVariant.price,
            originalPrice: selectedVariant.originalPrice || 0,
            quantity: Number(quantity)
          }
        ];
      }
    });

    showToast(`Added ${product.name} (${selectedVariant.weight}) to cart!`);
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId) => {
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  const applyCouponCode = async (code) => {
    try {
      const res = await couponAPI.validateCoupon(code, subtotal);
      if (res.success && res.coupon) {
        setAppliedCoupon(res.coupon);
        showToast(res.message || 'Coupon applied successfully!');
        return { success: true, message: res.message };
      }
    } catch (err) {
      showToast(err.message || 'Failed to apply coupon');
      return { success: false, message: err.message || 'Invalid coupon' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed');
  };

  // Calculations
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Recalculate discount based on current subtotal
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
      if (appliedCoupon.maxDiscountAmount && discountAmount > appliedCoupon.maxDiscountAmount) {
        discountAmount = appliedCoupon.maxDiscountAmount;
      }
    } else {
      discountAmount = appliedCoupon.discountAmount || appliedCoupon.discountValue || 0;
    }
    discountAmount = Math.min(discountAmount, subtotal);
  }

  const isFreeShipping = storeSettings.freeShippingEnabled && (subtotal >= storeSettings.freeShippingThreshold);
  const shippingFee = (subtotal === 0 || isFreeShipping) ? 0 : storeSettings.standardShippingFee;
  const remainingForFreeShipping = storeSettings.freeShippingEnabled ? Math.max(0, storeSettings.freeShippingThreshold - subtotal) : 0;
  const freeShippingProgress = storeSettings.freeShippingEnabled ? Math.min(100, (subtotal / storeSettings.freeShippingThreshold) * 100) : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const value = {
    cartItems,
    cartCount,
    subtotal,
    discountAmount,
    appliedCoupon,
    shippingFee,
    freeShippingThreshold: storeSettings.freeShippingThreshold,
    freeShippingEnabled: storeSettings.freeShippingEnabled,
    remainingForFreeShipping,
    freeShippingProgress,
    finalTotal,
    isCartOpen,
    setIsCartOpen,
    openCart: () => setIsCartOpen(true),
    closeCart: () => setIsCartOpen(false),
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyCouponCode,
    removeCoupon,
    toastMessage
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};


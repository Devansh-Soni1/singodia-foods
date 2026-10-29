import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatCurrency';

export const BlinkitCartBar = () => {
  const { cartItems, cartCount, subtotal, isCartOpen, setIsCartOpen, recentItems } = useCart();
  const location = useLocation();
  const [pulse, setPulse] = useState(false);

  // Hidden on checkout, cart page, admin routes, or when the full cart drawer is open
  const isHidden = 
    !cartItems || 
    cartItems.length === 0 || 
    isCartOpen ||
    location.pathname === '/checkout' ||
    location.pathname === '/cart' ||
    location.pathname.startsWith('/admin');

  // Trigger brief bounce animation whenever a new item is added
  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 400);
      return () => clearTimeout(timer);
    }
  }, [cartCount, recentItems]);

  if (isHidden) return null;

  // Ensure we display at most the latest 2 items side-by-side
  // When 3rd item is added, 1st disappears and 2nd+3rd are displayed
  const displayPhotos = (recentItems && recentItems.length > 0)
    ? recentItems.slice(-2)
    : cartItems.slice(-2).map(item => ({
        id: item.cartItemId,
        name: item.name,
        image: item.image
      }));

  return (
    <div 
      className={`fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[94%] sm:w-auto sm:min-w-[420px] max-w-lg transition-all duration-300 ${
        pulse ? 'scale-103' : 'scale-100'
      }`}
    >
      <div 
        onClick={() => setIsCartOpen(true)}
        className="bg-gradient-to-r from-[#0C831F] via-[#0A731B] to-[#085E16] text-white rounded-2xl sm:rounded-full px-3.5 py-2.5 sm:px-5 sm:py-3 shadow-[0_12px_35px_rgba(12,131,31,0.38)] border border-emerald-400/40 flex items-center justify-between gap-3 cursor-pointer hover:shadow-[0_16px_45px_rgba(12,131,31,0.5)] transition-all select-none backdrop-blur-md"
      >
        
        {/* LEFT SECTION: Recent Item Photos (1 or 2 side-by-side) */}
        <div className="flex items-center gap-2.5 min-w-0">
          
          {/* Thumbnails Container */}
          <div className="flex items-center gap-1.5 shrink-0">
            {displayPhotos.map((item, idx) => (
              <div 
                key={item.id || idx}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden border-2 border-white/95 shadow-md bg-white shrink-0 transform transition-all duration-300 animate-in zoom-in-75"
              >
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=300&q=80'; }}
                />
              </div>
            ))}
          </div>

          {/* Text: '1 item added in cart' or 'X items added in cart' */}
          <div className="min-w-0 flex flex-col justify-center">
            <div className="flex items-center gap-1">
              <span className="text-xs sm:text-sm font-black text-white leading-tight truncate">
                {cartCount} {cartCount === 1 ? 'item' : 'items'} added in cart
              </span>
            </div>
            
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-black text-amber-300 text-sm sm:text-base leading-none">
                {formatPrice(subtotal)}
              </span>
              <span className="text-[10px] text-emerald-100 font-semibold hidden xs:inline">
                • Free Delivery Available
              </span>
            </div>
          </div>

        </div>

        {/* RIGHT SECTION: 'View Cart ➔' Blinkit-style button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsCartOpen(true);
            }}
            className="bg-white hover:bg-emerald-50 text-[#0C831F] font-black text-xs sm:text-sm px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl sm:rounded-full shadow-md flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer group"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#0C831F] group-hover:rotate-12 transition-transform" />
            <span>View Cart</span>
            <ArrowRight className="w-4 h-4 text-[#0C831F] group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default BlinkitCartBar;

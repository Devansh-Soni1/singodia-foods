import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatCurrency';

export const BlinkitCartBar = () => {
  const { cartItems, cartCount, subtotal, isCartOpen, setIsCartOpen, recentItems } = useCart();
  const location = useLocation();
  const [pulse, setPulse] = useState(false);
  const [floatingBadge, setFloatingBadge] = useState(null);

  // Hidden on checkout, cart page, admin routes, or when the full cart drawer is open
  const isHidden = 
    !cartItems || 
    cartItems.length === 0 || 
    isCartOpen ||
    location.pathname === '/checkout' ||
    location.pathname === '/cart' ||
    location.pathname.startsWith('/admin');

  // Trigger brief bounce animation & floating +1 badge whenever cartCount changes
  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      setPulse(true);
      setFloatingBadge('+1 Added! ✨');
      const timer = setTimeout(() => {
        setPulse(false);
      }, 450);
      const badgeTimer = setTimeout(() => {
        setFloatingBadge(null);
      }, 1200);
      return () => {
        clearTimeout(timer);
        clearTimeout(badgeTimer);
      };
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
      className={`fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[94%] sm:w-auto sm:min-w-[430px] max-w-lg animate-cart-slide-up transition-transform duration-300 ${
        pulse ? 'scale-104 -translate-y-1' : 'scale-100 translate-y-0'
      }`}
    >
      {/* Floating "+1 Added!" Animated Badge */}
      {floatingBadge && (
        <div className="absolute -top-3 left-8 z-50 pointer-events-none animate-cart-float-badge">
          <div className="bg-amber-400 text-gray-950 font-black text-[11px] px-2.5 py-1 rounded-full shadow-lg border border-amber-300 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-brand-green" />
            <span>{floatingBadge}</span>
          </div>
        </div>
      )}

      <div 
        onClick={() => setIsCartOpen(true)}
        className="relative overflow-hidden bg-gradient-to-r from-[#0C831F] via-[#0A731B] to-[#085E16] text-white rounded-2xl sm:rounded-full px-3.5 py-2.5 sm:px-5 sm:py-3 shadow-[0_12px_40px_rgba(12,131,31,0.42)] border-2 border-emerald-400/50 flex items-center justify-between gap-3 cursor-pointer hover:shadow-[0_16px_50px_rgba(12,131,31,0.55)] transition-all select-none backdrop-blur-md group"
      >
        
        {/* Shimmer Light Reflection Sweep */}
        <div className="absolute inset-0 w-28 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none animate-cart-shimmer" />

        {/* LEFT SECTION: Recent Item Photos (1 or 2 side-by-side with pop animation) */}
        <div className="flex items-center gap-2.5 min-w-0 relative z-10">
          
          {/* Thumbnails Container with sliding pop-in */}
          <div className="flex items-center gap-1.5 shrink-0">
            {displayPhotos.map((item, idx) => (
              <div 
                key={item.id || idx}
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden border-2 border-white/95 shadow-md bg-white shrink-0 transform transition-all duration-300 ${
                  idx === displayPhotos.length - 1 ? 'animate-cart-item-pop' : ''
                }`}
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
              <span className={`text-xs sm:text-sm font-black text-white leading-tight truncate ${pulse ? 'animate-pop-scale' : ''}`}>
                {cartCount} {cartCount === 1 ? 'item' : 'items'} added in cart
              </span>
            </div>
            
            <div className="flex items-center gap-1.5 text-xs">
              <span className={`font-black text-amber-300 text-sm sm:text-base leading-none ${pulse ? 'animate-pop-scale text-yellow-300' : ''}`}>
                {formatPrice(subtotal)}
              </span>
              <span className="text-[10px] text-emerald-100 font-semibold hidden xs:inline">
                • Fast Pan-India Dispatch
              </span>
            </div>
          </div>

        </div>

        {/* RIGHT SECTION: 'View Cart ➔' Blinkit-style button */}
        <div className="flex items-center gap-2 shrink-0 relative z-10">
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
            <ArrowRight className="w-4 h-4 text-[#0C831F] animate-arrow-nudge" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default BlinkitCartBar;


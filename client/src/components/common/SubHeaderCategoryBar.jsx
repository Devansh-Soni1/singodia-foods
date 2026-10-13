import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const SubHeaderCategoryBar = () => {
  const location = useLocation();

  // Hide on checkout, login, register, and admin routes
  if (
    location.pathname.startsWith('/checkout') ||
    location.pathname.startsWith('/login') ||
    location.pathname.startsWith('/register') ||
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/order-confirmation')
  ) {
    return null;
  }

  const categoryItems = [
    {
      id: 'mango-pickles',
      titleLine1: 'Mango',
      titleLine2: 'Pickles',
      link: '/shop?category=mango-pickles',
      icon: (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9 sm:w-10 sm:h-10 mx-auto">
          {/* Mango outline with stem and leaf */}
          <path d="M 23 10 C 13 14 11 26 14 34 C 18 42 27 42 32 38 C 38 33 39 22 34 14 C 30 9 26 9 23 10 Z" />
          <path d="M 24 10 C 24 6 27 4 28 3" />
          <path d="M 27 4 C 33 4 35 9 32 11" />
          <path d="M 22 17 C 20 22 21 28 24 33" strokeDasharray="1.5 3" strokeWidth="1.2" opacity="0.6" />
        </svg>
      ),
    },
    {
      id: 'sweet-pickles',
      titleLine1: 'Sweet',
      titleLine2: 'Pickles',
      link: '/shop?taste=sweet',
      icon: (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9 sm:w-10 sm:h-10 mx-auto">
          {/* Sugar cube / sweet candy character with smiling face */}
          <path d="M 14 16 L 34 16 C 37 16 39 18 38 21 L 36 37 C 35 40 33 41 30 41 L 18 41 C 15 41 13 40 12 37 L 10 21 C 9 18 11 16 14 16 Z" />
          {/* Smiling eyes */}
          <path d="M 18 26 Q 20 23 22 26" strokeWidth="2" />
          <path d="M 26 26 Q 28 23 30 26" strokeWidth="2" />
          {/* Sweet smile */}
          <path d="M 21 31 Q 24 35 27 31" strokeWidth="2" />
          {/* Cheerful sparkles */}
          <path d="M 6 22 L 8 24" strokeWidth="1.5" />
          <path d="M 7 28 L 9 27" strokeWidth="1.5" />
          <path d="M 42 22 L 40 24" strokeWidth="1.5" />
          <path d="M 41 28 L 39 27" strokeWidth="1.5" />
        </svg>
      ),
    },
    {
      id: 'trial-packs',
      titleLine1: 'Trial',
      titleLine2: 'Packs',
      link: '/shop?category=combo-packs',
      icon: (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9 sm:w-10 sm:h-10 mx-auto">
          {/* 4 mini jars 2x2 grid */}
          <rect x="11" y="9" width="10" height="3" rx="1" />
          <rect x="12" y="12" width="8" height="10" rx="1.5" />
          <line x1="14" y1="17" x2="18" y2="17" strokeWidth="1" />
          <rect x="27" y="9" width="10" height="3" rx="1" />
          <rect x="28" y="12" width="8" height="10" rx="1.5" />
          <line x1="30" y1="17" x2="34" y2="17" strokeWidth="1" />
          <rect x="11" y="27" width="10" height="3" rx="1" />
          <rect x="12" y="30" width="8" height="10" rx="1.5" />
          <line x1="14" y1="35" x2="18" y2="35" strokeWidth="1" />
          <rect x="27" y="27" width="10" height="3" rx="1" />
          <rect x="28" y="30" width="8" height="10" rx="1.5" />
          <line x1="30" y1="35" x2="34" y2="35" strokeWidth="1" />
        </svg>
      ),
    },
    {
      id: 'papad',
      titleLine1: 'Papad',
      titleLine2: '',
      link: '/shop?category=papad',
      icon: (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9 sm:w-10 sm:h-10 mx-auto">
          {/* Front round roasted papad */}
          <circle cx="21" cy="26" r="14" />
          {/* Spice dots */}
          <circle cx="16" cy="22" r="0.8" fill="currentColor" />
          <circle cx="22" cy="18" r="0.8" fill="currentColor" />
          <circle cx="25" cy="25" r="0.8" fill="currentColor" />
          <circle cx="18" cy="30" r="0.8" fill="currentColor" />
          <circle cx="26" cy="32" r="0.8" fill="currentColor" />
          <circle cx="14" cy="27" r="0.8" fill="currentColor" />
          {/* Stack behind */}
          <path d="M 28 14 C 36 17 38 31 32 38" />
          <path d="M 33 17 C 41 21 42 32 37 38" />
        </svg>
      ),
    },
    {
      id: 'spicy-pickles',
      titleLine1: 'Spicy',
      titleLine2: 'Pickles',
      link: '/shop?spice=Spicy',
      icon: (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9 sm:w-10 sm:h-10 mx-auto">
          {/* Hot Chilli */}
          <path d="M 12 33 C 18 36 30 34 38 23 C 35 24 28 26 22 24 C 15 22 13 28 12 33 Z" />
          <path d="M 38 23 Q 41 20 43 14" strokeWidth="1.5" />
          {/* Flames rising */}
          <path d="M 15 28 C 14 23 16 19 19 16 C 18 19 21 21 21 17 C 22 13 25 11 26 8 C 26 12 28 15 32 15 C 30 18 32 20 33 22" />
        </svg>
      ),
    },
    {
      id: 'mixed-pickles',
      titleLine1: 'Mixed',
      titleLine2: 'Pickles',
      link: '/shop?category=mixed-pickles',
      icon: (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9 sm:w-10 sm:h-10 mx-auto">
          {/* Mango slice */}
          <path d="M 24 10 C 18 12 17 21 22 28 C 28 32 33 28 35 22 C 37 14 30 9 24 10 Z" />
          {/* Lemon wedge */}
          <path d="M 12 36 C 18 39 27 38 32 34 L 16 28 Z" />
          <path d="M 21 31 L 20 36" strokeWidth="1.2" />
          <path d="M 25 30 L 26 35" strokeWidth="1.2" />
          {/* Chilli stem */}
          <path d="M 10 32 Q 14 30 16 26" strokeWidth="2" />
          <path d="M 35 15 Q 38 12 40 8" strokeWidth="1.5" />
        </svg>
      ),
    },
    {
      id: 'masalas',
      titleLine1: 'Masalas',
      titleLine2: '',
      link: '/shop?category=masalas',
      icon: (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9 sm:w-10 sm:h-10 mx-auto">
          {/* Spice bowl with spices */}
          <path d="M 14 25 Q 24 12 34 25" />
          <path d="M 11 25 Q 24 37 37 25 Z" />
          <line x1="28" y1="36" x2="40" y2="34" strokeWidth="2.5" />
          <line x1="29" y1="39" x2="39" y2="37" strokeWidth="2" />
          <path d="M 22 36 L 25 33 L 27 36 L 25 38 Z" fill="currentColor" fillOpacity="0.15" />
        </svg>
      ),
    },
    {
      id: 'all-products',
      titleLine1: 'All',
      titleLine2: 'Products',
      link: '/shop',
      icon: (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9 sm:w-10 sm:h-10 mx-auto">
          {/* Barni / Pickle Martaban */}
          <path d="M 17 12 C 17 8 31 8 31 12 L 34 16 L 14 16 Z" />
          <line x1="13" y1="16" x2="35" y2="16" strokeWidth="2.2" />
          <path d="M 33 16 Q 37 19 36 23" strokeWidth="1.5" />
          <path d="M 16 16 L 13 22 Q 10 27 10 35 Q 10 42 16 43 L 32 43 Q 38 42 38 35 Q 38 27 35 22 L 32 16 Z" />
          <path d="M 12 25 Q 24 28 36 25" strokeWidth="1.2" />
        </svg>
      ),
    },
  ];

  return (
    <section className="bg-white border-t border-b border-amber-200/80 shadow-[0_2px_8px_rgba(243,162,34,0.08)] select-none">
      
      {/* 1. Category Icon Strip */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 pt-3 pb-3">
        <div className="flex items-start justify-start md:justify-center gap-4 sm:gap-7 lg:gap-11 overflow-x-auto scrollbar-none pb-1 pt-2 px-1">
          {categoryItems.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className="flex-shrink-0 flex flex-col items-center justify-start group text-center min-w-[62px] sm:min-w-[76px] transition-transform duration-200 hover:-translate-y-1 focus:outline-none"
            >
              {/* Icon Container with optional badge */}
              <div className="relative mb-1.5 flex items-center justify-center">
                {/* Yellow Special Badge (like NAVRATRI SPECIAL) */}
                {item.badge && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#F3A222] text-[#3E2305] text-[7.5px] sm:text-[8px] font-black tracking-tight px-1.5 py-0.2 rounded-full whitespace-nowrap shadow-xs uppercase border border-[#D97706]/40">
                    {item.badge}
                  </span>
                )}
                
                {/* Line art Icon */}
                <div className="text-gray-800 group-hover:text-[#b35400] transition-colors duration-200">
                  {item.icon}
                </div>
              </div>

              {/* Title below icon */}
              <div className="text-[11.5px] sm:text-[12.5px] font-semibold text-gray-800 leading-tight group-hover:text-[#b35400] transition-colors duration-200 font-sans">
                <div>{item.titleLine1}</div>
                {item.titleLine2 && <div>{item.titleLine2}</div>}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 2. Trust Guarantee Strip */}
      <div className="border-t border-amber-300/70 bg-[#FFFDF9] py-2 px-4">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs sm:text-[13.5px] font-bold text-gray-800">
          
          {/* Trust Item 1: NO Chemical Preservatives */}
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#2E7D32] flex-shrink-0" fill="currentColor">
              {/* Rosette scalloped seal with checkmark */}
              <path d="M12 2l2.4 2.2 3.2-.6 1.4 2.9 3.2 1-.2 3.3 2.1 2.5-1.7 2.8.9 3.2-3 1.4-1 3.2-3.3-.3-2.3 2.3-2.3-2.3-3.3.3-1-3.2-3-1.4.9-3.2-1.7-2.8 2.1-2.5-.2-3.3 3.2-1 1.4-2.9 3.2.6L12 2z"/>
              <path d="M9.5 12l2 2 4-4" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="tracking-tight text-gray-900">NO Chemical Preservatives</span>
          </div>

          {/* Trust Item 2: Homemade Pickles */}
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#2E7D32] flex-shrink-0" fill="currentColor">
              <path d="M12 2l2.4 2.2 3.2-.6 1.4 2.9 3.2 1-.2 3.3 2.1 2.5-1.7 2.8.9 3.2-3 1.4-1 3.2-3.3-.3-2.3 2.3-2.3-2.3-3.3.3-1-3.2-3-1.4.9-3.2-1.7-2.8 2.1-2.5-.2-3.3 3.2-1 1.4-2.9 3.2.6L12 2z"/>
              <path d="M9.5 12l2 2 4-4" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="tracking-tight text-gray-900">Homemade Pickles</span>
          </div>

          {/* Trust Item 3: 100% Traditional Sun-Cured (Extra authentic reassurance) */}
          <div className="hidden md:flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#2E7D32] flex-shrink-0" fill="currentColor">
              <path d="M12 2l2.4 2.2 3.2-.6 1.4 2.9 3.2 1-.2 3.3 2.1 2.5-1.7 2.8.9 3.2-3 1.4-1 3.2-3.3-.3-2.3 2.3-2.3-2.3-3.3.3-1-3.2-3-1.4.9-3.2-1.7-2.8 2.1-2.5-.2-3.3 3.2-1 1.4-2.9 3.2.6L12 2z"/>
              <path d="M9.5 12l2 2 4-4" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="tracking-tight text-gray-900">Sun-Cured In Ceramic Barnis</span>
          </div>

        </div>
      </div>

    </section>
  );
};

export default SubHeaderCategoryBar;


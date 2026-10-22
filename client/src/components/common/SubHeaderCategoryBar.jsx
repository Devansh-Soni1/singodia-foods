import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { categoryAPI } from '../../services/api';

const CATEGORY_VISUALS = {
  'mango-pickles': {
    emoji: '🥭',
    title1: 'Mango',
    title2: 'Pickles',
    hindi: 'आम का अचार',
    path: '/category/mango-pickles/'
  },
  'red-chilli-pickles': {
    emoji: '🌶️',
    title1: 'Red Chilli',
    title2: 'Banarasi',
    hindi: 'भरवां लाल मिर्च',
    path: '/category/red-chilli-pickles/'
  },
  'green-chilli-pickles': {
    emoji: '🫑',
    title1: 'Green Chilli',
    title2: 'Pickles',
    hindi: 'हरी मिर्च',
    path: '/category/green-chilli-pickles/'
  },
  'lemon-pickles': {
    emoji: '🍋',
    title1: 'Lemon',
    title2: 'Oil-Free',
    hindi: 'नीम्बू का अचार',
    path: '/category/lemon-pickles/'
  },
  'rajasthani-specials': {
    emoji: '🏺',
    title1: 'Rajasthani',
    title2: 'Specials',
    hindi: 'कैर सांगरी',
    path: '/category/rajasthani-specials/'
  },
  'garlic-pickles': {
    emoji: '🧄',
    title1: 'Garlic',
    title2: 'Pickles',
    hindi: 'लहसुन का अचार',
    path: '/category/garlic-pickles/'
  },
  'sweet-pickles': {
    emoji: '🍯',
    title1: 'Sweet',
    title2: 'Murabba',
    hindi: 'मीठा छुंदा',
    path: '/category/sweet-pickles/'
  },
  'combo-packs': {
    emoji: '🎁',
    title1: 'Gift Boxes',
    title2: 'Combos',
    hindi: 'कॉम्बो पैक',
    path: '/category/combo-packs/'
  },
  'papad': {
    emoji: '🫓',
    title1: 'Marwadi',
    title2: 'Papad',
    hindi: 'पापड़',
    path: '/category/rajasthani-specials/'
  },
  'all-products': {
    emoji: '⭐',
    title1: 'All',
    title2: 'Pickles',
    hindi: 'सभी आचार',
    path: '/shop/'
  }
};

const resolveVisual = (slug = '', name = '') => {
  const s = slug.toLowerCase();
  const n = name.toLowerCase();
  if (CATEGORY_VISUALS[s]) return CATEGORY_VISUALS[s];
  if (s.includes('mango') || n.includes('mango') || n.includes('aam')) return CATEGORY_VISUALS['mango-pickles'];
  if (s.includes('red') || n.includes('lal mirch') || n.includes('red chilli')) return CATEGORY_VISUALS['red-chilli-pickles'];
  if (s.includes('green') || n.includes('hari mirch') || n.includes('green chilli')) return CATEGORY_VISUALS['green-chilli-pickles'];
  if (s.includes('lemon') || n.includes('nimbu') || n.includes('lemon')) return CATEGORY_VISUALS['lemon-pickles'];
  if (s.includes('rajasthan') || n.includes('kair') || n.includes('sangri')) return CATEGORY_VISUALS['rajasthani-specials'];
  if (s.includes('garlic') || n.includes('lahsun') || n.includes('garlic')) return CATEGORY_VISUALS['garlic-pickles'];
  if (s.includes('sweet') || n.includes('meetha') || n.includes('murabba')) return CATEGORY_VISUALS['sweet-pickles'];
  if (s.includes('combo') || s.includes('hamp') || s.includes('box') || n.includes('combo')) return CATEGORY_VISUALS['combo-packs'];
  if (s.includes('papad') || n.includes('papad')) return CATEGORY_VISUALS['papad'];
  
  const words = name.trim().split(' ');
  return {
    emoji: '🏺',
    title1: words[0] || name,
    title2: words.slice(1).join(' ') || '',
    hindi: ''
  };
};

export const SubHeaderCategoryBar = () => {
  const location = useLocation();
  const [dbCategories, setDbCategories] = useState([]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await categoryAPI.getCategories();
        if (Array.isArray(res.categories) && res.categories.length > 0) {
          setDbCategories(res.categories);
        }
      } catch (err) {
        // Fallback
      }
    };
    fetchCats();
  }, []);

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

  // Pre-configured list if database list is empty or complementary
  const defaultList = [
    { slug: 'mango-pickles', name: 'Mango Pickles', hindiName: 'आम का अचार' },
    { slug: 'red-chilli-pickles', name: 'Red Chilli', hindiName: 'भरवां लाल मिर्च' },
    { slug: 'green-chilli-pickles', name: 'Green Chilli', hindiName: 'तीखी हरी मिर्च' },
    { slug: 'lemon-pickles', name: 'Lemon Pickles', hindiName: 'खट्टा नीम्बू' },
    { slug: 'rajasthani-specials', name: 'Rajasthani Specials', hindiName: 'कैर सांगरी' },
    { slug: 'garlic-pickles', name: 'Garlic Pickles', hindiName: 'देसी लहसुन' },
    { slug: 'sweet-pickles', name: 'Sweet Murabba', hindiName: 'मीठा अचार' },
    { slug: 'combo-packs', name: 'Gift Hampers', hindiName: 'कॉम्बो पैक' },
    { slug: 'all-products', name: 'All Pickles', hindiName: 'सभी अचार' },
  ];

  const categoriesToShow = dbCategories.length > 0 ? dbCategories : defaultList;

  return (
    <section className="bg-white border-t border-b border-amber-200/80 shadow-[0_2px_8px_rgba(243,162,34,0.06)] select-none">
      
      {/* 1. Animated Category Emoji Strip (Pure transparent emoji, no background box, no badges) */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 pt-3 pb-3">
        <div className="flex items-start justify-start md:justify-center gap-3 sm:gap-6 lg:gap-8 overflow-x-auto scrollbar-none pb-1 pt-1.5 px-1">
          {categoriesToShow.map((cat) => {
            const visual = resolveVisual(cat.slug, cat.name);
            const link = visual.path || (cat.slug === 'all-products' ? '/shop/' : `/product/${(cat.slug || '').replace(/s$/, '')}/`);

            return (
              <Link
                key={cat.slug || cat._id}
                to={link}
                className="flex-shrink-0 flex flex-col items-center justify-start group text-center min-w-[66px] sm:min-w-[78px] transition-transform duration-200 focus:outline-none"
              >
                {/* Visual Icon (NO background box, NO top badges, clean transparent animated emoji) */}
                <div className="mb-1 flex items-center justify-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center cursor-pointer transition-transform duration-300 group-hover:-translate-y-1">
                    <span className="text-3xl sm:text-4xl select-none transition-transform duration-300 group-hover:scale-125 inline-block">
                      {visual.emoji}
                    </span>
                  </div>
                </div>

                {/* 2-Line Text Title */}
                <div className="text-[11px] sm:text-[12px] font-bold text-gray-800 leading-tight group-hover:text-[#b35400] transition-colors duration-200 font-sans">
                  <div>{visual.title1 || cat.name.split(' ')[0]}</div>
                  <div className="text-[10px] sm:text-[11px] font-semibold text-gray-500 group-hover:text-[#b35400]/80">
                    {visual.title2 || cat.hindiName || cat.name.split(' ').slice(1).join(' ')}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 2. Trust Guarantee Strip */}
      <div className="border-t border-amber-300/70 bg-[#FFFDF9] py-2 px-4">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs sm:text-[13.5px] font-bold text-gray-800">
          
          {/* Trust Item 1: NO Chemical Preservatives */}
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#2E7D32] flex-shrink-0" fill="currentColor">
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
            <span className="tracking-tight text-gray-900">100% Homemade Pickles</span>
          </div>

          {/* Trust Item 3: Sun-Cured In Ceramic Barnis */}
          <div className="hidden md:flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#2E7D32] flex-shrink-0" fill="currentColor">
              <path d="M12 2l2.4 2.2 3.2-.6 1.4 2.9 3.2 1-.2 3.3 2.1 2.5-1.7 2.8.9 3.2-3 1.4-1 3.2-3.3-.3-2.3 2.3-2.3-2.3-3.3.3-1-3.2-3-1.4.9-3.2-1.7-2.8 2.1-2.5-.2-3.3 3.2-1 1.4-2.9 3.2.6L12 2z"/>
              <path d="M9.5 12l2 2 4-4" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="tracking-tight text-gray-900">Sun-Cured in Traditional Martabans</span>
          </div>

        </div>
      </div>

    </section>
  );
};

export default SubHeaderCategoryBar;

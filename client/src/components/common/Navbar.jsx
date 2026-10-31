import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, ChevronDown, Sparkles, MessageCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { categoryAPI } from '../../services/api';
import { INGREDIENT_CATEGORIES } from '../../constants/ingredientCategories';
import siteLogo from '../../assets/logo.png';

export const Navbar = ({ onOpenSearch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [ingredientsDropdownOpen, setIngredientsDropdownOpen] = useState(false);
  const [tasteDropdownOpen, setTasteDropdownOpen] = useState(false);
  
  // Active hovered ingredient in 2-column mega menu (null by default so subcategories only show on hover!)
  const [activeHoveredIngredientId, setActiveHoveredIngredientId] = useState(null);

  // Mobile accordion states
  const [mobileIngredientsOpen, setMobileIngredientsOpen] = useState(false);
  const [mobileActiveIngredient, setMobileActiveIngredient] = useState('mango');
  const [mobileTasteOpen, setMobileTasteOpen] = useState(false);

  // Timer refs for smooth hover transitions and instant closing on mouse leave
  const ingredientsTimeoutRef = useRef(null);
  const tasteTimeoutRef = useRef(null);

  const { cartCount, openCart } = useCart();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Close menus on route change or scroll
  useEffect(() => {
    setMobileMenuOpen(false);
    setIngredientsDropdownOpen(false);
    setTasteDropdownOpen(false);
    setActiveHoveredIngredientId(null);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const handleScroll = () => {
      setIngredientsDropdownOpen(false);
      setTasteDropdownOpen(false);
      setActiveHoveredIngredientId(null);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (ingredientsTimeoutRef.current) clearTimeout(ingredientsTimeoutRef.current);
      if (tasteTimeoutRef.current) clearTimeout(tasteTimeoutRef.current);
    };
  }, []);

  // Close dropdowns on outside click
  const navRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setIngredientsDropdownOpen(false);
        setTasteDropdownOpen(false);
        setActiveHoveredIngredientId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleIngredientsEnter = () => {
    if (ingredientsTimeoutRef.current) clearTimeout(ingredientsTimeoutRef.current);
    if (tasteTimeoutRef.current) clearTimeout(tasteTimeoutRef.current);
    setTasteDropdownOpen(false);
    setIngredientsDropdownOpen(true);
  };

  const handleIngredientsLeave = () => {
    ingredientsTimeoutRef.current = setTimeout(() => {
      setIngredientsDropdownOpen(false);
      setActiveHoveredIngredientId(null);
    }, 120);
  };

  const handleTasteEnter = () => {
    if (tasteTimeoutRef.current) clearTimeout(tasteTimeoutRef.current);
    if (ingredientsTimeoutRef.current) clearTimeout(ingredientsTimeoutRef.current);
    setIngredientsDropdownOpen(false);
    setActiveHoveredIngredientId(null);
    setTasteDropdownOpen(true);
  };

  const handleTasteLeave = () => {
    tasteTimeoutRef.current = setTimeout(() => {
      setTasteDropdownOpen(false);
    }, 120);
  };

  const [dynamicCategories, setDynamicCategories] = useState([]);

  useEffect(() => {
    const fetchNavbarCategories = async () => {
      try {
        const res = await categoryAPI.getCategories();
        if (Array.isArray(res.categories) && res.categories.length > 0) {
          setDynamicCategories(res.categories);
        }
      } catch (err) {
        // Fallback to static list
      }
    };
    fetchNavbarCategories();
  }, []);

  const getCategoryIcon = (cat = {}) => {
    const img = (cat.image || '').trim();
    if (img && !img.startsWith('http') && !img.startsWith('/') && !img.includes('.')) {
      return img;
    }
    const slug = (cat.slug || '').toLowerCase();
    const name = (cat.name || '').toLowerCase();
    if (slug.includes('mango') || name.includes('mango') || name.includes('aam')) return '🥭';
    if (slug.includes('red') || name.includes('red') || name.includes('lal mirch')) return '🌶️';
    if (slug.includes('green') || name.includes('green') || name.includes('hari mirch')) return '🫑';
    if (slug.includes('lemon') || name.includes('lemon') || name.includes('nimbu')) return '🍋';
    if (slug.includes('rajasthan') || name.includes('kair') || name.includes('sangri')) return '🏺';
    if (slug.includes('garlic') || name.includes('garlic') || name.includes('lahsun')) return '🧄';
    if (slug.includes('jack') || name.includes('jack') || name.includes('kathal')) return '🪵';
    if (slug.includes('amla') || name.includes('amla') || name.includes('gooseberry')) return '🟢';
    if (slug.includes('ginger') || name.includes('ginger') || name.includes('adrak')) return '🫚';
    if (slug.includes('mix') || name.includes('mix')) return '🥗';
    if (slug.includes('sweet') || name.includes('meetha') || name.includes('murabba')) return '🍯';
    if (slug.includes('combo') || name.includes('box') || name.includes('hamp')) return '🎁';
    if (slug.includes('papad') || name.includes('papad')) return '🫓';
    return '🏺';
  };

  const navCategories = (dynamicCategories && dynamicCategories.length > 0)
    ? dynamicCategories.map((c) => {
        const cleanId = (c.slug || '').toLowerCase().replace(/-pickles?$/, '').replace(/s$/, '');
        const staticMatch = INGREDIENT_CATEGORIES.find(
          sc => sc.categorySlug === c.slug || sc.id === cleanId
        );
        const rawSubCats = (c.subCategories && c.subCategories.length > 0)
          ? c.subCategories
          : (staticMatch?.subCategories || []);

        return {
          id: c.slug || cleanId,
          name: c.name,
          hindiName: c.hindiName || staticMatch?.hindiName || '',
          categorySlug: c.slug,
          icon: getCategoryIcon(c) || staticMatch?.icon || '🏺',
          subCategories: rawSubCats.map(sub => ({
            name: sub.name,
            hindi: sub.hindiName || sub.hindi || '',
            slug: sub.slug,
            taste: sub.taste || 'tangy'
          }))
        };
      })
    : INGREDIENT_CATEGORIES;

  const tasteList = [
    { name: 'Sweet (मीठा / मुरब्बा)', path: '/shop/taste/sweet/', icon: '🍯' },
    { name: 'Tangy (खट्टा / चटपटा)', path: '/shop/taste/tangy/', icon: '🍋' },
    { name: 'Spicy (तीखा / चटपटा)', path: '/shop/taste/spicy/', icon: '🌶️' },
    { name: 'Winter Special (सर्दियों का खास)', path: '/shop/taste/winter/', icon: '❄️' },
    { name: 'Rajasthani Royal (शाही राजस्थानी)', path: '/shop/taste/rajasthani/', icon: '🏺' },
  ];

  const activeIngredient = navCategories.find(c => c.id === activeHoveredIngredientId || c.categorySlug === activeHoveredIngredientId) || null;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-[0_4px_12px_rgba(243,162,34,0.12)] transition-all" ref={navRef}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-20 sm:h-[88px] md:h-[94px]">
          
          {/* Left: Mobile Hamburger Button */}
          <div className="flex items-center lg:hidden z-10">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 -ml-1 text-gray-700 hover:text-[#b35400] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Logo: Centered on mobile, left on desktop */}
          <div className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 flex items-center z-10">
            <Link to="/" className="flex items-center flex-shrink-0 group py-1">
              <img 
                src={siteLogo} 
                alt="Singodia Foods" 
                className="h-[68px] sm:h-[84px] md:h-[96px] w-auto object-contain drop-shadow-sm transition-transform duration-200 group-hover:scale-105" 
                onError={(e) => { e.target.src = '/logo.png'; }}
              />
            </Link>
          </div>

          {/* Center Navigation Links (Exact FarmDidi Style without our story & blogs) */}
          <nav className="hidden lg:flex items-center space-x-7 font-sans font-bold text-[15px] text-[#b35400]">
            
            {/* 1. Shop by Ingredients 2-Column Flyout Dropdown (Exact FarmDidi Style) */}
            <div 
              className="relative"
              onMouseEnter={handleIngredientsEnter}
              onMouseLeave={handleIngredientsLeave}
            >
              <button 
                onClick={() => {
                  setIngredientsDropdownOpen(false);
                  navigate('/shop/');
                }}
                className="flex items-center gap-1.5 hover:text-[#e68819] transition-colors py-2 focus:outline-none"
              >
                <span>Shop by Ingredients</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${ingredientsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {ingredientsDropdownOpen && (
                <div 
                  className={`absolute top-full -left-4 ${activeIngredient ? 'w-[620px]' : 'w-[280px]'} bg-white rounded-2xl shadow-2xl border border-amber-200/80 z-50 flex overflow-hidden transition-all duration-150 animate-in fade-in slide-in-from-top-2`}
                >
                  {/* Left Column: Ingredients with chevron '>' */}
                  <div className="w-[280px] bg-white border-r border-gray-100 py-3 px-2 space-y-0.5 flex-shrink-0">
                    {navCategories.map((item) => {
                      const isHovered = activeHoveredIngredientId === item.id || activeHoveredIngredientId === item.categorySlug;
                      return (
                        <div
                          key={item.id}
                          onMouseEnter={() => setActiveHoveredIngredientId(item.id)}
                        >
                          <Link
                            to={`/category/${item.categorySlug}/`}
                            onClick={() => {
                              setIngredientsDropdownOpen(false);
                              setActiveHoveredIngredientId(null);
                            }}
                            className={`flex items-center justify-between px-3 py-2 rounded-xl text-[14px] font-bold transition-all ${
                              isHovered
                                ? 'text-[#b35400] underline font-extrabold bg-[#FAF6EF]'
                                : 'text-[#854102] hover:text-[#b35400] hover:bg-[#FAF6EF]/50'
                            }`}
                          >
                            <span className="flex items-center gap-2 truncate">
                              <span className="text-base">{item.icon}</span>
                              <span>{item.name}</span>
                              {item.hindiName && (
                                <span className="text-[12px] font-normal text-[#854102]/80">({item.hindiName})</span>
                              )}
                            </span>
                            <span className="text-sm font-bold text-[#b35400] ml-2 flex-shrink-0">&gt;</span>
                          </Link>
                        </div>
                      );
                    })}
                  </div>

                  {/* Right Column: Subcategories of the active hovered ingredient - only rendered on hover */}
                  {activeIngredient && (
                    <div className="flex-1 bg-white p-5 flex flex-col justify-between animate-in fade-in duration-150">
                      <div>
                        {/* Top Header: View All Pickles of this Ingredient */}
                        <Link
                          to={`/category/${activeIngredient.categorySlug}/`}
                          onClick={() => {
                            setIngredientsDropdownOpen(false);
                            setActiveHoveredIngredientId(null);
                          }}
                          className="group flex items-center justify-between pb-3 mb-3 border-b border-amber-100 text-xs font-black text-[#b35400] hover:text-[#e68819]"
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-base">{activeIngredient.icon}</span>
                            <span>All {activeIngredient.name} Pickles {activeIngredient.hindiName ? `(सभी ${activeIngredient.hindiName})` : ''}</span>
                          </span>
                          <span className="group-hover:translate-x-1 transition-transform font-bold">&rarr;</span>
                        </Link>

                        {/* Subcategories List */}
                        <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
                          {activeIngredient.subCategories && activeIngredient.subCategories.length > 0 ? (
                            activeIngredient.subCategories.map((sub) => (
                              <Link
                                key={sub.slug}
                                to={`/category/${activeIngredient.categorySlug}/${sub.slug}/`}
                                onClick={() => {
                                  setIngredientsDropdownOpen(false);
                                  setActiveHoveredIngredientId(null);
                                }}
                                className="group block py-1.5 px-2 rounded-lg hover:bg-[#FAF6EF] transition-all"
                              >
                                <div className="text-[14px] font-bold text-[#b35400] group-hover:text-[#e68819] transition-colors leading-tight">
                                  {sub.name}
                                </div>
                                {sub.hindi && (
                                  <div className="text-[11px] text-gray-500 font-medium group-hover:text-[#854102] mt-0.5">
                                    {sub.hindi}
                                  </div>
                                )}
                              </Link>
                            ))
                          ) : (
                            <div className="text-xs text-gray-400 py-3 italic">
                              Explore all {activeIngredient.name} pickles.
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Bottom Footer Note */}
                      <div className="pt-3 mt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                        <span>पारंपरिक देसी घर का स्वाद</span>
                        <Link
                          to={`/category/${activeIngredient.categorySlug}/`}
                          onClick={() => {
                            setIngredientsDropdownOpen(false);
                            setActiveHoveredIngredientId(null);
                          }}
                          className="text-[#b35400] font-bold hover:underline"
                        >
                          Explore all &rarr;
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 2. Shop by Taste Dropdown */}
            <div 
              className="relative"
              onMouseEnter={handleTasteEnter}
              onMouseLeave={handleTasteLeave}
            >
              <button 
                onClick={() => setTasteDropdownOpen(!tasteDropdownOpen)}
                className="flex items-center gap-1.5 hover:text-[#e68819] transition-colors py-2 focus:outline-none"
              >
                <span>Shop by taste</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${tasteDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {tasteDropdownOpen && (
                <div 
                  className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-3 px-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-3 py-1 mb-1 border-b border-gray-100">
                    Taste & Spice Profiles
                  </div>
                  {tasteList.map((item, idx) => (
                    <Link
                      key={idx}
                      to={item.path}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold text-gray-800 hover:bg-[#FAF6EF] hover:text-[#b35400] transition-colors"
                      onClick={() => setTasteDropdownOpen(false)}
                    >
                      <span className="text-base">{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Contact us (Our story and Blogs are removed per user request) */}
            <Link 
              to="/contact" 
              className="hover:text-[#e68819] transition-colors"
            >
              Contact us
            </Link>
          </nav>

          {/* Right Side: Search Pill, Account Icon, Cart with Red Badge */}
          <div className="flex items-center space-x-2.5 sm:space-x-4 z-10">
            
            {/* Search Pill: "Search our store" exactly matching the reference screenshot */}
            <div 
              onClick={onOpenSearch}
              className="hidden sm:flex items-center justify-between border border-gray-300 hover:border-gray-400 rounded-full py-1.5 px-4 bg-white text-gray-600 cursor-pointer w-44 md:w-52 lg:w-60 transition-colors shadow-xs"
              role="button"
              tabIndex={0}
              title="Search our store"
            >
              <span className="text-xs sm:text-[13px] text-gray-500 font-normal truncate">
                Search our store
              </span>
              <Search className="w-4 h-4 text-gray-500 ml-2 flex-shrink-0" />
            </div>

            {/* Mobile Search Icon Trigger */}
            <button
              onClick={onOpenSearch}
              className="sm:hidden p-2 text-gray-700 hover:text-[#b35400] rounded-full transition-colors"
              aria-label="Search Pickles"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Customer Account Icon (Golden/Amber outline from image) */}
            <Link
              to={isAuthenticated ? '/account' : '/login'}
              className="p-1.5 text-[#e68819] hover:text-[#c46809] transition-colors flex items-center relative group"
              aria-label="My Account"
              title={isAuthenticated ? `Logged in as ${user?.name}` : 'Login to your account'}
            >
              {/* Profile icon SVG matching FarmDidi user icon */}
              <svg 
                className="w-6 h-6 text-[#e68819]" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.8" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </Link>

            {/* Shopping Cart Icon (Wireframe golden cart with Round Crimson Red Badge) */}
            <button
              onClick={openCart}
              className="relative p-1.5 text-[#e68819] hover:text-[#c46809] transition-colors flex items-center"
              aria-label="Shopping Cart"
              title="View Cart"
            >
              <ShoppingCart className="w-6 h-6 text-[#e68819]" strokeWidth={1.8} />

              {/* Crimson Red Notification Bubble matching FarmDidi */}
              <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] bg-[#cc1226] text-white text-[11px] font-black rounded-full flex items-center justify-center px-1 shadow-xs animate-in zoom-in-75 duration-200">
                {cartCount}
              </span>
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu (Slide-in) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[64px] bg-black/50 backdrop-blur-xs z-50">
          <div className="bg-white w-[85%] max-w-sm h-full shadow-2xl p-5 overflow-y-auto animate-in slide-in-from-left duration-200 border-r border-gray-200">
            
            {/* Mobile Drawer Brand Logo */}
            <div className="pb-4 mb-4 border-b border-gray-100 flex items-center justify-between">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center">
                <img src={siteLogo} alt="Singodia Foods" className="h-16 w-auto object-contain drop-shadow-sm" onError={(e) => { e.target.src = '/logo.png'; }} />
              </Link>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Pill inside mobile menu */}
            <div 
              onClick={() => { setMobileMenuOpen(false); onOpenSearch(); }}
              className="flex items-center justify-between border border-gray-300 rounded-full py-2 px-4 bg-gray-50 text-gray-600 cursor-pointer mb-5 text-xs"
            >
              <span className="text-gray-500 font-normal">Search our store</span>
              <Search className="w-4 h-4 text-gray-500" />
            </div>

            {/* Mobile Navigation List */}
            <div className="flex flex-col space-y-1 font-sans font-bold text-sm text-[#b35400]">
              
              {/* Home */}
              <Link 
                to="/" 
                className="py-2.5 px-3 rounded-lg hover:bg-cream-100 flex items-center justify-between"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Home</span>
              </Link>

              {/* Accordion: Shop by Ingredients */}
              <div className="border-b border-gray-100 py-1">
                <button
                  onClick={() => setMobileIngredientsOpen(!mobileIngredientsOpen)}
                  className="w-full py-2.5 px-3 rounded-lg flex items-center justify-between hover:bg-cream-100 text-[#b35400] font-bold"
                >
                  <span>Shop by Ingredients</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileIngredientsOpen ? 'rotate-180' : ''}`} />
                </button>

                {mobileIngredientsOpen && (
                  <div className="pl-1 pr-1 py-1 space-y-1 bg-[#FAF6EF]/70 rounded-xl my-1">
                    {navCategories.map((item) => {
                      const isExpanded = mobileActiveIngredient === item.id || mobileActiveIngredient === item.categorySlug;
                      return (
                        <div key={item.id} className="border-b border-amber-100/60 last:border-0 py-1">
                          <div className="flex items-center justify-between px-2 py-1.5">
                            <Link
                              to={`/category/${item.categorySlug}/`}
                              onClick={() => setMobileMenuOpen(false)}
                              className="text-xs font-bold text-gray-800 hover:text-[#b35400] flex items-center gap-2 flex-1"
                            >
                              <span>{item.icon}</span>
                              <span>{item.name} {item.hindiName ? `(${item.hindiName})` : ''}</span>
                            </Link>
                            <button
                              type="button"
                              onClick={() => setMobileActiveIngredient(isExpanded ? null : item.id)}
                              className="p-1.5 text-gray-400 hover:text-[#b35400] cursor-pointer"
                              aria-label={`Toggle ${item.name} subcategories`}
                            >
                              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-[#b35400]' : ''}`} />
                            </button>
                          </div>
                          {isExpanded && (
                            <div className="pl-6 pr-2 py-1.5 space-y-1.5 bg-white/80 rounded-lg mb-1">
                              <Link
                                to={`/category/${item.categorySlug}/`}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block text-[11px] font-extrabold text-[#b35400] py-0.5 border-b border-amber-200/50"
                              >
                                All {item.name} Pickles {item.hindiName ? `(सभी ${item.hindiName})` : ''} &rarr;
                              </Link>
                              {item.subCategories && item.subCategories.length > 0 ? (
                                item.subCategories.map((sub) => (
                                  <Link
                                    key={sub.slug}
                                    to={`/category/${item.categorySlug}/${sub.slug}/`}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block text-[11px] font-semibold text-gray-700 hover:text-[#b35400] py-1"
                                  >
                                    {sub.name} {sub.hindi ? <span className="text-[10px] text-gray-400">({sub.hindi})</span> : null}
                                  </Link>
                                ))
                              ) : null}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Accordion: Shop by Taste */}
              <div className="border-b border-gray-100 py-1">
                <button
                  onClick={() => setMobileTasteOpen(!mobileTasteOpen)}
                  className="w-full py-2.5 px-3 rounded-lg flex items-center justify-between hover:bg-cream-100 text-[#b35400]"
                >
                  <span>Shop by taste</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileTasteOpen ? 'rotate-180' : ''}`} />
                </button>

                {mobileTasteOpen && (
                  <div className="pl-4 pr-2 py-1 space-y-1 bg-[#FAF6EF]/60 rounded-xl my-1">
                    {tasteList.map((item, idx) => (
                      <Link
                        key={idx}
                        to={item.path}
                        className="flex items-center gap-2.5 py-2 px-2 text-xs font-semibold text-gray-800 hover:text-[#b35400]"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span>{item.icon}</span>
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Contact us (Our story & blogs excluded) */}
              <Link 
                to="/contact" 
                className="py-2.5 px-3 rounded-lg hover:bg-cream-100 flex items-center justify-between text-[#b35400]"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Contact us</span>
              </Link>

            </div>

            {/* Mobile Account Details & WhatsApp */}
            <div className="pt-6 mt-6 border-t border-gray-200 space-y-3">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="text-xs text-gray-600 px-3">
                    Welcome back, <strong className="text-gray-900">{user?.name}</strong>
                  </div>
                  <Link 
                    to="/account" 
                    className="block text-center text-xs font-bold py-2.5 bg-gray-100 text-gray-800 rounded-xl"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Account & Orders
                  </Link>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link 
                    to="/login" 
                    className="flex-1 text-center py-2.5 text-xs font-bold border border-[#b35400] text-[#b35400] rounded-xl"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="flex-1 text-center py-2.5 text-xs font-bold bg-[#b35400] text-white rounded-xl"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}

              <a
                href="https://wa.me/919782983909?text=Hello%20Singodhia%20Foods%2C%20I%20have%20an%20inquiry%20regarding%20products%20and%20orders."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 text-xs font-bold bg-[#25D366] text-white rounded-xl shadow-xs"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

          </div>
        </div>
      )}

    </header>
  );
};

export default Navbar;

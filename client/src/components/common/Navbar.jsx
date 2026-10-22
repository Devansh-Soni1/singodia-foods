import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, ChevronDown, Sparkles, MessageCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { categoryAPI } from '../../services/api';

export const Navbar = ({ onOpenSearch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [ingredientsDropdownOpen, setIngredientsDropdownOpen] = useState(false);
  const [tasteDropdownOpen, setTasteDropdownOpen] = useState(false);
  
  // Mobile accordion states
  const [mobileIngredientsOpen, setMobileIngredientsOpen] = useState(false);
  const [mobileTasteOpen, setMobileTasteOpen] = useState(false);

  const { cartCount, openCart } = useCart();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setIngredientsDropdownOpen(false);
    setTasteDropdownOpen(false);
  }, [location.pathname, location.search]);

  // Close dropdowns on outside click
  const navRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setIngredientsDropdownOpen(false);
        setTasteDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const defaultIngredientsList = [
    { name: 'Mango (Aam / आम का अचार)', slug: 'mango-pickles', icon: '🥭' },
    { name: 'Red Chilli (Banarasi Lal Mirch / भरवां लाल मिर्च)', slug: 'red-chilli-pickles', icon: '🌶️' },
    { name: 'Green Chilli (Hari Mirch Tipore / हरी मिर्च)', slug: 'green-chilli-pickles', icon: '🫑' },
    { name: 'Lemon (Nimbu / खट्टा मीठा नीम्बू)', slug: 'lemon-pickles', icon: '🍋' },
    { name: 'Garlic (Lahsun / देसी लहसुन)', slug: 'garlic-pickles', icon: '🧄' },
    { name: 'Rajasthani Kair Sangri (कैर सांगरी शाही अचार)', slug: 'rajasthani-specials', icon: '👑' },
    { name: 'Mixed Vegetables (Pachranga Mix / पचरंगा)', slug: 'mixed-pickles', icon: '🥕' },
    { name: 'Combo Packs & Hampers (कॉम्बो पैक)', slug: 'combo-packs', icon: '🎁' },
  ];

  const ingredientsList = dynamicCategories.length > 0
    ? dynamicCategories.map(c => ({
        name: c.hindiName ? `${c.name} (${c.hindiName})` : c.name,
        slug: c.slug,
        icon: c.slug.includes('mango') ? '🥭' : c.slug.includes('chilli') || c.slug.includes('mirch') ? '🌶️' : c.slug.includes('lemon') || c.slug.includes('nimbu') ? '🍋' : c.slug.includes('garlic') || c.slug.includes('lahsun') ? '🧄' : c.slug.includes('combo') ? '🎁' : '👑'
      }))
    : defaultIngredientsList;

  const tasteList = [
    { name: 'Sweet (मीठा / मुरब्बा)', filter: 'subCategory=sweet', icon: '🍯' },
    { name: 'Tangy (खट्टा / चटपटा)', filter: 'subCategory=tangy', icon: '🍋' },
    { name: 'Spicy (तीखा / चटपटा)', filter: 'subCategory=spicy', icon: '🌶️' },
    { name: 'Winter Special (सर्दियों का खास)', filter: 'subCategory=winter', icon: '❄️' },
    { name: 'Rajasthani Royal (शाही राजस्थानी)', filter: 'subCategory=rajasthani', icon: '🏺' },
  ];

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
                src="/logo.png" 
                alt="Singodia Foods" 
                className="h-[64px] sm:h-[78px] md:h-[88px] w-auto object-contain drop-shadow-sm transition-transform duration-200 group-hover:scale-105" 
              />
            </Link>
          </div>

          {/* Center Navigation Links (Exact FarmDidi Style without our story & blogs) */}
          <nav className="hidden lg:flex items-center space-x-7 font-sans font-bold text-[15px] text-[#b35400]">
            
            {/* 1. Shop by Ingredients Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => { setIngredientsDropdownOpen(true); setTasteDropdownOpen(false); }}
            >
              <button 
                onClick={() => setIngredientsDropdownOpen(!ingredientsDropdownOpen)}
                className="flex items-center gap-1.5 hover:text-[#e68819] transition-colors py-2 focus:outline-none"
              >
                <span>Shop by Ingredients</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${ingredientsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {ingredientsDropdownOpen && (
                <div 
                  className="absolute top-full left-0 w-72 bg-white rounded-xl shadow-xl border border-gray-100 py-3 px-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setIngredientsDropdownOpen(false)}
                >
                  <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-3 py-1 mb-1 border-b border-gray-100">
                    Traditional Ingredients
                  </div>
                  {ingredientsList.map((item) => (
                    <Link
                      key={item.slug}
                      to={`/shop?category=${item.slug}`}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold text-gray-800 hover:bg-[#FAF6EF] hover:text-[#b35400] transition-colors"
                      onClick={() => setIngredientsDropdownOpen(false)}
                    >
                      <span className="text-base">{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Shop by Taste Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => { setTasteDropdownOpen(true); setIngredientsDropdownOpen(false); }}
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
                  onMouseLeave={() => setTasteDropdownOpen(false)}
                >
                  <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-3 py-1 mb-1 border-b border-gray-100">
                    Taste & Spice Profiles
                  </div>
                  {tasteList.map((item, idx) => (
                    <Link
                      key={idx}
                      to={`/shop?${item.filter}`}
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

            {/* 3. Build your Combo */}
            <Link 
              to="/build-combo" 
              className="hover:text-[#e68819] transition-colors flex items-center gap-1"
            >
              <span>Build your combo</span>
            </Link>

            {/* 4. Contact us (Our story and Blogs are removed per user request) */}
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
                <img src="/logo.png" alt="Singodia Foods" className="h-16 w-auto object-contain drop-shadow-sm" />
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
                  className="w-full py-2.5 px-3 rounded-lg flex items-center justify-between hover:bg-cream-100 text-[#b35400]"
                >
                  <span>Shop by Ingredients</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileIngredientsOpen ? 'rotate-180' : ''}`} />
                </button>

                {mobileIngredientsOpen && (
                  <div className="pl-4 pr-2 py-1 space-y-1 bg-[#FAF6EF]/60 rounded-xl my-1">
                    {ingredientsList.map((item) => (
                      <Link
                        key={item.slug}
                        to={`/shop?category=${item.slug}`}
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
                        to={`/shop?${item.filter}`}
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

              {/* Build your combo */}
              <Link 
                to="/build-combo" 
                className="py-2.5 px-3 rounded-lg hover:bg-cream-100 flex items-center justify-between text-[#b35400]"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Build your combo</span>
                <span className="text-[10px] bg-[#f3a222] text-black px-2 py-0.5 rounded-full font-extrabold uppercase">Custom Box</span>
              </Link>

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

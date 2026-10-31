import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Star, Plus, Check, ShoppingBag, 
  Truck, ShieldCheck, ChevronDown, Gift, Zap, X
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { adminAPI } from '../../services/api';
import siteLogo from '../../assets/logo.png';

// 8 Default Signature Flavours
export const DEFAULT_TRIAL_ITEMS = [
  { id: 1, name: 'Kachi Keri Aam', hindiName: 'कच्ची केरी', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=400&q=80', taste: 'Khatta Meetha', icon: '🥭' },
  { id: 2, name: 'Bharwa Lal Mirch', hindiName: 'भरवां लाल मिर्च', image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=400&q=80', taste: 'Banarasi Teekha', icon: '🌶️' },
  { id: 3, name: 'Teekhi Hari Mirch', hindiName: 'हरी मिर्च', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80', taste: 'Lemon Cured', icon: '🫑' },
  { id: 4, name: 'Khatta Meetha Nimbu', hindiName: 'नीम्बू अचार', image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80', taste: 'Oil-Free Sun Cured', icon: '🍋' },
  { id: 5, name: 'Kair Sangri Shahi', hindiName: 'कैर सांगरी', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80', taste: 'Royal Marwadi', icon: '🏺' },
  { id: 6, name: 'Desi Lasun Methi', hindiName: 'लहसुन मेथी', image: 'https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&w=400&q=80', taste: 'Desi Garlic', icon: '🧄' },
  { id: 7, name: 'Hathras Hing Aam', hindiName: 'हींग आम', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80', taste: 'Hing Flavour', icon: '🌸' },
  { id: 8, name: 'Winter Mix Veg', hindiName: 'मिक्स अचार', image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80', taste: 'Crunchy Veg', icon: '🥕' }
];

export const FeaturedTrialPackBanner = () => {
  const { addToCart } = useCart();
  const [packSize, setPackSize] = useState(4);
  const [trialItems, setTrialItems] = useState(DEFAULT_TRIAL_ITEMS);
  
  // Start empty for 4 or 6 pack; when 8 pack is selected, auto-select all 8!
  const [selectedJars, setSelectedJars] = useState([]);

  // Pricing
  const [pricing, setPricing] = useState({
    4: { originalPrice: 599, price: 499, discountPercent: 17 },
    6: { originalPrice: 699, price: 599, discountPercent: 14 },
    8: { originalPrice: 799, price: 699, discountPercent: 10 }
  });

  // Parabolic flight state
  const [flyingJar, setFlyingJar] = useState(null);
  const bucketTargetRef = useRef(null);
  const [bucketBounce, setBucketBounce] = useState(false);
  const [bucketSparkles, setBucketSparkles] = useState(false);

  // Load custom settings from Admin if configured
  useEffect(() => {
    const loadCustomSettings = async () => {
      try {
        const res = await adminAPI.getSettings();
        if (res?.settings?.trialPackItems && Array.isArray(res.settings.trialPackItems) && res.settings.trialPackItems.length === 8) {
          setTrialItems(res.settings.trialPackItems);
        }
        if (res?.settings?.trialPackPricing) {
          setPricing(prev => ({ ...prev, ...res.settings.trialPackPricing }));
        }
      } catch (err) {
        console.warn('Using default trial pack items:', err);
      }
    };
    loadCustomSettings();
  }, []);

  const currentPricing = pricing[packSize] || pricing[8];
  const isBucketFull = selectedJars.length >= packSize;

  // Handle pack size change: when 8 is selected, auto-select all 8 items!
  const handlePackChange = (newSize) => {
    setPackSize(newSize);
    if (newSize === 8) {
      // 8 wala select kare tab hi auto select ho sabhi item!
      setSelectedJars([...trialItems]);
      setBucketBounce(true);
      setBucketSparkles(true);
      setTimeout(() => {
        setBucketBounce(false);
        setBucketSparkles(false);
      }, 500);
    } else {
      // 4 ya 6 par empty rahega taki user khud choose kar sake
      setSelectedJars([]);
    }
  };

  // Toggle item in/out of bucket with arcing flight animation
  const handleToggleJar = (item, event) => {
    const isAlreadyIn = selectedJars.some(j => j.id === item.id);

    if (isAlreadyIn) {
      // Remove from bucket
      setSelectedJars(prev => prev.filter(j => j.id !== item.id));
      return;
    }

    if (selectedJars.length >= packSize) {
      // Alert bounce if bucket full
      setBucketBounce(true);
      setTimeout(() => setBucketBounce(false), 350);
      return;
    }

    // Launch parabolic flight arc towards the Bucket
    if (event && bucketTargetRef.current) {
      const cardRect = event.currentTarget.getBoundingClientRect();
      const bucketRect = bucketTargetRef.current.getBoundingClientRect();

      const startX = cardRect.left + cardRect.width / 2;
      const startY = cardRect.top + cardRect.height / 2;
      const targetX = bucketRect.left + bucketRect.width / 2;
      const targetY = bucketRect.top + bucketRect.height / 3;

      setFlyingJar({
        image: item.image,
        startX,
        startY,
        dx: targetX - startX,
        dy: targetY - startY
      });

      setTimeout(() => {
        setFlyingJar(null);
        setBucketBounce(true);
        setBucketSparkles(true);
        setTimeout(() => {
          setBucketBounce(false);
          setBucketSparkles(false);
        }, 400);
      }, 450);
    }

    setSelectedJars(prev => [...prev, item]);
  };

  // Add customized trial pack to cart
  const handleAddToCart = () => {
    const itemsToPack = selectedJars.length > 0 
      ? selectedJars 
      : trialItems.slice(0, packSize);

    const trialProduct = {
      _id: `trial-pack-${packSize}`,
      name: `Singodia Foods Special Trial Pack (Pack of ${packSize})`,
      hindiName: `सिंगोदिया स्पेशल ट्रायल पैक (${packSize} का पैक)`,
      slug: `singodia-special-trial-pack-${packSize}`,
      images: [
        itemsToPack[0]?.image || 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=400&q=80'
      ],
      variants: [
        {
          weight: `${packSize} Jars x 75g (${itemsToPack.map(j => j.name).join(', ')})`,
          price: currentPricing.price,
          originalPrice: currentPricing.originalPrice,
          inStock: true,
          stockCount: 100
        }
      ]
    };

    addToCart(trialProduct, trialProduct.variants[0], 1);
  };

  return (
    <section className="py-5 sm:py-7 bg-white border-b border-cream-200 font-sans relative">
      
      {/* Animated Flying Jar Portal */}
      {flyingJar && (
        <div 
          className="fixed z-50 pointer-events-none"
          style={{
            left: `${flyingJar.startX}px`,
            top: `${flyingJar.startY}px`,
            '--dx': `${flyingJar.dx}px`,
            '--dy': `${flyingJar.dy}px`,
            animation: 'parabolicFlightArc 0.45s cubic-bezier(0.2, 0.85, 0.35, 1.25) forwards'
          }}
        >
          <div className="w-12 h-12 rounded-2xl p-1 bg-white shadow-2xl border-2 border-brand-green ring-4 ring-amber-400 flex items-center justify-center">
            <img src={flyingJar.image} alt="flying jar" className="w-full h-full object-cover rounded-xl" />
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-3 sm:px-6">
        
        {/* ========================================================== */}
        {/* COMPACT MAIN BOX (SLEEK HEIGHT & PREMIUM BORDER) */}
        {/* ========================================================== */}
        <div className="bg-[#FFFDF9] rounded-3xl border-2 border-amber-300/90 shadow-md p-3.5 sm:p-5 relative overflow-hidden">
          
          {/* Subtle Warm Background Glow */}
          <div className="absolute -top-16 -right-16 w-60 h-60 bg-amber-200/30 rounded-full blur-2xl pointer-events-none" />

          {/* -------------------------------------------------------- */}
          {/* 1. TOP ROW: Left Logo & Right Discount Line */}
          {/* -------------------------------------------------------- */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 mb-3.5 border-b border-amber-200/70">
            
            {/* LEFT: Official Logo */}
            <div className="flex items-center gap-2">
              <img 
                src={siteLogo} 
                alt="Singodia Foods" 
                className="h-10 sm:h-12 md:h-14 w-auto object-contain drop-shadow-xs" 
                onError={(e) => { e.target.src = '/logo.png'; }} 
              />
              <span className="hidden sm:inline-block text-[10px] font-extrabold uppercase tracking-widest text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-md">
                100% Traditional Handcrafted
              </span>
            </div>

            {/* RIGHT: Red Offer Line */}
            <div className="inline-flex items-center gap-2 bg-[#D32F2F] text-white px-3.5 py-1.5 rounded-full shadow-2xs text-xs font-black tracking-wide uppercase self-start sm:self-auto">
              <span className="bg-white text-[#D32F2F] text-[10px] font-black px-1.5 py-0.2 rounded-full">
                {currentPricing.discountPercent}% OFF
              </span>
              <span>
                {packSize}x75g Pickle Jars At <s className="opacity-75 font-normal">₹{currentPricing.originalPrice}</s> <span className="text-amber-300 font-black text-sm">₹{currentPricing.price}</span>
              </span>
            </div>

          </div>

          {/* -------------------------------------------------------- */}
          {/* 2. MAIN 2-COLUMN SECTION: Product Cards (Left) + Bucket & Info (Right) */}
          {/* -------------------------------------------------------- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-center">

            {/* ====================================================== */}
            {/* LEFT SIDE (7 cols): 8 Compact Product Cards (4 cols x 2 rows) */}
            {/* ====================================================== */}
            <div className="lg:col-span-7">
              <div className="text-[11px] font-bold text-gray-700 mb-2 flex items-center justify-between">
                <span>Tap any card to drop into bucket:</span>
                <span className="text-[10px] font-black text-brand-green bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                  {selectedJars.length} / {packSize} Selected
                </span>
              </div>

              {/* 4x2 Compact Cards Grid */}
              <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
                {trialItems.map((item) => {
                  const isSelected = selectedJars.some(j => j.id === item.id);
                  const isFull = isBucketFull && !isSelected;

                  return (
                    <div
                      key={item.id}
                      onClick={(e) => handleToggleJar(item, e)}
                      className={`relative rounded-2xl p-2 border text-center transition-all duration-200 flex flex-col justify-between items-center cursor-pointer select-none group ${
                        isSelected 
                          ? 'bg-emerald-50/90 border-brand-green ring-2 ring-brand-green/30 shadow-xs' 
                          : isFull 
                            ? 'bg-white/70 border-gray-200 opacity-60' 
                            : 'bg-white border-amber-200/90 hover:border-amber-400 hover:shadow-sm hover:-translate-y-0.5 active:scale-95'
                      }`}
                    >
                      {/* Product Thumbnail */}
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-amber-50/60 border border-gray-200 mb-1.5 shadow-2xs">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=300&q=80'; }}
                        />
                      </div>

                      {/* Name & Flavour */}
                      <div className="w-full mb-1.5">
                        <span className="text-[10px] font-extrabold text-gray-900 block leading-tight truncate">
                          {item.hindiName}
                        </span>
                        <span className="text-[9px] text-gray-500 font-medium block truncate">
                          {item.name.split(' ')[0]}
                        </span>
                      </div>

                      {/* Bottom Button (Sends into Bucket) */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleJar(item, e);
                        }}
                        disabled={isFull}
                        className={`w-full py-1 px-1.5 rounded-lg text-[10px] font-black flex items-center justify-center gap-0.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-brand-green text-white shadow-2xs'
                            : isFull
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-amber-400 hover:bg-brand-green text-gray-950 hover:text-white shadow-2xs active:scale-90'
                        }`}
                        title={isSelected ? 'Remove from bucket' : 'Drop into bucket'}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>In Bucket</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3 stroke-[3]" />
                            <span>+ Add</span>
                          </>
                        )}
                      </button>

                    </div>
                  );
                })}
              </div>
            </div>

            {/* ====================================================== */}
            {/* RIGHT SIDE (5 cols): Title, Price, REAL BUCKET & ADD TO CART */}
            {/* ====================================================== */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              
              {/* Heading & Subtitle */}
              <div>
                <h3 className="text-base sm:text-lg lg:text-xl font-extrabold text-[#832B0A] leading-tight font-serif">
                  Not sure which <span className="text-brand-green underline decoration-wavy decoration-mustard">pickle</span> to try first?
                </h3>
                <p className="text-[11px] text-gray-600 font-medium mt-0.5">
                  Pick flavours on left — watch them drop into your bucket!
                </p>
              </div>

              {/* Pack Selector (4, 6, 8 Jars) & Price Row */}
              <div className="my-2.5 p-2 bg-amber-50/80 rounded-xl border border-amber-200 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1">
                    {[4, 6, 8].map((size) => {
                      const isActive = packSize === size;
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => handlePackChange(size)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                            isActive
                              ? 'bg-[#832B0A] text-white shadow-xs scale-102 ring-2 ring-amber-400'
                              : 'bg-white text-gray-800 border border-gray-200 hover:border-amber-400 hover:bg-amber-100/50'
                          }`}
                        >
                          <span>{size} Pack</span>
                          {size === 8 && (
                            <span className={`text-[9px] font-black px-1 rounded-sm uppercase ${
                              isActive ? 'bg-amber-300 text-amber-950' : 'bg-amber-100 text-amber-800'
                            }`}>
                              All 8
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-baseline gap-1.5 shrink-0">
                    <span className="text-lg sm:text-xl font-black text-[#D32F2F]">
                      ₹{currentPricing.price}
                    </span>
                    <span className="text-xs text-gray-400 line-through font-semibold">
                      ₹{currentPricing.originalPrice}
                    </span>
                    <span className="bg-[#D32F2F] text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
                      {currentPricing.discountPercent}% OFF
                    </span>
                  </div>
                </div>

                {packSize === 8 && selectedJars.length === 8 && (
                  <div className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md flex items-center justify-between">
                    <span>✨ All 8 flavours auto-selected in bucket!</span>
                    <span className="text-[9px] text-emerald-900 font-extrabold uppercase">Best Value</span>
                  </div>
                )}
              </div>

              {/* ==================================================== */}
              {/* REALISTIC SVG BUCKET (CART BUCKET WITH LIVE JARS) */}
              {/* ==================================================== */}
              <div 
                ref={bucketTargetRef}
                className={`relative my-1 p-2 rounded-2xl bg-gradient-to-b from-amber-100/70 via-amber-50 to-orange-50/50 border-2 border-amber-300 shadow-sm transition-all duration-300 ${
                  bucketBounce ? 'scale-105 ring-4 ring-brand-green shadow-lg animate-bucket-thump' : ''
                }`}
              >
                {/* Sparkle burst on item landing */}
                {bucketSparkles && (
                  <div className="absolute -top-3 right-4 z-20 pointer-events-none animate-sparkle-burst">
                    <span className="text-xl">✨</span>
                    <span className="text-lg">🌟</span>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  
                  {/* The Realistic Illustrated Bucket Graphic */}
                  <div className="w-20 sm:w-24 shrink-0 relative">
                    <svg viewBox="0 0 200 170" className="w-full h-auto drop-shadow-md select-none">
                      <defs>
                        <linearGradient id="bucketMetalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#FDE68A" />
                          <stop offset="45%" stopColor="#F59E0B" />
                          <stop offset="100%" stopColor="#D97706" />
                        </linearGradient>
                        <linearGradient id="bucketCavity" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#78350F" />
                          <stop offset="100%" stopColor="#451A03" />
                        </linearGradient>
                      </defs>

                      {/* Bucket Handle */}
                      <path d="M 35 65 C 35 15, 165 15, 165 65" fill="none" stroke="#92400E" strokeWidth="5" strokeLinecap="round" />
                      <rect x="80" y="16" width="40" height="12" rx="6" fill="#78350F" stroke="#FDE68A" strokeWidth="1.5" />

                      {/* Bucket Shadow */}
                      <ellipse cx="100" cy="160" rx="65" ry="8" fill="rgba(0,0,0,0.15)" />

                      {/* Bucket Body */}
                      <path d="M 28 65 L 45 150 Q 100 162 155 150 L 172 65 Z" fill="url(#bucketMetalGrad)" stroke="#B45309" strokeWidth="2.5" />

                      {/* Embossed Ring details */}
                      <path d="M 33 95 Q 100 106 167 95" fill="none" stroke="#FEF3C7" strokeWidth="2.5" opacity="0.85" />
                      <path d="M 40 128 Q 100 138 160 128" fill="none" stroke="#FEF3C7" strokeWidth="2.5" opacity="0.85" />

                      {/* Rim Opening */}
                      <ellipse cx="100" cy="65" rx="72" ry="18" fill="url(#bucketCavity)" stroke="#78350F" strokeWidth="2.5" />
                    </svg>

                    {/* Badge on Bucket */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/95 border border-amber-300 px-1.5 py-0.2 rounded-full shadow-2xs">
                      <span className="text-[9px] font-black text-gray-900 leading-none block whitespace-nowrap">
                        {selectedJars.length}/{packSize} Jars
                      </span>
                    </div>
                  </div>

                  {/* Inside Bucket Live Items Peek Tray */}
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-extrabold text-amber-900 mb-1 flex items-center justify-between">
                      <span>Items in Bucket:</span>
                      <span className="text-[9px] text-gray-500 font-bold">Tap × to remove</span>
                    </div>

                    {selectedJars.length === 0 ? (
                      <div className="p-2 bg-white/80 rounded-xl border border-dashed border-amber-300 text-center">
                        <span className="text-[10px] text-amber-800/80 font-bold block animate-bounce">
                          🧺 Bucket is empty!
                        </span>
                        <span className="text-[9px] text-gray-500 block">
                          Tap pickles on left to add
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto scrollbar-none p-1 bg-white/90 rounded-xl border border-amber-200">
                        {selectedJars.map((j) => (
                          <div 
                            key={j.id} 
                            className="inline-flex items-center gap-1 bg-amber-50 border border-amber-300 rounded-lg px-1.5 py-0.5 shadow-2xs"
                          >
                            <img src={j.image} alt={j.name} className="w-3.5 h-3.5 rounded object-cover" />
                            <span className="text-[9px] font-bold text-gray-900 truncate max-w-[65px]">
                              {j.hindiName || j.name.split(' ')[0]}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedJars(prev => prev.filter(item => item.id !== j.id));
                              }}
                              className="text-red-500 hover:text-red-700 ml-0.5 cursor-pointer"
                              title="Remove"
                            >
                              <X className="w-2.5 h-2.5 stroke-[3]" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* Big Red ADD TO CART Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-black text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 uppercase tracking-wider active:scale-98 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {selectedJars.length === 0 
                      ? `ADD PACK OF ${packSize} TO CART • ₹${currentPricing.price}`
                      : `ADD TO CART • ₹${currentPricing.price} (${selectedJars.length}/${packSize} IN BUCKET)`
                    }
                  </span>
                </button>

                {/* Delivery & Perks */}
                <div className="flex items-center justify-between text-[10.5px] font-bold text-gray-700 mt-2">
                  <div className="flex items-center gap-1 text-emerald-800">
                    <Truck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Express Pan-India Delivery</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-900">
                    <Zap className="w-3.5 h-3.5 text-amber-600" />
                    <span>100% Online Secured via Razorpay</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Flight & Bounce Keyframe Styles */}
      <style>{`
        @keyframes parabolicFlightArc {
          0% {
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 1;
          }
          35% {
            transform: translate(calc(var(--dx) * 0.35), calc(var(--dy) * 0.2 - 80px)) scale(1.15) rotate(-15deg);
            opacity: 1;
          }
          70% {
            transform: translate(calc(var(--dx) * 0.75), calc(var(--dy) * 0.65 - 30px)) scale(0.85) rotate(10deg);
            opacity: 0.95;
          }
          100% {
            transform: translate(var(--dx), var(--dy)) scale(0.35) rotate(0deg);
            opacity: 0;
          }
        }

        @keyframes bucketThumpAnim {
          0% { transform: scale(1, 1); }
          25% { transform: scale(1.08, 0.92); }
          50% { transform: scale(0.95, 1.05); }
          75% { transform: scale(1.02, 0.98); }
          100% { transform: scale(1, 1); }
        }

        .animate-bucket-thump {
          animation: bucketThumpAnim 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        @keyframes sparkleBurstFade {
          0% { transform: scale(0.3) rotate(0deg); opacity: 1; }
          100% { transform: scale(1.5) rotate(40deg); opacity: 0; }
        }

        .animate-sparkle-burst {
          animation: sparkleBurstFade 0.4s ease-out forwards;
        }
      `}</style>

    </section>
  );
};

export default FeaturedTrialPackBanner;

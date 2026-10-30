import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Star, Plus, Check, ShoppingBag, 
  Truck, ShieldCheck, Gift, Zap, X, Flame
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { adminAPI } from '../../services/api';
import siteLogo from '../../assets/logo.png';

// 8 Default Signature Flavours with rich descriptors
export const DEFAULT_TRIAL_ITEMS = [
  { id: 1, name: 'Kachi Keri Aam', hindiName: 'कच्ची केरी आम', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=400&q=80', taste: 'Khatta Meetha', icon: '🥭', badge: 'Traditional' },
  { id: 2, name: 'Bharwa Lal Mirch', hindiName: 'भरवां लाल मिर्च', image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=400&q=80', taste: 'Spicy Banarasi', icon: '🌶️', badge: 'Bestseller' },
  { id: 3, name: 'Teekhi Hari Mirch', hindiName: 'तीखी हरी मिर्च', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80', taste: 'Tangy Lemon-Cured', icon: '🫑', badge: 'Crispy' },
  { id: 4, name: 'Khatta Meetha Nimbu', hindiName: 'नीम्बू अचार', image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80', taste: 'Sun-Cured Oil-Free', icon: '🍋', badge: 'Oil-Free' },
  { id: 5, name: 'Kair Sangri Shahi', hindiName: 'कैर सांगरी', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80', taste: 'Royal Marwadi', icon: '🏺', badge: 'Royal' },
  { id: 6, name: 'Desi Lasun Methi', hindiName: 'लहसुन मेथी', image: 'https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&w=400&q=80', taste: 'Aromatic Garlic', icon: '🧄', badge: 'Immunity' },
  { id: 7, name: 'Hathras Hing Aam', hindiName: 'हींग आम अचार', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80', taste: 'Hathrasi Hing Tadka', icon: '🌸', badge: 'Digestive' },
  { id: 8, name: 'Winter Mix Veg', hindiName: 'मिक्स अचार', image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80', taste: 'Crunchy Garden Medley', icon: '🥕', badge: 'Fresh' }
];

export const FeaturedTrialPackBanner = () => {
  const { addToCart } = useCart();
  const [packSize, setPackSize] = useState(8);
  const [trialItems, setTrialItems] = useState(DEFAULT_TRIAL_ITEMS);
  const [selectedJars, setSelectedJars] = useState(() => DEFAULT_TRIAL_ITEMS.slice(0, 8));

  // Dynamic pricing
  const [pricing, setPricing] = useState({
    4: { originalPrice: 599, price: 499, discountPercent: 17 },
    6: { originalPrice: 699, price: 599, discountPercent: 14 },
    8: { originalPrice: 799, price: 699, discountPercent: 10 }
  });

  // Micro-interaction animation state
  const [flyingJar, setFlyingJar] = useState(null);
  const bucketRef = useRef(null);
  const [bucketBounce, setBucketBounce] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);

  // Load custom 8 items and pricing from Admin Settings if saved
  useEffect(() => {
    const loadCustomSettings = async () => {
      try {
        const res = await adminAPI.getSettings();
        if (res?.settings?.trialPackItems && Array.isArray(res.settings.trialPackItems) && res.settings.trialPackItems.length === 8) {
          setTrialItems(res.settings.trialPackItems);
          setSelectedJars(res.settings.trialPackItems.slice(0, packSize));
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

  // Handle pack size toggle (4, 6, 8)
  const handlePackChange = (newSize) => {
    setPackSize(newSize);
    if (selectedJars.length > newSize) {
      setSelectedJars(selectedJars.slice(0, newSize));
    } else if (selectedJars.length < newSize) {
      const remaining = trialItems.filter(item => !selectedJars.some(s => s.id === item.id));
      setSelectedJars([...selectedJars, ...remaining.slice(0, newSize - selectedJars.length)]);
    }
  };

  // Click to toggle jar with Parabolic Flying Arc Animation into the bucket/box
  const handleToggleJar = (item, event) => {
    const isAlreadyIn = selectedJars.some(j => j.id === item.id);

    if (isAlreadyIn) {
      // Remove from bucket
      setSelectedJars(prev => prev.filter(j => j.id !== item.id));
      return;
    }

    if (selectedJars.length >= packSize) {
      // Bucket full alert bounce
      setBucketBounce(true);
      setTimeout(() => setBucketBounce(false), 400);
      return;
    }

    // Launch high-arc parabolic flying animation towards the Bucket
    if (event && bucketRef.current) {
      const btnRect = event.currentTarget.getBoundingClientRect();
      const bucketRect = bucketRef.current.getBoundingClientRect();

      const startX = btnRect.left + btnRect.width / 2;
      const startY = btnRect.top + btnRect.height / 2;
      const targetX = bucketRect.left + bucketRect.width / 2;
      const targetY = bucketRect.top + bucketRect.height / 2;

      setFlyingJar({
        image: item.image,
        name: item.name,
        startX,
        startY,
        dx: targetX - startX,
        dy: targetY - startY
      });

      // After jar finishes flight arc:
      setTimeout(() => {
        setFlyingJar(null);
        setBucketBounce(true);
        setShowSparkles(true);
        setTimeout(() => {
          setBucketBounce(false);
          setShowSparkles(false);
        }, 500);
      }, 500);
    }

    setSelectedJars(prev => [...prev, item]);
  };

  // Add customized trial pack to cart
  const handleAddToCart = () => {
    const trialProduct = {
      _id: `trial-pack-${packSize}`,
      name: `Singodia Foods Special Trial Pack (Pack of ${packSize})`,
      hindiName: `सिंगोदिया स्पेशल ट्रायल पैक (${packSize} का पैक)`,
      slug: `singodia-special-trial-pack-${packSize}`,
      images: [
        trialItems[0]?.image || 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=400&q=80'
      ],
      variants: [
        {
          weight: `${packSize} Jars x 75g (${selectedJars.map(j => j.name).join(', ')})`,
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
    <section className="py-8 sm:py-12 bg-gradient-to-b from-[#FAF6EF] via-white to-[#FAF6EF] border-b border-cream-200 font-sans relative overflow-hidden">
      
      {/* Dynamic Parabolic Flying Jar Portal */}
      {flyingJar && (
        <div 
          className="fixed z-50 pointer-events-none"
          style={{
            left: `${flyingJar.startX}px`,
            top: `${flyingJar.startY}px`,
            '--dx': `${flyingJar.dx}px`,
            '--dy': `${flyingJar.dy}px`,
            animation: 'parabolicFlight 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards'
          }}
        >
          <div className="w-14 h-14 rounded-2xl p-1 bg-white shadow-2xl border-2 border-brand-green ring-4 ring-amber-400 flex items-center justify-center">
            <img src={flyingJar.image} alt="flying jar" className="w-full h-full object-cover rounded-xl" />
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ========================================================== */}
        {/* PREMIUM ROYAL TRIAL CARD CONTAINER */}
        {/* ========================================================== */}
        <div className="bg-gradient-to-br from-[#FFFDF9] via-[#FFF9EE] to-[#FFF4DF] rounded-3xl sm:rounded-[36px] border-2 border-amber-300/90 shadow-[0_20px_50px_rgba(217,119,6,0.12)] p-4 sm:p-7 lg:p-9 relative overflow-hidden">
          
          {/* Subtle Background Glow Orbs */}
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl pointer-events-none" />

          {/* -------------------------------------------------------- */}
          {/* TOP BAR: Official Logo on Left, Pack Tabs, & Red Tag on Right */}
          {/* -------------------------------------------------------- */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 sm:mb-8 pb-5 border-b border-amber-200/70">
            
            {/* LEFT: Large Official Brand Logo */}
            <div className="flex items-center gap-3">
              <img 
                src={siteLogo} 
                alt="Singodia Foods" 
                className="h-16 sm:h-20 md:h-24 w-auto max-w-[260px] sm:max-w-[320px] object-contain drop-shadow-md transition-transform hover:scale-105" 
                onError={(e) => { e.target.src = '/logo.png'; }} 
              />
              <div className="hidden sm:block pl-3 border-l-2 border-amber-300/80">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#B45309] block">
                  100% Traditional Handcrafted
                </span>
                <span className="text-sm font-black text-gray-900 font-serif">
                  Custom Tasting Hamper
                </span>
              </div>
            </div>

            {/* CENTER: Interactive Pack Switcher Tabs (4, 6, 8) */}
            <div className="flex items-center gap-1.5 p-1 bg-white/90 rounded-2xl border-2 border-amber-300/80 shadow-xs self-start md:self-auto">
              {[4, 6, 8].map((size) => {
                const isActive = packSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handlePackChange(size)}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive 
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md scale-102' 
                        : 'text-gray-700 hover:text-gray-950 hover:bg-amber-50'
                    }`}
                  >
                    <span>{size} Jars</span>
                    {size === 8 && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-tighter ${
                        isActive ? 'bg-white text-amber-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        Best Value
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* RIGHT: Red Discount Badge */}
            <div className="inline-flex items-center gap-2 bg-[#D32F2F] text-white px-4 py-2 rounded-2xl shadow-sm text-xs font-black tracking-wide uppercase self-start md:self-auto">
              <span className="bg-white text-[#D32F2F] text-[11px] font-black px-2 py-0.5 rounded-full shadow-2xs">
                {currentPricing.discountPercent}% OFF
              </span>
              <span>
                {packSize}x75g At <s className="opacity-75 font-normal">₹{currentPricing.originalPrice}</s> <strong className="text-amber-300 font-black text-sm sm:text-base">₹{currentPricing.price}</strong>
              </span>
            </div>

          </div>

          {/* -------------------------------------------------------- */}
          {/* MAIN 2-COLUMN EXPERIENCE: Hamper Bucket (Left) + Jar Selector (Right) */}
          {/* -------------------------------------------------------- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

            {/* ====================================================== */}
            {/* LEFT (5 cols): 3D Gift Hamper Bucket / Tasting Box */}
            {/* ====================================================== */}
            <div className="lg:col-span-5">
              
              <div 
                ref={bucketRef}
                className={`relative bg-gradient-to-b from-[#FFF2D6] via-[#FCE4B3] to-[#F5CE7C] rounded-3xl border-2 border-[#D99A26] p-4 sm:p-6 shadow-xl transition-transform duration-300 ${
                  bucketBounce ? 'scale-106 ring-4 ring-emerald-500 shadow-2xl animate-bucket-thump' : ''
                }`}
              >
                
                {/* Floating Sparkle Particles on Jar Drop */}
                {showSparkles && (
                  <div className="absolute -top-4 -right-4 z-20 pointer-events-none animate-sparkle-burst">
                    <span className="text-2xl">✨</span>
                    <span className="text-xl">💥</span>
                    <span className="text-2xl">🌟</span>
                  </div>
                )}

                {/* Bucket Decorative Crest / Handle */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-amber-300/80">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white p-1 border border-amber-400 shadow-xs flex items-center justify-center">
                      <Gift className="w-4 h-4 text-brand-green" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-black text-gray-950 font-serif leading-tight">
                        Your Tasting Hamper
                      </h3>
                      <p className="text-[10px] text-amber-900 font-bold">
                        Pack of {packSize} Glass Mini Jars
                      </p>
                    </div>
                  </div>

                  {/* Status Pill */}
                  <span className={`text-xs font-black px-2.5 py-1 rounded-full border shadow-2xs ${
                    isBucketFull 
                      ? 'bg-emerald-600 text-white border-emerald-500 animate-pulse' 
                      : 'bg-white text-gray-900 border-amber-300'
                  }`}>
                    {selectedJars.length} / {packSize} Filled
                  </span>
                </div>

                {/* Visual Progress Bar */}
                <div className="w-full bg-white/70 h-2 rounded-full overflow-hidden border border-amber-300 mb-4">
                  <div 
                    className="h-full bg-gradient-to-r from-brand-green to-emerald-500 transition-all duration-500 rounded-full"
                    style={{ width: `${(selectedJars.length / packSize) * 100}%` }}
                  />
                </div>

                {/* THE BUCKET TRAY (Interactive Jars inside the Box) */}
                <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-3 border border-amber-300 shadow-inner">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 mb-2 flex items-center justify-between">
                    <span>Jars in your bucket:</span>
                    <span className="text-[10px] text-amber-800 font-bold">Click × to remove</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {[...Array(packSize)].map((_, i) => {
                      const jar = selectedJars[i];
                      return (
                        <div 
                          key={i}
                          className={`aspect-square rounded-xl border flex flex-col items-center justify-center relative group transition-all duration-200 overflow-hidden ${
                            jar 
                              ? 'bg-gradient-to-b from-amber-50 to-white border-amber-300 shadow-sm hover:border-red-400' 
                              : 'bg-amber-100/40 border-2 border-dashed border-amber-300/80'
                          }`}
                        >
                          {jar ? (
                            <>
                              <img 
                                src={jar.image} 
                                alt={jar.name} 
                                className="w-full h-full object-cover rounded-xl"
                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=300&q=80'; }}
                              />
                              
                              {/* Label pill on hover */}
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-1 text-center">
                                <span className="text-[8px] font-black text-white leading-tight line-clamp-2">
                                  {jar.name}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setSelectedJars(prev => prev.filter(j => j.id !== jar.id))}
                                  className="mt-1 w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center cursor-pointer shadow-xs hover:scale-110 transition-transform"
                                  title="Remove from hamper"
                                >
                                  <X className="w-2.5 h-2.5 stroke-[3]" />
                                </button>
                              </div>

                              {/* Index badge */}
                              <span className="absolute top-1 left-1 bg-black/60 text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                                {i + 1}
                              </span>
                            </>
                          ) : (
                            <div className="text-center p-1">
                              <span className="text-[10px] text-amber-700/60 font-black block">+{i + 1}</span>
                              <span className="text-[8px] text-amber-700/50 font-medium block">Empty</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bucket Subtext / Celebration Notice */}
                <div className="mt-3 text-center">
                  {isBucketFull ? (
                    <div className="p-2 rounded-xl bg-emerald-100/90 border border-emerald-300 text-emerald-900 text-xs font-black flex items-center justify-center gap-1.5 shadow-2xs animate-pulse">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>🎉 Perfect! Your {packSize}-Pack Hamper is Complete!</span>
                    </div>
                  ) : (
                    <p className="text-[11px] font-bold text-amber-950">
                      Tap any flavour on the right to add to your hamper ({packSize - selectedJars.length} more needed)
                    </p>
                  )}
                </div>

                {/* ADD TO CART ACTION IN BUCKET */}
                <div className="mt-4 pt-3 border-t border-amber-300/80">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="w-full bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-black text-sm sm:text-base py-3.5 px-4 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wider active:scale-98 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>ADD THIS TRIAL BOX • ₹{currentPricing.price}</span>
                  </button>
                  
                  <div className="flex items-center justify-center gap-3 text-[10.5px] font-bold text-gray-700 mt-2">
                    <span className="flex items-center gap-1 text-emerald-800">
                      <Truck className="w-3.5 h-3.5 text-emerald-600" /> Free Shipping
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-amber-900">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-700" /> 100% Secure Checkout
                    </span>
                  </div>
                </div>

              </div>

            </div>

            {/* ====================================================== */}
            {/* RIGHT (7 cols): The 8 Pickles Tasting Shelf Cards */}
            {/* ====================================================== */}
            <div className="lg:col-span-7">
              
              <div className="mb-3">
                <div className="inline-block bg-white border border-brand-green/30 text-brand-green text-[10px] font-black tracking-widest px-3 py-0.5 rounded-full uppercase shadow-xs mb-1">
                  CHOOSE YOUR FAVORITE TASTES
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#832B0A] leading-tight font-serif">
                  Not sure which <span className="text-brand-green underline decoration-wavy decoration-mustard">pickle</span> to try first?
                </h2>
                <p className="text-xs text-gray-600 font-medium mt-0.5">
                  Handpick your favorite jars below — watch them drop into your gift hamper!
                </p>
              </div>

              {/* 8 Jars Grid (4 cols x 2 rows on desktop, 2 cols on mobile) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                {trialItems.map((item) => {
                  const isSelected = selectedJars.some(j => j.id === item.id);
                  const isFull = isBucketFull && !isSelected;

                  return (
                    <div 
                      key={item.id}
                      className={`relative rounded-2xl p-2 sm:p-2.5 border transition-all duration-300 flex flex-col justify-between group ${
                        isSelected 
                          ? 'bg-emerald-50/90 border-brand-green ring-2 ring-brand-green/30 shadow-md' 
                          : isFull 
                            ? 'bg-white/80 border-gray-200 opacity-60' 
                            : 'bg-white border-amber-200 hover:border-amber-400 hover:shadow-md hover:-translate-y-1'
                      }`}
                    >
                      {/* Flavour Badge */}
                      <span className="absolute top-1.5 left-1.5 z-10 text-[9px] font-black bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded-md shadow-2xs">
                        {item.icon} {item.badge}
                      </span>

                      {/* Image Thumbnail with zoom on hover */}
                      <div className="w-full aspect-square rounded-xl overflow-hidden bg-amber-50/50 border border-gray-100 mb-2 mt-4 relative">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=300&q=80'; }}
                        />
                      </div>

                      {/* Title & Descriptors */}
                      <div className="mb-2">
                        <span className="text-[10px] font-bold text-amber-900 block leading-none mb-0.5">
                          {item.hindiName}
                        </span>
                        <h4 className="text-xs font-black text-gray-900 truncate leading-tight">
                          {item.name}
                        </h4>
                        <span className="text-[9px] text-gray-500 font-medium block truncate mt-0.5">
                          {item.taste}
                        </span>
                      </div>

                      {/* Interactive Add / In Bucket Button */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleJar(item, e)}
                        disabled={isFull}
                        className={`w-full py-1.5 px-2 rounded-xl text-[11px] font-black flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer shadow-xs ${
                          isSelected
                            ? 'bg-brand-green hover:bg-red-600 text-white'
                            : isFull
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-brand-green hover:to-emerald-600 text-gray-950 hover:text-white'
                        }`}
                        title={isSelected ? 'Click to remove from hamper' : 'Add to your hamper'}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>In Bucket</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5 stroke-[3]" />
                            <span>+ Add</span>
                          </>
                        )}
                      </button>

                    </div>
                  );
                })}
              </div>

              {/* Extra Perks Banner */}
              <div className="mt-4 p-3 bg-white/80 rounded-2xl border border-amber-200/80 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-700">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
                  <span className="font-bold text-gray-900">4.8 / 5.0 Rating</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-[11px] text-gray-500 font-medium">1,774 Customer Reviews</span>
                </div>
                <div className="flex items-center gap-1.5 text-brand-green font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-mustard" />
                  <span>Complimentary Wooden Spoon Included 🥄</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Modern Keyframe Animations for Arcing Jar & Bucket Impact */}
      <style>{`
        @keyframes parabolicFlight {
          0% {
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 1;
          }
          35% {
            transform: translate(calc(var(--dx) * 0.35), calc(var(--dy) * 0.25 - 90px)) scale(1.15) rotate(-15deg);
            opacity: 1;
          }
          70% {
            transform: translate(calc(var(--dx) * 0.75), calc(var(--dy) * 0.7 - 40px)) scale(0.85) rotate(10deg);
            opacity: 0.95;
          }
          100% {
            transform: translate(var(--dx), var(--dy)) scale(0.35) rotate(0deg);
            opacity: 0;
          }
        }

        @keyframes bucketSquash {
          0% { transform: scale(1, 1); }
          25% { transform: scale(1.07, 0.93); }
          50% { transform: scale(0.95, 1.05); }
          75% { transform: scale(1.02, 0.98); }
          100% { transform: scale(1, 1); }
        }

        .animate-bucket-thump {
          animation: bucketSquash 0.45s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        @keyframes sparkleBurstAnim {
          0% { transform: scale(0.4) rotate(0deg); opacity: 1; }
          100% { transform: scale(1.6) rotate(35deg); opacity: 0; }
        }

        .animate-sparkle-burst {
          animation: sparkleBurstAnim 0.5s ease-out forwards;
        }
      `}</style>

    </section>
  );
};

export default FeaturedTrialPackBanner;

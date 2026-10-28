import React, { useState, useRef } from 'react';
import { 
  Sparkles, Star, Plus, Check, Trash2, ShoppingBag, 
  Truck, ShieldCheck, ChevronDown, Gift, RefreshCw, Zap, Heart
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

// 8 Signature Pickles for the Trial Box
const SIGNATURE_PICKLES = [
  {
    id: 'aam-achar',
    name: 'Kachi Keri Aam Achar',
    hindiName: 'कच्ची केरी आम का अचार',
    taste: 'Khatta & Masaledar',
    tagColor: 'bg-amber-100 text-amber-800 border-amber-200',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'lal-mirch',
    name: 'Banarasi Bharwa Lal Mirch',
    hindiName: 'बनारसी भरवां लाल मिर्च',
    taste: 'Royal & Medium Spicy',
    tagColor: 'bg-red-100 text-red-800 border-red-200',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'hari-mirch',
    name: 'Teekhi Hari Mirch Achar',
    hindiName: 'तीखी हरी मिर्च अचार',
    taste: 'Crisp & Tangy Zest',
    tagColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'nimbu-achar',
    name: 'Khatta Meetha Nimbu Achar',
    hindiName: 'खट्टा-मीठा नीम्बू अचार',
    taste: 'Sun-Cured Sweet & Sour',
    tagColor: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'kair-sangri',
    name: 'Rajasthani Kair Sangri Shahi',
    hindiName: 'शाही कैर सांगरी अचार',
    taste: 'Authentic Marwadi Heritage',
    tagColor: 'bg-orange-100 text-orange-800 border-orange-200',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'lasun-achar',
    name: 'Desi Lasun Methi Achar',
    hindiName: 'देसी लहसुन मेथी अचार',
    taste: 'Rich Garlic in Mustard Oil',
    tagColor: 'bg-stone-100 text-stone-800 border-stone-200',
    image: 'https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'hing-aam',
    name: 'Hathras Hing Aam Achar',
    hindiName: 'शाही हींग आम अचार',
    taste: 'Piquant Pure Hing Aroma',
    tagColor: 'bg-lime-100 text-lime-800 border-lime-200',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'winter-mix',
    name: 'Gajar Gobhi Winter Mix',
    hindiName: 'गाजर गोभी शलजम मिक्स',
    taste: 'Festive Crunchy Bites',
    tagColor: 'bg-purple-100 text-purple-800 border-purple-200',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80'
  }
];

// Pack Configurations requested by user:
// 4 pack: 599 -> -100 = 499 (17% off)
// 6 pack: 699 -> -100 = 599 (14% off)
// 8 pack: 799 -> -100 = 699 (13% off / 10% off badge)
const PACK_OPTIONS = {
  4: {
    packSize: 4,
    originalPrice: 599,
    price: 499,
    discountPercent: 17,
    label: '4 Pack Trial Box',
    subtitle: '4 Different flavours in one box',
    bannerText: '17% Off | 4x75g of Pickle Jars At ₹599 ₹499'
  },
  6: {
    packSize: 6,
    originalPrice: 699,
    price: 599,
    discountPercent: 14,
    label: '6 Pack Trial Box',
    subtitle: '6 Different flavours in one box',
    bannerText: '14% Off | 6x75g of Pickle Jars At ₹699 ₹599'
  },
  8: {
    packSize: 8,
    originalPrice: 799,
    price: 699,
    discountPercent: 13,
    label: '8 Pack Trial Box',
    subtitle: '8 Different flavours in one box',
    bannerText: '13% Off | 8x75g of Pickle Jars At ₹799 ₹699'
  }
};

export const FeaturedTrialPackBanner = () => {
  const { addToCart } = useCart();
  const [packSize, setPackSize] = useState(8);
  
  // Default selected jars pre-filled up to packSize so the customer can order instantly or customize
  const [selectedJars, setSelectedJars] = useState(() => SIGNATURE_PICKLES.slice(0, 8));

  // Animation State: Floating flying jar micro-interaction
  const [flyingJar, setFlyingJar] = useState(null);
  const boxTargetRef = useRef(null);
  const [boxShake, setBoxShake] = useState(false);
  const [addedToast, setAddedToast] = useState(null);

  const currentConfig = PACK_OPTIONS[packSize] || PACK_OPTIONS[8];

  // Handle pack size change (4, 6, 8)
  const handlePackChange = (newSize) => {
    setPackSize(newSize);
    if (selectedJars.length > newSize) {
      setSelectedJars(selectedJars.slice(0, newSize));
    } else if (selectedJars.length < newSize) {
      // Add missing ones from signature list
      const available = SIGNATURE_PICKLES.filter(p => !selectedJars.some(s => s.id === p.id));
      const needed = newSize - selectedJars.length;
      setSelectedJars([...selectedJars, ...available.slice(0, needed)]);
    }
  };

  // Add jar to box with flying animation
  const handleAddJar = (pickle, event) => {
    if (selectedJars.length >= packSize) {
      // Trigger box shake to indicate full
      setBoxShake(true);
      setTimeout(() => setBoxShake(false), 500);
      return;
    }

    // Capture starting position from clicked button
    if (event && boxTargetRef.current) {
      const btnRect = event.currentTarget.getBoundingClientRect();
      const boxRect = boxTargetRef.current.getBoundingClientRect();

      setFlyingJar({
        image: pickle.image,
        startX: btnRect.left + btnRect.width / 2,
        startY: btnRect.top + btnRect.height / 2,
        targetX: boxRect.left + boxRect.width / 2,
        targetY: boxRect.top + boxRect.height / 3
      });

      setTimeout(() => {
        setFlyingJar(null);
        setBoxShake(true);
        setTimeout(() => setBoxShake(false), 300);
      }, 550);
    }

    setSelectedJars(prev => [...prev, pickle]);
    
    // Quick mini toast
    setAddedToast(`+ Added ${pickle.name} to box!`);
    setTimeout(() => setAddedToast(null), 2000);
  };

  // Remove jar from box
  const handleRemoveJar = (indexToRemove) => {
    setSelectedJars(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Auto-fill all slots with recommendations
  const handleAutoFill = () => {
    setSelectedJars(SIGNATURE_PICKLES.slice(0, packSize));
  };

  // Reset box
  const handleClearBox = () => {
    setSelectedJars([]);
  };

  // Add custom bundle to cart
  const handleAddToCart = () => {
    const trialProduct = {
      _id: `trial-pack-${packSize}`,
      name: `Dadi's Special Trial Pack (Pack of ${packSize})`,
      hindiName: `दादी का स्पेशल ट्रायल पैक (${packSize} का पैक)`,
      slug: `dadi-special-trial-pack-${packSize}`,
      images: [
        'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80'
      ],
      variants: [
        {
          weight: `${packSize} Jars x 75g (${selectedJars.map(j => j.name).join(', ')})`,
          price: currentConfig.price,
          originalPrice: currentConfig.originalPrice,
          inStock: true,
          stockCount: 100
        }
      ]
    };

    addToCart(trialProduct, trialProduct.variants[0], 1);
  };

  const isBoxFull = selectedJars.length === packSize;
  const remainingSlots = packSize - selectedJars.length;

  return (
    <section className="relative py-10 sm:py-16 bg-[#FFF9EE] border-y-2 border-amber-200 overflow-hidden font-sans">
      
      {/* Background traditional ambient shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-100/40 rounded-full blur-3xl pointer-events-none" />

      {/* Flying Jar Animation Container */}
      {flyingJar && (
        <div 
          className="fixed z-50 pointer-events-none transition-all duration-500 ease-in-out"
          style={{
            left: `${flyingJar.startX}px`,
            top: `${flyingJar.startY}px`,
            animation: 'flyIntoBox 0.55s cubic-bezier(0.2, 0.8, 0.2, 1) forwards'
          }}
        >
          <div className="w-16 h-16 rounded-full p-1 bg-white shadow-2xl border-2 border-brand-green ring-4 ring-amber-300">
            <img 
              src={flyingJar.image} 
              alt="flying jar" 
              className="w-full h-full object-cover rounded-full" 
            />
          </div>
        </div>
      )}

      {/* Floating Mini Toast */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-amber-400 animate-bounce">
          <Sparkles className="w-4 h-4 text-mustard" />
          <span>{addedToast}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ======================================================== */}
        {/* TOP RED DISCOUNT BADGE (Dynamic based on selected pack) */}
        {/* ======================================================== */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-3 bg-[#D32F2F] text-white px-5 sm:px-8 py-2 rounded-full shadow-md text-xs sm:text-sm font-extrabold tracking-wide uppercase">
            <span className="bg-white text-[#D32F2F] text-[11px] sm:text-xs font-black px-2 py-0.5 rounded-full">
              {currentConfig.discountPercent}% OFF
            </span>
            <span>
              {packSize}x75g of Pickle Jars At <s className="opacity-75 font-normal">₹{currentConfig.originalPrice}</s> <span className="text-amber-300 font-black text-sm sm:text-base">₹{currentConfig.price}</span>
            </span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* MAIN 3-COLUMN FEATURED BANNER GRID */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

          {/* ------------------------------------------------------ */}
          {/* COLUMN 1 (Left 4 cols): Branding Card & Trial Box Preview */}
          {/* ------------------------------------------------------ */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            
            {/* DADI'S SPECIAL PACK BRANDING CARD with Website Logo */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-amber-300 shadow-sm flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-brand-green p-1 bg-amber-50 shadow-inner shrink-0 flex items-center justify-center overflow-hidden">
                <img 
                  src="/logo.png" 
                  alt="Singodhia Foods Logo" 
                  className="w-full h-full object-contain"
                  onError={(e) => { e.target.src = '/hero-banner.png'; }}
                />
              </div>
              <div className="flex-1">
                <span className="inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 mb-1">
                  Heritage Masterpiece
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight uppercase font-serif tracking-tight">
                  DADI'S <br /><span className="text-brand-green">SPECIAL PACK</span>
                </h3>
                <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                  Freshly sun-cured in ceramic martabans
                </p>
              </div>
            </div>

            {/* Trial Box Hero Showcase */}
            <div className="bg-gradient-to-br from-amber-400 via-amber-300 to-yellow-200 rounded-3xl p-5 border-3 border-amber-400 shadow-lg relative overflow-hidden text-center">
              <div className="absolute top-2 left-2 bg-black text-white text-[9px] font-black px-2 py-0.5 rounded-md tracking-wider uppercase">
                Shark Tank Style
              </div>
              <div className="absolute top-2 right-2 bg-green-700 text-white text-[9px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> 100% Pure
              </div>

              {/* Box Image / Presentation */}
              <div className="my-3 flex justify-center">
                <div className="relative w-44 h-44 sm:w-52 sm:h-52 bg-white/90 backdrop-blur-xs rounded-2xl p-3 border-2 border-amber-400 shadow-inner flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-amber-50 p-2 border border-amber-300 mb-1 flex items-center justify-center">
                    <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-gray-950 uppercase leading-none font-serif">
                    Pickle Trial Box
                  </h4>
                  <span className="text-xs font-bold text-brand-green mt-1 bg-brand-green/10 px-2.5 py-0.5 rounded-full border border-brand-green/20">
                    (Pack of {packSize})
                  </span>
                  
                  {/* Miniature Jar Stacks in Showcase */}
                  <div className="flex items-center justify-center gap-1 mt-2.5">
                    {selectedJars.slice(0, 5).map((jar, i) => (
                      <div key={i} className="w-6 h-6 rounded-full border border-amber-400 overflow-hidden shadow-xs">
                        <img src={jar.image} alt="jar" className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {selectedJars.length > 5 && (
                      <span className="w-6 h-6 rounded-full bg-brand-green text-white text-[9px] font-extrabold flex items-center justify-center">
                        +{selectedJars.length - 5}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-xs font-bold text-gray-900 mt-1">
                8 Handmade Flavours • Pure Kachi Ghani Mustard Oil
              </p>
            </div>

            {/* Quick Pickles Selection Grid on Mobile / Left Column */}
            <div className="bg-white rounded-2xl p-4 border border-amber-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-brand-green" />
                  <h4 className="text-xs sm:text-sm font-black text-gray-900 uppercase">
                    Select Your {packSize} Flavours:
                  </h4>
                </div>
                <button
                  onClick={handleAutoFill}
                  className="text-[11px] font-bold text-brand-green hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Auto-Fill
                </button>
              </div>

              {/* 8 Pickles Grid with '+ Add' Buttons */}
              <div className="grid grid-cols-2 gap-2 sm:gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                {SIGNATURE_PICKLES.map((pickle) => {
                  const isInBox = selectedJars.some(j => j.id === pickle.id);
                  const isFull = selectedJars.length >= packSize;

                  return (
                    <div 
                      key={pickle.id}
                      className={`relative p-2 rounded-xl border transition-all ${
                        isInBox 
                          ? 'border-brand-green bg-emerald-50/50 shadow-xs' 
                          : 'border-gray-200 bg-gray-50/50 hover:border-amber-400 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <img 
                          src={pickle.image} 
                          alt={pickle.name} 
                          className="w-10 h-10 rounded-lg object-cover border border-gray-200 shrink-0" 
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-bold text-gray-900 truncate leading-snug">
                            {pickle.name}
                          </p>
                          <span className={`inline-block text-[8px] font-semibold px-1 py-0.2 rounded border truncate max-w-full ${pickle.tagColor}`}>
                            {pickle.taste}
                          </span>
                        </div>
                      </div>

                      {/* Add Button with Animation Trigger */}
                      <button
                        type="button"
                        onClick={(e) => {
                          if (isInBox) {
                            const idx = selectedJars.findIndex(j => j.id === pickle.id);
                            if (idx >= 0) handleRemoveJar(idx);
                          } else {
                            handleAddJar(pickle, e);
                          }
                        }}
                        disabled={!isInBox && isFull}
                        className={`w-full mt-1.5 py-1 px-2 rounded-lg text-[10px] font-extrabold flex items-center justify-center gap-1 transition-all ${
                          isInBox
                            ? 'bg-brand-green text-white hover:bg-red-600'
                            : isFull
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-amber-400 hover:bg-brand-green text-gray-950 hover:text-white shadow-xs active:scale-95'
                        }`}
                      >
                        {isInBox ? (
                          <>
                            <Check className="w-3 h-3" /> In Box (Tap to remove)
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3" /> + Add to Box
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* ------------------------------------------------------ */}
          {/* COLUMN 2 (Middle 4 cols): Offer Info, Dropdown & Add to Cart */}
          {/* ------------------------------------------------------ */}
          <div className="lg:col-span-4 flex flex-col justify-between h-full bg-white/70 backdrop-blur-xs p-5 sm:p-6 rounded-3xl border-2 border-amber-200 shadow-sm">
            <div>
              {/* Badge: NEW TO SINGODHIA FOODS? */}
              <div className="inline-block bg-white border border-brand-green/30 text-brand-green text-[11px] font-black tracking-widest px-3 py-1 rounded-full uppercase shadow-xs mb-3">
                NEW TO SINGODHIA FOODS?
              </div>

              {/* Main Headline */}
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#9A3412] leading-tight font-serif">
                Not sure which <span className="text-brand-green underline decoration-wavy decoration-mustard">pickle</span> to try first?
              </h2>

              <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1.5">
                Start with <strong className="text-gray-900 font-bold">Dadi's Special Trial Pack</strong>
              </p>

              {/* ======================================================== */}
              {/* YELLOW RIBBON with PACK SIZE DROPDOWN (4, 6, 8) */}
              {/* ======================================================== */}
              <div className="my-5 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-300 p-3.5 rounded-2xl border-2 border-amber-400 shadow-md relative">
                
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <Gift className="w-4 h-4 text-brand-green shrink-0" />
                    <span className="text-xs sm:text-sm font-black text-gray-950 uppercase tracking-tight">
                      {packSize} Different flavours in one box
                    </span>
                  </div>

                  {/* Dropdown Selector */}
                  <div className="relative">
                    <select
                      value={packSize}
                      onChange={(e) => handlePackChange(Number(e.target.value))}
                      className="bg-white border-2 border-gray-950 text-gray-950 font-black text-xs px-2.5 py-1 rounded-xl shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-green pr-6 appearance-none"
                    >
                      <option value={4}>4 Pack (₹499)</option>
                      <option value={6}>6 Pack (₹599)</option>
                      <option value={8}>8 Pack (₹699)</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-950 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Quick Pack Size Pills for 1-Tap Switching */}
                <div className="grid grid-cols-3 gap-1.5 mt-2">
                  {[4, 6, 8].map((size) => {
                    const cfg = PACK_OPTIONS[size];
                    const active = packSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handlePackChange(size)}
                        className={`py-1.5 px-2 rounded-xl text-center text-xs font-black transition-all ${
                          active
                            ? 'bg-gray-950 text-amber-300 shadow-md scale-102 border border-gray-950'
                            : 'bg-white/80 text-gray-800 hover:bg-white border border-amber-300'
                        }`}
                      >
                        <div>{size} Jars</div>
                        <div className="text-[10px] font-bold opacity-90">₹{cfg.price}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ratings and Reviews Line */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-gray-900">4.8</span>
                <span className="text-xs text-gray-400">|</span>
                <span className="text-xs font-semibold text-gray-600">1,774 Verified Reviews</span>
              </div>

              {/* Price Row with Strikethrough & Percentage OFF */}
              <div className="flex items-baseline gap-3 mb-5">
                <span className="text-2xl sm:text-3xl font-black text-[#D32F2F]">
                  ₹{currentConfig.price}
                </span>
                <span className="text-base sm:text-lg text-gray-400 line-through font-semibold">
                  ₹{currentConfig.originalPrice}
                </span>
                <span className="bg-[#D32F2F] text-white text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs">
                  {currentConfig.discountPercent}% OFF
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200">
                  SAVE ₹100
                </span>
              </div>

              {/* Big Red ADD TO CART Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-black text-sm sm:text-base py-3.5 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wider active:scale-98 cursor-pointer group"
              >
                <ShoppingBag className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>ADD TO CART • ₹{currentConfig.price}</span>
              </button>

              {/* Free shipping & Flat discount badges below button */}
              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-amber-200/80 text-[11px]">
                <div className="flex items-center gap-2 text-emerald-800 font-bold">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0 border border-emerald-200">
                    <Truck className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div>
                    <p className="leading-tight">Free shipping</p>
                    <span className="text-[10px] text-gray-500 font-normal">On this product</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-amber-900 font-bold">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 border border-amber-300">
                    <Zap className="w-4 h-4 text-amber-700" />
                  </div>
                  <div>
                    <p className="leading-tight">FLAT 3% OFF</p>
                    <span className="text-[10px] text-gray-500 font-normal">On Prepaid Orders</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Guarantees Footer */}
            <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 font-medium">
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3 text-red-500 fill-red-500" /> 100% Homemade
              </span>
              <span>• Zero Preservatives •</span>
              <span>Mustard Oil Cured</span>
            </div>
          </div>

          {/* ------------------------------------------------------ */}
          {/* COLUMN 3 (Right 4 cols): THE ANIMATED VISUAL TRIAL BOX */}
          {/* ------------------------------------------------------ */}
          <div 
            ref={boxTargetRef}
            className={`lg:col-span-4 bg-gradient-to-b from-[#FFF3D6] to-[#FFE8B8] rounded-3xl p-5 border-3 border-amber-400 shadow-xl relative transition-transform duration-300 ${
              boxShake ? 'scale-103 ring-4 ring-brand-green shadow-2xl' : ''
            }`}
          >
            {/* Box Header */}
            <div className="flex items-center justify-between pb-3 border-b-2 border-amber-300/80">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-400 flex items-center justify-center text-gray-950 font-black shadow-xs">
                  🎁
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-gray-900 uppercase leading-none">
                    Your Custom Box
                  </h3>
                  <span className="text-[10px] font-bold text-gray-600">
                    Pack of {packSize} Jars (75g each)
                  </span>
                </div>
              </div>

              {/* Progress Pill */}
              <div className="text-right">
                <span className={`inline-block text-[11px] font-extrabold px-2.5 py-1 rounded-full border ${
                  isBoxFull 
                    ? 'bg-brand-green text-white border-brand-green' 
                    : 'bg-white text-gray-900 border-amber-300'
                }`}>
                  {selectedJars.length} / {packSize} Jars
                </span>
              </div>
            </div>

            {/* Visual Slots inside the Box */}
            <div className="mt-4">
              <p className="text-[11px] font-bold text-gray-700 mb-2.5 flex items-center justify-between">
                <span>Jar Slots in your Hamper:</span>
                {selectedJars.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearBox}
                    className="text-[10px] text-red-600 hover:underline flex items-center gap-0.5"
                  >
                    <Trash2 className="w-3 h-3" /> Clear Box
                  </button>
                )}
              </p>

              {/* Slots Grid: Dynamic based on packSize */}
              <div className={`grid gap-2 sm:gap-2.5 ${
                packSize === 4 ? 'grid-cols-2' : packSize === 6 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'
              }`}>
                {[...Array(packSize)].map((_, index) => {
                  const jar = selectedJars[index];

                  if (jar) {
                    return (
                      <div 
                        key={index}
                        className="group relative bg-white rounded-xl p-2 border-2 border-brand-green shadow-xs flex flex-col items-center text-center animate-in zoom-in-95 duration-200"
                      >
                        {/* Remove Jar Button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveJar(index)}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] font-black opacity-80 group-hover:opacity-100 hover:scale-110 transition-all shadow-xs z-10"
                          title="Remove flavour"
                        >
                          ✕
                        </button>

                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 mb-1.5 bg-amber-50">
                          <img 
                            src={jar.image} 
                            alt={jar.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                          />
                        </div>
                        <span className="text-[10px] font-extrabold text-gray-900 leading-tight line-clamp-1">
                          {jar.name}
                        </span>
                        <span className="text-[8px] font-bold text-brand-green mt-0.5">
                          Slot #{index + 1} ✓
                        </span>
                      </div>
                    );
                  }

                  // Empty Slot
                  return (
                    <div 
                      key={index}
                      className="border-2 border-dashed border-amber-400 bg-white/40 rounded-xl p-2.5 flex flex-col items-center justify-center min-h-[90px] text-center hover:bg-white/80 transition-all"
                    >
                      <div className="w-7 h-7 rounded-full bg-amber-200/60 flex items-center justify-center text-amber-800 text-xs font-bold mb-1">
                        +
                      </div>
                      <span className="text-[10px] font-bold text-amber-900">
                        Flavour #{index + 1}
                      </span>
                      <span className="text-[8px] text-gray-500">
                        Tap + on left
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Box Status Banner */}
            <div className="mt-4 pt-3 border-t border-amber-300/80">
              {isBoxFull ? (
                <div className="bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl p-2.5 text-center text-xs font-black flex items-center justify-center gap-1.5 shadow-xs">
                  <span>🎉</span>
                  <span>Hamper is Ready! Click "ADD TO CART"</span>
                </div>
              ) : (
                <div className="bg-white/80 text-amber-950 border border-amber-300 rounded-xl p-2.5 text-center text-xs font-bold flex items-center justify-between">
                  <span>Choose {remainingSlots} more flavours</span>
                  <button
                    type="button"
                    onClick={handleAutoFill}
                    className="bg-brand-green text-white text-[10px] font-black px-2.5 py-1 rounded-lg hover:bg-brand-green-light"
                  >
                    Auto-fill
                  </button>
                </div>
              )}
            </div>

            {/* Quick Summary Pill at bottom of box */}
            <div className="mt-3 text-center">
              <span className="text-[11px] font-bold text-gray-700">
                Total Price: <span className="text-brand-green font-black text-sm">₹{currentConfig.price}</span> (was <s className="text-gray-400">₹{currentConfig.originalPrice}</s>)
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* Embedded CSS for smooth Flying Arc Animation */}
      <style>{`
        @keyframes flyIntoBox {
          0% {
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: translate(calc(-50% + 100px), calc(-50% - 80px)) scale(0.8) rotate(15deg);
            opacity: 0.9;
          }
          100% {
            transform: translate(calc(-50% + 250px), calc(-50% + 50px)) scale(0.3) rotate(30deg);
            opacity: 0;
          }
        }
      `}</style>

    </section>
  );
};

export default FeaturedTrialPackBanner;

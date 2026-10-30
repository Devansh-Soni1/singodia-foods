import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, ShoppingBasket, Plus, Check, X, 
  Star, Truck, ShieldCheck, Sparkles, ArrowRight, Zap
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { adminAPI } from '../../services/api';
import siteLogo from '../../assets/logo.png';

// 8 Signature Rajasthani Flavours
export const DEFAULT_TRIAL_ITEMS = [
  { id: 1, name: 'Kachi Keri Aam', hindiName: 'कच्ची केरी आम', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=400&q=80', taste: 'Khatta Meetha', icon: '🥭' },
  { id: 2, name: 'Bharwa Lal Mirch', hindiName: 'भरवां लाल मिर्च', image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=400&q=80', taste: 'Banarasi Spicy', icon: '🌶️' },
  { id: 3, name: 'Teekhi Hari Mirch', hindiName: 'तीखी हरी मिर्च', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80', taste: 'Lemon Cured', icon: '🫑' },
  { id: 4, name: 'Khatta Meetha Nimbu', hindiName: 'नीम्बू अचार', image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80', taste: 'Oil-Free Sun-Aged', icon: '🍋' },
  { id: 5, name: 'Kair Sangri Shahi', hindiName: 'शाही कैर सांगरी', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80', taste: 'Royal Marwadi', icon: '🏺' },
  { id: 6, name: 'Desi Lasun Methi', hindiName: 'लहसुन मेथी', image: 'https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&w=400&q=80', taste: 'Aromatic Garlic', icon: '🧄' },
  { id: 7, name: 'Hathras Hing Aam', hindiName: 'हींग आम अचार', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80', taste: 'Hathrasi Hing', icon: '🌸' },
  { id: 8, name: 'Winter Mix Veg', hindiName: 'मिक्स अचार', image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80', taste: 'Crunchy Veggies', icon: '🥕' }
];

export const FeaturedTrialPackBanner = () => {
  const { addToCart } = useCart();
  const [packSize, setPackSize] = useState(8);
  const [trialItems, setTrialItems] = useState(DEFAULT_TRIAL_ITEMS);
  
  // By default, NO product is pre-selected (empty bucket) as requested!
  const [selectedJars, setSelectedJars] = useState([]);

  // Dynamic pricing
  const [pricing, setPricing] = useState({
    4: { originalPrice: 599, price: 499, discountPercent: 17 },
    6: { originalPrice: 699, price: 599, discountPercent: 14 },
    8: { originalPrice: 799, price: 699, discountPercent: 10 }
  });

  // Animation state
  const [flyingJar, setFlyingJar] = useState(null);
  const bucketRef = useRef(null);
  const [bucketBounce, setBucketBounce] = useState(false);

  // Load custom settings if configured in Admin
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

  // Change pack size (trim if exceeds)
  const handlePackChange = (newSize) => {
    setPackSize(newSize);
    if (selectedJars.length > newSize) {
      setSelectedJars(selectedJars.slice(0, newSize));
    }
  };

  // Toggle Jar on click anywhere on Card OR on button
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
      setTimeout(() => setBucketBounce(false), 350);
      return;
    }

    // Trigger Parabolic Flying Animation into the Cart Bucket on the Left
    if (event && bucketRef.current) {
      const cardRect = event.currentTarget.getBoundingClientRect();
      const bucketRect = bucketRef.current.getBoundingClientRect();

      const startX = cardRect.left + cardRect.width / 2;
      const startY = cardRect.top + cardRect.height / 2;
      const targetX = bucketRect.left + bucketRect.width / 2;
      const targetY = bucketRect.top + bucketRect.height / 2;

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
        setTimeout(() => setBucketBounce(false), 400);
      }, 450);
    }

    setSelectedJars(prev => [...prev, item]);
  };

  // Add customized trial pack to cart
  const handleAddToCart = () => {
    if (selectedJars.length === 0) {
      alert(`कृपया दाहिनी ओर से कम से कम 1 या पूरे ${packSize} स्वाद चुनें!`);
      return;
    }

    const trialProduct = {
      _id: `trial-pack-${packSize}`,
      name: `Singodia Foods Special Trial Pack (Pack of ${packSize})`,
      hindiName: `सिंगोदिया स्पेशल ट्रायल पैक (${packSize} का पैक)`,
      slug: `singodia-special-trial-pack-${packSize}`,
      images: [
        selectedJars[0]?.image || trialItems[0]?.image
      ],
      variants: [
        {
          weight: `${selectedJars.length} Jars x 75g (${selectedJars.map(j => j.name).join(', ')})`,
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
    <section className="py-4 sm:py-6 bg-[#FAF6EF] font-sans">
      
      {/* Curved Parabolic Flying Jar Portal */}
      {flyingJar && (
        <div 
          className="fixed z-50 pointer-events-none"
          style={{
            left: `${flyingJar.startX}px`,
            top: `${flyingJar.startY}px`,
            '--dx': `${flyingJar.dx}px`,
            '--dy': `${flyingJar.dy}px`,
            animation: 'flyIntoBucket 0.45s cubic-bezier(0.2, 0.85, 0.25, 1) forwards'
          }}
        >
          <div className="w-12 h-12 rounded-xl p-1 bg-white shadow-2xl border-2 border-brand-green ring-4 ring-amber-300 flex items-center justify-center">
            <img src={flyingJar.image} alt="flying jar" className="w-full h-full object-cover rounded-lg" />
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        
        {/* ========================================================== */}
        {/* COMPACT MAIN BOX (हाइट छोटी, साफ़ और प्रीमियम) */}
        {/* ========================================================== */}
        <div className="bg-gradient-to-br from-[#FFFDF9] via-[#FFF9EE] to-[#FFF5E4] rounded-3xl border-2 border-amber-300/90 shadow-md p-4 sm:p-6 relative overflow-hidden">
          
          {/* -------------------------------------------------------- */}
          {/* HEADER LINE: Logo on Left & Red Discount Tag on Right */}
          {/* -------------------------------------------------------- */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 mb-4 border-b border-amber-200/80">
            
            {/* Left: Brand Logo */}
            <div className="flex items-center gap-2">
              <img 
                src={siteLogo} 
                alt="Singodia Foods" 
                className="h-12 sm:h-16 md:h-18 w-auto object-contain drop-shadow-sm"
                onError={(e) => { e.target.src = '/logo.png'; }}
              />
            </div>

            {/* Right: Red Discount Header Box */}
            <div className="inline-flex items-center gap-2 bg-[#D32F2F] text-white px-3.5 py-1.5 rounded-full shadow-xs text-xs font-black tracking-wide uppercase self-start sm:self-auto">
              <span className="bg-white text-[#D32F2F] text-[10px] font-black px-1.5 py-0.2 rounded-full">
                {currentPricing.discountPercent}% OFF
              </span>
              <span>
                {packSize}x75g of Pickle Jars At <s className="opacity-75 font-normal">₹{currentPricing.originalPrice}</s> <strong className="text-amber-300 font-black text-sm">₹{currentPricing.price}</strong>
              </span>
            </div>

          </div>

          {/* -------------------------------------------------------- */}
          {/* 2-COLUMN LAYOUT: Left (Info + Cart Bucket) & Right (Products) */}
          {/* -------------------------------------------------------- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
            
            {/* ====================================================== */}
            {/* LEFT COLUMN (5 cols): Title, Price, Cart Bucket & Action */}
            {/* ====================================================== */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-3.5">
              
              {/* Title & Badge */}
              <div>
                <span className="inline-block bg-white border border-brand-green/30 text-brand-green text-[10px] font-black tracking-widest px-2.5 py-0.5 rounded-full uppercase shadow-2xs mb-1.5">
                  CUSTOM TASTING BOX
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#832B0A] leading-tight font-serif">
                  Not sure which <span className="text-brand-green underline decoration-wavy decoration-mustard">pickle</span> to try first?
                </h3>
                <p className="text-xs text-gray-600 font-medium mt-1">
                  Pick your favorite jars from the right — watch them drop into your bucket!
                </p>
              </div>

              {/* Pack Selector Pills (4, 6, 8) */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-gray-700">Choose Size:</span>
                <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-amber-300/80 shadow-2xs">
                  {[4, 6, 8].map((size) => {
                    const isActive = packSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handlePackChange(size)}
                        className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                          isActive 
                            ? 'bg-amber-500 text-white shadow-xs scale-102' 
                            : 'text-gray-700 hover:bg-amber-50'
                        }`}
                      >
                        {size} Pack
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price & Savings Display */}
              <div className="flex items-baseline gap-2.5 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/80">
                <span className="text-2xl sm:text-3xl font-black text-[#D32F2F]">
                  ₹{currentPricing.price}
                </span>
                <span className="text-sm text-gray-400 line-through font-semibold">
                  ₹{currentPricing.originalPrice}
                </span>
                <span className="bg-[#D32F2F] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                  {currentPricing.discountPercent}% OFF
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200">
                  Save ₹100
                </span>
              </div>

              {/* ==================================================== */}
              {/* THE CART TYPE BUCKET (सामान जाने वाली आकर्षक बकेट) */}
              {/* ==================================================== */}
              <div 
                ref={bucketRef}
                className={`bg-white rounded-2xl border-2 border-amber-400 p-3.5 shadow-sm transition-all duration-300 relative ${
                  bucketBounce ? 'scale-105 ring-4 ring-brand-green shadow-lg' : ''
                }`}
              >
                {/* Bucket Header */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 border border-amber-300 shadow-2xs">
                      <ShoppingBasket className="w-4 h-4 text-brand-green" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-gray-900 leading-tight">
                        Your Tasting Bucket
                      </h4>
                      <span className="text-[10px] text-gray-500 font-semibold block">
                        {selectedJars.length === 0 ? 'Empty bucket' : `${selectedJars.length} of ${packSize} items added`}
                      </span>
                    </div>
                  </div>

                  {/* Count Tag */}
                  <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border ${
                    isBucketFull 
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                      : 'bg-amber-100 text-amber-900 border-amber-300'
                  }`}>
                    {selectedJars.length} / {packSize} Jars
                  </span>
                </div>

                {/* Bucket Content Area */}
                {selectedJars.length === 0 ? (
                  <div className="py-3 px-2 text-center bg-amber-50/50 rounded-xl border border-dashed border-amber-300/80">
                    <p className="text-xs font-bold text-amber-900">
                      👈 Click any pickle on the right to add to your bucket!
                    </p>
                    <span className="text-[10px] text-gray-500">
                      (Select {packSize} flavours to complete your pack)
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto scrollbar-thin p-1 bg-amber-50/40 rounded-xl border border-amber-200">
                      {selectedJars.map((jar) => (
                        <div 
                          key={jar.id}
                          className="inline-flex items-center gap-1.5 bg-white pl-1.5 pr-2 py-0.5 rounded-lg border border-amber-300 shadow-2xs text-[11px] font-bold text-gray-800 animate-in fade-in zoom-in-95 duration-200"
                        >
                          <img src={jar.image} alt={jar.name} className="w-4 h-4 rounded-full object-cover" />
                          <span className="truncate max-w-[90px]">{jar.name.split(' ')[0]}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedJars(prev => prev.filter(j => j.id !== jar.id));
                            }}
                            className="w-3.5 h-3.5 rounded-full bg-gray-200 hover:bg-red-500 hover:text-white flex items-center justify-center text-[9px] cursor-pointer transition-colors"
                            title="Remove"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>

                    {isBucketFull && (
                      <div className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Bucket complete! Ready to add to cart.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Add to Cart CTA Button */}
              <div>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-black text-sm py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 uppercase tracking-wider active:scale-98 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>ADD TO CART • ₹{currentPricing.price}</span>
                </button>

                {/* Trust Perks */}
                <div className="flex items-center justify-between text-[10.5px] font-bold text-gray-600 mt-2 px-1">
                  <span className="flex items-center gap-1 text-emerald-800">
                    <Truck className="w-3.5 h-3.5 text-emerald-600" /> Free Shipping
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-amber-900">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-700" /> 100% Secure Online
                  </span>
                  <span>•</span>
                  <span>🥄 Spoon Included</span>
                </div>
              </div>

            </div>

            {/* ====================================================== */}
            {/* RIGHT COLUMN (7 cols): Rectangular Product Cards */}
            {/* ====================================================== */}
            <div className="lg:col-span-7">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-gray-800 uppercase tracking-wide">
                  Select {packSize} Flavours ({selectedJars.length}/{packSize} picked):
                </span>
                <span className="text-[10px] text-gray-500 font-semibold hidden sm:inline">
                  Click on any card to add
                </span>
              </div>

              {/* 8 Curved Rectangle Product Cards (4 cols x 2 rows) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {trialItems.map((item) => {
                  const isSelected = selectedJars.some(j => j.id === item.id);
                  const isFull = isBucketFull && !isSelected;

                  return (
                    <div 
                      key={item.id}
                      onClick={(e) => handleToggleJar(item, e)}
                      className={`relative rounded-2xl border p-2 text-center transition-all duration-200 flex flex-col justify-between cursor-pointer select-none group ${
                        isSelected 
                          ? 'bg-emerald-50 border-brand-green ring-2 ring-brand-green/30 shadow-xs' 
                          : isFull 
                            ? 'bg-white/80 border-gray-200 opacity-60' 
                            : 'bg-white border-gray-200 hover:border-amber-400 hover:shadow-md hover:-translate-y-0.5'
                      }`}
                      title={isSelected ? 'Click to remove' : 'Click card to add to bucket'}
                    >
                      {/* Flavour Tag */}
                      <span className="absolute top-1.5 left-1.5 text-[8.5px] font-bold bg-amber-100 text-amber-900 px-1 rounded-md z-10 leading-tight">
                        {item.icon}
                      </span>

                      {/* Image Thumbnail with rounded rectangle */}
                      <div className="w-full aspect-square rounded-xl overflow-hidden bg-amber-50/50 border border-gray-100 mb-1.5 mt-2">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=300&q=80'; }}
                        />
                      </div>

                      {/* Text */}
                      <div className="mb-1.5 px-0.5">
                        <span className="text-[9px] font-bold text-amber-800 block truncate leading-none">
                          {item.hindiName}
                        </span>
                        <h5 className="text-[11px] font-black text-gray-900 truncate leading-tight mt-0.5">
                          {item.name}
                        </h5>
                        <span className="text-[9px] text-gray-500 font-medium block truncate">
                          {item.taste}
                        </span>
                      </div>

                      {/* Bottom Button (also clickable directly) */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleJar(item, e);
                        }}
                        disabled={isFull}
                        className={`w-full py-1 rounded-xl text-[10.5px] font-black flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs ${
                          isSelected
                            ? 'bg-brand-green text-white hover:bg-red-600'
                            : isFull
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-amber-400 hover:bg-brand-green text-gray-950 hover:text-white'
                        }`}
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

          </div>

        </div>

      </div>

      {/* Parabolic Flying Animation Keyframes into Left Bucket */}
      <style>{`
        @keyframes flyIntoBucket {
          0% {
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 1;
          }
          40% {
            transform: translate(calc(var(--dx) * 0.4), calc(var(--dy) * 0.3 - 80px)) scale(1.15) rotate(-15deg);
            opacity: 1;
          }
          75% {
            transform: translate(calc(var(--dx) * 0.8), calc(var(--dy) * 0.75 - 30px)) scale(0.85) rotate(10deg);
            opacity: 0.95;
          }
          100% {
            transform: translate(var(--dx), var(--dy)) scale(0.25) rotate(0deg);
            opacity: 0;
          }
        }
      `}</style>

    </section>
  );
};

export default FeaturedTrialPackBanner;

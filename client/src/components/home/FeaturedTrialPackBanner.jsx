import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Star, Plus, Check, ShoppingBag, 
  Truck, ShieldCheck, ChevronDown, Gift, Zap
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { adminAPI } from '../../services/api';

// 8 Default Signature Flavours (can be customized from Admin Settings)
export const DEFAULT_TRIAL_ITEMS = [
  { id: 1, name: 'Kachi Keri Aam', hindiName: 'कच्ची केरी आम', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=300&q=80', taste: 'Khatta' },
  { id: 2, name: 'Bharwa Lal Mirch', hindiName: 'भरवां लाल मिर्च', image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=300&q=80', taste: 'Spicy' },
  { id: 3, name: 'Teekhi Hari Mirch', hindiName: 'तीखी हरी मिर्च', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80', taste: 'Tangy' },
  { id: 4, name: 'Khatta Meetha Nimbu', hindiName: 'नीम्बू अचार', image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=300&q=80', taste: 'Sun-cured' },
  { id: 5, name: 'Kair Sangri Shahi', hindiName: 'कैर सांगरी', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=300&q=80', taste: 'Royal' },
  { id: 6, name: 'Desi Lasun Methi', hindiName: 'लहसुन अचार', image: 'https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&w=300&q=80', taste: 'Garlic' },
  { id: 7, name: 'Hathras Hing Aam', hindiName: 'हींग आम अचार', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=300&q=80', taste: 'Aromatic' },
  { id: 8, name: 'Winter Mix Veg', hindiName: 'मिक्स अचार', image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=300&q=80', taste: 'Crunchy' }
];

export const FeaturedTrialPackBanner = () => {
  const { addToCart } = useCart();
  const [packSize, setPackSize] = useState(8);
  const [trialItems, setTrialItems] = useState(DEFAULT_TRIAL_ITEMS);
  const [selectedJars, setSelectedJars] = useState(() => DEFAULT_TRIAL_ITEMS.slice(0, 8));

  // Dynamic pricing from state or admin settings:
  // 4 pack: 599 -> 499 (17% off)
  // 6 pack: 699 -> 599 (14% off)
  // 8 pack: 799 -> 699 (10% off as requested)
  const [pricing, setPricing] = useState({
    4: { originalPrice: 599, price: 499, discountPercent: 17 },
    6: { originalPrice: 699, price: 599, discountPercent: 14 },
    8: { originalPrice: 799, price: 699, discountPercent: 10 }
  });

  // Micro-interaction animation state
  const [flyingJar, setFlyingJar] = useState(null);
  const trialBoxRef = useRef(null);
  const [boxBounce, setBoxBounce] = useState(false);

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

  // Handle pack dropdown / selection
  const handlePackChange = (newSize) => {
    setPackSize(newSize);
    if (selectedJars.length > newSize) {
      setSelectedJars(selectedJars.slice(0, newSize));
    } else if (selectedJars.length < newSize) {
      const remaining = trialItems.filter(item => !selectedJars.some(s => s.id === item.id));
      setSelectedJars([...selectedJars, ...remaining.slice(0, newSize - selectedJars.length)]);
    }
  };

  // Click on '+' under any of the 8 jars with flying animation into the Trial Box
  const handleToggleJar = (item, event) => {
    const isAlreadyIn = selectedJars.some(j => j.id === item.id);

    if (isAlreadyIn) {
      // Remove from box
      setSelectedJars(prev => prev.filter(j => j.id !== item.id));
      return;
    }

    if (selectedJars.length >= packSize) {
      // Box is full, bounce to alert
      setBoxBounce(true);
      setTimeout(() => setBoxBounce(false), 400);
      return;
    }

    // Trigger Flying Animation towards the Trial Box on the left
    if (event && trialBoxRef.current) {
      const btnRect = event.currentTarget.getBoundingClientRect();
      const boxRect = trialBoxRef.current.getBoundingClientRect();

      const startX = btnRect.left + btnRect.width / 2;
      const startY = btnRect.top + btnRect.height / 2;
      const targetX = boxRect.left + boxRect.width / 2;
      const targetY = boxRect.top + boxRect.height / 2;

      setFlyingJar({
        image: item.image,
        startX,
        startY,
        dx: targetX - startX,
        dy: targetY - startY
      });

      setTimeout(() => {
        setFlyingJar(null);
        setBoxBounce(true);
        setTimeout(() => setBoxBounce(false), 350);
      }, 450);
    }

    setSelectedJars(prev => [...prev, item]);
  };

  // Add customized trial pack to cart
  const handleAddToCart = () => {
    const trialProduct = {
      _id: `trial-pack-${packSize}`,
      name: `Dadi's Special Trial Pack (Pack of ${packSize})`,
      hindiName: `दादी का स्पेशल ट्रायल पैक (${packSize} का पैक)`,
      slug: `dadi-special-trial-pack-${packSize}`,
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
    <section className="py-6 sm:py-8 bg-white border-b border-cream-200 font-sans">
      
      {/* Flying Jar Animation Portal */}
      {flyingJar && (
        <div 
          className="fixed z-50 pointer-events-none"
          style={{
            left: `${flyingJar.startX}px`,
            top: `${flyingJar.startY}px`,
            '--dx': `${flyingJar.dx}px`,
            '--dy': `${flyingJar.dy}px`,
            animation: 'flyToBoxAnim 0.45s cubic-bezier(0.2, 0.8, 0.25, 1) forwards'
          }}
        >
          <div className="w-12 h-12 rounded-full p-1 bg-white shadow-2xl border-2 border-brand-green ring-4 ring-amber-300">
            <img src={flyingJar.image} alt="flying jar" className="w-full h-full object-cover rounded-full" />
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-3 sm:px-6">
        
        {/* ========================================================== */}
        {/* SINGLE UNIFIED COMPACT CARD (जैसा फार्मदीदी स्क्रीनशॉट में है) */}
        {/* ========================================================== */}
        <div className="bg-[#FEF8E7] rounded-3xl border-2 border-amber-300/80 shadow-md p-4 sm:p-6 lg:p-7 relative overflow-hidden">
          
          {/* Subtle background decorative warm aura */}
          <div className="absolute -top-16 -right-16 w-60 h-60 bg-amber-200/40 rounded-full blur-2xl pointer-events-none" />

          {/* -------------------------------------------------------- */}
          {/* TOP ROW: Red Discount Banner & Dadi Special Logo Badge */}
          {/* -------------------------------------------------------- */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            {/* Red Offer Tag (10-17% Off dynamically calculated) */}
            <div className="inline-flex items-center gap-2 bg-[#D32F2F] text-white px-4 py-1.5 rounded-full shadow-xs text-xs font-black tracking-wide uppercase self-start">
              <span className="bg-white text-[#D32F2F] text-[10px] font-black px-1.5 py-0.2 rounded-full">
                {currentPricing.discountPercent}% OFF
              </span>
              <span>
                {packSize}x75g of Pickle Jars At <s className="opacity-75 font-normal">₹{currentPricing.originalPrice}</s> <span className="text-amber-300 font-black text-sm">₹{currentPricing.price}</span>
              </span>
            </div>

            {/* DADI'S SPECIAL PACK with Website Logo */}
            <div className="inline-flex items-center gap-2.5 bg-white/90 border border-amber-300 px-3 py-1 rounded-2xl shadow-xs self-start sm:self-auto">
              <div className="w-8 h-8 rounded-full border border-brand-green p-0.5 bg-amber-50 shrink-0 overflow-hidden">
                <img src="/logo.png" alt="Singodhia Foods" className="w-full h-full object-contain" onError={(e) => { e.target.src = '/hero-banner.png'; }} />
              </div>
              <div className="leading-tight">
                <span className="text-[9px] uppercase tracking-wider text-amber-800 font-bold block">100% Traditional</span>
                <span className="text-xs font-black text-gray-900 font-serif uppercase tracking-tight">DADI'S SPECIAL PACK</span>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------- */}
          {/* MAIN 2-COLUMN COMPACT CONTENT */}
          {/* -------------------------------------------------------- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 items-center">

            {/* LEFT SIDE (6 cols): Trial Box Hamper + 8 Mini Pickle Jars with small '+' */}
            <div className="lg:col-span-6 flex flex-col sm:flex-row items-center gap-4 bg-white/60 p-3 sm:p-4 rounded-2xl border border-amber-200/90 shadow-inner">
              
              {/* Visual Yellow Hamper Box with Bounce Animation & Live Slots */}
              <div 
                ref={trialBoxRef}
                className={`w-36 sm:w-44 shrink-0 bg-gradient-to-b from-amber-400 via-amber-300 to-yellow-200 rounded-2xl p-2.5 sm:p-3 border-2 border-amber-400 shadow-md text-center transition-all duration-300 ${
                  boxBounce ? 'scale-108 ring-4 ring-brand-green' : ''
                }`}
              >
                <div className="w-9 h-9 mx-auto rounded-full bg-white p-1 border border-amber-300 mb-1 flex items-center justify-center shadow-xs">
                  <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
                <h4 className="text-xs sm:text-sm font-black text-gray-950 uppercase leading-tight font-serif">
                  Pickle Trial Box
                </h4>
                <span className="inline-block text-[10px] font-extrabold text-brand-green bg-white/90 px-2 py-0.5 rounded-full border border-brand-green/30 mt-0.5">
                  (Pack of {packSize})
                </span>

                {/* Visual miniature jar slots inside the box */}
                <div className="grid grid-cols-4 gap-1 mt-2 p-1 bg-amber-500/20 rounded-xl border border-amber-400/40">
                  {[...Array(packSize)].map((_, i) => {
                    const jar = selectedJars[i];
                    return (
                      <div 
                        key={i} 
                        className="aspect-square rounded-md bg-white/80 border border-amber-300/80 flex items-center justify-center overflow-hidden p-0.5 shadow-2xs"
                        title={jar ? jar.name : 'Empty Slot'}
                      >
                        {jar ? (
                          <img src={jar.image} alt={jar.name} className="w-full h-full object-cover rounded-sm" />
                        ) : (
                          <span className="text-[8px] text-amber-700/60 font-bold">{i + 1}</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Live Jars Count Badge */}
                <div className="mt-1.5 text-[10px] font-black text-gray-900 bg-white/90 py-0.5 px-1.5 rounded-md border border-amber-300 shadow-2xs">
                  {selectedJars.length} / {packSize} Jars in Box
                </div>
              </div>

              {/* 8 Pickle Jars Grid (4 cols x 2 rows) with cute small '+' button below each */}
              <div className="flex-1 w-full">
                <div className="text-[11px] font-bold text-gray-700 mb-1.5 flex items-center justify-between">
                  <span>Tap <strong className="text-brand-green">+</strong> to select your flavours:</span>
                  <span className="text-[10px] font-bold text-brand-green bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-200">
                    {selectedJars.length}/{packSize} Filled
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {trialItems.map((item) => {
                    const isSelected = selectedJars.some(j => j.id === item.id);
                    const isFull = selectedJars.length >= packSize;

                    return (
                      <div 
                        key={item.id}
                        className={`p-1.5 rounded-xl border text-center transition-all flex flex-col items-center justify-between ${
                          isSelected 
                            ? 'bg-emerald-50 border-brand-green shadow-xs' 
                            : 'bg-white border-gray-200 hover:border-amber-300'
                        }`}
                      >
                        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg overflow-hidden border border-gray-200 mb-1 bg-amber-50">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=300&q=80'; }}
                          />
                        </div>
                        <span className="text-[9px] font-bold text-gray-900 leading-none truncate max-w-full block mb-1">
                          {item.name.split(' ')[0]}
                        </span>

                        {/* Small '+' or '✓' Button below jar */}
                        <button
                          type="button"
                          onClick={(e) => handleToggleJar(item, e)}
                          disabled={!isSelected && isFull}
                          className={`w-6 h-6 rounded-full text-[11px] font-black flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-brand-green text-white shadow-xs hover:bg-red-600'
                              : isFull
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-amber-400 hover:bg-brand-green text-gray-950 hover:text-white shadow-xs active:scale-90 cursor-pointer'
                          }`}
                          title={isSelected ? 'Remove from box' : 'Add to box'}
                        >
                          {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Plus className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* RIGHT SIDE (6 cols): Title, Ribbon with Dropdown, Price & ADD TO CART */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              
              {/* Badge */}
              <div className="inline-block bg-white border border-brand-green/30 text-brand-green text-[10px] font-black tracking-widest px-2.5 py-0.5 rounded-full uppercase shadow-xs mb-2 self-start">
                NEW TO SINGODHIA FOODS?
              </div>

              {/* Heading */}
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#832B0A] leading-tight font-serif">
                Not sure which <span className="text-brand-green underline decoration-wavy decoration-mustard">pickle</span> to try first?
              </h2>

              <p className="text-xs text-gray-600 font-medium mt-1">
                Start with <strong className="text-gray-900 font-bold">Dadi's Special Trial Pack</strong>
              </p>

              {/* ====================================================== */}
              {/* YELLOW RIBBON with PACK SIZE DROPDOWN (4, 6, 8) */}
              {/* ====================================================== */}
              <div className="my-3.5 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-300 px-3 py-2 rounded-xl border border-amber-400 shadow-sm flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Gift className="w-4 h-4 text-brand-green shrink-0" />
                  <span className="text-xs sm:text-sm font-black text-gray-950 uppercase tracking-tight truncate">
                    {packSize} Different flavours in one box
                  </span>
                </div>

                {/* Dropdown for 4, 6, 8 */}
                <div className="relative shrink-0">
                  <select
                    value={packSize}
                    onChange={(e) => handlePackChange(Number(e.target.value))}
                    className="bg-white border-2 border-gray-950 text-gray-950 font-black text-xs px-2.5 py-1 rounded-lg shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-green pr-6 appearance-none"
                  >
                    <option value={4}>4 Pack (₹{pricing[4].price})</option>
                    <option value={6}>6 Pack (₹{pricing[6].price})</option>
                    <option value={8}>8 Pack (₹{pricing[8].price})</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-950 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Ratings */}
              <div className="flex items-center gap-1.5 mb-2.5 text-xs text-gray-600">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="font-bold text-gray-900">4.8</span>
                <span className="text-gray-300">|</span>
                <span className="font-semibold text-gray-600 text-[11px]">1,774 Reviews</span>
              </div>

              {/* Price Row (₹699 ₹799 13% OFF) */}
              <div className="flex items-baseline gap-2.5 mb-3.5">
                <span className="text-2xl sm:text-3xl font-black text-[#D32F2F]">
                  ₹{currentPricing.price}
                </span>
                <span className="text-sm sm:text-base text-gray-400 line-through font-semibold">
                  ₹{currentPricing.originalPrice}
                </span>
                <span className="bg-[#D32F2F] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                  {currentPricing.discountPercent}% OFF
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200">
                  Save ₹100
                </span>
              </div>

              {/* Red ADD TO CART Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-black text-sm sm:text-base py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 uppercase tracking-wider active:scale-98 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>ADD TO CART</span>
              </button>

              {/* Perks below button */}
              <div className="flex items-center justify-between text-[11px] font-bold text-gray-700 mt-3 pt-2.5 border-t border-amber-200/60">
                <div className="flex items-center gap-1 text-emerald-800">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Free shipping <span className="text-[10px] text-gray-500 font-normal">On this product</span></span>
                </div>
                <div className="flex items-center gap-1 text-amber-900">
                  <Zap className="w-3.5 h-3.5 text-amber-600" />
                  <span>FLAT 3% OFF <span className="text-[10px] text-gray-500 font-normal">On Prepaid</span></span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Fly Animation Keyframes with dynamic offsets */}
      <style>{`
        @keyframes flyToBoxAnim {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          50% {
            transform: translate(calc(-50% + var(--dx) * 0.5), calc(-50% + var(--dy) * 0.5 - 50px)) scale(0.9);
            opacity: 0.95;
          }
          100% {
            transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0.25);
            opacity: 0;
          }
        }
      `}</style>

    </section>
  );
};

export default FeaturedTrialPackBanner;

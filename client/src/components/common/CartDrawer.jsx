import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  X, Trash2, Plus, Minus, ShoppingBag, Truck, Gift, ShoppingBasket, 
  ChevronDown, ChevronUp, Percent, Sparkles, Check, FileText
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatCurrency';
import { productAPI } from '../../services/api';
import { resolveProductImage } from '../../utils/imageUtils';

export const CartDrawer = () => {
  const {
    isCartOpen,
    closeCart,
    cartItems,
    cartCount,
    subtotal,
    discountAmount,
    appliedCoupon,
    shippingFee,
    finalTotal,
    removeFromCart,
    updateQuantity,
    addToCart,
    applyCouponCode,
    removeCoupon
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);
  const [upsellProducts, setUpsellProducts] = useState([]);
  const navigate = useNavigate();

  // Load upsell / "People Also Loved" products
  useEffect(() => {
    let isMounted = true;
    const fetchUpsells = async () => {
      try {
        const res = await productAPI.getProducts({ limit: 8 });
        if (isMounted && Array.isArray(res.products)) {
          // Exclude products already in cart
          const existingIds = new Set(cartItems.map(item => item.productId || item.slug));
          const filtered = res.products.filter(p => !existingIds.has(p._id) && !existingIds.has(p.slug));
          setUpsellProducts(filtered.slice(0, 4));
        }
      } catch (err) {
        console.warn('Upsell fetch error:', err);
      }
    };
    if (isCartOpen) {
      fetchUpsells();
    }
    return () => { isMounted = false; };
  }, [isCartOpen, cartItems]);

  if (!isCartOpen) return null;

  // Milestone tier calculations (matching screenshot: 2 Items, 3 Items, 6 Items)
  const milestone1 = 2; // Free Shipping
  const milestone2 = 3; // Buy 3 Get 3 Gifts
  const milestone3 = 6; // Tote Bag Free

  // Progress percentage for milestone bar
  let milestoneProgress = 0;
  if (cartCount === 0) {
    milestoneProgress = 0;
  } else if (cartCount === 1) {
    milestoneProgress = 20;
  } else if (cartCount === 2) {
    milestoneProgress = 35;
  } else if (cartCount >= 3 && cartCount < 6) {
    milestoneProgress = 35 + ((cartCount - 3) / 3) * 35 + 30; // ~65% to 85%
  } else if (cartCount >= 6) {
    milestoneProgress = 100;
  }

  // Milestone top message
  let milestoneMessage = 'Add 2 Jar(s) to get FREE Delivery';
  if (cartCount === 1) {
    milestoneMessage = 'Add 1 Jar(s) to get FREE Delivery';
  } else if (cartCount === 2) {
    milestoneMessage = 'Add 1 more to unlock Buy 3 Get 3 Gifts! 🎁';
  } else if (cartCount >= 3 && cartCount < 6) {
    const diff = 6 - cartCount;
    milestoneMessage = `Add ${diff} more Jar(s) for FREE Tote Bag! 🛍️`;
  } else if (cartCount >= 6) {
    milestoneMessage = '🎉 Congratulations! All Milestone Gifts Unlocked!';
  }

  // Calculate total original MRP and total savings
  const totalOriginalPrice = cartItems.reduce((acc, item) => {
    const orig = item.originalPrice && item.originalPrice > item.price
      ? item.originalPrice
      : Math.round(item.price * 1.25);
    return acc + orig * item.quantity;
  }, 0);

  const productSavings = Math.max(0, totalOriginalPrice - subtotal);
  const shippingSavings = cartCount >= 2 || subtotal >= 499 ? 49 : 0;
  const totalSavings = productSavings + (discountAmount || 0) + shippingSavings;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplying(true);
    setCouponError('');
    const res = await applyCouponCode(couponInput.trim());
    setIsApplying(false);
    if (!res?.success) {
      setCouponError(res?.message || 'Invalid coupon code');
    } else {
      setCouponInput('');
    }
  };

  const handleCheckoutClick = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeCart}
      />

      {/* Slide-out drawer panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex w-full sm:w-auto">
        <div className="w-full sm:w-[420px] md:w-[450px] bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          
          {/* 1. Header (YOUR CART) */}
          <div className="px-4 py-3.5 sm:px-5 sm:py-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
            <h2 className="text-sm sm:text-base font-black text-gray-900 tracking-wider uppercase font-sans">
              YOUR CART ({cartCount})
            </h2>
            <button
              onClick={closeCart}
              className="p-1 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          {/* 2. Top Banner Note */}
          <div className="bg-[#FAF6EF] py-1.5 px-4 text-center border-b border-amber-200/50 shrink-0">
            <p className="text-[11px] text-gray-600 font-medium tracking-tight">
              These offers are valid for 325g jars & standard sizes
            </p>
          </div>

          {/* Scrollable Center Body */}
          <div className="flex-1 overflow-y-auto px-4 py-3 sm:px-5 space-y-3.5 scrollbar-thin">
            
            {/* 3. Milestone Tier Rewards Progress Bar */}
            <div className="bg-gradient-to-b from-emerald-50/50 via-white to-white rounded-2xl p-3 border border-emerald-100 shadow-2xs">
              {/* Dynamic Milestone Target Text */}
              <div className="text-center font-bold text-xs sm:text-[13px] text-[#1b7a42] mb-3">
                {milestoneMessage}
              </div>

              {/* 3 Milestone Columns with Connecting Bar */}
              <div className="relative pb-1">
                {/* Connecting Track Background */}
                <div className="absolute top-[28px] left-[15%] right-[15%] h-1 bg-gray-200 rounded-full z-0" />
                {/* Connecting Track Filled Progress */}
                <div 
                  className="absolute top-[28px] left-[15%] h-1 bg-amber-500 rounded-full transition-all duration-500 z-0"
                  style={{ width: `${Math.min(70, (milestoneProgress * 0.70))}%` }}
                />

                <div className="grid grid-cols-3 text-center relative z-10">
                  {/* Milestone 1: 2 Items */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-gray-600 mb-1">2 Items</span>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center border-2 transition-all ${
                      cartCount >= 2 
                        ? 'bg-amber-500 border-amber-500 text-white shadow-xs' 
                        : 'bg-white border-amber-300 text-amber-600'
                    }`}>
                      <Truck className="w-4 h-4 stroke-[2]" />
                    </div>
                    <span className={`text-[10px] font-bold mt-1.5 leading-tight ${
                      cartCount >= 2 ? 'text-brand-green' : 'text-gray-600'
                    }`}>
                      Free Shipping
                    </span>
                  </div>

                  {/* Milestone 2: 3 Items */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-gray-600 mb-1">3 Items</span>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center border-2 transition-all ${
                      cartCount >= 3 
                        ? 'bg-amber-500 border-amber-500 text-white shadow-xs' 
                        : 'bg-white border-amber-300 text-amber-600'
                    }`}>
                      <Gift className="w-4 h-4 stroke-[2]" />
                    </div>
                    <span className={`text-[10px] font-bold mt-1.5 leading-tight ${
                      cartCount >= 3 ? 'text-brand-green' : 'text-gray-600'
                    }`}>
                      Buy3 Get 3Gifts
                    </span>
                  </div>

                  {/* Milestone 3: 6 Items */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-gray-600 mb-1">6 Items</span>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center border-2 transition-all ${
                      cartCount >= 6 
                        ? 'bg-amber-500 border-amber-500 text-white shadow-xs' 
                        : 'bg-white border-amber-300 text-amber-600'
                    }`}>
                      <ShoppingBasket className="w-4 h-4 stroke-[2]" />
                    </div>
                    <span className={`text-[10px] font-bold mt-1.5 leading-tight ${
                      cartCount >= 6 ? 'text-brand-green' : 'text-gray-600'
                    }`}>
                      Tote Bag Free
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Cart Items List */}
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 mb-3 border border-amber-200">
                  <ShoppingBag className="w-8 h-8 stroke-1" />
                </div>
                <h4 className="text-base font-bold text-gray-900 mb-1">Your cart is currently empty!</h4>
                <p className="text-xs text-gray-500 max-w-xs mb-5">
                  Taste the authentic, grandmother-crafted heritage pickles of Rajasthan. Add your favorite jars now.
                </p>
                <Link
                  to="/shop"
                  onClick={closeCart}
                  className="bg-brand-green hover:bg-brand-green-light text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-xs transition-all"
                >
                  Explore All Pickles
                </Link>
              </div>
            ) : (
              <div className="space-y-2.5">
                {cartItems.map((item) => {
                  const itemOrigPrice = item.originalPrice && item.originalPrice > item.price
                    ? item.originalPrice
                    : Math.round(item.price * 1.25);

                  return (
                    <div 
                      key={item.cartItemId} 
                      className="flex gap-3 p-3 rounded-2xl border border-gray-200 bg-white shadow-2xs hover:border-gray-300 transition-colors"
                    >
                      {/* Product Thumbnail */}
                      <Link 
                        to={`/product/${item.slug}/`} 
                        onClick={closeCart}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-amber-50/40 border border-gray-100 flex items-center justify-center p-1 shrink-0 overflow-hidden"
                      >
                        <img
                          src={resolveProductImage(item.image)}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </Link>

                      {/* Product Details & Actions */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        {/* Title & Price Header */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 pr-1">
                            <Link
                              to={`/product/${item.slug}/`}
                              onClick={closeCart}
                              className="text-xs sm:text-sm font-bold text-gray-900 hover:text-brand-green line-clamp-1 block leading-snug"
                              title={item.name}
                            >
                              {item.name}
                            </Link>
                            <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                              {item.weight || 'Standard Jar'}
                            </p>
                          </div>

                          {/* Price */}
                          <div className="text-right shrink-0">
                            <div className="text-xs sm:text-sm font-black text-gray-900 font-sans">
                              {formatPrice(item.price * item.quantity)}
                            </div>
                            {itemOrigPrice > item.price && (
                              <div className="text-[10px] text-gray-400 line-through">
                                {formatPrice(itemOrigPrice * item.quantity)}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Bottom Row: Trash + Stepper Controls */}
                        <div className="flex items-center gap-2 mt-2 pt-1">
                          {/* Trash Button */}
                          <button
                            onClick={() => removeFromCart(item.cartItemId)}
                            className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-chilli hover:border-red-200 hover:bg-red-50/50 transition-colors cursor-pointer"
                            title="Remove item"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Inline Stepper: [-] qty [+] */}
                          <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50/60 overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                              className="px-2 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200/60 transition-colors cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3 stroke-[2.5]" />
                            </button>
                            <span className="px-2 text-xs font-bold text-gray-900 min-w-[20px] text-center select-none font-sans">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                              className="px-2 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200/60 transition-colors cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3 stroke-[2.5]" />
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 5. Celebratory Unlocked Callout Banner */}
            {cartItems.length > 0 && (cartCount >= 2 || subtotal >= 499) && (
              <div className="bg-[#EAF7ED] border border-[#BBE5C5] rounded-2xl p-3 flex items-center gap-3 shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-white border border-[#BBE5C5] flex items-center justify-center shrink-0 text-base shadow-2xs">
                  🎁
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-[13px] font-bold text-[#1b7a42] leading-tight">
                    Free Shipping Gift Unlocked!
                  </h4>
                  <p className="text-[11px] text-gray-600 mt-0.5">
                    You saved ₹49 on shipping across India.
                  </p>
                </div>
              </div>
            )}

            {/* 6. Coupon Code Input Box */}
            {cartItems.length > 0 && (
              <div>
                {!appliedCoupon ? (
                  <form onSubmit={handleApplyCoupon} className="flex items-center border border-gray-200 rounded-2xl p-1 bg-white shadow-2xs focus-within:border-brand-green">
                    <div className="pl-3 text-gray-400">
                      <Percent className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="w-full px-2 py-1.5 text-xs uppercase font-medium bg-transparent focus:outline-none placeholder:text-gray-400 placeholder:normal-case"
                    />
                    <button
                      type="submit"
                      disabled={isApplying || !couponInput.trim()}
                      className="text-xs font-bold text-brand-green hover:text-brand-green-light disabled:opacity-40 px-3 py-1.5 transition-colors uppercase cursor-pointer"
                    >
                      {isApplying ? 'Applying...' : 'Apply'}
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Coupon {appliedCoupon.code} applied!</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-chilli hover:underline text-[11px] font-bold cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}
                {couponError && (
                  <p className="text-[11px] text-chilli font-medium mt-1 pl-2">{couponError}</p>
                )}
              </div>
            )}

            {/* 7. People Also Loved Recommendations */}
            {cartItems.length > 0 && upsellProducts.length > 0 && (
              <div className="pt-2">
                <div className="mb-2.5">
                  <span className="text-xs sm:text-sm font-bold text-gray-900 border-b-2 border-brand-green pb-0.5 inline-block">
                    People Also Loved
                  </span>
                </div>

                <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                  {upsellProducts.map((p) => {
                    const price = p.variants?.[0]?.price || 249;
                    const weight = p.variants?.[0]?.weight || '250g';
                    const img = resolveProductImage(p.images?.[0]);

                    return (
                      <div 
                        key={p._id || p.slug}
                        className="flex items-center justify-between gap-2.5 p-2 bg-white border border-gray-200 rounded-xl shadow-2xs shrink-0 w-60"
                      >
                        <img
                          src={img}
                          alt={p.name}
                          className="w-11 h-11 rounded-lg object-contain bg-amber-50/40 border border-gray-100 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-bold text-gray-900 truncate leading-tight">
                            {p.name}
                          </p>
                          <p className="text-[10px] text-gray-500 font-medium">
                            {weight} • <strong className="text-gray-900">{formatPrice(price)}</strong>
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => addToCart(p, p.variants?.[0], 1)}
                          className="bg-[#F3A222] hover:bg-[#D97706] text-[#3E2305] text-[10px] font-extrabold px-2.5 py-1.5 rounded-lg shadow-2xs cursor-pointer transition-all shrink-0 hover:scale-105"
                        >
                          + Add
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

          {/* 8. Sticky Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-100 bg-white shrink-0">
              
              {/* Black Ribbon: 3% OFF on Prepaid Orders | COD Available */}
              <div className="bg-black text-white text-[11px] font-bold py-1.5 px-4 text-center tracking-wide">
                3% OFF on Prepaid Orders | COD Available
              </div>

              <div className="p-4 sm:p-5 space-y-3">
                {/* Estimated Total Row with Chevron Toggle */}
                <div>
                  <div 
                    onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
                    className="flex items-center justify-between cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-800">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span>Estimated total</span>
                      {showPriceBreakdown ? (
                        <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                      ) : (
                        <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                      )}
                    </div>

                    <div className="text-right">
                      <div className="flex items-baseline gap-1.5 justify-end">
                        {totalOriginalPrice > finalTotal && (
                          <span className="text-xs text-gray-400 line-through font-medium">
                            {formatPrice(totalOriginalPrice)}
                          </span>
                        )}
                        <span className="text-base sm:text-lg font-black text-gray-900 font-sans">
                          {formatPrice(finalTotal)}
                        </span>
                      </div>
                      {totalSavings > 0 && (
                        <p className="text-[11px] font-bold text-emerald-700">
                          You saved {formatPrice(totalSavings)}!
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Expandable Price Breakdown */}
                  {showPriceBreakdown && (
                    <div className="mt-2.5 pt-2 border-t border-gray-100 space-y-1 text-xs text-gray-600">
                      <div className="flex justify-between">
                        <span>Items Subtotal:</span>
                        <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
                      </div>
                      {discountAmount > 0 && (
                        <div className="flex justify-between text-emerald-700 font-semibold">
                          <span>Coupon Discount:</span>
                          <span>-{formatPrice(discountAmount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Estimated Shipping:</span>
                        <span>
                          {shippingFee === 0 ? (
                            <span className="text-brand-green font-bold text-[11px]">FREE</span>
                          ) : (
                            formatPrice(shippingFee)
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Red Prominent "Buy Now" Button with Payment Badges */}
                <button
                  onClick={handleCheckoutClick}
                  className="w-full bg-[#C00000] hover:bg-[#A50000] text-white rounded-2xl py-3 px-4 shadow-md hover:shadow-lg transition-all flex items-center justify-between group cursor-pointer"
                >
                  <span className="text-base sm:text-lg font-black tracking-wide font-sans">
                    Buy Now
                  </span>

                  {/* Payment Brand Icons Pill */}
                  <div className="bg-white rounded-full px-2.5 py-1 flex items-center gap-1.5 shadow-2xs">
                    {/* Paytm */}
                    <span className="text-[10px] font-extrabold text-[#002E6E] tracking-tighter">paytm</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    {/* PhonePe */}
                    <div className="w-4 h-4 rounded-full bg-[#5f259f] flex items-center justify-center text-white text-[9px] font-black">
                      पे
                    </div>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    {/* GPay */}
                    <span className="text-[10px] font-bold text-gray-800 flex items-center">
                      <span className="text-[#4285F4]">G</span>
                      <span className="text-[#EA4335]">P</span>
                      <span className="text-[#FBBC05]">a</span>
                      <span className="text-[#34A853]">y</span>
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    {/* UPI Badge */}
                    <div className="px-1 py-0.5 rounded bg-gradient-to-r from-orange-500 to-green-600 text-white text-[8px] font-black leading-none">
                      UPI
                    </div>
                  </div>
                </button>

                {/* Footer Subtext: Powered by shopflo */}
                <div className="flex items-center justify-center gap-1.5 text-gray-400 text-[11px] pt-0.5">
                  <span>Powered by</span>
                  <span className="font-extrabold text-gray-600 tracking-tight flex items-center gap-1">
                    <span className="text-gray-800 text-xs">❖</span> shopflo
                  </span>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CartDrawer;

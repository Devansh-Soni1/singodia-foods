import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  X, Trash2, Plus, Minus, ShoppingBag, 
  ChevronDown, ChevronUp, Percent, Sparkles, FileText
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
          
          {/* Header (YOUR CART) */}
          <div className="px-4 py-3.5 sm:px-5 sm:py-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-green" />
              <h2 className="text-sm sm:text-base font-black text-gray-900 tracking-wider uppercase font-sans">
                YOUR CART ({cartCount})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          {/* Scrollable Center Body */}
          <div className="flex-1 overflow-y-auto px-4 py-3.5 sm:px-5 space-y-4 scrollbar-thin">
            
            {/* Cart Items List */}
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 mb-3 border border-amber-200">
                  <ShoppingBag className="w-8 h-8 stroke-1" />
                </div>
                <h4 className="text-base font-bold text-gray-900 mb-1">Your cart is currently empty!</h4>
                <p className="text-xs text-gray-500 max-w-xs mb-5 leading-relaxed">
                  Experience traditional handmade taste from Rajasthan. Add your favorite achar jars now.
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
              <div className="space-y-3">
                {cartItems.map((item) => (
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
                            Jar Size: <strong className="text-gray-700">{item.weight || 'Standard'}</strong>
                          </p>
                        </div>

                        {/* Price */}
                        <div className="text-right shrink-0">
                          <div className="text-xs sm:text-sm font-black text-gray-900 font-sans">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                          {item.quantity > 1 && (
                            <div className="text-[10px] text-gray-400 font-normal">
                              ({formatPrice(item.price)} each)
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
                            className="px-2 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200/60 transition-transform active:scale-75 cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3 stroke-[2.5]" />
                          </button>
                          <span className="px-2 text-xs font-bold text-gray-900 min-w-[20px] text-center select-none font-sans">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="px-2 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200/60 transition-transform active:scale-75 cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3 stroke-[2.5]" />
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Coupon Code Input Box */}
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

            {/* People Also Loved Recommendations */}
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

          {/* Sticky Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-100 bg-white p-4 sm:p-5 space-y-3 shrink-0">
              
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
                    <span className="text-base sm:text-lg font-black text-gray-900 font-sans">
                      {formatPrice(finalTotal)}
                    </span>
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

              {/* Red Prominent "Buy Now" Button with Payment Badges and Micro-Interactions */}
              <button
                onClick={handleCheckoutClick}
                className="relative overflow-hidden w-full bg-[#C00000] hover:bg-[#A50000] text-white rounded-2xl py-3 px-4 shadow-md hover:shadow-xl transition-all flex items-center justify-between group cursor-pointer active:scale-98"
              >
                <div className="absolute inset-0 w-24 h-full bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none animate-cart-shimmer" />
                <span className="text-base sm:text-lg font-black tracking-wide font-sans relative z-10">
                  Buy Now
                </span>

                {/* Payment Brand Icons Pill */}
                <div className="bg-white rounded-full px-2.5 py-1 flex items-center gap-1.5 shadow-2xs">
                  <span className="text-[10px] font-extrabold text-[#002E6E] tracking-tighter">paytm</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <div className="w-4 h-4 rounded-full bg-[#5f259f] flex items-center justify-center text-white text-[9px] font-black">
                    पे
                  </div>
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <span className="text-[10px] font-bold text-gray-800 flex items-center">
                    <span className="text-[#4285F4]">G</span>
                    <span className="text-[#EA4335]">P</span>
                    <span className="text-[#FBBC05]">a</span>
                    <span className="text-[#34A853]">y</span>
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <div className="px-1 py-0.5 rounded bg-gradient-to-r from-orange-500 to-green-600 text-white text-[8px] font-black leading-none">
                    UPI
                  </div>
                </div>
              </button>

              {/* Footer Subtext: Razorpay & iThink Logistics */}
              <div className="flex items-center justify-center gap-2 text-gray-400 text-[10.5px] pt-0.5">
                <span>🔒 100% Secure Checkout via Razorpay</span>
                <span>•</span>
                <span>Delivered via iThink Logistics</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CartDrawer;

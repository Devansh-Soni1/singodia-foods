import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck, Check, Sparkles, Tag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatCurrency';

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
    remainingForFreeShipping,
    freeShippingProgress,
    finalTotal,
    removeFromCart,
    updateQuantity,
    applyCouponCode,
    removeCoupon
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplying(true);
    setCouponError('');
    const res = await applyCouponCode(couponInput.trim());
    setIsApplying(false);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  const handleCheckoutClick = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-cream-200 bg-cream-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-green" />
              <h3 className="text-lg font-bold text-charcoal font-serif">Your Cart</h3>
              <span className="bg-brand-green/10 text-brand-green text-xs font-bold px-2 py-0.5 rounded-full">
                {cartCount} {cartCount === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 rounded-full text-charcoal hover:bg-cream-200 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="bg-mustard-light/40 p-3.5 border-b border-mustard/20">
            <div className="flex items-center gap-2 text-xs font-semibold text-charcoal mb-2">
              <Truck className="w-4 h-4 text-brand-green flex-shrink-0" />
              {remainingForFreeShipping > 0 ? (
                <span>
                  Add <strong className="text-chilli">{formatPrice(remainingForFreeShipping)}</strong> more to get <strong className="text-brand-green">FREE Pan-India Shipping!</strong>
                </span>
              ) : (
                <span className="text-brand-green font-bold flex items-center gap-1">
                  <Check className="w-4 h-4" /> You have unlocked FREE Delivery! 🎉
                </span>
              )}
            </div>
            {/* Progress bar */}
            <div className="w-full bg-cream-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-brand-green h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 rounded-full bg-cream-100 flex items-center justify-center text-mustard mb-4">
                  <ShoppingBag className="w-10 h-10 stroke-1" />
                </div>
                <h4 className="text-lg font-bold text-charcoal mb-1">Your pickle cart is empty!</h4>
                <p className="text-xs text-earth-brown max-w-xs mb-6">
                  Experience traditional handmade taste from Rajasthan. Add your favorite achar jars now.
                </p>
                <Link
                  to="/shop"
                  onClick={closeCart}
                  className="bg-brand-green hover:bg-brand-green-light text-white text-xs font-bold px-6 py-3 rounded-full transition-all shadow-sm"
                >
                  Explore All Pickles
                </Link>
              </div>
            ) : (
              cartItems.map((item) => (
                <div 
                  key={item.cartItemId} 
                  className="flex gap-3 sm:gap-4 p-3 rounded-xl border border-cream-200/90 bg-cream-50/40 hover:bg-cream-50 transition-colors"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-18 h-18 sm:w-20 sm:h-20 object-cover rounded-lg flex-shrink-0 border border-cream-200"
                  />

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <Link
                          to={`/product/${item.slug}/`}
                          onClick={closeCart}
                          className="text-xs sm:text-sm font-bold text-charcoal hover:text-brand-green line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-gray-400 hover:text-chilli p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      
                      <p className="text-[11px] text-earth-brown font-medium mt-0.5">
                        Jar Size: <span className="font-bold text-charcoal">{item.weight}</span>
                      </p>
                    </div>

                    {/* Price and Quantity */}
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-cream-200/60">
                      <div className="text-xs font-bold text-brand-green">
                        {formatPrice(item.price * item.quantity)}
                        {item.quantity > 1 && (
                          <span className="text-[10px] text-earth-brown font-normal ml-1">
                            ({formatPrice(item.price)} each)
                          </span>
                        )}
                      </div>

                      <div className="flex items-center border border-cream-300 rounded-lg bg-white">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="p-1 text-charcoal hover:text-brand-green"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-charcoal min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="p-1 text-charcoal hover:text-brand-green"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Coupon & Checkout */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-cream-200 bg-cream-50/70 space-y-3.5">
              
              {/* Coupon Code Input */}
              {!appliedCoupon ? (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Coupon Code (e.g. DESI10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs uppercase font-medium bg-white border border-cream-200 rounded-lg focus:outline-none focus:border-brand-green"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isApplying || !couponInput.trim()}
                    className="bg-brand-green hover:bg-brand-green-light disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                  >
                    {isApplying ? 'Applying...' : 'Apply'}
                  </button>
                </form>
              ) : (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Coupon {appliedCoupon.code} applied!</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-chilli hover:underline text-[11px] font-bold"
                  >
                    Remove
                  </button>
                </div>
              )}

              {couponError && (
                <p className="text-[11px] text-chilli font-medium">{couponError}</p>
              )}

              {/* Price Calculation Summary */}
              <div className="space-y-1.5 text-xs text-charcoal">
                <div className="flex justify-between">
                  <span className="text-earth-brown">Subtotal:</span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount:</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-earth-brown">Estimated Shipping:</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-brand-green font-bold uppercase text-[11px]">FREE</span>
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-base font-bold text-charcoal pt-2 border-t border-cream-200">
                  <span>Payable Amount:</span>
                  <span className="text-brand-green">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleCheckoutClick}
                className="w-full bg-mustard hover:bg-mustard-dark text-brand-green-dark text-sm font-extrabold py-3.5 px-4 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <p className="text-[10px] text-center text-earth-brown">
                🔒 Safe & Encrypted Checkout • COD & UPI Accepted
              </p>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CartDrawer;


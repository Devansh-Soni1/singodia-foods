import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck, Check, Sparkles, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatCurrency';

export const CartPage = () => {
  const {
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

  if (cartItems.length === 0) {
    return (
      <div className="py-20 bg-[#FAF6EF] min-h-[70vh] flex items-center justify-center">
        <div className="max-w-md w-full mx-auto text-center px-4">
          <div className="w-20 h-20 rounded-full bg-cream-200 text-mustard flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-10 h-10 stroke-1" />
          </div>
          <h1 className="text-2xl font-bold text-charcoal font-serif mb-2">Your Cart is Empty</h1>
          <p className="text-xs sm:text-sm text-earth-brown mb-6">
            Looks like you haven't added any traditional homemade pickles yet. Explore our bestselling Rajasthani recipes!
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-light text-white text-xs font-bold px-8 py-3.5 rounded-xl shadow-sm transition-all"
          >
            <span>Browse All Pickles</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 sm:py-16 bg-[#FAF6EF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-2xl sm:text-4xl font-extrabold text-charcoal font-serif mb-8">
          Shopping Cart ({cartCount} {cartCount === 1 ? 'Jar' : 'Jars'})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Free Shipping Alert Box */}
            <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-card">
              <div className="flex items-center gap-2 text-xs font-semibold text-charcoal mb-2">
                <Truck className="w-4 h-4 text-brand-green flex-shrink-0" />
                {remainingForFreeShipping > 0 ? (
                  <span>
                    Add <strong className="text-chilli">{formatPrice(remainingForFreeShipping)}</strong> more to get <strong className="text-brand-green">FREE Pan-India Shipping!</strong>
                  </span>
                ) : (
                  <span className="text-brand-green font-bold flex items-center gap-1">
                    <Check className="w-4 h-4" /> You have qualified for FREE Pan-India Shipping! 🎉
                  </span>
                )}
              </div>
              <div className="w-full bg-cream-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-brand-green h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>

            {/* Cart Table */}
            <div className="bg-white rounded-2xl border border-cream-200 shadow-card overflow-hidden">
              <div className="divide-y divide-cream-100">
                {cartItems.map((item) => (
                  <div key={item.cartItemId} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-xl border border-cream-200 flex-shrink-0"
                      />
                      <div>
                        <Link to={`/product/${item.slug}`} className="text-sm sm:text-base font-bold text-charcoal hover:text-brand-green line-clamp-1 font-serif">
                          {item.name}
                        </Link>
                        {item.hindiName && (
                          <p className="text-xs text-mustard-dark font-medium">{item.hindiName}</p>
                        )}
                        <p className="text-xs text-earth-brown mt-0.5">
                          Size: <span className="font-bold text-charcoal">{item.weight}</span>
                        </p>
                        <p className="text-xs text-brand-green font-bold sm:hidden mt-1">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6">
                      {/* Quantity */}
                      <div className="flex items-center border border-cream-300 rounded-lg bg-cream-50">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="px-2.5 py-1 text-charcoal hover:text-brand-green font-bold text-xs"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2 text-xs font-bold text-charcoal min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="px-2.5 py-1 text-charcoal hover:text-brand-green font-bold text-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Total */}
                      <div className="text-right min-w-[80px]">
                        <span className="text-sm font-extrabold text-charcoal block">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-gray-400 hover:text-chilli p-1.5"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Link
                to="/shop"
                className="text-xs font-bold text-brand-green hover:underline flex items-center gap-1"
              >
                ← Continue Shopping Pickles
              </Link>
            </div>

          </div>

          {/* Right: Summary Box */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-card space-y-5">
              <h3 className="text-lg font-bold text-charcoal font-serif pb-3 border-b border-cream-200">
                Order Summary
              </h3>

              {/* Coupon box */}
              <div>
                {!appliedCoupon ? (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Coupon Code"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 text-xs uppercase font-medium bg-cream-50 border border-cream-300 rounded-xl focus:outline-none focus:border-brand-green"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isApplying || !couponInput.trim()}
                      className="bg-brand-green hover:bg-brand-green-light disabled:opacity-50 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{appliedCoupon.code} Applied</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-chilli hover:underline text-xs font-bold"
                    >
                      Remove
                    </button>
                  </div>
                )}
                {couponError && (
                  <p className="text-[11px] text-chilli font-medium mt-1">{couponError}</p>
                )}
              </div>

              {/* Breakdown */}
              <div className="space-y-2 text-xs text-charcoal pt-2">
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
                  <span className="text-earth-brown">Shipping Fee:</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-brand-green font-bold uppercase text-[11px]">FREE</span>
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-lg font-extrabold text-charcoal pt-3 border-t border-cream-200">
                  <span>Payable Total:</span>
                  <span className="text-brand-green">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-mustard hover:bg-mustard-dark text-brand-green-dark text-sm font-extrabold py-4 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <div className="text-[11px] text-center text-earth-brown pt-2 space-y-1">
                <p>🔒 100% Safe & Secure Checkout</p>
                <p>Pan-India Delivery via Delhivery & Bluedart</p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CartPage;


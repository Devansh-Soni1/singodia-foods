import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, Truck, CreditCard, Banknote, ArrowRight, 
  CheckCircle, AlertCircle, ShoppingBag, Lock
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import { formatPrice } from '../utils/formatCurrency';

// Dynamic loader for Razorpay Checkout script if not already present in DOM
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => resolve(false));
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const CheckoutPage = () => {
  const { cartItems, subtotal, discountAmount, appliedCoupon, shippingFee, finalTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    addressLine1: user?.addresses?.[0]?.addressLine1 || '',
    addressLine2: user?.addresses?.[0]?.addressLine2 || '',
    landmark: user?.addresses?.[0]?.landmark || '',
    city: user?.addresses?.[0]?.city || '',
    state: user?.addresses?.[0]?.state || 'Rajasthan',
    pincode: user?.addresses?.[0]?.pincode || '',
    paymentMethod: 'razorpay',
    customerNotes: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const indianStates = [
    'Rajasthan', 'Delhi', 'Uttar Pradesh', 'Maharashtra', 'Karnataka', 
    'Gujarat', 'Haryana', 'Punjab', 'Madhya Pradesh', 'West Bengal', 
    'Tamil Nadu', 'Telangana', 'Andhra Pradesh', 'Bihar', 'Kerala', 
    'Odisha', 'Assam', 'Jharkhand', 'Uttarakhand', 'Himachal Pradesh', 'Goa'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage('');
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setErrorMessage('Your cart is empty. Please add pickles before checkout.');
      return;
    }

    // Validation
    if (!formData.name || !formData.email || !formData.phone) {
      setErrorMessage('Please fill in your name, email, and 10-digit phone number.');
      return;
    }

    if (!formData.addressLine1 || !formData.city || !formData.pincode) {
      setErrorMessage('Please provide your complete delivery address and PIN code.');
      return;
    }

    if (!/^\d{6}$/.test(formData.pincode.trim())) {
      setErrorMessage('Please enter a valid 6-digit Indian PIN code.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const orderPayload = {
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        },
        shippingAddress: {
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          landmark: formData.landmark,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        },
        items: cartItems.map(item => ({
          product: item.productId,
          name: item.name,
          image: item.image,
          weight: item.weight,
          price: item.price,
          quantity: item.quantity
        })),
        subtotal,
        discount: discountAmount,
        couponCode: appliedCoupon?.code || '',
        shippingFee,
        paymentMethod: formData.paymentMethod,
        customerNotes: formData.customerNotes
      };

      const res = await orderAPI.createOrder(orderPayload);

      if (!res.success) {
        throw new Error(res.message || 'Failed to place order.');
      }

      const createdOrder = res.order;

      // Handle Razorpay Online Payment Flow
      if (formData.paymentMethod === 'razorpay') {
        let isLoaded = !!window.Razorpay;
        if (!isLoaded) {
          isLoaded = await loadRazorpayScript();
        }

        if (!isLoaded || !window.Razorpay) {
          setLoading(false);
          setErrorMessage('Razorpay payment gateway load nahi ho paya. Kripya apna internet connection check karein.');
          return;
        }

        const razorpayKey = res.razorpayKeyId || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_TtL5JmEDSmmcoo';

        const options = {
          key: razorpayKey,
          amount: Math.round(finalTotal * 100),
          currency: 'INR',
          name: 'Singodhia Foods',
          description: `Payment for Order ${createdOrder.orderNumber}`,
          image: window.location.origin + '/logo.png',
          order_id: createdOrder.razorpayOrderId || res.order?.razorpayOrderId || undefined,
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone
          },
          notes: {
            orderNumber: createdOrder.orderNumber,
            address: `${formData.addressLine1}, ${formData.city}, ${formData.pincode}`
          },
          theme: {
            color: '#1E4334'
          },
          handler: async function (paymentResponse) {
            try {
              // Verify on backend
              const verifyRes = await orderAPI.verifyPayment({
                orderId: createdOrder._id,
                razorpayOrderId: paymentResponse.razorpay_order_id || createdOrder.razorpayOrderId,
                razorpayPaymentId: paymentResponse.razorpay_payment_id,
                razorpaySignature: paymentResponse.razorpay_signature
              });
              clearCart();
              const confirmedOrder = verifyRes?.order || { ...createdOrder, paymentStatus: 'completed' };
              navigate(`/order-confirmation/${createdOrder.orderNumber}`, { state: { order: confirmedOrder } });
            } catch (vErr) {
              console.warn('Payment verification notice:', vErr);
              clearCart();
              navigate(`/order-confirmation/${createdOrder.orderNumber}`, { state: { order: createdOrder } });
            }
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
              // Discard pending order immediately so it is NOT saved in DB, admin, or user history
              orderAPI.discardPendingOrder(createdOrder._id, createdOrder.razorpayOrderId);
              setErrorMessage('Payment poori nahi hui ya radd kar di gayi. Kripya dubara prayas karein.');
            }
          }
        };

        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.on('payment.failed', function (failResp) {
          setLoading(false);
          // Discard failed/declined order immediately
          orderAPI.discardPendingOrder(createdOrder._id, createdOrder.razorpayOrderId);
          setErrorMessage(`Payment decline / asafal rahi: ${failResp.error?.description || 'Kripya dusre UPI ya card se koshish karein.'}`);
        });
        razorpayInstance.open();
        return;
      }

      setLoading(false);
      setErrorMessage('Online payment select karein.');

    } catch (err) {
      console.error('Order error:', err);
      setErrorMessage(err.message || 'An error occurred while placing the order. Please try again.');
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="py-24 text-center min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h2 className="text-xl font-bold text-charcoal mb-2 font-serif">Nothing to checkout!</h2>
        <p className="text-xs text-earth-brown mb-6">Your shopping cart is currently empty.</p>
        <Link to="/shop" className="bg-brand-green text-white text-xs font-bold px-6 py-3 rounded-xl">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10 sm:py-16 bg-[#FAF6EF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-charcoal font-serif">
            Checkout & Delivery
          </h1>
          <p className="text-xs sm:text-sm text-earth-brown mt-1">
            Complete your shipping details to receive your handcrafted Rajasthani pickles.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-800 text-xs font-semibold">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Form Fields */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Customer Contact */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-cream-100">
                  <span className="w-6 h-6 rounded-full bg-brand-green text-white text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <h2 className="text-base font-bold text-charcoal font-serif">
                    Contact Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-charcoal block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      name="name"
                      placeholder="e.g. Ramesh Chandra Singodhia"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 text-xs bg-cream-50 border border-cream-300 rounded-xl focus:outline-none focus:border-brand-green font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-charcoal block mb-1">
                      Phone Number (Mobile for Delivery updates) *
                    </label>
                    <input
                      type="tel"
                      required
                      name="phone"
                      placeholder="10-digit mobile number"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 text-xs bg-cream-50 border border-cream-300 rounded-xl focus:outline-none focus:border-brand-green font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-charcoal block mb-1">
                      Email Address (For receipt & tracking) *
                    </label>
                    <input
                      type="email"
                      required
                      name="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 text-xs bg-cream-50 border border-cream-300 rounded-xl focus:outline-none focus:border-brand-green font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-cream-100">
                  <span className="w-6 h-6 rounded-full bg-brand-green text-white text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <h2 className="text-base font-bold text-charcoal font-serif">
                    Delivery Address
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-charcoal block mb-1">
                      House / Flat No., Street / Building Name *
                    </label>
                    <input
                      type="text"
                      required
                      name="addressLine1"
                      placeholder="e.g. Flat 302, Royal Palms Apartment, MG Road"
                      value={formData.addressLine1}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 text-xs bg-cream-50 border border-cream-300 rounded-xl focus:outline-none focus:border-brand-green font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-charcoal block mb-1">
                        Locality / Area / Landmark
                      </label>
                      <input
                        type="text"
                        name="landmark"
                        placeholder="e.g. Near Jain Mandir"
                        value={formData.landmark}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 text-xs bg-cream-50 border border-cream-300 rounded-xl focus:outline-none focus:border-brand-green font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-charcoal block mb-1">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        name="pincode"
                        placeholder="6-digit PIN code"
                        value={formData.pincode}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 text-xs bg-cream-50 border border-cream-300 rounded-xl focus:outline-none focus:border-brand-green font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-charcoal block mb-1">
                        City / Town *
                      </label>
                      <input
                        type="text"
                        required
                        name="city"
                        placeholder="e.g. Jaipur"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 text-xs bg-cream-50 border border-cream-300 rounded-xl focus:outline-none focus:border-brand-green font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-charcoal block mb-1">
                        State *
                      </label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 text-xs bg-cream-50 border border-cream-300 rounded-xl focus:outline-none focus:border-brand-green font-medium"
                      >
                        {indianStates.map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-charcoal block mb-1">
                      Delivery Instructions (Optional)
                    </label>
                    <textarea
                      rows="2"
                      name="customerNotes"
                      placeholder="e.g. Please ring bell twice or leave with security."
                      value={formData.customerNotes}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 text-xs bg-cream-50 border border-cream-300 rounded-xl focus:outline-none focus:border-brand-green font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-cream-100">
                  <span className="w-6 h-6 rounded-full bg-brand-green text-white text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <h2 className="text-base font-bold text-charcoal font-serif">
                    Payment Method (100% Secure)
                  </h2>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl border-2 border-brand-green bg-cream-50/80 shadow-xs ring-1 ring-brand-green/20 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-brand-green text-white flex items-center justify-center text-xs shrink-0 mt-0.5">
                        ✓
                      </div>
                      <div>
                        <span className="text-sm font-bold text-charcoal font-serif flex items-center gap-2">
                          <span>Online Payment via Razorpay</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                            Instant Confirmation
                          </span>
                        </span>
                        <p className="text-xs text-earth-brown mt-0.5">
                          Pay securely using <strong>UPI (GPay, PhonePe, Paytm, BHIM)</strong>, Debit/Credit Cards, or Net Banking.
                        </p>
                      </div>
                    </div>
                    <CreditCard className="w-5 h-5 text-brand-green shrink-0" />
                  </div>

                  {/* Supported Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-cream-200/60">
                    <span className="text-[10px] text-gray-500 font-semibold mr-1">Accepted:</span>
                    <span className="text-[10px] font-bold text-gray-800 bg-white px-2 py-0.5 rounded-md border border-gray-200 shadow-2xs">Google Pay</span>
                    <span className="text-[10px] font-bold text-gray-800 bg-white px-2 py-0.5 rounded-md border border-gray-200 shadow-2xs">PhonePe</span>
                    <span className="text-[10px] font-bold text-gray-800 bg-white px-2 py-0.5 rounded-md border border-gray-200 shadow-2xs">Paytm UPI</span>
                    <span className="text-[10px] font-bold text-gray-800 bg-white px-2 py-0.5 rounded-md border border-gray-200 shadow-2xs">BHIM UPI</span>
                    <span className="text-[10px] font-bold text-gray-800 bg-white px-2 py-0.5 rounded-md border border-gray-200 shadow-2xs">All Debit & Credit Cards</span>
                    <span className="text-[10px] font-bold text-gray-800 bg-white px-2 py-0.5 rounded-md border border-gray-200 shadow-2xs">Net Banking</span>
                  </div>
                </div>

                {/* Logistics Info Note */}
                <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-2xl flex items-center gap-2.5 text-xs text-blue-900">
                  <Truck className="w-4 h-4 text-[#002E6E] shrink-0" />
                  <span>
                    Your parcel will be carefully packed in bubble wrap and dispatched via <strong>iThink Logistics Express</strong>.
                  </span>
                </div>
              </div>

            </div>

            {/* Right Column: Order Review & Submit */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-cream-200 shadow-card space-y-5">
                <h3 className="text-lg font-bold text-charcoal font-serif pb-3 border-b border-cream-200">
                  Order Review ({cartItems.length} items)
                </h3>

                {/* Items preview list */}
                <div className="max-h-64 overflow-y-auto divide-y divide-cream-100 pr-1">
                  {cartItems.map((item) => (
                    <div key={item.cartItemId} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover border border-cream-200 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-charcoal truncate">{item.name}</p>
                          <p className="text-[11px] text-earth-brown">
                            {item.weight} × {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="text-right font-bold text-charcoal flex-shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing Summary */}
                <div className="space-y-2 text-xs text-charcoal pt-3 border-t border-cream-200">
                  <div className="flex justify-between">
                    <span className="text-earth-brown">Subtotal:</span>
                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Discount ({appliedCoupon?.code}):</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-earth-brown">Shipping Fee:</span>
                    <span>
                      {shippingFee === 0 ? (
                        <span className="text-gray-900 font-bold uppercase text-[11px]">₹0</span>
                      ) : (
                        formatPrice(shippingFee)
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-lg font-extrabold text-charcoal pt-3 border-t border-cream-200">
                    <span>Payable Amount:</span>
                    <span className="text-brand-green">{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-mustard hover:bg-mustard-dark disabled:opacity-50 text-brand-green-dark text-sm font-extrabold py-4 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span>Processing Order...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>
                        Place Order ({formatPrice(finalTotal)})
                      </span>
                    </>
                  )}
                </button>

                <div className="p-3 bg-cream-50 rounded-xl text-[11px] text-earth-brown space-y-1">
                  <p className="flex items-center gap-1 font-semibold text-charcoal">
                    <Truck className="w-3.5 h-3.5 text-brand-green" /> Dispatched within 24 hours from Jaipur
                  </p>
                  <p>• Carefully packed in leak-proof protective cushioning</p>
                  <p>• SMS and WhatsApp tracking will be shared upon dispatch</p>
                </div>

              </div>
            </div>

          </div>
        </form>

      </div>
    </div>
  );
};

export default CheckoutPage;


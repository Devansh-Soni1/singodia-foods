import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  ShieldCheck, Truck, CreditCard, Banknote, ArrowRight, 
  CheckCircle, AlertCircle, ShoppingBag, Lock, UserCheck, CheckCircle2,
  MapPin, Plus, Loader2, Sparkles, Home, Building2, Phone, Edit3,
  X, Clock, Info
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI, authAPI, shippingAPI } from '../services/api';
import { GoogleAuthButton } from '../components/auth/GoogleAuthButton';
import { formatPrice } from '../utils/formatCurrency';
import { AddressSelectModal } from '../components/checkout/AddressSelectModal';

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
  const { 
    cartItems, 
    subtotal, 
    discountAmount, 
    appliedCoupon, 
    clearCart,
    isFreeShipping,
    freeShippingThreshold,
    freeShippingEnabled
  } = useCart();
  const { user, isAuthenticated, addAddress, setDefaultAddress, deleteAddress } = useAuth();
  const navigate = useNavigate();

  // Address selection modal state
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isDeliveryInfoOpen, setIsDeliveryInfoOpen] = useState(false);

  const splitName = (fullName = '') => {
    const parts = (fullName || '').trim().split(/\s+/);
    const firstName = parts[0] || '';
    const lastName = parts.slice(1).join(' ') || '';
    return { firstName, lastName };
  };

  // Form states - First & Last name + Address fields
  const initialNameParts = splitName(user?.name || '');
  const [formData, setFormData] = useState({
    firstName: initialNameParts.firstName,
    lastName: initialNameParts.lastName,
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone ? String(user.phone).replace(/^(\+91|91|0)/, '').replace(/\D/g, '').slice(-10) : '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    district: '',
    pincode: '',
    state: 'Rajasthan',
    paymentMethod: 'razorpay',
    customerNotes: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // PIN Code Auto-fetch state
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeStatus, setPincodeStatus] = useState('');

  // Dynamic iThink Logistics rate state
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingRateInfo, setShippingRateInfo] = useState(null);
  const [dynamicShippingFee, setDynamicShippingFee] = useState(null);

  // Calculate total cart weight in Kg
  const totalCartWeightKg = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const wStr = String(item.weight || '').toLowerCase();
      let itemWeightKg = 0.5;
      if (wStr.includes('kg')) {
        const num = parseFloat(wStr);
        itemWeightKg = isNaN(num) ? 1.0 : num;
      } else if (wStr.includes('g') || wStr.includes('gm')) {
        const num = parseFloat(wStr);
        itemWeightKg = isNaN(num) ? 0.5 : num / 1000;
      }
      return acc + (itemWeightKg * (item.quantity || 1));
    }, 0);
  }, [cartItems]);

  // Fetch live iThink Logistics shipping rate for destination pincode
  const calculateIThinkRate = useCallback(async (destinationPincode) => {
    const cleanPin = String(destinationPincode || '').trim();
    if (!/^\d{6}$/.test(cleanPin)) return;

    setShippingLoading(true);
    try {
      const res = await shippingAPI.calculateRate({
        toPincode: cleanPin,
        weight: totalCartWeightKg || 0.5,
        paymentMethod: 'Prepaid'
      });

      if (res && res.success) {
        const cost = Number(res.rate || res.estimatedCost) || 50;
        setDynamicShippingFee(cost);
        setShippingRateInfo(res);
      } else {
        // Fallback default
        setDynamicShippingFee(60);
      }
    } catch (err) {
      console.warn('Shipping rate calculation notice:', err);
      setDynamicShippingFee(60);
    } finally {
      setShippingLoading(false);
    }
  }, [totalCartWeightKg]);

  // Auto-populate default address on load
  useEffect(() => {
    if (user) {
      const addresses = user.addresses || [];
      const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];

      if (defaultAddr) {
        setSelectedAddressId(defaultAddr._id);
        const cleanPhone = defaultAddr.phone || user.phone || '';
        const formattedPhone = String(cleanPhone).replace(/^(\+91|91|0)/, '').replace(/\D/g, '').slice(-10);

        const addrName = defaultAddr.fullName || user.name || prev.name;
        const nameParts = splitName(addrName);

        setFormData(prev => ({
          ...prev,
          firstName: nameParts.firstName || prev.firstName,
          lastName: nameParts.lastName || prev.lastName,
          name: addrName,
          email: user.email || prev.email,
          phone: formattedPhone || prev.phone,
          addressLine1: defaultAddr.addressLine1 || prev.addressLine1,
          addressLine2: defaultAddr.addressLine2 || prev.addressLine2,
          landmark: defaultAddr.landmark || prev.landmark,
          city: defaultAddr.city || prev.city,
          district: defaultAddr.district || defaultAddr.city || prev.district || '',
          pincode: defaultAddr.pincode || prev.pincode,
          state: defaultAddr.state || prev.state || 'Rajasthan'
        }));

        if (defaultAddr.pincode && /^\d{6}$/.test(defaultAddr.pincode)) {
          calculateIThinkRate(defaultAddr.pincode);
        }
      } else {
        // First time customer: prefill name & email
        const userParts = splitName(user.name || '');
        setFormData(prev => ({
          ...prev,
          firstName: userParts.firstName || prev.firstName,
          lastName: userParts.lastName || prev.lastName,
          name: user.name || prev.name,
          email: user.email || prev.email,
          phone: user.phone ? String(user.phone).replace(/^(\+91|91|0)/, '').replace(/\D/g, '').slice(-10) : prev.phone
        }));
      }
    }
  }, [user, calculateIThinkRate]);

  // Handle address selected from modal
  const handleSelectAddressFromModal = (addr) => {
    setSelectedAddressId(addr._id);
    const cleanPhone = String(addr.phone || '').replace(/^(\+91|91|0)/, '').replace(/\D/g, '').slice(-10);
    const addrName = addr.fullName || prev.name;
    const addrParts = splitName(addrName);

    setFormData(prev => ({
      ...prev,
      firstName: addrParts.firstName || prev.firstName,
      lastName: addrParts.lastName || prev.lastName,
      name: addrName,
      phone: cleanPhone || prev.phone,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2 || '',
      landmark: addr.landmark || '',
      city: addr.city,
      district: addr.district || addr.city || '',
      pincode: addr.pincode,
      state: addr.state
    }));

    setIsAddressModalOpen(false);
    setPincodeStatus(`✓ चुना गया पता: ${addr.city}, ${addr.state} (${addr.pincode})`);
    calculateIThinkRate(addr.pincode);
  };

  // Handle new address saved inside modal
  const handleSaveNewAddressFromModal = async (newAddrPayload) => {
    if (addAddress) {
      const res = await addAddress(newAddrPayload);
      const savedAddresses = res?.addresses || [];
      const newest = savedAddresses[savedAddresses.length - 1] || newAddrPayload;

      handleSelectAddressFromModal({
        ...newAddrPayload,
        _id: newest._id || 'temp-' + Date.now()
      });
    } else {
      handleSelectAddressFromModal({
        ...newAddrPayload,
        _id: 'temp-' + Date.now()
      });
    }
  };

  // Handle setting default address inside modal
  const handleSetDefaultInsideModal = async (addressId) => {
    if (setDefaultAddress) {
      await setDefaultAddress(addressId);
    }
  };

  // Handle deleting address inside modal
  const handleDeleteAddressFromModal = async (addressId) => {
    try {
      if (deleteAddress) {
        await deleteAddress(addressId);
        toast.success('पता हटा दिया गया');
        if (selectedAddressId === addressId) {
          setSelectedAddressId(null);
        }
      }
    } catch (err) {
      toast.error(err.message || 'पता हटाने में विफल।');
    }
  };

  // Instant location auto-fetch on 6-digit PIN code input
  const handlePincodeChange = async (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setFormData(prev => ({ ...prev, pincode: val }));
    setPincodeStatus('');
    setErrorMessage('');

    if (val.length === 6) {
      setPincodeLoading(true);
      try {
        const [pinData] = await Promise.all([
          shippingAPI.lookupPincode(val),
          calculateIThinkRate(val)
        ]);

        if (pinData && pinData.state) {
          setFormData(prev => ({
            ...prev,
            city: pinData.city || prev.city || '',
            district: pinData.district || prev.district || '',
            state: pinData.state,
            landmark: prev.landmark || ''
          }));
          setPincodeStatus(`✓ ${pinData.city || pinData.district}, ${pinData.district} (${pinData.state})`);
        } else {
          setPincodeStatus('');
        }
      } catch {
        // Fallback
      } finally {
        setPincodeLoading(false);
      }
    } else {
      setDynamicShippingFee(null);
      setShippingRateInfo(null);
    }
  };

  const indianStates = [
    'Rajasthan', 'Delhi', 'Uttar Pradesh', 'Maharashtra', 'Karnataka', 
    'Gujarat', 'Haryana', 'Punjab', 'Madhya Pradesh', 'West Bengal', 
    'Tamil Nadu', 'Telangana', 'Andhra Pradesh', 'Bihar', 'Kerala', 
    'Odisha', 'Assam', 'Jharkhand', 'Uttarakhand', 'Himachal Pradesh', 'Goa'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'firstName' || name === 'lastName') {
        const first = name === 'firstName' ? value : (prev.firstName || '');
        const last = name === 'lastName' ? value : (prev.lastName || '');
        updated.name = `${first} ${last}`.trim();
      }
      return updated;
    });
    setErrorMessage('');
  };

  // Active shipping fee and total payable (respecting free shipping rule & iThink dynamic rates)
  const finalShippingFee = isFreeShipping ? 0 : (dynamicShippingFee !== null ? dynamicShippingFee : 50);
  const finalPayableTotal = Math.max(0, subtotal - discountAmount + finalShippingFee);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setErrorMessage('आपकी कार्ट खाली है। कृपया चेकआउट से पहले अचार जोड़ें।');
      return;
    }

    if (!isAuthenticated) {
      setErrorMessage('ऑर्डर करने के लिए कृपया पहले Google से लॉगिन करें।');
      return;
    }

    // 1. Strict Name Validation (First Name & Last Name)
    const cleanFirstName = (formData.firstName || '').trim();
    const cleanLastName = (formData.lastName || '').trim();
    const combinedName = `${cleanFirstName} ${cleanLastName}`.trim() || (formData.name || '').trim();

    if (!cleanFirstName) {
      setErrorMessage('कृपया अपना पहला नाम (First Name) दर्ज करें।');
      return;
    }

    if (!cleanLastName) {
      setErrorMessage('कृपया अपना उपनाम / सरनेम (Last Name) दर्ज करें।');
      return;
    }

    if (combinedName.length < 3) {
      setErrorMessage('कृपया अपना पूरा नाम (कम से कम 3 अक्षर) सही दर्ज करें।');
      return;
    }

    // 2. Strict 10-digit Indian Mobile Number validation
    const cleanPhone = String(formData.phone || '').trim().replace(/^(\+91|91|0)/, '').replace(/\D/g, '').slice(-10);
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setErrorMessage('कृपया 10-अंकों का वैध भारतीय मोबाइल नंबर (उदा. 9876543210) दर्ज करें। यह कूरियर डिलीवरी और WhatsApp ट्रैकिंग अपडेट्स के लिए अनिवार्य है।');
      return;
    }

    // 3. Strict 6-digit PIN code validation
    if (!formData.pincode || !/^\d{6}$/.test(formData.pincode.trim())) {
      setErrorMessage('कृपया 6-अंकों का मान्य भारतीय पिनकोड दर्ज करें।');
      return;
    }

    // 4. Strict Address Line 1 Validation
    if (!formData.addressLine1.trim()) {
      setErrorMessage('कृपया मकान / फ्लैट नं. और बिल्डिंग का नाम दर्ज करें।');
      return;
    }

    // 5. Strict Address Line 2 Validation
    if (!formData.addressLine2.trim()) {
      setErrorMessage('कृपया सड़क / गली / मोहल्ला / कॉलोनी का नाम दर्ज करें।');
      return;
    }

    // 6. Landmark is optional - no longer blocking

    // 7. Strict City Validation
    if (!formData.city.trim()) {
      setErrorMessage('कृपया शहर या कस्बा (City / Town) दर्ज करें।');
      return;
    }

    // 8. Strict District Validation
    if (!formData.district.trim()) {
      setErrorMessage('कृपया अपना ज़िला (District) दर्ज करें।');
      return;
    }

    // 9. Strict State Validation
    if (!formData.state.trim()) {
      setErrorMessage('कृपया राज्य (State) चुनें।');
      return;
    }

    // Auto-save phone to user profile if missing or updated
    if (user && (!user.phone || user.phone !== cleanPhone)) {
      authAPI.updateProfile({ phone: cleanPhone }).catch(() => {});
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const orderPayload = {
        customer: {
          name: combinedName,
          email: user?.email || formData.email,
          phone: cleanPhone
        },
        shippingAddress: {
          fullName: combinedName,
          addressLine1: formData.addressLine1.trim(),
          addressLine2: formData.addressLine2.trim(),
          landmark: (formData.landmark || '').trim(),
          city: formData.city.trim(),
          district: (formData.district || formData.city).trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
          phone: cleanPhone,
          isDefault: true
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
        shippingFee: finalShippingFee,
        carrier: shippingRateInfo?.courierName || 'Express Courier Service',
        zone: shippingRateInfo?.zone || 'Standard Domestic Zone',
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
          amount: Math.round(finalPayableTotal * 100),
          currency: 'INR',
          name: 'Singodia Foods',
          description: `Payment for Order ${createdOrder.orderNumber}`,
          image: window.location.origin + '/logo.png',
          order_id: createdOrder.razorpayOrderId || res.order?.razorpayOrderId || undefined,
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: cleanPhone
          },
          notes: {
            orderNumber: createdOrder.orderNumber,
            address: `${formData.addressLine1}, ${formData.addressLine2}, ${formData.city}, ${formData.pincode}`
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
        <Link to="/allpickles" className="bg-brand-green text-white text-xs font-bold px-6 py-3 rounded-xl">
          Return to Shop
        </Link>
      </div>
    );
  }

  // Require Google Login before Checkout
  if (!isAuthenticated) {
    return (
      <div className="py-14 sm:py-20 bg-[#FAF6EF] min-h-[75vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-10 border border-cream-200 shadow-card text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center mx-auto text-brand-green">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-green bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Account Required
            </span>
            <h2 className="text-2xl font-extrabold text-charcoal font-serif mt-2 mb-1.5">
              Login to Place Order
            </h2>
            <p className="text-xs text-earth-brown leading-relaxed">
              सुरक्षित ऑर्डर प्रोसेसिंग, लाइव ट्रैकिंग और ईमेल रसीद के लिए 1-क्लिक में अपने Google Account से लॉगिन करें।
            </p>
          </div>

          <div className="p-4 bg-cream-50/80 border border-cream-200 rounded-2xl">
            <p className="text-xs font-bold text-gray-700 mb-3">
              Click below to continue checkout:
            </p>
            <GoogleAuthButton redirectPath="/checkout" promptOneTap={true} />
          </div>

          <div className="space-y-2 text-left bg-[#FFFDF9] p-3.5 rounded-2xl border border-cream-200 text-xs text-gray-700">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Secure 1-Click Google Sign-In</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-brand-green shrink-0" />
              <span>Instant WhatsApp & SMS Tracking Updates</span>
            </div>
          </div>
        </div>
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
            Fill in your complete delivery details to receive your fresh handcrafted Rajasthani pickles.
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
                    Contact & Receiver Information
                  </h2>
                </div>

                {/* Verified Customer Card */}
                {user && (
                  <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-emerald-300 object-cover shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0">
                          {user.name?.[0] || 'U'}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 truncate flex items-center gap-1.5">
                          <span>{user.name}</span>
                          <span className="text-[10px] bg-emerald-200/70 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full">
                            Google Verified
                          </span>
                        </p>
                        <p className="text-[11px] text-gray-600 truncate">{user.email}</p>
                      </div>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  </div>
                )}

                <div className="space-y-4 pt-1">
                  {/* First Name & Last Name (अलग-अलग इनपुट) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-charcoal flex items-center justify-between mb-1.5">
                        <span className="flex items-center gap-1">
                          <span>First Name (पहला नाम)</span>
                          <span className="text-red-500 font-extrabold">*</span>
                        </span>
                      </label>
                      <input
                        type="text"
                        required
                        name="firstName"
                        placeholder="e.g. Ramesh"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 text-xs bg-cream-50 border border-cream-300 rounded-xl focus:outline-none focus:border-brand-green font-medium text-charcoal"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-charcoal flex items-center justify-between mb-1.5">
                        <span className="flex items-center gap-1">
                          <span>Last Name (उपनाम / सरनेम)</span>
                          <span className="text-red-500 font-extrabold">*</span>
                        </span>
                      </label>
                      <input
                        type="text"
                        required
                        name="lastName"
                        placeholder="e.g. Singodia"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 text-xs bg-cream-50 border border-cream-300 rounded-xl focus:outline-none focus:border-brand-green font-medium text-charcoal"
                      />
                    </div>
                  </div>

                  {/* Phone Number Input with +91 Prefix */}
                  <div>
                    <label className="text-xs font-bold text-charcoal flex items-center justify-between mb-1.5">
                      <span className="flex items-center gap-1">
                        <span>Mobile Number (मोबाइल)</span>
                        <span className="text-red-500 font-extrabold">*</span>
                      </span>
                      <span className="text-[10px] text-amber-900 bg-amber-100/80 font-bold px-2 py-0.5 rounded-full border border-amber-300">
                        10-Digit Mobile Required
                      </span>
                    </label>
                    <div className="flex rounded-xl overflow-hidden border border-cream-300 bg-cream-50 focus-within:border-brand-green focus-within:ring-1 focus-within:ring-brand-green shadow-xs">
                      <span className="px-3 py-2.5 bg-cream-200/60 text-xs font-bold text-gray-700 flex items-center border-r border-cream-300 select-none">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        name="phone"
                        placeholder="9876543210"
                        value={formData.phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setFormData({ ...formData, phone: val });
                          setErrorMessage('');
                        }}
                        className="w-full px-3.5 py-2.5 text-xs bg-transparent focus:outline-none font-semibold text-charcoal tracking-wide placeholder:font-normal placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Address Section */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card space-y-5">
                
                {/* Section Header with Select Address Action */}
                <div className="flex items-center justify-between pb-3 border-b border-cream-100 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-brand-green text-white text-xs font-bold flex items-center justify-center">
                      2
                    </span>
                    <h2 className="text-base font-bold text-charcoal font-serif">
                      Delivery Address (डिलीवरी पता)
                    </h2>
                  </div>

                  {/* Top "Select Address" Button */}
                  <button
                    type="button"
                    onClick={() => setIsAddressModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cream-100 hover:bg-cream-200 border border-brand-green/30 text-brand-green font-bold text-xs transition-all shadow-2xs hover:scale-102"
                  >
                    <MapPin className="w-3.5 h-3.5 text-brand-green" />
                    <span>पते चुनें / बदलें ({user?.addresses?.length || 0} Saved)</span>
                  </button>
                </div>

                {/* Active Address Status Pill */}
                {formData.pincode && formData.city && (
                  <div className="p-3 bg-[#FBF8F1] rounded-2xl border border-cream-200 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        <Home className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-charcoal truncate">
                          {formData.addressLine1 || 'Saved Address'}, {formData.city}{formData.district && formData.district !== formData.city ? `, ${formData.district}` : ''} - {formData.pincode}
                        </p>
                        <p className="text-[11px] text-earth-brown truncate">
                          Recipient: {formData.name || user?.name} • +91 {formData.phone}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAddressModalOpen(true)}
                      className="text-brand-green font-bold text-xs underline shrink-0 hover:text-brand-green-dark"
                    >
                      बदलें
                    </button>
                  </div>
                )}

                {/* Address Form Inputs */}
                <div className="space-y-4">
                  
                  {/* Address Line 1 */}
                  <div>
                    <label className="text-xs font-bold text-charcoal flex items-center gap-1 mb-1.5">
                      <span>House / Flat No., Building / Apartment Name (मकान / फ्लैट नं. व बिल्डिंग)</span>
                      <span className="text-red-500 font-extrabold">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      name="addressLine1"
                      placeholder="e.g. Flat 302, Shanti Kunj, Block B"
                      value={formData.addressLine1}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 text-xs bg-cream-50 border border-cream-300 rounded-xl focus:outline-none focus:border-brand-green font-medium"
                    />
                  </div>

                  {/* Address Line 2 */}
                  <div>
                    <label className="text-xs font-bold text-charcoal flex items-center gap-1 mb-1.5">
                      <span>Street / Colony / Area (सड़क / गली / मोहल्ला / क्षेत्र)</span>
                      <span className="text-red-500 font-extrabold">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      name="addressLine2"
                      placeholder="e.g. Station Road, Near Main Market"
                      value={formData.addressLine2}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 text-xs bg-cream-50 border border-cream-300 rounded-xl focus:outline-none focus:border-brand-green font-medium"
                    />
                  </div>

                  {/* Landmark (Optional) */}
                  <div>
                    <label className="text-xs font-bold text-charcoal flex items-center justify-between mb-1.5">
                      <span>Famous Landmark (प्रसिद्ध लैंडमार्क / पहचान)</span>
                      <span className="text-[11px] text-earth-brown font-normal italic">(Optional / वैकल्पिक)</span>
                    </label>
                    <input
                      type="text"
                      name="landmark"
                      placeholder="e.g. Near Jain Mandir / Opp. SBI Bank (वैकल्पिक)"
                      value={formData.landmark}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 text-xs bg-cream-50 border border-cream-300 rounded-xl focus:outline-none focus:border-brand-green font-medium"
                    />
                  </div>

                  {/* City & District (Separated into distinct fields) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-charcoal flex items-center gap-1 mb-1.5">
                        <span>City / Town (शहर / कस्बा)</span>
                        <span className="text-red-500 font-extrabold">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        name="city"
                        placeholder="e.g. Sujangarh"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 text-xs bg-cream-50 border border-cream-300 rounded-xl focus:outline-none focus:border-brand-green font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-charcoal flex items-center gap-1 mb-1.5">
                        <span>District (ज़िला)</span>
                        <span className="text-red-500 font-extrabold">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        name="district"
                        placeholder="e.g. Churu / Jaipur"
                        value={formData.district}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 text-xs bg-cream-50 border border-cream-300 rounded-xl focus:outline-none focus:border-brand-green font-medium"
                      />
                    </div>
                  </div>

                  {/* PIN Code & State (Placed next to City & District) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-charcoal flex items-center gap-1 mb-1.5">
                        <span>PIN Code (पिनकोड)</span>
                        <span className="text-red-500 font-extrabold">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          maxLength={6}
                          name="pincode"
                          placeholder="e.g. 331507 or 302001"
                          value={formData.pincode}
                          onChange={handlePincodeChange}
                          className="w-full px-3.5 py-2.5 text-xs bg-cream-50 border border-cream-300 rounded-xl focus:outline-none focus:border-brand-green font-bold tracking-wider text-charcoal"
                        />
                        {pincodeLoading && (
                          <div className="absolute right-3.5 top-2.5 text-brand-green">
                            <Loader2 className="w-4 h-4 animate-spin" />
                          </div>
                        )}
                      </div>
                      {pincodeStatus && (
                        <p className={`text-[11px] mt-1 font-semibold ${
                          pincodeStatus.startsWith('✓') ? 'text-emerald-700' : 'text-amber-800'
                        }`}>
                          {pincodeStatus}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-xs font-bold text-charcoal flex items-center gap-1 mb-1.5">
                        <span>State (राज्य)</span>
                        <span className="text-red-500 font-extrabold">*</span>
                      </label>
                      <select
                        name="state"
                        required
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

                  {/* Optional Delivery Instructions */}
                  <div>
                    <label className="text-xs font-bold text-charcoal block mb-1">
                      Delivery Instructions (डिलीवरी निर्देश - वैकल्पिक)
                    </label>
                    <textarea
                      rows="2"
                      name="customerNotes"
                      placeholder="e.g. Please call before delivery or ring bell twice."
                      value={formData.customerNotes}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 text-xs bg-cream-50 border border-cream-300 rounded-xl focus:outline-none focus:border-brand-green font-medium"
                    />
                  </div>

                </div>

                {/* Clean Express Delivery Card */}
                <div className="p-4 rounded-2xl bg-cream-50/80 border border-cream-200/90 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-brand-green" />
                      <span className="text-xs font-bold text-charcoal font-serif">
                        Express Home Delivery (होम डिलीवरी)
                      </span>
                    </div>
                    {shippingLoading ? (
                      <span className="text-[11px] text-brand-green flex items-center gap-1 font-semibold">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>जांच जारी...</span>
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        {isFreeShipping && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-300">
                            मुफ़्त डिलीवरी
                          </span>
                        )}
                        <span className="text-xs font-black text-brand-green bg-white px-2.5 py-0.5 rounded-full border border-cream-300 shadow-2xs">
                          {finalShippingFee === 0 ? 'FREE' : formatPrice(finalShippingFee)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-[11px] text-gray-700 leading-relaxed flex flex-wrap items-center justify-between gap-y-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                      <span>• अपेक्षित समय: <strong>{shippingRateInfo?.expectedDeliveryDays || '2 - 4 कार्य दिवस'}</strong></span>
                      {shippingRateInfo?.courierName && (
                        <span>• कूरियर: <strong className="capitalize">{shippingRateInfo.courierName}</strong></span>
                      )}
                      <span>• 100% सुरक्षित पैकेजिंग</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsDeliveryInfoOpen(true)}
                      className="text-[11px] font-bold text-brand-green hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>डिलीवरी नियम व जानकारी</span>
                    </button>
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
                          <span>100% Secure Online Payment (ऑनलाइन पेमेंट)</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                            Instant Confirmation
                          </span>
                        </span>
                        <p className="text-xs text-earth-brown mt-0.5">
                          UPI, Debit/Credit Cards व Net Banking द्वारा तुरंत और सुरक्षित भुगतान करें।
                        </p>
                      </div>
                    </div>
                    <CreditCard className="w-5 h-5 text-brand-green shrink-0" />
                  </div>

                  {/* Supported Payment Logos (No text names, clean brand badges) */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-cream-200/60">
                    {/* Google Pay */}
                    <div className="h-7 px-2.5 bg-white rounded-lg border border-gray-200 shadow-2xs flex items-center justify-center shrink-0" title="Google Pay">
                      <span className="text-xs font-bold text-gray-800 flex items-center tracking-tight">
                        <span className="text-[#4285F4] font-black">G</span>
                        <span className="text-gray-700 font-semibold ml-0.5">Pay</span>
                      </span>
                    </div>

                    {/* PhonePe */}
                    <div className="h-7 px-2.5 bg-[#5f259f] rounded-lg shadow-2xs flex items-center justify-center gap-1 shrink-0" title="PhonePe">
                      <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center text-[#5f259f] text-[9.5px] font-black leading-none">
                        पे
                      </div>
                      <span className="text-white font-extrabold text-[11px] tracking-tight">PhonePe</span>
                    </div>

                    {/* Paytm */}
                    <div className="h-7 px-2.5 bg-white rounded-lg border border-gray-200 shadow-2xs flex items-center justify-center shrink-0" title="Paytm">
                      <span className="text-xs font-black tracking-tighter flex items-baseline">
                        <span className="text-[#002E6E]">pay</span>
                        <span className="text-[#00BAF2]">tm</span>
                      </span>
                    </div>

                    {/* BHIM UPI */}
                    <div className="h-7 px-2 bg-white rounded-lg border border-gray-200 shadow-2xs flex items-center justify-center gap-1 shrink-0" title="BHIM UPI">
                      <span className="text-[10px] font-black tracking-wider text-[#002E6E]">UPI</span>
                      <div className="w-2.5 h-3 flex flex-col justify-center gap-0.5">
                        <span className="w-2.5 h-1 bg-[#F47920] skew-x-12 rounded-2xs block" />
                        <span className="w-2.5 h-1 bg-[#0FA348] -skew-x-12 rounded-2xs block" />
                      </div>
                    </div>

                    {/* RuPay */}
                    <div className="h-7 px-2 bg-white rounded-lg border border-gray-200 shadow-2xs flex items-center justify-center shrink-0" title="RuPay">
                      <span className="text-[10px] font-black tracking-tight text-[#0C2340]">Ru</span>
                      <span className="text-[10px] font-black tracking-tight text-[#E31837]">Pay</span>
                      <span className="text-[8px] font-black text-[#0C2340] ml-0.5">❯❯</span>
                    </div>

                    {/* VISA / Mastercard */}
                    <div className="h-7 px-2 bg-white rounded-lg border border-gray-200 shadow-2xs flex items-center justify-center gap-1 shrink-0" title="Visa / Mastercard">
                      <span className="text-[11px] font-black italic tracking-wider text-[#1A1F71]">VISA</span>
                      <div className="flex -space-x-1 items-center ml-0.5">
                        <div className="w-3 h-3 rounded-full bg-[#EB001B]" />
                        <div className="w-3 h-3 rounded-full bg-[#F79E1B] opacity-90" />
                      </div>
                    </div>
                  </div>
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

                  <div className="flex justify-between items-center">
                    <span className="text-earth-brown">
                      Delivery Charges (डिलीवरी शुल्क):
                    </span>
                    <span className="font-bold text-charcoal">
                      {shippingLoading ? (
                        <span className="text-gray-400 text-[11px]">Calculating...</span>
                      ) : finalShippingFee === 0 ? (
                        <span className="text-emerald-700 font-bold">FREE</span>
                      ) : (
                        formatPrice(finalShippingFee)
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-lg font-extrabold text-charcoal pt-3 border-t border-cream-200">
                    <span>Payable Amount:</span>
                    <span className="text-brand-green">{formatPrice(finalPayableTotal)}</span>
                  </div>
                </div>

                {/* Terms & Policies Consent Box */}
                <div className="p-3.5 bg-cream-50/90 rounded-2xl border border-cream-200 text-[11px] text-earth-brown leading-relaxed space-y-1.5">
                  <p className="text-charcoal font-medium">
                    ऑर्डर करके आप सिंगोदिया फूड्स की{' '}
                    <Link to="/terms" target="_blank" rel="noopener noreferrer" className="text-brand-green font-bold underline hover:text-brand-green-light">
                      Terms & Conditions
                    </Link>
                    ,{' '}
                    <Link to="/refund-policy" target="_blank" rel="noopener noreferrer" className="text-brand-green font-bold underline hover:text-brand-green-light">
                      Replacement Policy
                    </Link>
                    ,{' '}
                    <Link to="/shipping-policy" target="_blank" rel="noopener noreferrer" className="text-brand-green font-bold underline hover:text-brand-green-light">
                      Shipping Policy
                    </Link>{' '}
                    और{' '}
                    <Link to="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-brand-green font-bold underline hover:text-brand-green-light">
                      Privacy Policy
                    </Link>{' '}
                    से सहमत होते हैं।
                  </p>
                  <p className="text-[10px] text-earth-brown/90 leading-tight">
                    • <strong>केवल रिप्लेसमेंट (No Cash Refund):</strong> डैमेज/लीकेज पर डिलीवरी के 48 घंटे में अनबॉक्सिंग वीडियो भेजने पर नया जार भेजा जाएगा।<br />
                    • <strong>कैंसलेशन:</strong> डिस्पैच से पहले केवल कॉल (<a href="tel:+917597966707" className="text-brand-green font-bold underline">+91 75979 66707</a>) करके ही ऑर्डर रद्द करवाया जा सकता है।
                  </p>
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
                        Place Order ({formatPrice(finalPayableTotal)})
                      </span>
                    </>
                  )}
                </button>

                <div className="p-3 bg-cream-50 rounded-xl text-[11px] text-earth-brown space-y-1">
                  <p className="flex items-center gap-1 font-semibold text-charcoal">
                    <Truck className="w-3.5 h-3.5 text-brand-green" /> Express Pan-India Dispatch directly from Sujangarh, Rajasthan
                  </p>
                  <p>• Carefully packed in leak-proof protective cushioning</p>
                  <p>• Live SMS and WhatsApp tracking will be shared upon dispatch</p>
                </div>

              </div>
            </div>

          </div>
        </form>

      </div>

      {/* Address Selection & Add Address Popup Modal */}
      <AddressSelectModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        addresses={user?.addresses || []}
        selectedAddressId={selectedAddressId}
        onSelectAddress={handleSelectAddressFromModal}
        onSaveNewAddress={handleSaveNewAddressFromModal}
        onSetDefault={handleSetDefaultInsideModal}
        onDeleteAddress={handleDeleteAddressFromModal}
      />

      {/* Clean Customer-Facing Delivery Info Popup Modal */}
      {isDeliveryInfoOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 overflow-y-auto cursor-pointer"
          onClick={() => setIsDeliveryInfoOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-cream-200 space-y-4 animate-in zoom-in-95 duration-200 my-auto cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-cream-100">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-brand-green" />
                <h3 className="text-base font-bold text-charcoal font-serif">
                  डिलीवरी व शिपिंग जानकारी
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDeliveryInfoOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-gray-700 leading-relaxed">
              <div className="flex items-start gap-2.5 p-3 bg-cream-50/90 rounded-2xl border border-cream-200/60">
                <Clock className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                <div>
                  <strong className="text-charcoal block">24 घंटे में डिस्पैच:</strong>
                  आपका आर्डर सुजानगढ़ (राजस्थान) से 24 घंटे के भीतर ताज़ा पैक करके रवाना किया जाता है।
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 bg-cream-50/90 rounded-2xl border border-cream-200/60">
                <Truck className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                <div>
                  <strong className="text-charcoal block">विश्वसनीय कूरियर पार्टनर:</strong>
                  Delhivery, BlueDart और DTDC जैसी प्रमुख कूरियर सेवाओं द्वारा सुरक्षित होम डिलीवरी।
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 bg-cream-50/90 rounded-2xl border border-cream-200/60">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-charcoal block">लीक-प्रूफ सेफ पैकेजिंग:</strong>
                  अचार के जार को मल्टी-लेयर प्रोटेक्टिव कुशनिंग में पैक किया जाता है ताकि रास्ते में कोई लीकेज या टूट-फूट न हो।
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 bg-cream-50/90 rounded-2xl border border-cream-200/60">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-charcoal block">लाइव ट्रैकिंग:</strong>
                  पार्सल डिस्पैच होते ही आपको WhatsApp व SMS पर लाइव ट्रैकिंग लिंक मिल जाता है।
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsDeliveryInfoOpen(false)}
              className="w-full bg-brand-green hover:bg-brand-green-light text-white font-bold text-xs py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              समझ गया (Close)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;

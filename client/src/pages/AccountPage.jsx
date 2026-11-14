import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  User, Package, MapPin, Heart, LogOut, Plus, Trash2, 
  CheckCircle, Clock, Truck, ShieldAlert, ArrowRight, Eye,
  Loader2, Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { orderAPI, shippingAPI } from '../services/api';
import { formatPrice } from '../utils/formatCurrency';
import { ProductCard } from '../components/product/ProductCard';
import { OrderTrackingModal } from '../components/common/OrderTrackingModal';

export const AccountPage = () => {
  const { user, isAuthenticated, logout, updateProfile, addAddress, deleteAddress, setDefaultAddress } = useAuth();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTab = searchParams.get('tab') || 'orders';
  const [activeTab, setActiveTabState] = useState(urlTab);

  useEffect(() => {
    if (urlTab && urlTab !== activeTab) {
      setActiveTabState(urlTab);
    }
  }, [urlTab]);

  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    setSearchParams({ tab }, { replace: true, preventScrollReset: true });
  };

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState(null);

  // Address form state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeStatus, setPincodeStatus] = useState('');
  const [addressError, setAddressError] = useState('');

  const [newAddress, setNewAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    district: '',
    state: 'Rajasthan',
    pincode: '',
    isDefault: false
  });

  // Profile Form
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [profileSuccess, setProfileSuccess] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/account');
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await orderAPI.getMyOrders();
        if (Array.isArray(res.orders)) {
          // Only show successfully paid completed orders (never pending or declined)
          setOrders(res.orders.filter(o => o.paymentStatus === 'completed'));
        }
      } catch (err) {
        console.warn('Orders fetch note:', err);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, [isAuthenticated, navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ name: profileName, phone: profilePhone });
      setProfileSuccess('Profile updated successfully!');
      toast.success('Profile updated successfully!');
      setTimeout(() => setProfileSuccess(''), 3000);
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    }
  };

  const handlePincodeChange = async (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setNewAddress(prev => ({ ...prev, pincode: val }));
    setPincodeStatus('');
    setAddressError('');

    if (val.length === 6) {
      setPincodeLoading(true);
      try {
        const details = await shippingAPI.lookupPincode(val);
        if (details && details.state) {
          setNewAddress(prev => ({
            ...prev,
            city: details.city || prev.city || '',
            district: details.district || prev.district || '',
            state: details.state,
            landmark: prev.landmark || ''
          }));
          setPincodeStatus(`✓ ${details.city || details.district}, ${details.district} (${details.state})`);
        } else {
          setPincodeStatus('');
        }
      } catch {
        // Fallback
      } finally {
        setPincodeLoading(false);
      }
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setAddressError('');

    if (!newAddress.fullName.trim()) {
      setAddressError('कृपया प्राप्तकर्ता का पूरा नाम दर्ज करें।');
      return;
    }

    const cleanPhone = newAddress.phone.replace(/\D/g, '').slice(-10);
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setAddressError('कृपया 10-अंकों का मान्य मोबाइल नंबर दर्ज करें।');
      return;
    }

    if (!newAddress.addressLine1.trim()) {
      setAddressError('कृपया मकान / फ्लैट नं. व बिल्डिंग का नाम दर्ज करें।');
      return;
    }

    if (!newAddress.addressLine2.trim()) {
      setAddressError('कृपया सड़क / गली / मोहल्ला / क्षेत्र दर्ज करें।');
      return;
    }

    if (!newAddress.landmark.trim()) {
      setAddressError('कृपया कोई लैंडमार्क (उदा. मुख्य बाजार / मंदिर के पास) दर्ज करें।');
      return;
    }

    if (!newAddress.city.trim()) {
      setAddressError('कृपया शहर या कस्बा (City / Town) दर्ज करें।');
      return;
    }

    if (!newAddress.district.trim()) {
      setAddressError('कृपया अपना ज़िला (District) दर्ज करें।');
      return;
    }

    if (!/^\d{6}$/.test(newAddress.pincode.trim())) {
      setAddressError('कृपया 6-अंकों का मान्य पिनकोड दर्ज करें।');
      return;
    }

    if (!newAddress.state.trim()) {
      setAddressError('कृपया राज्य दर्ज करें।');
      return;
    }

    setSavingAddress(true);
    try {
      await addAddress({
        ...newAddress,
        phone: cleanPhone,
        district: newAddress.district.trim(),
        isDefault: newAddress.isDefault || (!user?.addresses || user.addresses.length === 0)
      });
      toast.success('पता सफलतापूर्वक सहेजा गया!');
      setShowAddressForm(false);
      setPincodeStatus('');
      setNewAddress({
        fullName: user?.name || '',
        phone: user?.phone || '',
        addressLine1: '',
        addressLine2: '',
        landmark: '',
        city: '',
        district: '',
        state: 'Rajasthan',
        pincode: '',
        isDefault: false
      });
    } catch (err) {
      setAddressError(err.message || 'पता सहेजने में विफल');
      toast.error(err.message || 'पता सहेजने में विफल');
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (window.confirm('क्या आप वाकई इस पते को हटाना चाहते हैं?')) {
      try {
        await deleteAddress(id);
        toast.success('पता हटा दिया गया');
      } catch (err) {
        toast.error(err.message || 'पता हटाने में विफल');
      }
    }
  };

  const handleSetDefaultAddress = async (id) => {
    try {
      await setDefaultAddress(id);
      toast.success('मुख्य पता अपडेट हो गया!');
    } catch (err) {
      toast.error(err.message || 'मुख्य पता सेट करने में विफल');
    }
  };

  return (
    <div className="py-10 sm:py-16 bg-[#FAF6EF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-cream-200 text-brand-green flex items-center justify-center text-xl font-bold font-serif">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-charcoal font-serif">
                Namaste, {user?.name}!
              </h1>
              <p className="text-xs text-earth-brown mt-0.5">
                {user?.email} • Customer since {new Date(user?.createdAt || Date.now()).getFullYear()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="px-4 py-2.5 rounded-xl border border-cream-300 text-charcoal hover:bg-cream-100 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-4 h-4 text-chilli" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Layout: Tab Navigation Sidebar + Main Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-start">
          
          {/* Navigation Tabs (Horizontal Strip on Mobile, Vertical Sidebar on Desktop) */}
          <div className="lg:col-span-3 bg-white rounded-2xl p-2 sm:p-3 border border-cream-200 shadow-card flex flex-row lg:flex-col gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none select-none">
            {[
              { id: 'orders', label: 'Order History', mobileLabel: 'Orders', icon: Package },
              { id: 'addresses', label: 'Saved Addresses', mobileLabel: 'Addresses', icon: MapPin },
              { id: 'wishlist', label: `My Wishlist (${wishlist.length})`, mobileLabel: `Wishlist (${wishlist.length})`, icon: Heart },
              { id: 'profile', label: 'Profile Details', mobileLabel: 'Profile', icon: User },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-[110px] sm:min-w-[130px] lg:min-w-0 lg:w-full flex items-center justify-center lg:justify-start gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-brand-green text-white shadow-xs'
                      : 'text-charcoal bg-cream-50/70 lg:bg-transparent hover:bg-cream-100 hover:text-brand-green'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.mobileLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9 bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card min-h-[500px]">
            
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-lg font-bold text-charcoal font-serif mb-6 pb-2 border-b border-cream-100">
                  Your Orders
                </h2>

                {loadingOrders ? (
                  <p className="text-xs text-earth-brown">Loading your order history...</p>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-cream-300 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-charcoal mb-1">No orders placed yet</h3>
                    <p className="text-xs text-earth-brown mb-4">
                      Explore our authentic handcrafted pickles and enjoy tradition delivered to your doorstep.
                    </p>
                    <Link
                      to="/shop"
                      className="inline-block bg-brand-green text-white text-xs font-bold px-6 py-2.5 rounded-xl"
                    >
                      Shop Pickles
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((ord) => (
                      <div
                        key={ord._id || ord.orderNumber}
                        className="p-5 rounded-2xl border border-cream-200 bg-cream-50/50 space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-cream-200/60">
                          <div>
                            <span className="text-xs font-bold text-brand-green block">
                              Order #{ord.orderNumber}
                            </span>
                            <span className="text-[11px] text-earth-brown">
                              Placed on {new Date(ord.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              ord.orderStatus === 'Delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ord.orderStatus === 'Shipped'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              Status: {ord.orderStatus || 'Placed'}
                            </span>
                            <span className="text-xs font-bold text-charcoal">
                              {formatPrice(ord.totalAmount)}
                            </span>
                          </div>
                        </div>

                        {/* Items in order */}
                        <div className="space-y-2">
                          {ord.items?.map((item, i) => (
                            <div key={i} className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-charcoal">
                                {item.name} ({item.weight}) × {item.quantity}
                              </span>
                              <span className="text-earth-brown">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-2.5 flex flex-wrap justify-between items-center gap-2 text-xs border-t border-cream-200/60">
                          <span className="text-[11px] text-earth-brown">
                            Payment: <strong className="text-charcoal uppercase">{ord.paymentMethod}</strong> ({ord.paymentStatus})
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedTrackingOrder(ord)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-green hover:bg-brand-green-light text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>Track Order (लाइव ट्रैकिंग)</span>
                            </button>

                            <Link
                              to={`/order-confirmation/${ord.orderNumber}`}
                              className="text-brand-green font-bold hover:underline flex items-center gap-1 text-[11px] px-2 py-1"
                            >
                              <span>Receipt</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div>
                <div className="flex items-center justify-between mb-6 pb-2 border-b border-cream-100">
                  <div>
                    <h2 className="text-lg font-bold text-charcoal font-serif">
                      Saved Delivery Addresses
                    </h2>
                    <p className="text-xs text-earth-brown mt-0.5">
                      अपने सुरक्षित पते प्रबंधित करें ताकि चेकआउट तेज़ और आसान हो सके
                    </p>
                  </div>
                  {!showAddressForm && (
                    <button
                      onClick={() => {
                        setShowAddressForm(true);
                        setAddressError('');
                        setPincodeStatus('');
                      }}
                      className="flex items-center gap-1.5 text-xs font-bold bg-brand-green hover:bg-brand-green-dark text-white px-4 py-2.5 rounded-xl transition-all shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ नया पता जोड़ें</span>
                    </button>
                  )}
                </div>

                {showAddressForm && (
                  <form onSubmit={handleAddAddress} className="p-5 sm:p-6 rounded-2xl bg-white border border-cream-200 mb-8 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between pb-3 border-b border-cream-100">
                      <h3 className="text-sm font-bold text-charcoal font-serif flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-brand-green" />
                        <span>नया डिलीवरी पता जोड़ें (Add Delivery Address)</span>
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddressForm(false);
                          setAddressError('');
                          setPincodeStatus('');
                        }}
                        className="text-xs text-gray-400 hover:text-charcoal font-semibold"
                      >
                        ✕ बंद करें
                      </button>
                    </div>

                    {addressError && (
                      <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                        {addressError}
                      </div>
                    )}

                    {/* Full Name & Phone Number */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="text-xs font-bold text-charcoal block mb-1">
                          पूरा नाम (Full Name) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Ramesh Chandra"
                          value={newAddress.fullName}
                          onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs bg-cream-50 border border-cream-300 rounded-xl focus:outline-none focus:border-brand-green font-medium"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-charcoal block mb-1">
                          मोबाइल नंबर (10-Digit Mobile) <span className="text-red-500">*</span>
                        </label>
                        <div className="flex rounded-xl overflow-hidden border border-cream-300 bg-cream-50">
                          <span className="px-3 py-2.5 bg-cream-200/60 text-xs font-bold text-gray-700 border-r border-cream-300">
                            +91
                          </span>
                          <input
                            type="tel"
                            required
                            maxLength={10}
                            placeholder="9876543210"
                            value={newAddress.phone}
                            onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                            className="w-full px-3.5 py-2.5 text-xs bg-transparent focus:outline-none font-semibold text-charcoal"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Address Line 1 */}
                    <div>
                      <label className="text-xs font-bold text-charcoal block mb-1">
                        मकान / फ्लैट नं., बिल्डिंग / अपार्टमेंट का नाम <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Flat 302, Prem Niwas, Tower B"
                        value={newAddress.addressLine1}
                        onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-cream-50 border border-cream-300 rounded-xl focus:outline-none focus:border-brand-green font-medium"
                      />
                    </div>

                    {/* Address Line 2 */}
                    <div>
                      <label className="text-xs font-bold text-charcoal block mb-1">
                        सड़क / गली / मोहल्ला / क्षेत्र (Street / Area) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Bagreche Bass, Near Station Road"
                        value={newAddress.addressLine2}
                        onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-cream-50 border border-cream-300 rounded-xl focus:outline-none focus:border-brand-green font-medium"
                      />
                    </div>

                    {/* Landmark */}
                    <div>
                      <label className="text-xs font-bold text-charcoal block mb-1">
                        प्रसिद्ध लैंडमार्क (Landmark / पहचान) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Near Jain Mandir / Old Post Office"
                        value={newAddress.landmark}
                        onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-cream-50 border border-cream-300 rounded-xl focus:outline-none focus:border-brand-green font-medium"
                      />
                    </div>

                    {/* City & District (Separated into distinct fields) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="text-xs font-bold text-charcoal block mb-1">
                          शहर / कस्बा (City / Town) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Sujangarh"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs bg-cream-50 border border-cream-300 rounded-xl focus:outline-none focus:border-brand-green font-medium"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-charcoal block mb-1">
                          ज़िला (District) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Churu / Jaipur"
                          value={newAddress.district}
                          onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs bg-cream-50 border border-cream-300 rounded-xl focus:outline-none focus:border-brand-green font-medium"
                        />
                      </div>
                    </div>

                    {/* PIN Code & State (Placed near City & District) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="text-xs font-bold text-charcoal block mb-1">
                          पिनकोड (PIN Code) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            maxLength={6}
                            placeholder="e.g. 331507"
                            value={newAddress.pincode}
                            onChange={handlePincodeChange}
                            className="w-full px-3.5 py-2.5 text-xs bg-cream-50 border border-cream-300 rounded-xl focus:outline-none focus:border-brand-green font-bold tracking-wider"
                          />
                          {pincodeLoading && (
                            <div className="absolute right-3 top-3 text-brand-green">
                              <Loader2 className="w-4 h-4 animate-spin" />
                            </div>
                          )}
                        </div>
                        {pincodeStatus && (
                          <p className="text-[11px] mt-1 font-semibold text-emerald-700">
                            {pincodeStatus}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="text-xs font-bold text-charcoal block mb-1">
                          राज्य (State) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Rajasthan"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs bg-cream-50 border border-cream-300 rounded-xl focus:outline-none focus:border-brand-green font-medium"
                        />
                      </div>
                    </div>

                    {/* Default Address Checkbox */}
                    <div className="pt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-charcoal">
                        <input
                          type="checkbox"
                          checked={newAddress.isDefault}
                          onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                          className="w-4 h-4 accent-brand-green rounded"
                        />
                        <span>इस पते को मुख्य पता (Default Address) बनाएं</span>
                      </label>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2.5 pt-3 border-t border-cream-200">
                      <button
                        type="submit"
                        disabled={savingAddress}
                        className="px-5 py-2.5 bg-brand-green hover:bg-brand-green-dark text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 disabled:opacity-60"
                      >
                        <Check className="w-4 h-4" />
                        <span>{savingAddress ? 'सहेज रहे हैं...' : 'पता सहेजें (Save Address)'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddressForm(false);
                          setAddressError('');
                          setPincodeStatus('');
                        }}
                        className="px-4 py-2.5 border border-cream-300 hover:bg-cream-100 text-charcoal text-xs font-bold rounded-xl transition-colors"
                      >
                        रद्द करें (Cancel)
                      </button>
                    </div>
                  </form>
                )}

                {user?.addresses?.length === 0 ? (
                  <div className="p-8 text-center bg-white rounded-3xl border border-cream-200">
                    <MapPin className="w-8 h-8 text-cream-300 mx-auto mb-2" />
                    <p className="text-xs text-earth-brown font-medium">अभी तक कोई सहेजा गया पता नहीं है। तेज़ी से चेकआउट करने के लिए ऊपर से नया पता जोड़ें।</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user?.addresses?.map((addr) => (
                      <div 
                        key={addr._id} 
                        className={`p-4 sm:p-5 rounded-2xl border transition-all text-xs space-y-1.5 relative ${
                          addr.isDefault 
                            ? 'border-brand-green/40 bg-brand-green/5 shadow-sm' 
                            : 'border-cream-200 bg-white hover:border-cream-300 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-charcoal text-sm">{addr.fullName}</span>
                            {addr.isDefault && (
                              <span className="px-2 py-0.5 rounded-full bg-brand-green text-white text-[10px] font-bold">
                                Default
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => handleDeleteAddress(addr._id)}
                            className="text-gray-400 hover:text-chilli p-1 transition-colors"
                            title="Delete address"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="text-charcoal font-medium">{addr.addressLine1}</p>
                        {addr.addressLine2 && (
                          <p className="text-earth-brown">{addr.addressLine2}</p>
                        )}
                        {addr.landmark && (
                          <p className="text-earth-brown text-[11px]">
                            <span className="font-semibold text-charcoal">लैंडमार्क:</span> {addr.landmark}
                          </p>
                        )}
                        <p className="text-earth-brown font-medium">
                          {addr.city}{addr.district ? `, ${addr.district}` : ''}, {addr.state} — <span className="font-bold text-charcoal">{addr.pincode}</span>
                        </p>
                        <p className="text-charcoal font-semibold pt-1 text-[11px]">
                          फोन: +91 {addr.phone}
                        </p>

                        {!addr.isDefault && setDefaultAddress && (
                          <div className="pt-2 border-t border-cream-100 flex justify-end">
                            <button
                              type="button"
                              onClick={() => handleSetDefaultAddress(addr._id)}
                              className="text-[11px] text-brand-green hover:underline font-bold"
                            >
                              मुख्य पता बनाएं (Set as Default)
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div>
                <h2 className="text-lg font-bold text-charcoal font-serif mb-6 pb-2 border-b border-cream-100">
                  Your Wishlist
                </h2>

                {wishlist.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="w-12 h-12 text-cream-300 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-charcoal mb-1">Your wishlist is empty</h3>
                    <p className="text-xs text-earth-brown mb-4">
                      Save jars you'd love to savor on your next order.
                    </p>
                    <Link to="/shop" className="bg-brand-green text-white text-xs font-bold px-6 py-2.5 rounded-xl">
                      Explore All Pickles
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.map((item) => (
                      <ProductCard key={item._id || item.slug} product={item} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="max-w-md">
                <h2 className="text-lg font-bold text-charcoal font-serif mb-6 pb-2 border-b border-cream-100">
                  Profile Information
                </h2>

                {profileSuccess && (
                  <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold">
                    {profileSuccess}
                  </div>
                )}

                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-charcoal block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-cream-50 border border-cream-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-charcoal block mb-1">Email Address (Read-only)</label>
                    <input
                      type="email"
                      disabled
                      value={user?.email || ''}
                      className="w-full px-3.5 py-2.5 text-xs bg-cream-200/50 border border-cream-300 rounded-xl text-gray-500 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-charcoal block mb-1">Mobile Phone</label>
                    <input
                      type="tel"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-cream-50 border border-cream-300 rounded-xl"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-brand-green hover:bg-brand-green-light text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all"
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Live Order Tracking Modal */}
      {selectedTrackingOrder && (
        <OrderTrackingModal
          order={selectedTrackingOrder}
          isOpen={Boolean(selectedTrackingOrder)}
          onClose={() => setSelectedTrackingOrder(null)}
        />
      )}
    </div>
  );
};

export default AccountPage;


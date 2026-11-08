import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  User, Package, MapPin, Heart, LogOut, Plus, Trash2, 
  CheckCircle, Clock, Truck, ShieldAlert, ArrowRight, Eye
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { orderAPI } from '../services/api';
import { formatPrice } from '../utils/formatCurrency';
import { ProductCard } from '../components/product/ProductCard';

export const AccountPage = () => {
  const { user, isAuthenticated, logout, updateProfile, addAddress, deleteAddress } = useAuth();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') || 'orders';
  const setActiveTab = (tab) => setSearchParams({ tab });

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Address form modal
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
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

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await addAddress(newAddress);
      toast.success('Address added successfully!');
      setShowAddressForm(false);
      setNewAddress({
        fullName: user?.name || '',
        phone: user?.phone || '',
        addressLine1: '',
        addressLine2: '',
        landmark: '',
        city: '',
        state: 'Rajasthan',
        pincode: '',
        isDefault: false
      });
    } catch (err) {
      toast.error(err.message || 'Failed to add address');
    }
  };

  const handleDeleteAddress = async (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      await deleteAddress(id);
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Navigation Tabs */}
          <div className="lg:col-span-3 bg-white rounded-2xl p-3 border border-cream-200 shadow-card space-y-1">
            {[
              { id: 'orders', label: 'Order History', icon: Package },
              { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
              { id: 'wishlist', label: `My Wishlist (${wishlist.length})`, icon: Heart },
              { id: 'profile', label: 'Profile Details', icon: User },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                    activeTab === tab.id
                      ? 'bg-brand-green text-white shadow-xs'
                      : 'text-charcoal hover:bg-cream-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
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

                        <div className="pt-2 flex justify-between items-center text-[11px] text-earth-brown border-t border-cream-200/60">
                          <span>Payment: {ord.paymentMethod?.toUpperCase()} ({ord.paymentStatus})</span>
                          <Link
                            to={`/order-confirmation/${ord.orderNumber}`}
                            className="text-brand-green font-bold hover:underline flex items-center gap-1"
                          >
                            <span>View Full Receipt</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
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
                  <h2 className="text-lg font-bold text-charcoal font-serif">
                    Saved Delivery Addresses
                  </h2>
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="flex items-center gap-1.5 text-xs font-bold bg-brand-green text-white px-3.5 py-2 rounded-xl"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Address
                  </button>
                </div>

                {showAddressForm && (
                  <form onSubmit={handleAddAddress} className="p-5 rounded-2xl bg-cream-50 border border-cream-200 mb-6 space-y-4">
                    <h3 className="text-sm font-bold text-charcoal font-serif">New Delivery Address</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="font-bold block mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={newAddress.fullName}
                          onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                          className="w-full p-2 rounded-lg border border-cream-300"
                        />
                      </div>
                      <div>
                        <label className="font-bold block mb-1">Phone Number</label>
                        <input
                          type="text"
                          required
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                          className="w-full p-2 rounded-lg border border-cream-300"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="font-bold block mb-1">Address (House, Street)</label>
                        <input
                          type="text"
                          required
                          value={newAddress.addressLine1}
                          onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                          className="w-full p-2 rounded-lg border border-cream-300"
                        />
                      </div>
                      <div>
                        <label className="font-bold block mb-1">City</label>
                        <input
                          type="text"
                          required
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          className="w-full p-2 rounded-lg border border-cream-300"
                        />
                      </div>
                      <div>
                        <label className="font-bold block mb-1">PIN Code</label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={newAddress.pincode}
                          onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                          className="w-full p-2 rounded-lg border border-cream-300"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" className="px-4 py-2 bg-brand-green text-white text-xs font-bold rounded-lg">
                        Save Address
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(false)}
                        className="px-4 py-2 border border-cream-300 text-charcoal text-xs font-bold rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {user?.addresses?.length === 0 ? (
                  <p className="text-xs text-earth-brown">No saved addresses yet. Add one above for faster checkout.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user?.addresses?.map((addr) => (
                      <div key={addr._id} className="p-4 rounded-2xl border border-cream-200 bg-cream-50/50 relative text-xs space-y-1">
                        <button
                          onClick={() => handleDeleteAddress(addr._id)}
                          className="absolute top-3 right-3 text-gray-400 hover:text-chilli p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <p className="font-bold text-charcoal">{addr.fullName}</p>
                        <p className="text-earth-brown">{addr.addressLine1}</p>
                        <p className="text-earth-brown">{addr.city}, {addr.state} — {addr.pincode}</p>
                        <p className="text-charcoal font-semibold pt-1">Phone: {addr.phone}</p>
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
    </div>
  );
};

export default AccountPage;


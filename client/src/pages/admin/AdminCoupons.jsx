import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, X, Sparkles } from 'lucide-react';
import { couponAPI } from '../../services/api';
import { formatPrice } from '../../utils/formatCurrency';

export const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderValue: '',
    maxDiscountAmount: '',
    description: ''
  });

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await couponAPI.getCoupons();
        if (Array.isArray(res.coupons)) setCoupons(res.coupons);
      } catch (err) {
        console.warn(err);
      }
    };
    fetchCoupons();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await couponAPI.createCoupon(newCoupon);
      setCoupons([...coupons, res.coupon || { ...newCoupon, _id: 'coup-' + Date.now() }]);
      setShowModal(false);
      setNewCoupon({ code: '', discountType: 'percentage', discountValue: '', minOrderValue: '', maxDiscountAmount: '', description: '' });
    } catch (err) {
      alert(err.message || 'Failed to create coupon');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this coupon code?')) {
      try {
        await couponAPI.deleteCoupon(id);
        setCoupons(coupons.filter(c => c._id !== id));
      } catch (err) {
        setCoupons(coupons.filter(c => c._id !== id));
      }
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-serif">Coupons & Promotional Codes</h1>
          <p className="text-xs text-gray-500 mt-1">Configure discounts and seasonal offers for customers.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-brand-green hover:bg-brand-green-light text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {coupons.map((c, idx) => (
          <div key={c._id || c.code || idx} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="bg-mustard-light text-brand-green-dark px-3 py-1 rounded-lg text-xs font-black tracking-widest uppercase">
                  {c.code}
                </span>
                <button onClick={() => handleDelete(c._id)} className="text-gray-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-600 font-medium mt-1">{c.description}</p>
              <div className="mt-3 space-y-1 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>Discount:</span>
                  <span className="font-bold text-gray-900">{c.discountType === 'percentage' ? `${c.discountValue}%` : formatPrice(c.discountValue)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Min Order:</span>
                  <span className="font-bold text-gray-900">{formatPrice(c.minOrderValue)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="text-base font-bold text-gray-900 font-serif">Create Coupon</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="font-bold block mb-1">Coupon Code (Uppercase)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FESTIVE20"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  className="w-full p-2.5 rounded-xl border border-gray-300 font-bold uppercase"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold block mb-1">Discount Type</label>
                  <select
                    value={newCoupon.discountType}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-300 font-semibold"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={newCoupon.discountValue}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-gray-300 font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold block mb-1">Minimum Order Value (₹)</label>
                <input
                  type="number"
                  value={newCoupon.minOrderValue}
                  onChange={(e) => setNewCoupon({ ...newCoupon, minOrderValue: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-gray-300"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. 10% OFF on all orders"
                  value={newCoupon.description}
                  onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-300"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-xl font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-brand-green text-white rounded-xl font-bold">
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;


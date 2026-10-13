import React, { useState, useEffect } from 'react';
import { Settings, Save, Check, Truck, MessageCircle, AlertCircle } from 'lucide-react';
import { adminAPI } from '../../services/api';

export const AdminSettings = () => {
  const [settings, setSettings] = useState({
    freeShippingThreshold: 499,
    standardShippingFee: 60,
    codEnabled: true,
    announcementText: '🌶️ Traditional Rajasthani Handcrafted Pickles • FREE Delivery on orders above ₹499! • Use Code: DESI10 for 10% OFF',
    whatsappNumber: '919876543210',
    supportPhone: '+91 98765 43210',
    supportEmail: 'care@singodhiafoods.com'
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await adminAPI.getSettings();
        if (res.settings) {
          setSettings(prev => ({ ...prev, ...res.settings }));
        }
      } catch (err) {
        console.warn(err);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminAPI.updateSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert(err.message || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-serif">Store Configuration & Settings</h1>
        <p className="text-xs text-gray-500 mt-1">
          Manage shipping rates, Cash on Delivery availability, WhatsApp contact, and banner announcements.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Store settings have been updated and applied successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6 text-xs">
        
        {/* Shipping & COD */}
        <div>
          <h3 className="font-bold text-sm text-gray-900 font-serif pb-2 border-b border-gray-100 mb-4 flex items-center gap-2">
            <Truck className="w-4 h-4 text-brand-green" /> Shipping & Delivery Rules
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold block mb-1">Free Shipping Order Threshold (₹)</label>
              <input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-gray-300 font-bold"
              />
              <span className="text-[10px] text-gray-500 mt-0.5 block">Orders above this qualify for free Pan-India delivery</span>
            </div>
            <div>
              <label className="font-bold block mb-1">Standard Shipping Fee (₹)</label>
              <input
                type="number"
                value={settings.standardShippingFee}
                onChange={(e) => setSettings({ ...settings, standardShippingFee: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-gray-300 font-bold"
              />
              <span className="text-[10px] text-gray-500 mt-0.5 block">Applied when order total is below threshold</span>
            </div>
          </div>

          <div className="mt-4">
            <label className="flex items-center gap-2 cursor-pointer font-bold">
              <input
                type="checkbox"
                checked={settings.codEnabled}
                onChange={(e) => setSettings({ ...settings, codEnabled: e.target.checked })}
                className="text-brand-green"
              />
              <span>Enable Cash on Delivery (COD) for all pin codes</span>
            </label>
          </div>
        </div>

        {/* Header Announcement Bar */}
        <div>
          <h3 className="font-bold text-sm text-gray-900 font-serif pb-2 border-b border-gray-100 mb-4">
            Homepage Announcement Message
          </h3>
          <div>
            <label className="font-bold block mb-1">Top Bar Marquee Text</label>
            <input
              type="text"
              value={settings.announcementText}
              onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-gray-300"
            />
          </div>
        </div>

        {/* Contact & Support */}
        <div>
          <h3 className="font-bold text-sm text-gray-900 font-serif pb-2 border-b border-gray-100 mb-4 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-emerald-600" /> Customer Support Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-bold block mb-1">WhatsApp Number (with country code)</label>
              <input
                type="text"
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-gray-300"
              />
            </div>
            <div>
              <label className="font-bold block mb-1">Support Phone Helpline</label>
              <input
                type="text"
                value={settings.supportPhone}
                onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-gray-300"
              />
            </div>
            <div>
              <label className="font-bold block mb-1">Support Email</label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-gray-300"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-brand-green hover:bg-brand-green-light text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>

      </form>
    </div>
  );
};

export default AdminSettings;


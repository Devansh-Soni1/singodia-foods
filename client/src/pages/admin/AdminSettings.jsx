import React, { useState, useEffect } from 'react';
import { 
  Settings, Save, Check, Truck, MessageCircle, AlertCircle, 
  Image, Upload, RefreshCw, Sparkles 
} from 'lucide-react';
import { adminAPI, productAPI } from '../../services/api';

export const AdminSettings = () => {
  const [settings, setSettings] = useState({
    freeShippingThreshold: 499,
    standardShippingFee: 60,
    codEnabled: true,
    announcementText: '🌶️ Traditional Rajasthani Handcrafted Pickles • FREE Delivery on orders above ₹499! • Use Code: DESI10 for 10% OFF',
    whatsappNumber: '919876543210',
    supportPhone: '+91 98765 43210',
    supportEmail: 'care@singodhiafoods.com',
    heroBannerImage: '/hero-banner.png'
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await adminAPI.getSettings();
        if (res.settings) {
          setSettings(prev => ({ 
            ...prev, 
            ...res.settings,
            heroBannerImage: res.settings.heroBannerImage || '/hero-banner.png'
          }));
        }
      } catch (err) {
        console.warn(err);
      }
    };
    fetchSettings();
  }, []);

  const handleBannerUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setUploadingBanner(true);
    try {
      const res = await productAPI.uploadImage(formData);
      if (res.url) {
        setSettings(prev => ({ ...prev, heroBannerImage: res.url }));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      alert(err.message || 'Banner upload failed');
    } finally {
      setUploadingBanner(false);
    }
  };

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
          Manage hero banner image, shipping rates, Cash on Delivery, WhatsApp contact, and announcements.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-xs">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Store settings & Hero Banner updated and applied successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-7 text-xs">
        
        {/* ======================================================== */}
        {/* HOMEPAGE HERO BANNER IMAGE (मुख्य होमपेज बैनर इमेज) */}
        {/* ======================================================== */}
        <div className="bg-gradient-to-br from-amber-50/70 to-orange-50/40 p-5 sm:p-6 rounded-2xl border border-amber-200/90 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-amber-200/60">
            <div>
              <h3 className="font-bold text-sm text-gray-900 font-serif flex items-center gap-2">
                <Image className="w-4 h-4 text-amber-700" />
                <span>Homepage Hero Banner Image (मुख्य होमपेज बैनर)</span>
              </h3>
              <p className="text-[11px] text-gray-600 mt-0.5">
                Aap yahan se website ke top par dikhne wali main hero image kabhi bhi change kar sakte hain.
              </p>
            </div>
            
            <button
              type="button"
              onClick={() => setSettings(prev => ({ ...prev, heroBannerImage: '/hero-banner.png' }))}
              className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-[11px] font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
              title="Reset to default original hero image"
            >
              <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
              <span>Reset to Default</span>
            </button>
          </div>

          {/* Current Banner Preview Box */}
          <div className="space-y-1.5">
            <span className="font-bold text-[11px] text-gray-700 block">
              Current Live Preview (वर्तमान बैनर):
            </span>
            <div className="relative rounded-xl overflow-hidden border border-amber-300 bg-white shadow-xs max-h-64 flex items-center justify-center">
              <img
                src={settings.heroBannerImage || '/hero-banner.png'}
                alt="Current Hero Banner"
                className="w-full h-auto max-h-64 object-cover sm:object-contain block"
                onError={(e) => { e.target.src = '/hero-banner.png'; }}
              />
              <span className="absolute bottom-2 right-2 bg-black/75 text-white text-[10px] font-bold px-2.5 py-1 rounded-md backdrop-blur-xs flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-mustard" /> Live On Homepage
              </span>
            </div>
          </div>

          {/* Upload & Direct URL Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="font-bold block mb-1 text-gray-800">
                1. Upload New Image (कंप्यूटर से नई फोटो चुनें)
              </label>
              <label className={`w-full p-3 rounded-xl border-2 border-dashed border-amber-300 hover:border-amber-500 bg-white hover:bg-amber-50/70 cursor-pointer flex items-center justify-center gap-2 font-bold text-amber-900 transition-colors shadow-2xs ${uploadingBanner ? 'opacity-60 pointer-events-none' : ''}`}>
                <Upload className="w-4 h-4 text-amber-700" />
                <span>{uploadingBanner ? 'Uploading Image to Cloud...' : 'Choose File to Upload'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerUpload}
                  className="hidden"
                  disabled={uploadingBanner}
                />
              </label>
              <span className="text-[10px] text-gray-500 mt-1 block">
                Supports JPG, PNG, WebP (Cloudinary CDN par auto-host hogi)
              </span>
            </div>

            <div>
              <label className="font-bold block mb-1 text-gray-800">
                2. Or Paste Image URL (या इमेज का सीधा लिंक डालें)
              </label>
              <input
                type="text"
                value={settings.heroBannerImage || ''}
                placeholder="https://... or /hero-banner.png"
                onChange={(e) => setSettings({ ...settings, heroBannerImage: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-gray-300 font-mono text-[11px] bg-white"
              />
              <span className="text-[10px] text-gray-500 mt-1 block">
                Any Cloudinary, Imgur, or direct CDN image link
              </span>
            </div>
          </div>
        </div>

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
            disabled={loading || uploadingBanner}
            className="bg-brand-green hover:bg-brand-green-light text-white font-bold px-7 py-3 rounded-xl flex items-center gap-2 shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings & Banner</span>
          </button>
        </div>

      </form>
    </div>
  );
};

export default AdminSettings;

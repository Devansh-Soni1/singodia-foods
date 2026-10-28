import React, { useState, useEffect } from 'react';
import { 
  Settings, Save, Check, Truck, MessageCircle, AlertCircle, 
  Image, Upload, RefreshCw, Sparkles, Gift, Camera 
} from 'lucide-react';
import { adminAPI, productAPI } from '../../services/api';
import { compressImageFile } from '../../utils/imageUtils';
import { DEFAULT_TRIAL_ITEMS } from '../../components/home/FeaturedTrialPackBanner';

export const AdminSettings = () => {
  const [settings, setSettings] = useState({
    freeShippingEnabled: false,
    freeShippingThreshold: 499,
    standardShippingFee: 60,
    codEnabled: true,
    announcementEnabled: true,
    announcementText: '',
    whatsappNumber: '919782983909',
    supportPhone: '+91 97829 83909',
    supportEmail: 'singodia.bajranglal9@gmail.com',
    heroBannerImage: '/hero-banner.png',
    trialPackItems: DEFAULT_TRIAL_ITEMS,
    trialPackPricing: {
      4: { price: 499, originalPrice: 599, discountPercent: 17 },
      6: { price: 599, originalPrice: 699, discountPercent: 14 },
      8: { price: 699, originalPrice: 799, discountPercent: 13 }
    }
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingJarIndex, setUploadingJarIndex] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await adminAPI.getSettings();
        if (res.settings) {
          setSettings(prev => ({ 
            ...prev, 
            ...res.settings,
            heroBannerImage: res.settings.heroBannerImage || '/hero-banner.png',
            trialPackItems: (Array.isArray(res.settings.trialPackItems) && res.settings.trialPackItems.length === 8) 
              ? res.settings.trialPackItems 
              : DEFAULT_TRIAL_ITEMS,
            trialPackPricing: res.settings.trialPackPricing || prev.trialPackPricing
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

  const handleJarImageUpload = async (index, file) => {
    if (!file) return;
    setUploadingJarIndex(index);
    try {
      const { dataUrl } = await compressImageFile(file, 500, 0.8);
      let finalUrl = dataUrl;
      try {
        const formData = new FormData();
        formData.append('image', file);
        const res = await productAPI.uploadImage(formData);
        if (res?.url && (res.url.startsWith('https://res.cloudinary.com') || res.url.startsWith('data:image/'))) {
          finalUrl = res.url;
        }
      } catch (uploadErr) {
        console.warn('Using client dataUrl for jar:', uploadErr.message);
      }

      setSettings(prev => {
        const items = [...(prev.trialPackItems || DEFAULT_TRIAL_ITEMS)];
        items[index] = { ...items[index], image: finalUrl };
        return { ...prev, trialPackItems: items };
      });
    } catch (err) {
      alert('Jar image upload failed: ' + err.message);
    } finally {
      setUploadingJarIndex(null);
    }
  };

  const handleJarFieldChange = (index, field, value) => {
    setSettings(prev => {
      const items = [...(prev.trialPackItems || DEFAULT_TRIAL_ITEMS)];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, trialPackItems: items };
    });
  };

  const handlePricingChange = (size, field, val) => {
    setSettings(prev => {
      const pricing = { ...prev.trialPackPricing };
      pricing[size] = { ...pricing[size], [field]: Number(val) };
      // auto calculate % off
      if (pricing[size].originalPrice > 0 && pricing[size].price > 0) {
        pricing[size].discountPercent = Math.round(
          ((pricing[size].originalPrice - pricing[size].price) / pricing[size].originalPrice) * 100
        );
      }
      return { ...prev, trialPackPricing: pricing };
    });
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

        {/* Announcement & Offers Bar Settings */}
        <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-200/80 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-amber-200/60">
            <div>
              <h3 className="font-bold text-sm text-gray-900 font-serif flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Top Bar Offers & Announcement Marquee (ऑफ़र और घोषणा पट्टी)</span>
              </h3>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Aap apne hisab se koi bhi offer ya announcement likh sakte hain. Agar khali chhodenge to normal brand slogans slide honge.
              </p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-gray-800">
              <input
                type="checkbox"
                checked={settings.announcementEnabled !== false}
                onChange={(e) => setSettings({ ...settings, announcementEnabled: e.target.checked })}
                className="rounded text-brand-green w-4 h-4"
              />
              <span>Bar Visible</span>
            </label>
          </div>

          <div>
            <label className="font-bold block mb-1 text-gray-800">
              Custom Offer / Announcement Text (e.g. "Diwali Special: Use Code DESI10 for 10% OFF")
            </label>
            <input
              type="text"
              placeholder="Leave empty for traditional handcrafted pickles tagline..."
              value={settings.announcementText || ''}
              onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-gray-300 bg-white text-xs"
            />
          </div>
        </div>

        {/* ======================================================== */}
        {/* DADI'S SPECIAL TRIAL PACK (8 BOXES / FLAVOURS & PRICING) */}
        {/* ======================================================== */}
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50/70 p-5 sm:p-6 rounded-2xl border-2 border-amber-300 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-amber-200">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-gray-900 font-serif flex items-center gap-2">
                <Gift className="w-5 h-5 text-brand-green" />
                <span>Dadi's Special Trial Pack (8 बॉक्स की फोटो और कीमतें)</span>
              </h3>
              <p className="text-[11px] text-gray-600 mt-0.5">
                Homepage ke Trial Box me dikhne wale sabhi 8 achar ki photo aur naam aap yahan se change kar sakte hain.
              </p>
            </div>
          </div>

          {/* Pricing Controls: 4 Pack, 6 Pack, 8 Pack */}
          <div className="bg-white p-4 rounded-xl border border-amber-200">
            <h4 className="font-bold text-xs text-gray-900 mb-2">Trial Pack Pricing & Offers (कीमतें और छूट):</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[4, 6, 8].map((size) => {
                const pInfo = settings.trialPackPricing?.[size] || { price: 0, originalPrice: 0, discountPercent: 0 };
                return (
                  <div key={size} className="p-3 bg-amber-50/50 rounded-xl border border-amber-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-gray-900">{size} Pack Trial Box</span>
                      <span className="text-[10px] font-extrabold bg-[#D32F2F] text-white px-2 py-0.5 rounded-full">
                        {pInfo.discountPercent}% OFF
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-gray-500 font-bold block">Selling Price (₹)</label>
                        <input
                          type="number"
                          value={pInfo.price}
                          onChange={(e) => handlePricingChange(size, 'price', e.target.value)}
                          className="w-full p-1.5 rounded-lg border border-gray-300 font-black text-xs bg-white text-[#D32F2F]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-500 font-bold block">Original Price (₹)</label>
                        <input
                          type="number"
                          value={pInfo.originalPrice}
                          onChange={(e) => handlePricingChange(size, 'originalPrice', e.target.value)}
                          className="w-full p-1.5 rounded-lg border border-gray-300 font-semibold text-xs bg-white text-gray-500 line-through"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 8 Jars Management Grid */}
          <div>
            <h4 className="font-bold text-xs text-gray-900 mb-2.5">
              8 Pickle Jars / Boxes Customization (आठों अचार के फोटो व नाम):
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(settings.trialPackItems || DEFAULT_TRIAL_ITEMS).map((jar, idx) => (
                <div key={idx} className="bg-white p-3 rounded-xl border border-amber-200 shadow-xs flex flex-col justify-between space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-12 h-12 rounded-lg border border-gray-300 overflow-hidden shrink-0 bg-amber-50">
                      <img 
                        src={jar.image} 
                        alt={jar.name} 
                        className="w-full h-full object-cover" 
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=300&q=80'; }}
                      />
                      {uploadingJarIndex === idx && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-[9px] font-bold">
                          ...
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] font-black text-brand-green uppercase tracking-wider block">
                        Flavour #{idx + 1}
                      </span>
                      <label className="cursor-pointer text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-0.5">
                        <Camera className="w-3 h-3" />
                        <span>Change Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleJarImageUpload(idx, e.target.files?.[0])}
                          className="hidden"
                          disabled={uploadingJarIndex === idx}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div>
                      <label className="text-[9px] font-bold text-gray-500 block">Flavour Name</label>
                      <input
                        type="text"
                        value={jar.name}
                        onChange={(e) => handleJarFieldChange(idx, 'name', e.target.value)}
                        className="w-full p-1.5 rounded-lg border border-gray-300 text-[11px] font-bold bg-white"
                        placeholder="e.g. Kachi Keri Aam"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-gray-500 block">Taste / Tag</label>
                      <input
                        type="text"
                        value={jar.taste || ''}
                        onChange={(e) => handleJarFieldChange(idx, 'taste', e.target.value)}
                        className="w-full p-1.5 rounded-lg border border-gray-300 text-[10px] bg-white"
                        placeholder="e.g. Khatta, Spicy"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shipping & Delivery Rules */}
        <div>
          <h3 className="font-bold text-sm text-gray-900 font-serif pb-2 border-b border-gray-100 mb-4 flex items-center gap-2">
            <Truck className="w-4 h-4 text-brand-green" /> Shipping & Delivery Rules (डिलीवरी नियम)
          </h3>

          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-gray-800">
              <input
                type="checkbox"
                checked={settings.freeShippingEnabled === true}
                onChange={(e) => setSettings({ ...settings, freeShippingEnabled: e.target.checked })}
                className="rounded text-brand-green w-4 h-4"
              />
              <span>Offer Free Delivery to Customers (फ्री डिलीवरी ऑन/ऑफ़)</span>
            </label>
            <span className="text-[10px] text-gray-500 mt-0.5 block pl-6">
              Agar uncheck karenge to sabhi orders par standard delivery charge lagega.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold block mb-1">Free Shipping Order Threshold (₹)</label>
              <input
                type="number"
                disabled={!settings.freeShippingEnabled}
                value={settings.freeShippingThreshold}
                onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                className={`w-full p-2.5 rounded-xl border border-gray-300 font-bold ${!settings.freeShippingEnabled ? 'bg-gray-100 opacity-60' : ''}`}
              />
              <span className="text-[10px] text-gray-500 mt-0.5 block">Orders above this qualify for free delivery</span>
            </div>
            <div>
              <label className="font-bold block mb-1">Standard Shipping Fee (₹)</label>
              <input
                type="number"
                value={settings.standardShippingFee}
                onChange={(e) => setSettings({ ...settings, standardShippingFee: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-gray-300 font-bold"
              />
              <span className="text-[10px] text-gray-500 mt-0.5 block">Standard shipping charge across India</span>
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

        {/* Payment & Logistics Integration Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 sm:p-5 rounded-2xl border border-gray-200">
          <div className="p-3.5 bg-white rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-gray-900 flex items-center gap-1.5">
                💳 Razorpay Payments
              </span>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                Connected
              </span>
            </div>
            <p className="text-[11px] text-gray-500">
              Online checkout enabled for UPI (Google Pay, PhonePe, Paytm), Debit/Credit Cards & NetBanking.
            </p>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-gray-900 flex items-center gap-1.5">
                📦 iThink Logistics
              </span>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                Connected
              </span>
            </div>
            <p className="text-[11px] text-gray-500">
              AWB generation & courier booking active. Pickup Warehouse: <strong>Sujangarh (331507)</strong>.
            </p>
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

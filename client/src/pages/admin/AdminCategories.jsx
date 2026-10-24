import React, { useState, useEffect } from 'react';
import { FolderTree, Plus, Edit2, Trash2, X, Smile, Sparkles, Layers, Tag, ChevronRight } from 'lucide-react';
import { categoryAPI } from '../../services/api';

const QUICK_PICKLE_EMOJIS = ['🥭', '🌶️', '🫑', '🍋', '🏺', '🧄', '🥗', '🍯', '🎁', '🫓', '⭐', '🥒', '🥕', '🫙'];

const TASTE_PROFILES = [
  { id: 'tangy', name: 'Tangy (खट्टा / चटपटा)', icon: '🍋' },
  { id: 'sweet', name: 'Sweet (मीठा / मुरब्बा)', icon: '🍯' },
  { id: 'spicy', name: 'Spicy (तीखा / चटपटा)', icon: '🌶️' },
  { id: 'winter', name: 'Winter Special (सर्दियों का खास)', icon: '❄️' },
  { id: 'rajasthani', name: 'Rajasthani Royal (शाही राजस्थानी)', icon: '🏺' },
];

const STANDARD_PRESETS = {
  mango: [
    { name: 'Traditional Mango Pickle', hindiName: 'पारंपरिक आम का अचार', slug: 'traditional-mango-pickle', taste: 'tangy' },
    { name: 'Punjabi Mango Pickle', hindiName: 'पंजाबी आम का अचार', slug: 'punjabi-mango-pickle', taste: 'spicy' },
    { name: 'Sweet Mango Pickle', hindiName: 'मीठा आम का अचार', slug: 'sweet-mango-pickle', taste: 'sweet' },
    { name: 'Mango Chundo / Chunda', hindiName: 'आम का छुंदा / मुरब्बा', slug: 'mango-chunda', taste: 'sweet' },
    { name: 'Avakaya (Andhra Style)', hindiName: 'आवाकाया आम अचार', slug: 'avakaya-mango-pickle', taste: 'spicy' },
    { name: 'Dry Mango Pickle', hindiName: 'सूखा हींग आम का अचार', slug: 'dry-mango-pickle', taste: 'tangy' },
    { name: 'Kachi Keri Desi Pickle', hindiName: 'कच्ची केरी का अचार', slug: 'kachi-keri-pickle', taste: 'tangy' }
  ],
  chilli: [
    { name: 'Banarasi Bharwa Lal Mirch', hindiName: 'बनारसी भरवां लाल मिर्च', slug: 'banarasi-lal-mirch', taste: 'spicy' },
    { name: 'Rajasthani Hari Mirch Tipore', hindiName: 'राजस्थानी हरी मिर्च के टिपोरे', slug: 'hari-mirch-tipore', taste: 'spicy' },
    { name: 'Green Chilli Thecha', hindiName: 'हरी मिर्च का ठेचा', slug: 'green-chilli-thecha', taste: 'spicy' },
    { name: 'Rai Vali Teekhi Hari Mirch', hindiName: 'राई वाली तीखी हरी मिर्च', slug: 'rai-hari-mirch', taste: 'spicy' },
    { name: 'Sweet & Tangy Chilli Pickle', hindiName: 'खट्टी मीठी मिर्च', slug: 'sweet-tangy-chilli', taste: 'sweet' }
  ],
  lemon: [
    { name: 'Khatta Meetha Nimbu Pickle', hindiName: 'खट्टा मीठा नीम्बू का अचार', slug: 'khatta-meetha-nimbu', taste: 'sweet' },
    { name: 'Oil-Free Sun-Dried Lemon', hindiName: 'धूप में पका बिना तेल का नीम्बू', slug: 'oil-free-lemon-pickle', taste: 'tangy' },
    { name: 'Salty Black Lemon Pickle', hindiName: 'काला पाचक नीम्बू अचार', slug: 'black-lemon-pickle', taste: 'tangy' },
    { name: 'Spicy Lemon Pickle', hindiName: 'तीखा चटपटा नीम्बू', slug: 'spicy-lemon-pickle', taste: 'spicy' }
  ],
  jackfruit: [
    { name: 'Traditional Kathal Pickle', hindiName: 'पारंपरिक कटहल का अचार', slug: 'traditional-kathal-pickle', taste: 'spicy' },
    { name: 'Spicy Mustard Kathal Achar', hindiName: 'सरसों मसालेदार कटहल', slug: 'spicy-mustard-kathal', taste: 'spicy' },
    { name: 'Desi Kathal Masala', hindiName: 'देसी कटहल मसाला', slug: 'desi-kathal-masala', taste: 'tangy' }
  ],
  garlic: [
    { name: 'Desi Lahsun Masaledar Achar', hindiName: 'देसी लहसुन का चटपटा अचार', slug: 'desi-lahsun-achar', taste: 'spicy' },
    { name: 'Garlic & Red Chilli Chutney', hindiName: 'लहसुन लाल मिर्च की चटनी', slug: 'garlic-chilli-chutney', taste: 'spicy' },
    { name: 'Sun-Dried Garlic Pickle', hindiName: 'धूप में पका लहसुन अचार', slug: 'sun-dried-garlic', taste: 'tangy' }
  ],
  mixed: [
    { name: 'Pachranga Shahi Mix Pickle', hindiName: 'पचरंगा शाही मिक्स अचार', slug: 'pachranga-mix-pickle', taste: 'rajasthani' },
    { name: 'Gajar Gobhi Shalgam Winter Pickle', hindiName: 'गाजर गोभी शलजम सर्दियों का अचार', slug: 'gajar-gobhi-shalgam', taste: 'winter' },
    { name: 'Sweet & Sour Mixed Pickle', hindiName: 'खट्टा मीठा मिक्स अचार', slug: 'sweet-sour-mixed', taste: 'sweet' }
  ],
  amla: [
    { name: 'Desi Amla Masala Pickle', hindiName: 'देसी आंवला मसालेदार अचार', slug: 'amla-masala-pickle', taste: 'tangy' },
    { name: 'Sweet Amla Murabba', hindiName: 'मीठा आंवला मुरब्बा', slug: 'amla-murabba', taste: 'sweet' },
    { name: 'Oil-Free Amla Achar', hindiName: 'बिना तेल का आंवला', slug: 'oil-free-amla', taste: 'tangy' }
  ],
  rajasthani: [
    { name: 'Royal Marwadi Kair Sangri', hindiName: 'शाही कैर सांगरी का अचार', slug: 'kair-sangri-pickle', taste: 'rajasthani' },
    { name: 'Marwadi Gunda / Lesua Pickle', hindiName: 'मारवाड़ी गुंदा / लसोड़ा अचार', slug: 'marwadi-gunda-pickle', taste: 'rajasthani' },
    { name: 'Bikaneri Moong Dal Papad', hindiName: 'बीकानेरी मूंग दाल पापड़', slug: 'bikaneri-papad', taste: 'rajasthani' },
    { name: 'Shahi Achar Masala Mix', hindiName: 'शाही अचार का मसाला', slug: 'shahi-achar-masala', taste: 'rajasthani' }
  ]
};

export const getCategoryEmoji = (cat = {}) => {
  const img = (cat.image || '').trim();
  if (img && !img.startsWith('http') && !img.startsWith('/') && !img.includes('.')) {
    return img;
  }
  const slug = (cat.slug || '').toLowerCase();
  const name = (cat.name || '').toLowerCase();
  if (slug.includes('mango') || name.includes('mango') || name.includes('aam')) return '🥭';
  if (slug.includes('red') || name.includes('red') || name.includes('lal mirch')) return '🌶️';
  if (slug.includes('green') || name.includes('green') || name.includes('hari mirch')) return '🫑';
  if (slug.includes('lemon') || name.includes('lemon') || name.includes('nimbu')) return '🍋';
  if (slug.includes('rajasthan') || name.includes('kair') || name.includes('sangri')) return '🏺';
  if (slug.includes('garlic') || name.includes('garlic') || name.includes('lahsun')) return '🧄';
  if (slug.includes('mix') || name.includes('mix')) return '🥗';
  if (slug.includes('sweet') || name.includes('meetha') || name.includes('murabba')) return '🍯';
  if (slug.includes('combo') || name.includes('box') || name.includes('hamp')) return '🎁';
  if (slug.includes('papad') || name.includes('papad')) return '🫓';
  return '🏺';
};

export const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    hindiName: '',
    slug: '',
    description: '',
    image: '🥭',
    displayOrder: 1,
    subCategories: []
  });

  // State for new subcategory item in modal
  const [newSub, setNewSub] = useState({
    name: '',
    hindiName: '',
    slug: '',
    taste: 'tangy'
  });

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await categoryAPI.getCategories();
        if (Array.isArray(res.categories)) setCategories(res.categories);
      } catch (err) {
        console.warn(err);
      }
    };
    fetchCats();
  }, []);

  const openCreateModal = () => {
    setEditingCat(null);
    setFormData({
      name: '',
      hindiName: '',
      slug: '',
      description: '',
      image: '🥭',
      displayOrder: categories.length + 1,
      subCategories: []
    });
    setNewSub({ name: '', hindiName: '', slug: '', taste: 'tangy' });
    setShowModal(true);
  };

  const openEditModal = (cat) => {
    setEditingCat(cat);
    setFormData({
      name: cat.name || '',
      hindiName: cat.hindiName || '',
      slug: cat.slug || '',
      description: cat.description || '',
      image: getCategoryEmoji(cat),
      displayOrder: cat.displayOrder || 1,
      subCategories: Array.isArray(cat.subCategories) ? [...cat.subCategories] : []
    });
    setNewSub({ name: '', hindiName: '', slug: '', taste: 'tangy' });
    setShowModal(true);
  };

  const handleAddSubCategory = (e) => {
    e?.preventDefault();
    if (!newSub.name.trim()) {
      alert('Please enter sub-category variety name');
      return;
    }
    const cleanSubSlug = (newSub.slug || newSub.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')).replace(/(^-|-$)/g, '');
    const item = {
      name: newSub.name.trim(),
      hindiName: newSub.hindiName.trim(),
      slug: cleanSubSlug,
      taste: newSub.taste || 'tangy'
    };

    setFormData(prev => ({
      ...prev,
      subCategories: [...prev.subCategories, item]
    }));
    setNewSub({ name: '', hindiName: '', slug: '', taste: 'tangy' });
  };

  const handleRemoveSubCategory = (index) => {
    setFormData(prev => ({
      ...prev,
      subCategories: prev.subCategories.filter((_, idx) => idx !== index)
    }));
  };

  const handlePreFillPresets = () => {
    const s = (formData.slug || formData.name).toLowerCase();
    let matched = null;
    if (s.includes('mango') || s.includes('aam')) matched = STANDARD_PRESETS.mango;
    else if (s.includes('red') || s.includes('green') || s.includes('chilli') || s.includes('mirch')) matched = STANDARD_PRESETS.chilli;
    else if (s.includes('lemon') || s.includes('nimbu')) matched = STANDARD_PRESETS.lemon;
    else if (s.includes('jack') || s.includes('kathal')) matched = STANDARD_PRESETS.jackfruit;
    else if (s.includes('garlic') || s.includes('lahsun')) matched = STANDARD_PRESETS.garlic;
    else if (s.includes('mix')) matched = STANDARD_PRESETS.mixed;
    else if (s.includes('amla') || s.includes('goose')) matched = STANDARD_PRESETS.amla;
    else if (s.includes('rajasthan') || s.includes('kair') || s.includes('sangri')) matched = STANDARD_PRESETS.rajasthani;

    if (matched) {
      setFormData(prev => ({
        ...prev,
        subCategories: [...matched]
      }));
    } else {
      // General standard varieties
      const baseName = formData.name || 'Special';
      const baseHindi = formData.hindiName || 'स्पेशल';
      setFormData(prev => ({
        ...prev,
        subCategories: [
          { name: `Traditional ${baseName}`, hindiName: `पारंपरिक ${baseHindi}`, slug: `traditional-${formData.slug || 'pickle'}`, taste: 'tangy' },
          { name: `Spicy Masala ${baseName}`, hindiName: `तीखा मसालेदार ${baseHindi}`, slug: `spicy-${formData.slug || 'pickle'}`, taste: 'spicy' },
          { name: `Sweet & Tangy ${baseName}`, hindiName: `खट्टा मीठा ${baseHindi}`, slug: `sweet-tangy-${formData.slug || 'pickle'}`, taste: 'sweet' },
        ]
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCat) {
        const idOrSlug = editingCat._id || editingCat.slug;
        const res = await categoryAPI.updateCategory(idOrSlug, formData);
        setCategories(categories.map(c => ((c._id && c._id === editingCat._id) || c.slug === editingCat.slug) ? (res.category || { ...c, ...formData }) : c));
      } else {
        const res = await categoryAPI.createCategory(formData);
        setCategories([...categories, res.category || { ...formData, _id: 'cat-' + Date.now() }]);
      }
      setShowModal(false);
    } catch (err) {
      alert(err.message || 'Action failed');
    }
  };

  const handleDelete = async (cat) => {
    if (window.confirm(`Delete category "${cat.name}" and all its subcategories?`)) {
      try {
        if (cat._id) await categoryAPI.deleteCategory(cat._id);
        setCategories(categories.filter(c => (c._id || c.slug) !== (cat._id || cat.slug)));
      } catch (err) {
        setCategories(categories.filter(c => (c._id || c.slug) !== (cat._id || cat.slug)));
      }
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-serif">Product Categories & Sub-Categories</h1>
          <p className="text-xs text-gray-500 mt-1">
            Yahan par Category add karein jo "Shop by Ingredients" me dikhegi, aur har category ki Sub-Categories manage karein jo flyout me dikhengi.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-brand-green hover:bg-brand-green-light text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, idx) => {
          const emoji = getCategoryEmoji(cat);
          const subCount = cat.subCategories?.length || 0;
          return (
            <div key={cat._id || idx} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50/90 border border-amber-200/80 flex items-center justify-center text-3xl shadow-xs select-none">
                    <span className="transform transition-transform hover:scale-110">{emoji}</span>
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                    subCount > 0 
                      ? 'bg-amber-100 text-[#b35400] border border-amber-300/80' 
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {subCount} Sub-Categories
                  </span>
                </div>
                
                <h3 className="font-bold text-gray-900 font-serif text-base">{cat.name}</h3>
                <p className="text-xs text-mustard-dark font-semibold">{cat.hindiName}</p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{cat.description || 'Authentic traditional recipe'}</p>

                {/* Subcategories list preview */}
                <div className="mt-4 pt-3 border-t border-amber-100/70">
                  <div className="flex items-center justify-between text-[11px] font-bold text-gray-700 mb-2">
                    <span className="flex items-center gap-1 text-[#b35400]">
                      <Layers className="w-3.5 h-3.5" />
                      <span>Sub-Categories (सब-प्रकार):</span>
                    </span>
                    <button
                      onClick={() => openEditModal(cat)}
                      className="text-[11px] text-[#b35400] hover:text-[#e68819] font-bold hover:underline cursor-pointer"
                    >
                      Edit Varieties &rarr;
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                    {subCount > 0 ? (
                      cat.subCategories.slice(0, 6).map((sub, sIdx) => {
                        const tasteObj = TASTE_PROFILES.find(t => t.id === sub.taste);
                        return (
                          <span
                            key={sIdx}
                            className="text-[10px] bg-[#FAF6EF] text-[#854102] border border-amber-200/70 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1"
                          >
                            <span>{tasteObj?.icon || '✨'}</span>
                            <span>{sub.name}</span>
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-[11px] text-gray-400 italic">No sub-categories yet. Click Edit to add.</span>
                    )}
                    {subCount > 6 && (
                      <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-md font-bold">
                        +{subCount - 6} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-400 font-mono text-[11px] truncate max-w-[150px]">/{cat.slug}/</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="flex items-center gap-1 text-xs font-bold text-brand-green hover:text-brand-green-light px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer"
                    title="Edit Category & Subcategories"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Manage</span>
                  </button>
                  <button
                    onClick={() => handleDelete(cat)}
                    className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE / EDIT CATEGORY & SUB-CATEGORIES MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-gray-200 my-8 max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4 shrink-0">
              <div>
                <h3 className="text-lg font-bold text-gray-900 font-serif">
                  {editingCat ? `Edit Category: ${editingCat.name}` : 'Add New Category'}
                </h3>
                <p className="text-[11px] text-gray-500">Configure Category details and its Sub-Category varieties.</p>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Scrollable Body */}
            <form onSubmit={handleSubmit} className="space-y-5 text-xs overflow-y-auto pr-1">
              
              {/* Category Emoji Selector */}
              <div>
                <label className="font-bold block mb-1 text-gray-800">Category Emoji Icon (इमोजी)</label>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-center text-3xl select-none shrink-0 shadow-xs">
                    {formData.image || '🏺'}
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="Enter emoji e.g. 🥭"
                    className="flex-1 p-2.5 rounded-xl border border-gray-300 text-sm font-semibold"
                  />
                </div>
                {/* Quick Emoji Buttons */}
                <div className="flex flex-wrap gap-1.5 p-2 bg-gray-50 rounded-xl border border-gray-200">
                  {QUICK_PICKLE_EMOJIS.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setFormData({ ...formData, image: em })}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg hover:bg-amber-100 transition-colors cursor-pointer ${formData.image === em ? 'bg-amber-200 ring-2 ring-amber-400' : 'bg-white'}`}
                      title={em}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1 text-gray-800">Category Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      setFormData({ ...formData, name, slug: editingCat ? formData.slug : slug });
                    }}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-semibold"
                    placeholder="e.g. Mango Pickles"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1 text-gray-800">Hindi Title (हिंदी नाम) *</label>
                  <input
                    type="text"
                    value={formData.hindiName}
                    onChange={(e) => setFormData({ ...formData, hindiName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-semibold"
                    placeholder="e.g. आम का अचार"
                  />
                </div>
              </div>

              {/* Slug and Display Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1 text-gray-800">Category URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-300 font-mono text-[11px]"
                    placeholder="e.g. mango-pickles"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1 text-gray-800">Display Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) || 1 })}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
                    placeholder="1, 2, 3..."
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1 text-gray-800">Description</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
                  placeholder="Short description of this pickle category..."
                />
              </div>

              {/* ======================================================== */}
              {/* SUB-CATEGORIES SECTION (SUB OPTIONS IN FLYOUT MENU) */}
              {/* ======================================================== */}
              <div className="p-4 bg-amber-50/70 border border-amber-300/80 rounded-2xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/80 pb-2.5">
                  <div>
                    <h4 className="font-bold text-sm text-[#b35400] flex items-center gap-1.5 font-serif">
                      <Layers className="w-4 h-4" />
                      <span>Sub-Categories / Varieties (सब-कैटेगरी और स्वाद)</span>
                    </h4>
                    <p className="text-[11px] text-gray-600 mt-0.5">
                      Ye varieties menu me hover karne par right side me dikhengi aur store par filter karengi.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handlePreFillPresets}
                    className="text-[11px] font-bold text-amber-900 bg-white hover:bg-amber-100 border border-amber-300 px-3 py-1 rounded-lg flex items-center gap-1 self-start sm:self-auto cursor-pointer shadow-2xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Pre-fill Standard Varieties</span>
                  </button>
                </div>

                {/* Existing Subcategories List */}
                <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                  {formData.subCategories && formData.subCategories.length > 0 ? (
                    formData.subCategories.map((sub, idx) => {
                      const tasteObj = TASTE_PROFILES.find(t => t.id === sub.taste);
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-amber-200 shadow-2xs text-xs"
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <span className="text-base select-none">{tasteObj?.icon || '✨'}</span>
                            <div>
                              <div className="font-bold text-gray-900 leading-tight">{sub.name}</div>
                              <div className="text-[11px] text-amber-800 font-medium">
                                {sub.hindiName || sub.hindi || ''} • <span className="font-mono text-[10px] text-gray-400">/{sub.slug}/</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200">
                              {tasteObj?.name.split(' ')[0] || sub.taste}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSubCategory(idx)}
                              className="text-gray-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
                              title="Delete Sub-category"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-4 bg-white/70 rounded-xl border border-dashed border-amber-200 text-gray-500 text-xs">
                      No sub-categories added yet. Use the form below or click "Pre-fill Standard Varieties".
                    </div>
                  )}
                </div>

                {/* Add Sub-category Input Form */}
                <div className="bg-white p-3 rounded-xl border border-amber-200/90 space-y-2 mt-2">
                  <span className="font-bold text-gray-800 text-[11px] block uppercase tracking-wider">
                    + Add New Sub-Category Variety
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={newSub.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                        setNewSub({ ...newSub, name, slug });
                      }}
                      placeholder="Name (e.g. Sweet Mango Pickle)"
                      className="p-2 rounded-lg border border-gray-300 text-xs"
                    />
                    <input
                      type="text"
                      value={newSub.hindiName}
                      onChange={(e) => setNewSub({ ...newSub, hindiName: e.target.value })}
                      placeholder="Hindi (e.g. मीठा आम का अचार)"
                      className="p-2 rounded-lg border border-gray-300 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <select
                      value={newSub.taste}
                      onChange={(e) => setNewSub({ ...newSub, taste: e.target.value })}
                      className="p-2 rounded-lg border border-gray-300 text-xs font-medium"
                    >
                      {TASTE_PROFILES.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.icon} {t.name}
                        </option>
                      ))}
                    </select>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newSub.slug}
                        onChange={(e) => setNewSub({ ...newSub, slug: e.target.value })}
                        placeholder="Slug (e.g. sweet-mango-pickle)"
                        className="flex-1 p-2 rounded-lg border border-gray-300 text-xs font-mono"
                      />
                      <button
                        type="button"
                        onClick={handleAddSubCategory}
                        className="bg-[#b35400] hover:bg-[#854102] text-white text-xs font-bold px-3 py-2 rounded-lg cursor-pointer flex items-center gap-1 shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 shrink-0">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="px-4 py-2 border border-gray-300 rounded-xl font-bold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-brand-green hover:bg-brand-green-light text-white rounded-xl font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <span>Save Category & Sub-Categories</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;

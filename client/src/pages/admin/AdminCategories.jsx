import React, { useState, useEffect } from 'react';
import { FolderTree, Plus, Edit2, Trash2, X, Smile } from 'lucide-react';
import { categoryAPI } from '../../services/api';

const QUICK_PICKLE_EMOJIS = ['🥭', '🌶️', '🫑', '🍋', '🏺', '🧄', '🥗', '🍯', '🎁', '🫓', '⭐', '🥒', '🥕', '🫙'];

export const getCategoryEmoji = (cat = {}) => {
  const img = (cat.image || '').trim();
  // If cat.image is already an emoji or short symbol
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
    displayOrder: 1
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
      displayOrder: categories.length + 1
    });
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
      displayOrder: cat.displayOrder || 1
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCat) {
        await categoryAPI.updateCategory(editingCat._id || editingCat.slug, formData);
        setCategories(categories.map(c => (c._id === editingCat._id || c.slug === editingCat.slug) ? { ...c, ...formData } : c));
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
    if (window.confirm(`Delete category ${cat.name}?`)) {
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-serif">Product Categories</h1>
          <p className="text-xs text-gray-500 mt-1">Organize your pickle jars by flavor, vegetable, and regional styles with emoji icons.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-brand-green hover:bg-brand-green-light text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, idx) => {
          const emoji = getCategoryEmoji(cat);
          return (
            <div key={idx} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                {/* Emoji Emblem instead of photo */}
                <div className="w-16 h-16 rounded-2xl bg-amber-50/90 border border-amber-200/80 flex items-center justify-center text-4xl mb-4 shadow-xs select-none">
                  <span className="transform transition-transform hover:scale-110">{emoji}</span>
                </div>
                
                <h3 className="font-bold text-gray-900 font-serif text-base">{cat.name}</h3>
                <p className="text-xs text-mustard-dark font-semibold">{cat.hindiName}</p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{cat.description || 'Authentic traditional recipe'}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-400 font-mono text-[11px]">Slug: {cat.slug}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="text-gray-400 hover:text-brand-green p-1 transition-colors"
                    title="Edit Category"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat)}
                    className="text-gray-400 hover:text-red-600 p-1 transition-colors"
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="text-base font-bold text-gray-900 font-serif">
                {editingCat ? 'Edit Category' : 'Add Category'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Category Emoji Selector */}
              <div>
                <label className="font-bold block mb-1 text-gray-700">Category Emoji Icon (इमोजी)</label>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-center text-3xl select-none">
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
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg hover:bg-amber-100 transition-colors ${formData.image === em ? 'bg-amber-200 ring-2 ring-amber-400' : 'bg-white'}`}
                      title={em}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1 text-gray-700">Category Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    setFormData({ ...formData, name, slug: editingCat ? formData.slug : slug });
                  }}
                  className="w-full p-2.5 rounded-xl border border-gray-300"
                  placeholder="e.g. Mango Pickles"
                />
              </div>

              <div>
                <label className="font-bold block mb-1 text-gray-700">Hindi Title</label>
                <input
                  type="text"
                  value={formData.hindiName}
                  onChange={(e) => setFormData({ ...formData, hindiName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-300"
                  placeholder="e.g. आम का अचार"
                />
              </div>

              <div>
                <label className="font-bold block mb-1 text-gray-700">Category Slug</label>
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
                <label className="font-bold block mb-1 text-gray-700">Description</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-300"
                  placeholder="Short description of this pickle style..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="px-4 py-2 border border-gray-300 rounded-xl font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-brand-green hover:bg-brand-green-light text-white rounded-xl font-bold"
                >
                  Save Category
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

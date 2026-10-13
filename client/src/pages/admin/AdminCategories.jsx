import React, { useState, useEffect } from 'react';
import { FolderTree, Plus, Edit2, Trash2, X } from 'lucide-react';
import { categoryAPI } from '../../services/api';
import { SAMPLE_CATEGORIES } from '../../utils/sampleData';

export const AdminCategories = () => {
  const [categories, setCategories] = useState(SAMPLE_CATEGORIES);
  const [showModal, setShowModal] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    hindiName: '',
    slug: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80',
    displayOrder: 1
  });

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await categoryAPI.getCategories();
        if (res.categories?.length > 0) setCategories(res.categories);
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
      image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80',
      displayOrder: categories.length + 1
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
          <p className="text-xs text-gray-500 mt-1">Organize your pickle jars by flavor, vegetable, and regional styles.</p>
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
        {categories.map((cat, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="aspect-[16/9] rounded-xl overflow-hidden mb-3 bg-gray-100">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-bold text-gray-900 font-serif text-base">{cat.name}</h3>
              <p className="text-xs text-mustard-dark font-semibold">{cat.hindiName}</p>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{cat.description}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-400 font-mono">Slug: {cat.slug}</span>
              <button
                onClick={() => handleDelete(cat)}
                className="text-gray-400 hover:text-red-600 p-1"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="text-base font-bold text-gray-900 font-serif">Add Category</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold block mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-300"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">Hindi Title</label>
                <input
                  type="text"
                  value={formData.hindiName}
                  onChange={(e) => setFormData({ ...formData, hindiName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-300"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">Description</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-300"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">Image URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-300"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-xl font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-brand-green text-white rounded-xl font-bold">
                  Save
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


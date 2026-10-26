import React, { useState, useEffect, useRef } from 'react';
import { 
  Package, Plus, Edit2, Trash2, X, Check, Search, 
  Flame, Upload, ExternalLink, AlertCircle, Image as ImageIcon,
  Loader2, Star, Eye, Sparkles, Tag, ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { productAPI, categoryAPI, adminAPI } from '../../services/api';
import { formatPrice } from '../../utils/formatCurrency';
import { TASTE_SUBCATEGORIES, getTasteInfo } from '../../constants/tasteSubCategories';
import { compressImageFile, resolveProductImage } from '../../utils/imageUtils';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80';
const MASALA_IMAGE_SNIPPET = 'photo-1596040033229-a9821ebd058d';

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState('all');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  const fileInputRef = useRef(null);

  const defaultFormData = {
    name: '',
    hindiName: '',
    category: '',
    subCategory: '',
    shortDescription: '',
    fullDescription: '',
    images: [],
    spiceLevel: 'Medium',
    ingredients: '',
    shelfLife: '12 Months from packaging date',
    oilType: 'Pure Kachi Ghani Mustard Oil (सरसों का तेल)',
    pairWith: 'Aloo Paratha, Dal Rice, Khichdi',
    tags: '',
    isBestSeller: false,
    isFeatured: false,
    isNewArrival: false,
    isActive: true,
    variants: [
      { weight: '250g', price: 249, originalPrice: 299, inStock: true, stockCount: 50 },
      { weight: '500g', price: 449, originalPrice: 520, inStock: true, stockCount: 50 }
    ]
  };

  const [formData, setFormData] = useState(defaultFormData);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const pRes = await productAPI.getProducts({ limit: 100 });
      if (Array.isArray(pRes.products)) setProducts(pRes.products);
      const cRes = await categoryAPI.getCategories();
      if (Array.isArray(cRes.categories)) setCategories(cRes.categories);
    } catch (err) {
      console.warn('Using existing products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      ...defaultFormData,
      category: categories[0]?.slug || 'mango-pickles',
      subCategory: '',
      images: [],
      variants: [
        { weight: '250g', price: 249, originalPrice: 299, inStock: true, stockCount: 50 },
        { weight: '500g', price: 449, originalPrice: 520, inStock: true, stockCount: 50 }
      ]
    });
    setUploadError('');
    setShowUrlInput(false);
    setUrlInput('');
    setShowModal(true);
  };

  const openEditModal = (p) => {
    setEditingProduct(p);
    setFormData({
      name: p.name || '',
      hindiName: p.hindiName || '',
      category: p.category || 'mango-pickles',
      subCategory: p.subCategory || '',
      shortDescription: p.shortDescription || '',
      fullDescription: p.fullDescription || '',
      images: Array.isArray(p.images) && p.images.length > 0 
        ? p.images.filter(img => img && !img.includes(MASALA_IMAGE_SNIPPET))
        : [],
      spiceLevel: p.spiceLevel || 'Medium',
      ingredients: Array.isArray(p.ingredients) ? p.ingredients.join(', ') : (p.ingredients || ''),
      shelfLife: p.shelfLife || '12 Months from packaging date',
      oilType: p.oilType || 'Pure Kachi Ghani Mustard Oil (सरसों का तेल)',
      pairWith: Array.isArray(p.pairWith) ? p.pairWith.join(', ') : (p.pairWith || ''),
      tags: Array.isArray(p.tags) ? p.tags.join(', ') : (p.tags || ''),
      isBestSeller: !!p.isBestSeller,
      isFeatured: !!p.isFeatured,
      isNewArrival: !!p.isNewArrival,
      isActive: p.isActive !== false,
      variants: Array.isArray(p.variants) && p.variants.length > 0 
        ? p.variants 
        : [{ weight: '250g', price: 249, originalPrice: 299, inStock: true, stockCount: 50 }]
    });
    setUploadError('');
    setShowUrlInput(false);
    setUrlInput('');
    setShowModal(true);
  };

  // Handle direct file upload from phone or computer
  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
    setUploadingImage(true);
    setUploadError('');

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        setUploadError('Only image files (JPG, PNG, WEBP) are supported.');
        continue;
      }

      try {
        // Fast client-side HD compression (converts phone photo to lightweight ~80KB high-res image)
        const { file: compressedFile, dataUrl } = await compressImageFile(file, 900, 0.78);

        let uploadedUrl = null;
        try {
          const uploadData = new FormData();
          uploadData.append('image', compressedFile);
          const res = await productAPI.uploadImage(uploadData);
          // Only trust uploaded URL if it is a persistent cloud storage CDN or persistent Data URL.
          // Never use ephemeral /uploads/ paths that get wiped on server reboot!
          if (res?.url && (res.url.startsWith('https://res.cloudinary.com') || res.url.startsWith('data:image/'))) {
            uploadedUrl = res.url;
          }
        } catch (uploadErr) {
          console.warn('Backend upload notice, using persistent DataURL fallback:', uploadErr.message);
        }

        const finalImgUrl = uploadedUrl || dataUrl;
        if (finalImgUrl) {
          setFormData(prev => ({
            ...prev,
            images: [
              ...prev.images.filter(img => img !== DEFAULT_IMAGE && !img.includes(MASALA_IMAGE_SNIPPET)),
              finalImgUrl
            ]
          }));
        }
      } catch (err) {
        console.error('Image processing failed:', err);
        setUploadError('Failed to process image: ' + err.message);
      }
    }

    setUploadingImage(false);
  };

  const handleAddUrlImage = () => {
    if (!urlInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      images: [
        ...prev.images.filter(img => img !== DEFAULT_IMAGE && !img.includes(MASALA_IMAGE_SNIPPET)),
        urlInput.trim()
      ]
    }));
    setUrlInput('');
    setShowUrlInput(false);
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleMakePrimary = (index) => {
    if (index === 0) return;
    setFormData(prev => {
      const list = [...prev.images];
      const selected = list.splice(index, 1)[0];
      return { ...prev, images: [selected, ...list] };
    });
  };

  // Preset weights for 1-click addition without blank inputs
  const PRESET_OPTIONS = [
    { weight: '250g', price: 249, originalPrice: 299 },
    { weight: '500g', price: 449, originalPrice: 520 },
    { weight: '1kg', price: 799, originalPrice: 950 },
    { weight: '2kg', price: 1499, originalPrice: 1750 },
    { weight: 'Combo Pack', price: 699, originalPrice: 850 }
  ];

  const addQuickVariant = (weight, price, originalPrice) => {
    const existingIndex = formData.variants.findIndex(v => v.weight.toLowerCase() === weight.toLowerCase());
    if (existingIndex >= 0) {
      alert(`${weight} already added in variants!`);
      return;
    }
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { weight, price, originalPrice, inStock: true, stockCount: 50 }]
    }));
  };

  const addCustomVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { weight: 'Custom', price: 299, originalPrice: 349, inStock: true, stockCount: 50 }]
    }));
  };

  const removeVariant = (index) => {
    if (formData.variants.length <= 1) {
      alert('At least one weight variant is required.');
      return;
    }
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const updateVariant = (index, field, value) => {
    const updated = [...formData.variants];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, variants: updated }));
  };

  // Submit product create/edit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Please enter product name.');
      return;
    }

    const cleanImages = (formData.images || [])
      .filter(img => img && !img.includes(MASALA_IMAGE_SNIPPET));

    const finalImages = cleanImages.length > 0
      ? cleanImages
      : [DEFAULT_IMAGE];

    const payload = {
      ...formData,
      images: finalImages,
      ingredients: typeof formData.ingredients === 'string'
        ? formData.ingredients.split(',').map(s => s.trim()).filter(Boolean)
        : formData.ingredients,
      pairWith: typeof formData.pairWith === 'string'
        ? formData.pairWith.split(',').map(s => s.trim()).filter(Boolean)
        : formData.pairWith,
      tags: typeof formData.tags === 'string'
        ? formData.tags.split(',').map(s => s.trim()).filter(Boolean)
        : formData.tags
    };

    try {
      if (editingProduct) {
        const res = await productAPI.updateProduct(editingProduct._id, payload);
        const updatedObj = res.product || { ...payload, _id: editingProduct._id };
        setProducts(products.map(p => p._id === editingProduct._id ? updatedObj : p));
        alert('Pickle product updated successfully!');
      } else {
        const res = await productAPI.createProduct(payload);
        const createdObj = res.product || { ...payload, _id: 'prod-' + Date.now() };
        setProducts([createdObj, ...products]);
        alert('Pickle product uploaded successfully!');
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      console.error('Submit product error:', err);
      const errMsg = err.response?.data?.message || err.message || 'Operation failed';
      alert('Upload failed: ' + errMsg);
    }
  };

  const handleToggleFeatured = async (product) => {
    const willBeFeatured = !product.isFeatured;
    if (willBeFeatured) {
      const currentFeaturedCount = products.filter(p => p.isFeatured && p._id !== product._id).length;
      if (currentFeaturedCount >= 4) {
        alert('Home page par sirf 4 hi products add ho sakte hain! Kripya pehle kisi doosre product ko uncheck karein.');
        return;
      }
    }

    try {
      await productAPI.updateProduct(product._id, { isFeatured: willBeFeatured });
      setProducts(prev => prev.map(p => p._id === product._id ? { ...p, isFeatured: willBeFeatured } : p));
    } catch (err) {
      console.error(err);
      alert('Failed to update featured status: ' + (err?.message || 'Server error'));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this pickle product?')) {
      try {
        await productAPI.deleteProduct(id);
        setProducts(prev => prev.filter(p => p._id !== id));
      } catch (err) {
        console.error('Delete product error:', err);
        alert('Failed to delete product: ' + (err?.message || 'Server error. Please verify you are logged in as admin.'));
      }
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.hindiName?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase()) ||
      p.subCategory?.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSubCategory = selectedSubCategory === 'all' || (p.subCategory || '').toLowerCase() === selectedSubCategory.toLowerCase();
    return matchesSearch && matchesCategory && matchesSubCategory;
  });

  return (
    <div className="space-y-6 max-w-7xl">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-brand-cream to-amber-50/70 p-6 rounded-3xl border border-amber-200/60 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🌶️</span>
            <h1 className="text-2xl font-bold text-gray-900 font-serif">Pickle Products Catalog</h1>
          </div>
          <p className="text-xs text-gray-600 mt-1.5 max-w-2xl leading-relaxed">
            Upload new homemade pickles with photos from your phone/laptop, set prices for 250g/500g/1kg jars, manage stock, and highlight bestsellers for <strong>Singodhia Foods</strong>.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-brand-green hover:bg-brand-green-light text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Upload New Pickle</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-gray-200 shadow-xs">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, Hindi title, category, or taste..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-green transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
          {/* Main Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs py-2 px-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-700 focus:outline-none focus:border-brand-green"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>

          {/* Taste Sub-Category Dropdown */}
          <select
            value={selectedSubCategory}
            onChange={(e) => setSelectedSubCategory(e.target.value)}
            className="text-xs py-2 px-3 bg-amber-50/60 border border-amber-200 rounded-xl font-medium text-gray-800 focus:outline-none focus:border-brand-green"
          >
            <option value="all">All Tastes (सब-कैटेगरी)</option>
            {TASTE_SUBCATEGORIES.map((t) => (
              <option key={t.id} value={t.id}>{t.icon} {t.name} ({t.hindiName})</option>
            ))}
          </select>

          <span className="text-xs text-gray-500 font-semibold shrink-0">
            <strong>{filteredProducts.length}</strong> Products
          </span>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-[10px] border-b border-gray-200">
              <tr>
                <th className="p-4">Pickle & Photo</th>
                <th className="p-4">Category</th>
                <th className="p-4">Homepage (Max 4)</th>
                <th className="p-4">Weights & Prices</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-gray-500">
                    <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="font-bold text-sm text-gray-700">No pickles found</p>
                    <p className="text-xs text-gray-400 mt-1">Try modifying your search or upload a new pickle.</p>
                    <button
                      onClick={openCreateModal}
                      className="mt-4 bg-brand-green text-white text-xs font-bold px-4 py-2 rounded-xl"
                    >
                      + Upload New Pickle
                    </button>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const totalStock = p.variants?.reduce((sum, v) => sum + (v.stockCount || 0), 0) || 0;
                  const primaryImg = (p.images && p.images.find(img => img && !img.includes(MASALA_IMAGE_SNIPPET))) || DEFAULT_IMAGE;
                  
                  return (
                    <tr key={p._id || p.slug} className="hover:bg-amber-50/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={resolveProductImage(primaryImg, DEFAULT_IMAGE)}
                            alt={p.name}
                            onError={(e) => {
                              if (e.target.src !== DEFAULT_IMAGE) {
                                e.target.src = DEFAULT_IMAGE;
                              }
                            }}
                            className="w-14 h-14 rounded-xl object-cover border border-gray-200 shrink-0 bg-gray-100 shadow-xs"
                          />
                          <div>
                            <div className="font-bold text-gray-900 flex items-center gap-1.5">
                              {p.name}
                              {p.isBestSeller && (
                                <span className="text-[10px] text-amber-800 font-bold bg-amber-100 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                  <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> Bestseller
                                </span>
                              )}
                              {p.isFeatured && (
                                <span className="text-[10px] text-brand-green font-bold bg-brand-green/10 px-1.5 py-0.5 rounded-full">
                                  Home Featured
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-amber-900/80 font-medium">{p.hindiName}</div>
                            <div className="text-[10px] text-gray-400 mt-0.5">
                              {p.images?.length || 1} Photo{(p.images?.length || 1) > 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 text-gray-600 capitalize font-medium">
                        <div className="flex flex-col gap-1.5 items-start">
                          <span className="bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-lg text-xs font-semibold">
                            {p.category ? p.category.replace(/-/g, ' ') : 'General'}
                          </span>
                          {p.subCategory && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200">
                              <span>{getTasteInfo(p.subCategory)?.icon || '✨'}</span>
                              <span className="capitalize">{getTasteInfo(p.subCategory)?.name || p.subCategory}</span>
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(p)}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
                            p.isFeatured
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs hover:bg-emerald-100'
                              : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                          }`}
                          title={p.isFeatured ? 'Featured on Homepage (Click to remove)' : 'Click to feature on Homepage'}
                        >
                          <span>{p.isFeatured ? '🏠 Featured (Live)' : '+ Add to Home'}</span>
                        </button>
                      </td>

                      <td className="p-4">
                        <div className="space-y-1">
                          {p.variants?.map((v, i) => (
                            <div key={i} className="text-[11px] font-medium text-gray-700 flex items-center gap-2">
                              <span className="font-bold text-gray-900 bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">{v.weight}</span>
                              <strong className="text-brand-green">{formatPrice(v.price)}</strong>
                              {v.originalPrice > v.price && (
                                <span className="text-[10px] text-gray-400 line-through">
                                  {formatPrice(v.originalPrice)}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="p-4">
                        <span className={`font-bold px-2 py-0.5 rounded ${totalStock < 20 ? 'text-chilli bg-red-50' : 'text-gray-700'}`}>
                          {totalStock} jars
                        </span>
                      </td>

                      <td className="p-4">
                        {p.isActive !== false ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Live
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                            Draft
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {p.slug && (
                            <Link
                              to={`/product/${p.slug}/`}
                              target="_blank"
                              className="p-2 text-gray-400 hover:text-brand-green hover:bg-gray-100 rounded-xl transition-colors"
                              title="View on Live Store"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          )}
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-2 text-gray-500 hover:text-brand-green hover:bg-amber-50 rounded-xl transition-colors cursor-pointer"
                            title="Edit Pickle"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p._id)}
                            className="p-2 text-gray-400 hover:text-chilli hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                            title="Delete Pickle"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-8 shadow-2xl border border-gray-100 my-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 font-serif flex items-center gap-2">
                  <span>{editingProduct ? '✏️ Edit Pickle Recipe' : '✨ Upload New Pickle'}</span>
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Fill in the details, upload photos from your device, and set weight variants.
                </p>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 text-xs">
              
              {/* IMAGE UPLOADER SECTION */}
              <div className="bg-amber-50/50 p-4 sm:p-5 rounded-2xl border border-amber-200/80">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <label className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-brand-green" /> Product Photos (फोटो अपलोड करें) *
                    </label>
                    <p className="text-[11px] text-gray-500">
                      Upload clear photos of the pickle jar, martaban, or ingredients directly from your device.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="text-[11px] font-bold text-brand-green hover:underline"
                  >
                    {showUrlInput ? 'Hide URL input' : '+ Paste Image URL'}
                  </button>
                </div>

                {/* Paste URL row if toggled */}
                {showUrlInput && (
                  <div className="flex gap-2 mb-3">
                    <input
                      type="url"
                      placeholder="Paste image link (https://...)"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      className="flex-1 p-2 rounded-xl border border-gray-300 text-xs bg-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddUrlImage}
                      className="px-3 py-2 bg-brand-green text-white font-bold rounded-xl text-xs"
                    >
                      Add Image
                    </button>
                  </div>
                )}

                {/* Drag and Drop / Click to Upload Box */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFiles(e.target.files)}
                  className="hidden"
                />

                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    handleFiles(e.dataTransfer.files);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                    isDragging 
                      ? 'border-brand-green bg-emerald-50/60 scale-[1.01]' 
                      : 'border-amber-300/80 hover:border-brand-green bg-white hover:bg-emerald-50/20'
                  }`}
                >
                  {uploadingImage ? (
                    <div className="flex flex-col items-center justify-center py-4 text-brand-green gap-2">
                      <Loader2 className="w-8 h-8 animate-spin" />
                      <span className="font-bold">Uploading image to server...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-brand-green/10 flex items-center justify-center text-brand-green">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="font-bold text-gray-900 text-sm">Click to choose image</span>
                        <span className="text-gray-500"> or drag and drop photos here</span>
                      </div>
                      <p className="text-[11px] text-gray-400">
                        Supports JPG, PNG, WEBP (Max 5MB each) • You can select multiple images
                      </p>
                    </div>
                  )}
                </div>

                {uploadError && (
                  <p className="text-red-600 text-[11px] font-semibold mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {uploadError}
                  </p>
                )}

                {/* Uploaded Thumbnails Preview */}
                {formData.images.length > 0 && (
                  <div className="mt-4">
                    <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block mb-2">
                      Uploaded Photos ({formData.images.length}):
                    </span>
                    <div className="flex flex-wrap gap-3">
                      {formData.images.map((img, idx) => (
                        <div 
                          key={idx} 
                          className="relative group w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-amber-300 bg-white shadow-xs"
                        >
                          <img
                            src={resolveProductImage(img, DEFAULT_IMAGE)}
                            alt={`Pickle photo ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />

                          {/* Primary Badge */}
                          {idx === 0 ? (
                            <span className="absolute top-1 left-1 bg-brand-green text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-md shadow-xs">
                              Primary
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleMakePrimary(idx)}
                              className="absolute top-1 left-1 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-brand-green"
                              title="Make this the main photo"
                            >
                              Set Primary
                            </button>
                          )}

                          {/* Remove button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 right-1 bg-chilli text-white p-1 rounded-full opacity-90 hover:opacity-100 transition-all hover:scale-110 shadow-xs cursor-pointer"
                            title="Remove photo"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* BASIC DETAILS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold block mb-1 text-gray-800">Pickle Name (English) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Banarasi Lal Mirch Ka Bharwa Achar"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-brand-green text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1 text-gray-800">Hindi Title (हिंदी नाम)</label>
                  <input
                    type="text"
                    placeholder="e.g. बनारसी भरवां लाल मिर्च अचार"
                    value={formData.hindiName}
                    onChange={(e) => setFormData({ ...formData, hindiName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-brand-green text-xs"
                  />
                </div>
              </div>

              {/* CATEGORY */}
              <div>
                <label className="font-bold block mb-1 text-gray-800">Pickle Category (मुख्य कैटेगरी) *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-brand-green text-xs font-medium"
                >
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* TASTE & VARIETY SUB-CATEGORY */}
              <div className="p-3.5 bg-amber-50/70 border border-amber-200/90 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-xs text-gray-900 flex items-center gap-1.5">
                    <span>Sub-Category & Variety (सब-कैटेगरी और प्रकार)</span>
                    {formData.subCategory && (
                      <span className="text-[10px] text-amber-900 font-bold px-2 py-0.5 bg-amber-200/80 rounded-md border border-amber-300">
                        Selected: {formData.subCategory}
                      </span>
                    )}
                  </label>
                  {formData.subCategory && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, subCategory: '' })}
                      className="text-[11px] text-gray-400 hover:text-chilli font-semibold cursor-pointer"
                    >
                      Clear Selection
                    </button>
                  )}
                </div>

                {/* If selected category has subcategories configured in Admin Categories */}
                {(() => {
                  const selCat = categories.find(c => c.slug === formData.category || c._id === formData.category);
                  const subList = selCat?.subCategories || [];
                  if (subList.length > 0) {
                    return (
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold text-[#b35400] block">
                          {selCat.name} Specific Varieties (इस कैटेगरी की सब-कैटेगरी):
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {subList.map((sub, sIdx) => {
                            const isSelected = (formData.subCategory || '').toLowerCase() === sub.slug.toLowerCase();
                            return (
                              <button
                                key={sIdx}
                                type="button"
                                onClick={() => setFormData({ ...formData, subCategory: isSelected ? '' : sub.slug })}
                                className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                  isSelected
                                    ? 'bg-brand-green text-white border-brand-green shadow-xs'
                                    : 'bg-white hover:bg-amber-100 text-gray-800 border-amber-200'
                                }`}
                              >
                                <span>{sub.name}</span>
                                {sub.hindiName && (
                                  <span className={`text-[10px] font-normal ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>
                                    ({sub.hindiName})
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}

                <div>
                  <span className="text-[11px] font-bold text-gray-700 block mb-1">
                    Or select by general taste profile (स्वाद अनुसार):
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                    {TASTE_SUBCATEGORIES.map((taste) => {
                      const isSelected = (formData.subCategory || '').toLowerCase() === taste.id;
                      return (
                        <button
                          key={taste.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, subCategory: isSelected ? '' : taste.id })}
                          className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all text-center cursor-pointer ${
                            isSelected
                              ? 'bg-brand-green text-white border-brand-green shadow-xs font-bold ring-2 ring-brand-green/20 scale-[1.02]'
                              : 'bg-white hover:bg-amber-100/70 text-gray-800 border-gray-200 hover:border-amber-300'
                          }`}
                        >
                          <span className="text-xl mb-1">{taste.icon}</span>
                          <span className="text-xs font-bold leading-tight">{taste.name}</span>
                          <span className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                            {taste.hindiName}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* DESCRIPTIONS */}
              <div>
                <label className="font-bold block mb-1 text-gray-800">Short Description (1-2 sentences) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sun-cured raw mangoes infused with cold-pressed mustard oil and roasted spices."
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-brand-green text-xs"
                />
              </div>

              <div>
                <label className="font-bold block mb-1 text-gray-800">Full Heritage Story & Preparation *</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Describe the grandmother's recipe, sun-curing method, authentic spices, and specialty..."
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-brand-green text-xs"
                />
              </div>

              {/* WEIGHT & PRICE VARIANTS */}
              <div className="bg-amber-50/40 p-4 sm:p-5 rounded-2xl border border-amber-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <label className="font-bold text-gray-900 text-sm block">
                      Weight & Price Variants (वज़न और कीमतें) *
                    </label>
                    <p className="text-[11px] text-gray-500">
                      Click below pills to instantly add standard sizes with ready-made prices (कोई ब्लैंक बॉक्स नहीं भरना पड़ेगा):
                    </p>
                  </div>
                </div>

                {/* Instant 1-Click Weight Preset Pills */}
                <div className="flex flex-wrap items-center gap-2 mb-4 p-2.5 bg-white rounded-xl border border-amber-300 shadow-2xs">
                  <span className="text-[11px] font-black text-amber-900 uppercase tracking-wide">
                    1-Click Add:
                  </span>
                  {PRESET_OPTIONS.map((opt) => {
                    const isAdded = formData.variants.some(v => (v.weight || '').toLowerCase() === opt.weight.toLowerCase());
                    return (
                      <button
                        key={opt.weight}
                        type="button"
                        onClick={() => addQuickVariant(opt.weight, opt.price, opt.originalPrice)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                          isAdded
                            ? 'bg-brand-green/10 text-brand-green border-brand-green ring-1 ring-brand-green/20'
                            : 'bg-amber-50 hover:bg-amber-100 text-gray-800 border-amber-300 shadow-2xs hover:scale-105'
                        }`}
                      >
                        <span className="font-black">{isAdded ? '✓' : '+'}</span>
                        <span>{opt.weight}</span>
                        <span className="text-[10px] text-gray-500 font-normal">({formatPrice(opt.price)})</span>
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={addCustomVariant}
                    className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-bold rounded-xl border border-gray-300 cursor-pointer"
                  >
                    + Custom
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.variants.map((v, i) => (
                    <div key={i} className="bg-white p-3 rounded-xl border border-gray-200 shadow-2xs space-y-2">
                      <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
                        <div className="w-32">
                          <label className="text-[10px] font-bold text-gray-500 uppercase block mb-0.5">Weight (वज़न)</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 250g"
                            value={v.weight}
                            onChange={(e) => updateVariant(i, 'weight', e.target.value)}
                            className="w-full p-2 rounded-lg border border-gray-300 text-xs font-bold text-gray-900"
                          />
                        </div>

                        <div className="w-28">
                          <label className="text-[10px] font-bold text-gray-500 uppercase block mb-0.5">Selling Price (₹)</label>
                          <input
                            type="number"
                            required
                            placeholder="249"
                            value={v.price}
                            onChange={(e) => updateVariant(i, 'price', Number(e.target.value))}
                            className="w-full p-2 rounded-lg border border-gray-300 text-xs font-black text-brand-green"
                          />
                        </div>

                        <div className="w-28">
                          <label className="text-[10px] font-bold text-gray-500 uppercase block mb-0.5">MRP / Original (₹)</label>
                          <input
                            type="number"
                            placeholder="299"
                            value={v.originalPrice || ''}
                            onChange={(e) => updateVariant(i, 'originalPrice', Number(e.target.value))}
                            className="w-full p-2 rounded-lg border border-gray-300 text-xs text-gray-700"
                          />
                        </div>

                        <div className="w-24">
                          <label className="text-[10px] font-bold text-gray-500 uppercase block mb-0.5">Stock Count</label>
                          <input
                            type="number"
                            placeholder="50"
                            value={v.stockCount}
                            onChange={(e) => updateVariant(i, 'stockCount', Number(e.target.value))}
                            className="w-full p-2 rounded-lg border border-gray-300 text-xs font-medium"
                          />
                        </div>

                        <div className="flex items-center gap-3 sm:ml-auto pt-2 sm:pt-4">
                          <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={v.inStock !== false}
                              onChange={(e) => updateVariant(i, 'inStock', e.target.checked)}
                              className="rounded text-brand-green"
                            />
                            <span>In Stock</span>
                          </label>

                          <button
                            type="button"
                            onClick={() => removeVariant(i)}
                            className="p-1.5 text-gray-400 hover:text-chilli hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                            title="Remove variant"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Quick weight selector chips for this row */}
                      <div className="flex items-center gap-1 pt-1 border-t border-gray-100">
                        <span className="text-[9px] text-gray-400 font-bold uppercase mr-1">Switch:</span>
                        {['250g', '500g', '1kg', '2kg', 'Combo Pack'].map(w => (
                          <button
                            key={w}
                            type="button"
                            onClick={() => updateVariant(i, 'weight', w)}
                            className={`text-[10px] px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                              v.weight === w
                                ? 'bg-brand-green text-white font-bold'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {w}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* INGREDIENTS & SHELF LIFE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold block mb-1 text-gray-800">Ingredients (comma separated)</label>
                  <input
                    type="text"
                    placeholder="Raw Mango, Mustard Oil, Fenugreek, Saunf, Rock Salt"
                    value={formData.ingredients}
                    onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-brand-green text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1 text-gray-800">Oil Type (तेल का प्रकार)</label>
                  <input
                    type="text"
                    placeholder="Pure Kachi Ghani Mustard Oil (सरसों का तेल)"
                    value={formData.oilType}
                    onChange={(e) => setFormData({ ...formData, oilType: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-brand-green text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold block mb-1 text-gray-800">Shelf Life</label>
                  <input
                    type="text"
                    placeholder="12 Months from packaging date"
                    value={formData.shelfLife}
                    onChange={(e) => setFormData({ ...formData, shelfLife: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-brand-green text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1 text-gray-800">Pairs Best With (comma separated)</label>
                  <input
                    type="text"
                    placeholder="Aloo Paratha, Dal Khichdi, Missi Roti, Mathri"
                    value={formData.pairWith}
                    onChange={(e) => setFormData({ ...formData, pairWith: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-brand-green text-xs"
                  />
                </div>
              </div>

              {/* BADGES & FLAGS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                  <input
                    type="checkbox"
                    checked={formData.isBestSeller}
                    onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                    className="rounded text-brand-green w-4 h-4"
                  />
                  <span>⭐ Bestseller</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => {
                      if (e.target.checked) {
                        const currentFeaturedCount = products.filter(
                          p => p.isFeatured && (!editingProduct || (p._id !== editingProduct._id && p.slug !== editingProduct.slug))
                        ).length;
                        if (currentFeaturedCount >= 4) {
                          alert('Home page par sirf 4 hi products add ho sakte hain! Kripya pehle kisi doosre product ko uncheck karein.');
                          return;
                        }
                      }
                      setFormData({ ...formData, isFeatured: e.target.checked });
                    }}
                    className="rounded text-brand-green w-4 h-4"
                  />
                  <span>🏠 Homepage (Max 4)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                  <input
                    type="checkbox"
                    checked={formData.isNewArrival}
                    onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                    className="rounded text-brand-green w-4 h-4"
                  />
                  <span>✨ New Arrival</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded text-brand-green w-4 h-4"
                  />
                  <span>🟢 Active / Live</span>
                </label>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingImage}
                  className="px-7 py-2.5 rounded-xl bg-brand-green hover:bg-brand-green-light text-white font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
                >
                  {uploadingImage && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingProduct ? 'Save Changes' : 'Publish Pickle Product'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminProducts;

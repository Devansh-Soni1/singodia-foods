import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { Filter, SlidersHorizontal, X, Sparkles, ChevronDown } from 'lucide-react';
import { ProductCard } from '../components/product/ProductCard';
import { QuickViewModal } from '../components/product/QuickViewModal';
import { productAPI, categoryAPI } from '../services/api';
import { TASTE_SUBCATEGORIES, getTasteInfo } from '../constants/tasteSubCategories';

export const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categorySlug, subCategorySlug, slug } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProductForQuickView, setSelectedProductForQuickView] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Normalize category slugs (e.g. 'mango-pickle' -> 'mango-pickles')
  const normalizeCategory = (s = '') => {
    if (!s || s === 'all') return 'all';
    const c = s.toLowerCase().replace(/\/$/, '');
    if (c === 'mango-pickle') return 'mango-pickles';
    if (c === 'red-chilli-pickle') return 'red-chilli-pickles';
    if (c === 'green-chilli-pickle') return 'green-chilli-pickles';
    if (c === 'lemon-pickle') return 'lemon-pickles';
    if (c === 'garlic-pickle') return 'garlic-pickles';
    if (c === 'mixed-pickle') return 'mixed-pickles';
    if (c === 'sweet-pickle') return 'sweet-pickles';
    return c;
  };

  // Extract category and subcategory from clean URL path, fallback to searchParams
  const rawCat = categorySlug || (slug && slug !== 'all' ? slug : null) || searchParams.get('category') || 'all';
  const categoryParam = normalizeCategory(rawCat);

  const rawSub = subCategorySlug || searchParams.get('subCategory') || searchParams.get('taste') || 'all';
  const subCategoryParam = rawSub ? rawSub.toLowerCase().replace(/\/$/, '') : 'all';
  const sortParam = searchParams.get('sort') || 'popular';
  const searchParam = searchParams.get('q') || '';
  const bestsellersParam = searchParams.get('bestsellers') === 'true';
  const jainParam = searchParams.get('jain') === 'true';

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await categoryAPI.getCategories();
        if (Array.isArray(res.categories) && res.categories.length > 0) {
          setCategories(res.categories);
        }
      } catch (e) {}
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const fetchFiltered = async () => {
      setLoading(true);
      try {
        const res = await productAPI.getProducts({
          category: categoryParam !== 'all' ? categoryParam : undefined,
          subCategory: subCategoryParam !== 'all' ? subCategoryParam : undefined,
          sort: sortParam,
          search: searchParam,
          isBestSeller: bestsellersParam ? 'true' : undefined
        });
        let list = Array.isArray(res.products) ? res.products : [];

        // Apply subCategory taste filter on fallback / local results
        if (subCategoryParam !== 'all') {
          const rawSub = subCategoryParam.toLowerCase();
          const cleanWords = rawSub.replace(/-/g, ' ').split(' ').filter(w => !['pickle', 'pickles', 'achar', 'ka', 'ke', 'style'].includes(w));
          list = list.filter(p => {
            const pSub = (p.subCategory || '').toLowerCase();
            const pName = (p.name || '').toLowerCase();
            const pHindi = (p.hindiName || '').toLowerCase();
            const pSlug = (p.slug || '').toLowerCase();
            const pTags = Array.isArray(p.tags) ? p.tags.join(' ').toLowerCase() : (p.tags || '').toLowerCase();

            if (pSub === rawSub || pSlug === rawSub || pSlug.includes(rawSub)) return true;
            if (cleanWords.length > 0) {
              return cleanWords.some(w => pSub.includes(w) || pName.includes(w) || pHindi.includes(w) || pTags.includes(w) || pSlug.includes(w));
            }
            return false;
          });
        }
        
        // Jain friendly filter
        if (jainParam) {
          list = list.filter(p => 
            p.category === 'lemon-pickles' || 
            p.category === 'mango-pickles' || 
            p.tags?.includes('Jain Friendly') || 
            !p.ingredients?.some(i => i.toLowerCase().includes('garlic') || i.toLowerCase().includes('lahsun'))
          );
        }

        setProducts(list);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFiltered();
  }, [categoryParam, subCategoryParam, sortParam, searchParam, bestsellersParam, jainParam]);

  const updateFilter = (key, value) => {
    if (key === 'category') {
      if (value === 'all' || !value) {
        navigate('/shop/');
      } else {
        navigate(`/category/${value}/`);
      }
      return;
    }

    if (key === 'subCategory') {
      if (value === 'all' || !value) {
        if (categoryParam !== 'all') {
          navigate(`/category/${categoryParam}/`);
        } else {
          navigate('/shop/');
        }
      } else {
        if (categoryParam !== 'all') {
          navigate(`/category/${categoryParam}/${value}/`);
        } else {
          navigate(`/shop/taste/${value}/`);
        }
      }
      return;
    }

    const newParams = new URLSearchParams(searchParams);
    if (value === 'all' || !value) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    navigate('/shop/');
    setSearchParams({});
  };

  return (
    <div className="py-8 sm:py-12 bg-[#FAF6EF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <div className="text-xs text-earth-brown mb-1.5 flex items-center gap-1.5 flex-wrap">
            <button onClick={() => navigate('/')} className="hover:text-brand-green">Home</button>
            <span>/</span>
            <button onClick={() => navigate('/shop/')} className="hover:text-brand-green">All Pickles</button>
            {categoryParam !== 'all' && (
              <>
                <span>/</span>
                <button onClick={() => navigate(`/category/${categoryParam}/`)} className="font-bold text-brand-green capitalize hover:underline">
                  {categoryParam.replace(/-/g, ' ')}
                </button>
              </>
            )}
            {subCategoryParam !== 'all' && (
              <>
                <span>/</span>
                <span className="font-bold text-amber-800 capitalize bg-amber-100/90 border border-amber-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5">
                  <span>{subCategoryParam.replace(/-/g, ' ')}</span>
                  <button 
                    onClick={() => updateFilter('subCategory', 'all')} 
                    className="hover:text-red-600 font-black text-xs ml-0.5"
                    title="Clear subcategory filter"
                  >
                    ×
                  </button>
                </span>
              </>
            )}
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-charcoal font-serif capitalize">
            {categoryParam !== 'all'
              ? `${categoryParam.replace(/-/g, ' ')} ${subCategoryParam !== 'all' ? `— ${subCategoryParam.replace(/-/g, ' ')}` : ''}`
              : 'Traditional Desi Pickles (देसी आचार)'}
          </h1>
          <p className="text-xs sm:text-sm text-earth-brown mt-1">
            {categoryParam !== 'all'
              ? `Authentic homemade Rajasthani ${categoryParam.replace(/-/g, ' ')} cured in pure cold-pressed mustard oil.`
              : 'Hand-crafted in small batches, sun-cured in ceramic martabans with pure mustard oil.'}
          </p>
        </div>

        {/* Top Control Bar: Mobile Filter Toggle + Sorting */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-cream-200 shadow-card mb-8">
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cream-100 text-charcoal font-bold text-xs"
            >
              <SlidersHorizontal className="w-4 h-4 text-brand-green" />
              <span>Filters</span>
            </button>
            <span className="text-xs font-semibold text-earth-brown">
              Showing <strong className="text-charcoal">{products.length}</strong> authentic varieties
            </span>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-earth-brown font-medium hidden sm:inline">Sort by:</span>
            <select
              value={sortParam}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="bg-cream-50 border border-cream-200 text-charcoal font-bold rounded-lg px-3 py-1.5 focus:outline-none focus:border-brand-green"
            >
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
              <option value="newest">New Arrivals</option>
            </select>
          </div>

        </div>

        {/* Active Filter Pills */}
        {(categoryParam !== 'all' || subCategoryParam !== 'all' || bestsellersParam || searchParam) && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs text-earth-brown font-semibold">Active Filters:</span>
            {categoryParam !== 'all' && (
              <span className="inline-flex items-center gap-1 text-xs bg-cream-200 text-charcoal px-3 py-1 rounded-full font-bold">
                Category: {categoryParam.replace(/-/g, ' ')}
                <X className="w-3 h-3 cursor-pointer hover:text-chilli" onClick={() => updateFilter('category', 'all')} />
              </span>
            )}
            {subCategoryParam !== 'all' && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-full font-bold">
                <span>Taste: {getTasteInfo(subCategoryParam)?.name || subCategoryParam} {getTasteInfo(subCategoryParam)?.icon}</span>
                <X className="w-3 h-3 cursor-pointer hover:text-chilli" onClick={() => updateFilter('subCategory', 'all')} />
              </span>
            )}
            {bestsellersParam && (
              <span className="inline-flex items-center gap-1 text-xs bg-cream-200 text-charcoal px-3 py-1 rounded-full font-bold">
                Bestsellers Only
                <X className="w-3 h-3 cursor-pointer hover:text-chilli" onClick={() => updateFilter('bestsellers', '')} />
              </span>
            )}
            {searchParam && (
              <span className="inline-flex items-center gap-1 text-xs bg-cream-200 text-charcoal px-3 py-1 rounded-full font-bold">
                Search: "{searchParam}"
                <X className="w-3 h-3 cursor-pointer hover:text-chilli" onClick={() => updateFilter('q', '')} />
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-xs text-chilli font-bold hover:underline ml-2"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Layout: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Filters Sidebar */}
          <aside className={`lg:block ${mobileFilterOpen ? 'block' : 'hidden'} space-y-6`}>
            
            {/* Category Filter */}
            <div className="bg-white rounded-2xl p-5 border border-cream-200 shadow-card">
              <h3 className="text-sm font-bold text-charcoal font-serif mb-3 pb-2 border-b border-cream-100 flex items-center justify-between">
                <span>Categories</span>
                {categoryParam !== 'all' && (
                  <button onClick={() => updateFilter('category', 'all')} className="text-[11px] text-chilli font-semibold">
                    Reset
                  </button>
                )}
              </h3>
              <div className="space-y-1.5">
                <button
                  onClick={() => updateFilter('category', 'all')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                    categoryParam === 'all' ? 'bg-brand-green text-white font-bold' : 'text-charcoal hover:bg-cream-100'
                  }`}
                >
                  <span>All Categories</span>
                  <span>{products.length}</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => updateFilter('category', cat.slug)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                      categoryParam === cat.slug ? 'bg-brand-green text-white font-bold' : 'text-charcoal hover:bg-cream-100'
                    }`}
                  >
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Taste Profile Sub-Category Filter */}
            <div className="bg-white rounded-2xl p-5 border border-cream-200 shadow-card">
              <h3 className="text-sm font-bold text-charcoal font-serif mb-3 pb-2 border-b border-cream-100 flex items-center justify-between">
                <span>Taste Profile (स्वाद अनुसार)</span>
                {subCategoryParam !== 'all' && (
                  <button onClick={() => updateFilter('subCategory', 'all')} className="text-[11px] text-chilli font-semibold">
                    Reset
                  </button>
                )}
              </h3>
              <div className="space-y-1.5">
                <button
                  onClick={() => updateFilter('subCategory', 'all')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                    subCategoryParam === 'all' ? 'bg-brand-green text-white font-bold' : 'text-charcoal hover:bg-cream-100'
                  }`}
                >
                  <span>All Taste Profiles</span>
                </button>
                {TASTE_SUBCATEGORIES.map((taste) => {
                  const isSelected = subCategoryParam.toLowerCase() === taste.id;
                  return (
                    <button
                      key={taste.id}
                      onClick={() => updateFilter('subCategory', isSelected ? 'all' : taste.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                        isSelected ? 'bg-brand-green text-white font-bold' : 'text-charcoal hover:bg-cream-100'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{taste.icon}</span>
                        <span>{taste.name}</span>
                        <span className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-earth-brown'}`}>
                          ({taste.hindiName})
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Banner */}
            <div className="bg-gradient-to-br from-mustard to-mustard-dark text-brand-green-dark rounded-2xl p-5 shadow-card text-center space-y-2">
              <Sparkles className="w-6 h-6 mx-auto fill-current" />
              <h4 className="font-bold text-sm font-serif">Custom Gift Boxes</h4>
              <p className="text-[11px] leading-tight">
                Curate any 3 or 4 jars of your favorite homemade pickles with custom discount!
              </p>
              <button
                onClick={() => window.location.href = '/build-combo'}
                className="mt-2 w-full py-2 bg-brand-green text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Build Box Now
              </button>
            </div>

          </aside>

          {/* Products Grid */}
          <main className="lg:col-span-3">
            {/* Quick Taste Sub-Category Chips Bar */}
            <div className="bg-white rounded-2xl p-3.5 border border-cream-200 shadow-card mb-6">
              <div className="flex items-center justify-between mb-2 px-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-charcoal">Sub-Category (स्वाद अनुसार):</span>
                  {categoryParam !== 'all' && (
                    <span className="text-[11px] font-semibold text-brand-green bg-brand-green/10 px-2 py-0.5 rounded-full capitalize">
                      {categoryParam.replace(/-/g, ' ')}
                    </span>
                  )}
                </div>
                {subCategoryParam !== 'all' && (
                  <button 
                    onClick={() => updateFilter('subCategory', 'all')}
                    className="text-[11px] text-chilli font-bold hover:underline"
                  >
                    Clear Taste Filter
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => updateFilter('subCategory', 'all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    subCategoryParam === 'all'
                      ? 'bg-charcoal text-white shadow-xs'
                      : 'bg-cream-100 text-charcoal hover:bg-cream-200'
                  }`}
                >
                  All
                </button>
                {TASTE_SUBCATEGORIES.map((taste) => {
                  const isSelected = subCategoryParam.toLowerCase() === taste.id;
                  return (
                    <button
                      key={taste.id}
                      onClick={() => updateFilter('subCategory', isSelected ? 'all' : taste.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                        isSelected
                          ? 'bg-brand-green text-white border-brand-green shadow-xs ring-2 ring-brand-green/20'
                          : 'bg-white text-charcoal border-cream-200 hover:border-amber-400 hover:bg-amber-50/50'
                      }`}
                    >
                      <span>{taste.icon}</span>
                      <span>{taste.name}</span>
                      <span className={`text-[10px] font-normal ${isSelected ? 'text-white/80' : 'text-earth-brown'}`}>
                        ({taste.hindiName})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-cream-200" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-cream-200 shadow-card">
                <div className="w-16 h-16 bg-cream-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                  🏺
                </div>
                <h3 className="text-lg font-bold text-charcoal font-serif mb-1">
                  No pickles found matching this filter
                </h3>
                <p className="text-xs text-earth-brown mb-6 max-w-sm mx-auto">
                  Try adjusting your spice level or category selection to see our full traditional Rajasthani range.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-brand-green text-white text-xs font-bold px-6 py-2.5 rounded-full"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product._id || product.slug}
                    product={product}
                    onQuickView={(p) => setSelectedProductForQuickView(p)}
                  />
                ))}
              </div>
            )}
          </main>

        </div>

      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={selectedProductForQuickView}
        isOpen={!!selectedProductForQuickView}
        onClose={() => setSelectedProductForQuickView(null)}
      />

    </div>
  );
};

export default ShopPage;


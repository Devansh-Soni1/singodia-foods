import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, X, Sparkles, ChevronDown } from 'lucide-react';
import { ProductCard } from '../components/product/ProductCard';
import { QuickViewModal } from '../components/product/QuickViewModal';
import { productAPI } from '../services/api';
import { SAMPLE_CATEGORIES, SAMPLE_PRODUCTS } from '../utils/sampleData';

export const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState(SAMPLE_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [selectedProductForQuickView, setSelectedProductForQuickView] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter states
  const categoryParam = searchParams.get('category') || 'all';
  const spiceParam = searchParams.get('spice') || 'all';
  const sortParam = searchParams.get('sort') || 'popular';
  const searchParam = searchParams.get('q') || '';
  const bestsellersParam = searchParams.get('bestsellers') === 'true';
  const jainParam = searchParams.get('jain') === 'true';
  const tasteParam = searchParams.get('taste') || '';

  useEffect(() => {
    const fetchFiltered = async () => {
      setLoading(true);
      try {
        const res = await productAPI.getProducts({
          category: categoryParam,
          spiceLevel: spiceParam,
          sort: sortParam,
          search: searchParam,
          isBestSeller: bestsellersParam ? 'true' : undefined
        });
        let list = res.products || SAMPLE_PRODUCTS;
        
        // Jain friendly filter
        if (jainParam) {
          list = list.filter(p => 
            p.category === 'lemon-pickles' || 
            p.category === 'mango-pickles' || 
            p.tags?.includes('Jain Friendly') || 
            !p.ingredients?.some(i => i.toLowerCase().includes('garlic') || i.toLowerCase().includes('lahsun'))
          );
        }

        // Sweet taste filter
        if (tasteParam === 'sweet') {
          list = list.filter(p => 
            p.category === 'lemon-pickles' || 
            p.name?.toLowerCase().includes('khatta meetha') || 
            p.name?.toLowerCase().includes('sweet') || 
            p.tags?.includes('Sweet')
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
  }, [categoryParam, spiceParam, sortParam, searchParam, bestsellersParam, jainParam, tasteParam]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === 'all' || !value) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  const spiceLevels = [
    { id: 'all', label: 'All Spice Levels' },
    { id: 'Mild', label: 'Mild Spice (कम तीखा)' },
    { id: 'Medium', label: 'Medium Spice (मध्यम तीखा)' },
    { id: 'Spicy', label: 'Spicy (तीखा)' },
    { id: 'Extra Spicy', label: 'Teekha / Extra Spicy (बहुत तीखा)' },
  ];

  return (
    <div className="py-8 sm:py-12 bg-[#FAF6EF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <div className="text-xs text-earth-brown mb-1.5">
            <span>Home</span> / <span className="font-bold text-charcoal">All Pickles</span>
            {categoryParam !== 'all' && (
              <> / <span className="text-brand-green font-bold capitalize">{categoryParam.replace(/-/g, ' ')}</span></>
            )}
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-charcoal font-serif">
            Traditional Desi Pickles (देसी आचार)
          </h1>
          <p className="text-xs sm:text-sm text-earth-brown mt-1">
            Hand-crafted in small batches, sun-cured in ceramic martabans with pure mustard oil.
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
        {(categoryParam !== 'all' || spiceParam !== 'all' || bestsellersParam || searchParam) && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs text-earth-brown font-semibold">Active Filters:</span>
            {categoryParam !== 'all' && (
              <span className="inline-flex items-center gap-1 text-xs bg-cream-200 text-charcoal px-3 py-1 rounded-full font-bold">
                Category: {categoryParam.replace(/-/g, ' ')}
                <X className="w-3 h-3 cursor-pointer hover:text-chilli" onClick={() => updateFilter('category', 'all')} />
              </span>
            )}
            {spiceParam !== 'all' && (
              <span className="inline-flex items-center gap-1 text-xs bg-cream-200 text-charcoal px-3 py-1 rounded-full font-bold">
                Spice: {spiceParam}
                <X className="w-3 h-3 cursor-pointer hover:text-chilli" onClick={() => updateFilter('spice', 'all')} />
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
                  <span>{SAMPLE_PRODUCTS.length}</span>
                </button>
                {SAMPLE_CATEGORIES.map((cat) => (
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

            {/* Spice Level Filter */}
            <div className="bg-white rounded-2xl p-5 border border-cream-200 shadow-card">
              <h3 className="text-sm font-bold text-charcoal font-serif mb-3 pb-2 border-b border-cream-100 flex items-center justify-between">
                <span>Spice Level (तीखापन)</span>
                {spiceParam !== 'all' && (
                  <button onClick={() => updateFilter('spice', 'all')} className="text-[11px] text-chilli font-semibold">
                    Reset
                  </button>
                )}
              </h3>
              <div className="space-y-1.5">
                {spiceLevels.map((lvl) => (
                  <button
                    key={lvl.id}
                    onClick={() => updateFilter('spice', lvl.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                      spiceParam === lvl.id ? 'bg-brand-green text-white font-bold' : 'text-charcoal hover:bg-cream-100'
                    }`}
                  >
                    {lvl.label}
                  </button>
                ))}
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


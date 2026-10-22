import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Flame, ChevronRight } from 'lucide-react';
import { productAPI } from '../../services/api';
import { formatPrice } from '../../utils/formatCurrency';

export const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await productAPI.getProducts({ search: query.trim() });
        setResults(Array.isArray(res.products) ? res.products : []);
      } catch (err) {
        setResults([]);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSelectProduct = (slug) => {
    onClose();
    navigate(`/product/${slug}/`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-cream-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-cream-200 bg-cream-50">
          <Search className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search our store (e.g. Aam, Banarasi Lal Mirch, Kair Sangri)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm font-medium text-charcoal placeholder-gray-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-gray-400 hover:text-charcoal p-1 mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-bold text-earth-brown hover:text-charcoal px-2.5 py-1 bg-cream-200 rounded-md"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
          {query && results.length === 0 && (
            <div className="text-center py-8 text-earth-brown text-xs">
              No pickles matching "<strong>{query}</strong>". Try searching for <em>Lal Mirch</em>, <em>Aam</em>, or <em>Nimbu</em>.
            </div>
          )}

          {!query && (
            <div className="py-3 px-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-earth-brown mb-2">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {['Banarasi Lal Mirch', 'Aam Ka Achar', 'Kair Sangri', 'Oil-Free Nimbu', 'Trial Box', 'Hari Mirch'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="text-xs px-3 py-1.5 bg-cream-100 hover:bg-mustard-light rounded-full text-charcoal font-semibold border border-cream-200 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {results.map((product) => (
            <div
              key={product._id || product.slug}
              onClick={() => handleSelectProduct(product.slug)}
              className="flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-cream-100 cursor-pointer transition-colors group"
            >
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-14 h-14 object-cover rounded-lg flex-shrink-0 border border-cream-200"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-charcoal group-hover:text-brand-green truncate">
                    {product.name}
                  </h4>
                  <span className="text-[11px] text-earth-brown hidden sm:inline">
                    ({product.hindiName})
                  </span>
                </div>
                <p className="text-[11px] text-earth-brown line-clamp-1 mt-0.5">
                  {product.shortDescription}
                </p>
                <div className="flex items-center gap-3 mt-1 text-xs">
                  <span className="font-bold text-brand-green">
                    {formatPrice(product.variants[0]?.price)}
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium">
                    Starting from {product.variants[0]?.weight}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-brand-green group-hover:translate-x-0.5 transition-transform" />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default SearchModal;


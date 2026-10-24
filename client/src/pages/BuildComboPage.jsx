import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Plus, Check, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { productAPI } from '../services/api';
import { formatPrice } from '../utils/formatCurrency';
import { useCart } from '../context/CartContext';
import { resolveProductImage } from '../utils/imageUtils';

export const BuildComboPage = () => {
  const [boxSize, setBoxSize] = useState(3); // 3 or 4 jars
  const [selectedJars, setSelectedJars] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const fetchPickles = async () => {
      setLoading(true);
      try {
        const res = await productAPI.getProducts({ limit: 60 });
        if (Array.isArray(res.products)) {
          setAvailableProducts(res.products.filter(p => p.category !== 'combo-packs'));
        }
      } catch (e) {
        setAvailableProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPickles();
  }, []);

  const boxPricing = {
    3: { price: 649, originalPrice: 750, label: '3-Jar Artisanal Box (Any 3 Pickles)' },
    4: { price: 849, originalPrice: 999, label: '4-Jar Grand Hamper (Any 4 Pickles)' }
  };

  const currentPricing = boxPricing[boxSize];

  const handleSelectBoxSize = (size) => {
    setBoxSize(size);
    if (selectedJars.length > size) {
      setSelectedJars(selectedJars.slice(0, size));
    }
  };

  const handleAddJar = (product) => {
    if (selectedJars.length >= boxSize) return;
    setSelectedJars([...selectedJars, product]);
  };

  const handleRemoveJar = (index) => {
    const updated = [...selectedJars];
    updated.splice(index, 1);
    setSelectedJars(updated);
  };

  const handleAddComboToCart = () => {
    if (selectedJars.length !== boxSize) return;

    const comboItem = {
      _id: `custom-combo-${Date.now()}`,
      name: `Custom ${boxSize}-Jar Pickle Hamper`,
      hindiName: `कस्टम ${boxSize} आचार हैंपर`,
      slug: `custom-combo-${boxSize}-jars`,
      images: [selectedJars[0]?.images?.[0] || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80'],
      variants: [
        {
          weight: `${boxSize} x 250g Jars (${selectedJars.map(j => j.name.split(' ')[0]).join(', ')})`,
          price: currentPricing.price,
          originalPrice: currentPricing.originalPrice
        }
      ]
    };

    addToCart(comboItem, comboItem.variants[0], 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const remainingSlots = boxSize - selectedJars.length;

  return (
    <div className="py-10 sm:py-16 bg-[#FAF6EF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mustard-light/70 text-brand-green-dark text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-mustard-dark fill-mustard" />
            <span>Personalized Pickle Box</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-charcoal font-serif">
            Build Your Own Pickle Combo
          </h1>
          <p className="text-xs sm:text-sm text-earth-brown mt-2">
            Choose your favorite jars, curate your personal combination, and enjoy our exclusive combo bundle discount!
          </p>
        </div>

        {/* Step 1: Choose Box Size */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-brand-green text-white text-xs font-bold flex items-center justify-center">
              1
            </span>
            <h2 className="text-base sm:text-lg font-bold text-charcoal font-serif">
              Choose Your Hamper Size
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[3, 4].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => handleSelectBoxSize(size)}
                className={`p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                  boxSize === size
                    ? 'border-brand-green bg-cream-50/80 shadow-xs'
                    : 'border-cream-200 bg-white hover:border-cream-300'
                }`}
              >
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-charcoal font-serif">
                    {boxPricing[size].label}
                  </h3>
                  <p className="text-xs text-earth-brown mt-0.5">
                    Select any {size} jars (250g each) of your choice
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-400 line-through mr-1.5">
                    {formatPrice(boxPricing[size].originalPrice)}
                  </span>
                  <span className="text-lg font-extrabold text-brand-green">
                    {formatPrice(boxPricing[size].price)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Visual Box Preview Slots */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-green text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h2 className="text-base sm:text-lg font-bold text-charcoal font-serif">
                Your Custom Box Slots ({selectedJars.length} of {boxSize} filled)
              </h2>
            </div>
            {remainingSlots > 0 ? (
              <span className="text-xs font-bold text-chilli">
                Pick {remainingSlots} more {remainingSlots === 1 ? 'pickle' : 'pickles'} below to complete your box!
              </span>
            ) : (
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <Check className="w-4 h-4" /> Box is ready!
              </span>
            )}
          </div>

          {/* Box Slots Mockup */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-cream-100/70 border border-cream-200">
            {[...Array(boxSize)].map((_, index) => {
              const jar = selectedJars[index];
              return (
                <div
                  key={index}
                  className={`aspect-square rounded-xl border-2 border-dashed p-3 flex flex-col items-center justify-center text-center relative transition-all ${
                    jar
                      ? 'border-brand-green bg-white shadow-xs'
                      : 'border-cream-300 bg-cream-50 text-gray-400'
                  }`}
                >
                  {jar ? (
                    <>
                      <button
                        onClick={() => handleRemoveJar(index)}
                        className="absolute top-2 right-2 p-1 rounded-full bg-cream-100 hover:bg-chilli text-charcoal hover:text-white transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <img
                        src={jar.images[0]}
                        alt={jar.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg mb-1"
                      />
                      <p className="text-[11px] font-bold text-charcoal line-clamp-1">
                        {jar.name}
                      </p>
                      <span className="text-[10px] text-earth-brown">250g Jar</span>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-full bg-cream-200 flex items-center justify-center text-gray-400 mb-2">
                        <Plus className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-semibold text-earth-brown">
                        Jar #{index + 1}
                      </span>
                      <span className="text-[10px] text-gray-400">Empty Slot</span>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Button inside box */}
          <div className="mt-6 pt-4 border-t border-cream-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-earth-brown">Bundle Total:</span>
              <div className="text-2xl font-extrabold text-brand-green">
                {formatPrice(currentPricing.price)}
              </div>
            </div>

            <button
              onClick={handleAddComboToCart}
              disabled={selectedJars.length !== boxSize}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                selectedJars.length === boxSize
                  ? 'bg-mustard hover:bg-mustard-dark text-brand-green-dark shadow-md cursor-pointer'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" /> Combo Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 fill-current" />
                  Add Custom Combo Box to Cart
                </>
              )}
            </button>
          </div>
        </div>

        {/* Step 3: Available Pickles to Pick */}
        <div>
          <h3 className="text-xl font-bold text-charcoal font-serif mb-4">
            Pick From Our Artisanal Collection
          </h3>

          {loading ? (
            <div className="py-12 text-center text-xs text-earth-brown font-semibold">
              Loading available pickles...
            </div>
          ) : availableProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-cream-200 p-8 text-center text-charcoal max-w-md mx-auto">
              <p className="font-bold text-sm mb-1">अभी कॉम्बो के लिए कोई अचार उपलब्ध नहीं है</p>
              <p className="text-xs text-earth-brown">जैसे ही एडमिन पैनल से नए अचार अपलोड होंगे, वे यहाँ दिखाई देंगे।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {availableProducts.map((product) => {
              const countInBox = selectedJars.filter(j => (j._id || j.slug) === (product._id || product.slug)).length;
              const isBoxFull = selectedJars.length >= boxSize;

              return (
                <div
                  key={product._id || product.slug}
                  className="bg-white rounded-2xl border border-cream-200 p-4 shadow-card hover:shadow-hover transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-square rounded-xl overflow-hidden bg-cream-100 mb-3">
                      <img
                        src={resolveProductImage(product.images?.[0])}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="text-sm font-bold text-charcoal line-clamp-1 font-serif">
                      {product.name}
                    </h4>
                    <p className="text-xs text-mustard-dark font-medium">
                      {product.hindiName}
                    </p>
                    <p className="text-[11px] text-earth-brown line-clamp-2 mt-1">
                      {product.shortDescription}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-cream-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-earth-brown">
                      {countInBox > 0 && (
                        <span className="bg-brand-green/10 text-brand-green px-2 py-0.5 rounded-full text-[10px]">
                          {countInBox} in box
                        </span>
                      )}
                    </span>

                    <button
                      onClick={() => handleAddJar(product)}
                      disabled={isBoxFull}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                        isBoxFull
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-brand-green hover:bg-brand-green-light text-white shadow-xs'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" /> Add to Box
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default BuildComboPage;


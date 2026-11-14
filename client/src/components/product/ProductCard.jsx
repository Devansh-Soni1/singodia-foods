import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ShoppingBag, Eye, Check, Plus, Minus } from 'lucide-react';
import { formatPrice } from '../../utils/formatCurrency';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { getTasteInfo } from '../../constants/tasteSubCategories';
import { resolveProductImage } from '../../utils/imageUtils';

export const ProductCard = ({ product, onQuickView }) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart, updateQuantity, cartItems } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const variant = product.variants?.[selectedVariantIndex] || { weight: '250g', price: 249, originalPrice: 299 };
  const inWishlist = isInWishlist(product._id || product.slug);

  // Stock calculations
  const maxStock = (variant?.stockCount !== undefined && variant?.stockCount !== null)
    ? Number(variant.stockCount)
    : 50;
  const isOutOfStock = variant?.inStock === false || maxStock <= 0;

  // Cart item matching
  const currentCartItemId = `${product._id || product.slug}-${variant.weight}`;
  const currentCartItem = cartItems?.find(item => item.cartItemId === currentCartItemId);
  const currentQty = currentCartItem ? currentCartItem.quantity : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || currentQty >= maxStock) return;
    addToCart(product, variant, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  // Distinctive badges (handmade purity, sun-cured, oil-free)
  const badges = [];
  if (product.oilType?.toLowerCase().includes('oil-free')) {
    badges.push('Oil-Free');
  }
  const traditionBadge = product.tags?.includes('Jain Friendly') 
    ? 'Jain Friendly' 
    : (product.tags?.includes('Sun-Cured') ? 'Sun-Cured' : 'Handmade Batch');
  badges.push(traditionBadge);

  // Dynamic subtle backdrop color splash for jars matching the card style
  const isRed = product.slug?.includes('red-chilli') || product.name?.toLowerCase().includes('red chilli') || product.name?.toLowerCase().includes('punjabi');
  const isKer = product.slug?.includes('sangri') || product.name?.toLowerCase().includes('sangri');
  
  const backdropGradient = isRed
    ? 'from-red-100/90 via-rose-50/50 to-white'
    : isKer
    ? 'from-amber-100/90 via-orange-50/50 to-white'
    : 'from-amber-100/90 via-yellow-50/50 to-white';

  return (
    <div className="group bg-white rounded-2xl sm:rounded-3xl border border-gray-200/90 shadow-2xs hover:shadow-xl hover:border-amber-300 transition-all duration-300 p-2 sm:p-4 flex flex-col justify-between overflow-hidden relative">
      
      {/* Top Image Container with Splash Backdrop & Badges */}
      <div className={`relative rounded-xl sm:rounded-2xl overflow-hidden aspect-square flex items-center justify-center bg-gradient-to-b ${backdropGradient} mb-1.5 sm:mb-2`}>
        
        {/* "Limited Stock" corner ribbon badge */}
        {(product.isLimitedStock || product.badge === 'Limited Stock' || variant.stockCount <= 15) && (
          <div className="absolute top-1.5 right-0 bg-[#8B1A1A] text-white text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-l-md shadow-xs tracking-wide z-10 uppercase">
            Limited
          </div>
        )}

        {/* Wishlist Heart Icon */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-1.5 left-1.5 z-10 p-1.5 rounded-full backdrop-blur-xs transition-colors shadow-2xs ${
            inWishlist 
              ? 'bg-chilli text-white' 
              : 'bg-white/90 text-gray-500 hover:text-chilli hover:bg-white'
          }`}
          aria-label="Wishlist"
          title="Add to wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Icon */}
        {onQuickView && (
          <button
            onClick={handleQuickViewClick}
            className="absolute bottom-1.5 right-1.5 z-10 p-1.5 rounded-full bg-white/90 hover:bg-white text-gray-500 hover:text-brand-green backdrop-blur-xs transition-colors shadow-2xs opacity-0 group-hover:opacity-100 hidden sm:flex items-center justify-center"
            aria-label="Quick View"
            title="Quick View"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Product Jar Photo */}
        <Link to={`/allpickle/${product.slug}/`} className="w-full h-full flex items-center justify-center p-1 sm:p-2">
          <img
            src={resolveProductImage(product.images?.[0])}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </Link>
      </div>

      {/* Card Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Title (e.g. Homemade Mango Pickle | Aam ka Achar) */}
          <Link to={`/allpickle/${product.slug}/`} className="block">
            <h3 className="text-xs sm:text-[15px] font-bold text-gray-900 group-hover:text-brand-green transition-colors line-clamp-2 leading-snug font-sans min-h-[32px] sm:min-h-[40px]">
              {product.name}
            </h3>
          </Link>

          {/* Rating & Reviews line: ★ 4.7 | 1837 Reviews */}
          <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-gray-600 mt-1 sm:mt-1.5">
            <div className="flex items-center gap-0.5 text-amber-500 font-bold">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-500" />
              <span>{product.rating ? Number(product.rating).toFixed(1) : '4.8'}</span>
            </div>
            <span className="text-gray-300 font-normal">|</span>
            <span className="text-gray-500 font-medium text-[9.5px] sm:text-[11.5px] truncate">
              {product.numReviews || 795} Reviews
            </span>
          </div>

          {/* Distinctive Badges: Taste Sub-Category + Purity Badge */}
          <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 mt-1.5 sm:mt-2.5 mb-2 sm:mb-3">
            {product.subCategory && getTasteInfo(product.subCategory) && (
              <span
                className={`text-[9px] sm:text-[11px] font-bold px-1.5 py-0.2 sm:py-0.5 rounded border flex items-center gap-0.5 shadow-2xs tracking-tight ${getTasteInfo(product.subCategory).badgeClass}`}
                title={`Taste Profile: ${getTasteInfo(product.subCategory).name} (${getTasteInfo(product.subCategory).hindiName})`}
              >
                <span>{getTasteInfo(product.subCategory).icon}</span>
                <span>{getTasteInfo(product.subCategory).name}</span>
              </span>
            )}
            {badges.slice(0, 1).map((badge, idx) => (
              <span
                key={idx}
                className="bg-[#FFF59D] text-gray-800 text-[9px] sm:text-[11px] font-semibold px-1.5 py-0.2 sm:py-0.5 rounded shadow-2xs tracking-tight truncate max-w-[100px] sm:max-w-none"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Variant Selector, Price & Add to Cart */}
        <div className="pt-1.5 sm:pt-2 border-t border-gray-100 mt-1">
          
          {/* Weight Variants */}
          {product.variants && product.variants.length > 1 && (
            <div className="flex items-center gap-1 mb-1.5 sm:mb-2.5 overflow-x-auto scrollbar-none pb-0.5" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {product.variants.map((v, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedVariantIndex(idx);
                  }}
                  className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded transition-colors cursor-pointer shrink-0 ${
                    selectedVariantIndex === idx
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {v.weight}
                </button>
              ))}
            </div>
          )}

          {/* Pricing Row & Add to Cart */}
          <div className="flex items-center justify-between gap-1 mt-1">
            <div className="flex items-baseline gap-1">
              <span className="text-sm sm:text-lg font-black text-gray-900 font-sans">
                {formatPrice(variant.price)}
              </span>
              {variant.originalPrice > variant.price && (
                <span className="text-[10px] sm:text-[11px] text-gray-400 line-through hidden xs:inline">
                  {formatPrice(variant.originalPrice)}
                </span>
              )}
            </div>

            {/* Add to Cart, Out of Stock, or Inline Quantity Controls */}
            {isOutOfStock ? (
              <span className="py-1 px-1.5 rounded-lg font-bold text-[9px] sm:text-[10px] bg-gray-100 text-gray-400 border border-gray-200 select-none">
                Out of Stock
              </span>
            ) : currentQty > 0 ? (
              <div className="flex items-center border border-amber-300 bg-amber-50/80 rounded-lg sm:rounded-xl overflow-hidden shadow-2xs h-7 sm:h-8">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    updateQuantity(currentCartItemId, currentQty - 1);
                  }}
                  className="px-1.5 sm:px-2.5 h-full text-gray-800 hover:text-chilli hover:bg-amber-100 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                  title="Kam karein"
                >
                  <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                </button>
                <span className="px-1 sm:px-1.5 text-xs font-black text-gray-950 min-w-[18px] sm:min-w-[22px] text-center select-none font-sans">
                  {currentQty}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (currentQty < maxStock) {
                      updateQuantity(currentCartItemId, currentQty + 1);
                    }
                  }}
                  disabled={currentQty >= maxStock}
                  className={`px-1.5 sm:px-2.5 h-full flex items-center justify-center transition-colors ${
                    currentQty >= maxStock
                      ? 'opacity-30 cursor-not-allowed text-gray-400 bg-gray-100'
                      : 'text-gray-800 hover:text-brand-green hover:bg-amber-100 cursor-pointer'
                  }`}
                  aria-label="Increase quantity"
                  title={currentQty >= maxStock ? `Stock limit reached (${maxStock})` : 'Badhayein'}
                >
                  <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleAddToCart}
                className={`py-1 sm:py-1.5 px-2.5 sm:px-3 rounded-lg sm:rounded-xl font-black text-[11px] sm:text-xs tracking-tight transition-all duration-200 flex items-center justify-center gap-1 shadow-2xs cursor-pointer ${
                  isAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#F3A222] hover:bg-[#D97706] text-[#3E2305] hover:shadow-xs active:scale-95'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-3 h-3" /> Added
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3 h-3" /> Add
                  </>
                )}
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

export default ProductCard;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ShoppingBag, Eye, Check } from 'lucide-react';
import { formatPrice } from '../../utils/formatCurrency';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { getTasteInfo } from '../../constants/tasteSubCategories';

export const ProductCard = ({ product, onQuickView }) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const variant = product.variants?.[selectedVariantIndex] || { weight: '250g', price: 249, originalPrice: 299 };
  const inWishlist = isInWishlist(product._id || product.slug);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, variant, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
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

  // Extract / standardize the 3 yellow badge tags matching the FarmDidi screenshot
  const oilBadge = product.oilType?.toLowerCase().includes('sunflower')
    ? 'Sunflower Oil'
    : (product.oilType?.toLowerCase().includes('oil-free') ? 'Oil-Free' : 'Mustard Oil');

  const spiceBadge = product.spiceLevel 
    ? (product.spiceLevel.toLowerCase() === 'medium' ? 'Medium spicy' : product.spiceLevel)
    : 'Medium spicy';

  const thirdBadge = product.tags?.includes('Jain Friendly') 
    ? 'Jain Friendly' 
    : (product.tags?.includes('Sun-Cured') ? 'Sun-Cured' : 'Jain Friendly');

  const badges = [oilBadge, spiceBadge, thirdBadge];

  // Dynamic subtle backdrop color splash for jars matching the card style
  const isRed = product.slug?.includes('red-chilli') || product.name?.toLowerCase().includes('red chilli') || product.name?.toLowerCase().includes('punjabi');
  const isKer = product.slug?.includes('sangri') || product.name?.toLowerCase().includes('sangri');
  
  const backdropGradient = isRed
    ? 'from-red-100/90 via-rose-50/50 to-white'
    : isKer
    ? 'from-amber-100/90 via-orange-50/50 to-white'
    : 'from-amber-100/90 via-yellow-50/50 to-white';

  return (
    <div className="group bg-white rounded-3xl border border-gray-200/90 shadow-xs hover:shadow-xl hover:border-amber-300 transition-all duration-300 p-3 sm:p-4 flex flex-col justify-between overflow-hidden relative">
      
      {/* Top Image Container with Splash Backdrop & Badges */}
      <div className={`relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-square flex items-center justify-center bg-gradient-to-b ${backdropGradient} mb-2`}>
        
        {/* "Limited Stock" corner ribbon badge (matching Card 4 in reference screenshot) */}
        {(product.isLimitedStock || product.badge === 'Limited Stock' || variant.stockCount <= 15) && (
          <div className="absolute top-2 right-0 bg-[#8B1A1A] text-white text-[10px] font-black px-2.5 py-0.5 rounded-l-md shadow-xs tracking-wide z-10 uppercase">
            Limited Stock
          </div>
        )}

        {/* Wishlist Heart Icon */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2 left-2 z-10 p-1.5 rounded-full backdrop-blur-xs transition-colors shadow-2xs ${
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
            className="absolute bottom-2 right-2 z-10 p-1.5 rounded-full bg-white/90 hover:bg-white text-gray-500 hover:text-brand-green backdrop-blur-xs transition-colors shadow-2xs opacity-0 group-hover:opacity-100"
            aria-label="Quick View"
            title="Quick View"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Product Jar Photo */}
        <Link to={`/product/${product.slug}`} className="w-full h-full flex items-center justify-center p-1.5">
          <img
            src={product.images?.[0] || '/products/homemade-mango-pickle.png'}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </Link>
      </div>

      {/* Card Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Title (e.g. Homemade Mango Pickle | Aam ka Achar) */}
          <Link to={`/product/${product.slug}`} className="block">
            <h3 className="text-sm sm:text-[15px] font-semibold text-gray-900 group-hover:text-brand-green transition-colors line-clamp-2 leading-snug font-sans">
              {product.name}
            </h3>
          </Link>

          {/* Rating & Reviews line: ★ 4.7 | 1837 Reviews */}
          <div className="flex items-center gap-1.5 text-xs text-gray-600 mt-2">
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-500" />
              <span>{product.rating ? Number(product.rating).toFixed(1) : '4.8'}</span>
            </div>
            <span className="text-gray-300 font-normal">|</span>
            <span className="text-gray-500 font-medium text-[11.5px]">
              {product.numReviews || 795} Reviews
            </span>
          </div>

          {/* Distinctive Badges: Taste Sub-Category + Yellow Badges */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2.5 mb-3">
            {product.subCategory && getTasteInfo(product.subCategory) && (
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 shadow-2xs tracking-tight ${getTasteInfo(product.subCategory).badgeClass}`}
                title={`Taste Profile: ${getTasteInfo(product.subCategory).name} (${getTasteInfo(product.subCategory).hindiName})`}
              >
                <span>{getTasteInfo(product.subCategory).icon}</span>
                <span>{getTasteInfo(product.subCategory).name}</span>
              </span>
            )}
            {badges.map((badge, idx) => (
              <span
                key={idx}
                className="bg-[#FFF59D] text-gray-800 text-[11px] font-semibold px-2 py-0.5 rounded-md shadow-2xs tracking-tight"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Variant Selector, Price & Add to Cart */}
        <div className="pt-2 border-t border-gray-100 mt-1">
          
          {/* Weight Variants */}
          {product.variants && product.variants.length > 1 && (
            <div className="flex items-center gap-1 mb-2.5">
              {product.variants.map((v, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedVariantIndex(idx);
                  }}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
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
          <div className="flex items-center justify-between gap-2 mt-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-extrabold text-gray-900 font-sans">
                {formatPrice(variant.price)}
              </span>
              {variant.originalPrice > variant.price && (
                <span className="text-[11px] text-gray-400 line-through">
                  {formatPrice(variant.originalPrice)}
                </span>
              )}
            </div>

            {/* Add to Cart Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              className={`py-1.5 px-3 rounded-xl font-bold text-xs tracking-wide transition-all duration-200 flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer ${
                isAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#F3A222] hover:bg-[#D97706] text-[#3E2305] hover:shadow-xs'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Added!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" /> Add
                </>
              )}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

export default ProductCard;

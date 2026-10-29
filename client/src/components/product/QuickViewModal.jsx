import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Check, ShoppingBag, Heart, ArrowRight } from 'lucide-react';
import { formatPrice, calculateDiscount } from '../../utils/formatCurrency';
import { StarRating } from '../common/StarRating';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { resolveProductImage } from '../../utils/imageUtils';

export const QuickViewModal = ({ product, isOpen, onClose }) => {
  if (!isOpen || !product) return null;

  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const variant = product.variants?.[selectedVariantIdx] || { weight: '250g', price: 249 };
  const discount = calculateDiscount(variant.price, variant.originalPrice);
  const inWishlist = isInWishlist(product._id || product.slug);

  const maxStock = (variant?.stockCount !== undefined && variant?.stockCount !== null)
    ? Number(variant.stockCount)
    : 50;
  const isOutOfStock = variant?.inStock === false || maxStock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, variant, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-cream-200 relative animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-cream-100 hover:bg-cream-200 text-charcoal transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[85vh] overflow-y-auto">
          
          {/* Left: Images */}
          <div className="p-6 bg-cream-50 flex flex-col justify-center items-center">
            <div className="aspect-square w-full rounded-2xl overflow-hidden border border-cream-200 mb-3 bg-white">
              <img
                src={resolveProductImage(product.images?.[activeImageIdx] || product.images?.[0])}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIdx(i)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImageIdx === i ? 'border-brand-green' : 'border-transparent opacity-70'
                    }`}
                  >
                    <img src={resolveProductImage(img)} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <StarRating rating={product.rating || 4.8} reviewCount={product.numReviews} size="sm" />
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-charcoal font-serif">
                {product.name}
              </h2>
              {product.hindiName && (
                <p className="text-xs font-semibold text-mustard-dark mt-0.5">
                  {product.hindiName}
                </p>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3 my-3">
                <span className="text-2xl font-extrabold text-brand-green">
                  {formatPrice(variant.price)}
                </span>
                {variant.originalPrice > variant.price && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatPrice(variant.originalPrice)}
                  </span>
                )}
                {discount > 0 && (
                  <span className="bg-chilli text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                    {discount}% OFF
                  </span>
                )}
              </div>

              <p className="text-xs text-earth-brown leading-relaxed mb-4">
                {product.shortDescription}
              </p>

              {/* Variants */}
              {product.variants?.length > 1 && (
                <div className="mb-4">
                  <label className="text-xs font-bold text-charcoal block mb-1.5">
                    Select Jar Size:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedVariantIdx(idx)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                          selectedVariantIdx === idx
                            ? 'bg-brand-green text-white border-brand-green shadow-xs'
                            : 'bg-white text-charcoal border-cream-300 hover:border-brand-green'
                        }`}
                      >
                        {v.weight} — {formatPrice(v.price)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Ingredients tag cloud */}
              {product.ingredients?.length > 0 && (
                <div className="mb-4">
                  <span className="text-[11px] font-bold text-charcoal block mb-1">
                    Authentic Ingredients:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {product.ingredients.slice(0, 5).map((ing, i) => (
                      <span key={i} className="text-[10px] bg-cream-100 text-earth-brown px-2 py-0.5 rounded-md font-medium">
                        {ing}
                      </span>
                    ))}
                    {product.ingredients.length > 5 && (
                      <span className="text-[10px] text-earth-brown px-1 py-0.5">
                        +{product.ingredients.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-cream-200 space-y-3">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    isOutOfStock
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : isAdded
                        ? 'bg-emerald-600 text-white cursor-pointer'
                        : 'bg-mustard hover:bg-mustard-dark text-brand-green-dark shadow-sm cursor-pointer'
                  }`}
                >
                  {isOutOfStock ? (
                    'Out of Stock'
                  ) : isAdded ? (
                    <>
                      <Check className="w-4 h-4" /> Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 fill-current" /> Add to Cart
                    </>
                  )}
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3 rounded-xl border border-cream-300 transition-colors ${
                    inWishlist ? 'bg-chilli text-white border-chilli' : 'hover:bg-cream-100 text-charcoal'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>

              <Link
                to={`/product/${product.slug}/`}
                onClick={onClose}
                className="w-full text-center text-xs font-bold text-brand-green hover:underline flex items-center justify-center gap-1"
              >
                View Full Product Details & Reviews <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default QuickViewModal;


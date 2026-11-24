import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Check } from 'lucide-react';
import { formatPrice } from '../../utils/formatCurrency';
import { useCart } from '../../context/CartContext';
import { resolveProductImage } from '../../utils/imageUtils';

export const MiniProductCard = ({ product }) => {
  const { addToCart, cartItems } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const variant = product.variants?.[0] || { weight: '250g', price: product.price || 249 };
  const currentCartItemId = `${product._id || product.slug}-${variant.weight}`;
  const inCart = cartItems?.some(item => item.cartItemId === currentCartItemId);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, variant, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  const imgUrl = resolveProductImage(product.images?.[0]);

  return (
    <div className="group bg-white rounded-xl sm:rounded-2xl border border-gray-200/90 shadow-2xs hover:shadow-md hover:border-amber-300 transition-all p-2 sm:p-2.5 flex flex-col justify-between h-full relative">
      <Link to={`/allpickle/${product.slug}/`} className="block">
        {/* Chhoti Photo */}
        <div className="w-full h-24 sm:h-28 rounded-lg sm:rounded-xl bg-cream-50/70 overflow-hidden flex items-center justify-center mb-1.5 sm:mb-2 relative">
          <img
            src={imgUrl}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Naam */}
        <h4 
          className="text-[11px] sm:text-xs font-bold text-gray-900 group-hover:text-brand-green transition-colors line-clamp-1 leading-snug font-sans"
          title={product.name}
        >
          {product.name}
        </h4>
      </Link>

      {/* Price & Button */}
      <div className="flex items-center justify-between gap-1 mt-1.5 pt-1.5 border-t border-gray-100">
        <div className="flex items-baseline gap-1 min-w-0">
          <span className="text-xs sm:text-sm font-black text-gray-900 font-sans truncate">
            {formatPrice(variant.price)}
          </span>
          {variant.originalPrice > variant.price && (
            <span className="text-[9px] sm:text-[10px] text-gray-400 line-through hidden xs:inline">
              {formatPrice(variant.originalPrice)}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className={`py-1 px-2 sm:px-2.5 rounded-lg font-bold text-[10px] sm:text-[11px] transition-all flex items-center justify-center gap-0.5 sm:gap-1 cursor-pointer shrink-0 ${
            isAdded
              ? 'bg-emerald-600 text-white'
              : inCart
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-[#F3A222] hover:bg-[#D97706] text-[#3E2305] active:scale-95 shadow-2xs'
          }`}
          title="Add to cart"
        >
          {isAdded ? (
            <>
              <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
              <span>Added</span>
            </>
          ) : inCart ? (
            <span>+1</span>
          ) : (
            <>
              <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
              <span>Add</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default MiniProductCard;

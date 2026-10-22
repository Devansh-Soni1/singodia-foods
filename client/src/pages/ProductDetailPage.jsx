import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Heart, ShoppingBag, Truck, ShieldCheck, Check, Sparkles, 
  RotateCcw, Star, Sun, Info, ChevronRight, Send, AlertCircle
} from 'lucide-react';
import { productAPI, reviewAPI } from '../services/api';
import { formatPrice, calculateDiscount } from '../utils/formatCurrency';
import { SpiceMeter } from '../components/common/SpiceMeter';
import { StarRating } from '../components/common/StarRating';
import { ProductCard } from '../components/product/ProductCard';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { SAMPLE_PRODUCTS, SAMPLE_REVIEWS, findSampleProduct } from '../utils/sampleData';

export const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState(SAMPLE_REVIEWS);
  const [loading, setLoading] = useState(true);
  
  // Selected variant & quantity
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  // Active info tab: 'details', 'ingredients', 'storage', 'reviews'
  const [activeTab, setActiveTab] = useState('details');

  // Review Form State
  const [newReviewerName, setNewReviewerName] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      const cleanSlug = (slug || '').toLowerCase().replace(/\/$/, '');
      try {
        const res = await productAPI.getProductBySlug(cleanSlug);
        if (res.product) {
          setProduct(res.product);
          setRelatedProducts(res.relatedProducts || []);
        } else {
          // Fallback to sample data
          const found = findSampleProduct(cleanSlug);
          setProduct(found || SAMPLE_PRODUCTS[0]);
        }
      } catch (err) {
        const found = findSampleProduct(cleanSlug);
        setProduct(found || SAMPLE_PRODUCTS[0]);
      } finally {
        setLoading(false);
        window.scrollTo(0, 0);
      }
    };
    fetchProductData();
  }, [slug]);

  if (loading || !product) {
    return (
      <div className="py-24 text-center min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const variant = product.variants?.[selectedVariantIdx] || { weight: '250g', price: 249, originalPrice: 299 };
  const discount = calculateDiscount(variant.price, variant.originalPrice);
  const inWishlist = isInWishlist(product._id || product.slug);

  const handleAddToCart = () => {
    addToCart(product, variant, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, variant, quantity);
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReviewerName || !newComment) return;

    const newRev = {
      product: product._id,
      reviewerName: newReviewerName,
      rating: Number(newRating),
      title: newTitle || 'Delicious authentic taste!',
      comment: newComment,
      location: 'India',
      isVerifiedBuyer: true,
      date: 'Just now'
    };

    try {
      await reviewAPI.addReview(newRev);
    } catch (err) {
      console.warn('Review submission error:', err);
    }

    setReviews([newRev, ...reviews]);
    setReviewSubmitted(true);
    setNewReviewerName('');
    setNewTitle('');
    setNewComment('');
  };

  return (
    <div className="py-8 sm:py-12 bg-[#FAF6EF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="text-xs text-earth-brown mb-6 flex items-center gap-1.5 flex-wrap">
          <Link to="/" className="hover:text-brand-green">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/shop" className="hover:text-brand-green">Pickles</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="font-bold text-charcoal">{product.name}</span>
        </div>

        {/* Product Details Main Hero Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-cream-200 shadow-card mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left: Gallery */}
            <div className="lg:col-span-6 space-y-4">
              <div className="aspect-square rounded-2xl overflow-hidden bg-cream-50 border border-cream-200 shadow-xs relative">
                <img
                  src={product.images?.[activeImageIdx] || product.images?.[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
                {discount > 0 && (
                  <span className="absolute top-4 left-4 bg-chilli text-white text-xs font-black px-3 py-1 rounded-full shadow-xs">
                    {discount}% OFF
                  </span>
                )}
                {product.isBestSeller && (
                  <span className="absolute top-4 right-4 bg-brand-green text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-xs">
                    Bestseller
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {product.images?.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        activeImageIdx === idx
                          ? 'border-brand-green ring-2 ring-brand-green/20'
                          : 'border-cream-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Buy Box */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-5">
              <div>
                
                {/* Spice Meter & Ratings */}
                <div className="flex items-center gap-3 mb-2.5">
                  <SpiceMeter level={product.spiceLevel} size="md" />
                  <StarRating rating={product.rating || 4.9} reviewCount={product.numReviews} size="md" />
                </div>

                {/* Name */}
                <h1 className="text-2xl sm:text-4xl font-extrabold text-charcoal font-serif">
                  {product.name}
                </h1>
                {product.hindiName && (
                  <p className="text-sm font-semibold text-mustard-dark mt-1">
                    {product.hindiName}
                  </p>
                )}

                {/* Pricing Block */}
                <div className="flex items-baseline gap-3 my-4">
                  <span className="text-3xl sm:text-4xl font-extrabold text-brand-green">
                    {formatPrice(variant.price)}
                  </span>
                  {variant.originalPrice > variant.price && (
                    <span className="text-base text-gray-400 line-through">
                      {formatPrice(variant.originalPrice)}
                    </span>
                  )}
                  <span className="text-xs text-earth-brown font-medium">
                    (Inclusive of all taxes)
                  </span>
                </div>

                {/* Short Description */}
                <p className="text-xs sm:text-sm text-earth-brown leading-relaxed mb-6">
                  {product.shortDescription}
                </p>

                {/* Variants Selection (Weight) */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-charcoal uppercase tracking-wider">
                      Select Jar Size (Net Weight):
                    </span>
                    <span className="text-xs text-brand-green font-semibold">
                      In Stock ({variant.stockCount || 50} jars available)
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {product.variants?.map((v, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedVariantIdx(idx)}
                        className={`p-3 rounded-xl border-2 text-center transition-all ${
                          selectedVariantIdx === idx
                            ? 'border-brand-green bg-cream-50 shadow-xs'
                            : 'border-cream-200 bg-white hover:border-cream-300'
                        }`}
                      >
                        <span className="block text-xs sm:text-sm font-bold text-charcoal">
                          {v.weight}
                        </span>
                        <span className="block text-xs font-extrabold text-brand-green mt-0.5">
                          {formatPrice(v.price)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-xs font-bold text-charcoal uppercase tracking-wider">
                    Quantity:
                  </span>
                  <div className="flex items-center border border-cream-300 rounded-xl bg-cream-50">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 text-charcoal hover:text-brand-green font-bold text-sm"
                    >
                      -
                    </button>
                    <span className="px-3 text-sm font-bold text-charcoal min-w-[30px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1.5 text-charcoal hover:text-brand-green font-bold text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons: Add to Cart & Buy Now */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 py-4 px-6 rounded-xl font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-mustard hover:bg-mustard-dark text-brand-green-dark hover:shadow-md'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-5 h-5" /> Added to Cart!
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5 fill-current" /> Add to Cart
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="flex-1 py-4 px-6 rounded-xl bg-brand-green hover:bg-brand-green-light text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    Buy Now
                  </button>

                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`p-4 rounded-xl border border-cream-300 transition-colors flex items-center justify-center ${
                      inWishlist ? 'bg-chilli text-white border-chilli' : 'hover:bg-cream-100 text-charcoal'
                    }`}
                    title="Add to Wishlist"
                  >
                    <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                  </button>
                </div>

              </div>

              {/* Delivery & Trust Highlights */}
              <div className="pt-6 border-t border-cream-200 grid grid-cols-2 gap-3 text-xs text-charcoal font-medium">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-brand-green flex-shrink-0" />
                  <span>Free shipping on orders ₹499+</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-mustard flex-shrink-0" />
                  <span>Cash on Delivery (COD) available</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span>100% Sun-Cured in Barnis</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-green flex-shrink-0" />
                  <span>Zero synthetic preservatives</span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Detailed Information Tabs */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-cream-200 shadow-card mb-12">
          
          {/* Tab Navigation */}
          <div className="flex border-b border-cream-200 overflow-x-auto gap-4 sm:gap-8 mb-8 no-scrollbar">
            {[
              { id: 'details', label: 'Story & Taste Profile' },
              { id: 'ingredients', label: 'Ingredients & Spices' },
              { id: 'storage', label: 'Storage & Shelf Life' },
              { id: 'reviews', label: `Customer Reviews (${reviews.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 text-sm font-bold whitespace-nowrap transition-all border-b-2 font-serif ${
                  activeTab === tab.id
                    ? 'border-brand-green text-brand-green'
                    : 'border-transparent text-earth-brown hover:text-charcoal'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Full Story */}
          {activeTab === 'details' && (
            <div className="space-y-4 text-xs sm:text-sm text-earth-brown leading-relaxed max-w-4xl">
              <p className="text-base font-semibold text-charcoal">
                {product.fullDescription}
              </p>
              <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 space-y-2 mt-4">
                <h4 className="font-bold text-charcoal font-serif text-sm">
                  Traditional Preparation Notes:
                </h4>
                <p className="text-xs text-earth-brown">
                  {product.traditionNotes || 'Matured in authentic glazed clay martabans under sunlight for over 45 days. Stirred gently with clean wooden spoons every evening.'}
                </p>
              </div>

              {product.pairWith?.length > 0 && (
                <div className="pt-4">
                  <h4 className="font-bold text-charcoal font-serif text-sm mb-2">
                    How We Recommend Enjoying It:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {product.pairWith.map((pair, idx) => (
                      <span key={idx} className="bg-mustard-light/50 text-brand-green-dark px-3 py-1 rounded-full text-xs font-semibold">
                        🍴 {pair}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Ingredients */}
          {activeTab === 'ingredients' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h4 className="text-sm font-bold text-charcoal font-serif mb-3">
                  Full Ingredient List (कोई गुप्त मिलावट नहीं):
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {product.ingredients?.map((ing, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs text-charcoal font-medium">
                      <Sparkles className="w-3.5 h-3.5 text-mustard flex-shrink-0" />
                      <span>{ing}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                <p className="font-bold">⚠️ Allergen & Oil Information:</p>
                <p>{product.allergenInfo}</p>
                <p>Oil Used: <strong className="font-bold">{product.oilType || 'Pure Cold-Pressed Mustard Oil'}</strong></p>
              </div>
            </div>
          )}

          {/* Tab 3: Storage & Shelf Life */}
          {activeTab === 'storage' && (
            <div className="space-y-4 max-w-3xl text-xs sm:text-sm text-earth-brown leading-relaxed">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200">
                  <h5 className="font-bold text-charcoal font-serif text-sm mb-1">
                    Shelf Life:
                  </h5>
                  <p className="text-xs font-semibold text-brand-green">
                    {product.shelfLife || '12 Months from packaging date'}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200">
                  <h5 className="font-bold text-charcoal font-serif text-sm mb-1">
                    Recommended Storage:
                  </h5>
                  <p className="text-xs text-earth-brown">
                    Cool, dry place. Keep away from humid moisture.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 space-y-2">
                <h5 className="font-bold text-charcoal font-serif text-sm">
                  Grandmother’s Golden Tips to Keep Pickle Fresh:
                </h5>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>Always use a completely dry stainless steel or wooden spoon. Never use a wet spoon.</li>
                  <li>Ensure the oil layer always covers the top surface of the pickle.</li>
                  <li>Do not refrigerate traditional mustard oil pickles as natural fats can congeal. Keep in pantry.</li>
                </ul>
              </div>
            </div>
          )}

          {/* Tab 4: Reviews & Review Form */}
          {activeTab === 'reviews' && (
            <div className="space-y-8">
              
              {/* Existing Reviews */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((rev, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-cream-50 border border-cream-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-mustard">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-mustard' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <span className="text-[11px] text-earth-brown">{rev.date || 'Verified Buyer'}</span>
                    </div>
                    <h5 className="text-xs sm:text-sm font-bold text-charcoal font-serif">
                      "{rev.title}"
                    </h5>
                    <p className="text-xs text-earth-brown leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                    <div className="text-[11px] font-bold text-charcoal pt-1">
                      {rev.reviewerName} <span className="text-earth-brown font-normal">({rev.location || 'India'})</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Review Submission Form */}
              <div className="pt-6 border-t border-cream-200 max-w-xl">
                <h4 className="text-base font-bold text-charcoal font-serif mb-4">
                  Write a Customer Review
                </h4>

                {reviewSubmitted ? (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                    Thank you! Your review has been submitted and shared with the Singodhia Foods team.
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-charcoal block mb-1">Your Name</label>
                        <input
                          type="text"
                          required
                          value={newReviewerName}
                          onChange={(e) => setNewReviewerName(e.target.value)}
                          placeholder="e.g. Anjali Gupta"
                          className="w-full px-3 py-2 text-xs bg-cream-50 border border-cream-300 rounded-lg focus:outline-none focus:border-brand-green"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-charcoal block mb-1">Rating</label>
                        <select
                          value={newRating}
                          onChange={(e) => setNewRating(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-cream-50 border border-cream-300 rounded-lg focus:outline-none focus:border-brand-green"
                        >
                          <option value="5">⭐⭐⭐⭐⭐ 5 Stars (Outstanding)</option>
                          <option value="4">⭐⭐⭐⭐ 4 Stars (Very Good)</option>
                          <option value="3">⭐⭐⭐ 3 Stars (Good)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-charcoal block mb-1">Review Title</label>
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="e.g. Real dadi ke haath ka swad!"
                        className="w-full px-3 py-2 text-xs bg-cream-50 border border-cream-300 rounded-lg focus:outline-none focus:border-brand-green"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-charcoal block mb-1">Your Review</label>
                      <textarea
                        required
                        rows="3"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Tell others about the aroma, spice level, and pairing with meals..."
                        className="w-full px-3 py-2 text-xs bg-cream-50 border border-cream-300 rounded-lg focus:outline-none focus:border-brand-green"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-brand-green hover:bg-brand-green-light text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                    >
                      <span>Submit Review</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                )}
              </div>

            </div>
          )}

        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl sm:text-2xl font-bold text-charcoal font-serif mb-6">
              You May Also Savor (इन्हें भी आजमाएं)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((p) => (
                <ProductCard key={p._id || p.slug} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetailPage;

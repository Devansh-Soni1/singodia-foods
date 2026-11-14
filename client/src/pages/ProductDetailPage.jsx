import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Heart, ShoppingBag, Truck, ShieldCheck, Check, Sparkles, 
  RotateCcw, Star, Sun, Info, ChevronRight, ChevronLeft, Play, Send, AlertCircle,
  MapPin, Clock, CheckCircle2, Loader2
} from 'lucide-react';
import { productAPI, reviewAPI, shippingAPI } from '../services/api';
import { formatPrice, calculateDiscount } from '../utils/formatCurrency';
import { StarRating } from '../components/common/StarRating';
import { ProductCard } from '../components/product/ProductCard';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { resolveProductImage, isVideoUrl } from '../utils/imageUtils';

const DEFAULT_PRODUCT_REVIEWS = [
  {
    reviewerName: 'Sunita Sharma',
    rating: 5,
    title: 'Maa ke hath jaisa asali swad!',
    comment: 'Bilkul wahi purana swad jo dadi-nani ke hath se bane achar me milta tha. Asli desi masale ekdum fresh hain. 1kg ka jar mangwaya tha, parivar me sabko bahut pasand aaya!',
    location: 'Jaipur, Rajasthan',
    date: '3 days ago',
    isVerifiedBuyer: true
  },
  {
    reviewerName: 'Rajesh Meena',
    rating: 5,
    title: 'Authentic Rajasthani Recipe & Crispy Texture',
    comment: 'Bahut hi shuddh aur swadisht achar hai. Packing bhi mitti ke martaban style safe bubble wrap me aayi thi. No artificial vinegar or chemicals. Truly homemade!',
    location: 'New Delhi',
    date: '1 week ago',
    isVerifiedBuyer: true
  },
  {
    reviewerName: 'Pooja Agarwal',
    rating: 5,
    title: 'Aloo Parathe ke sath best combination',
    comment: 'Main regular customer ban chuki hoon. Morning breakfast me parathe ke sath is achar ka alag hi maza hai. Delivery fast thi aur taste 10/10.',
    location: 'Ahmedabad, Gujarat',
    date: '2 weeks ago',
    isVerifiedBuyer: true
  },
  {
    reviewerName: 'Vikas Singhal',
    rating: 5,
    title: '100% Traditional & Sun-cured Perfection',
    comment: 'Purity aur quality lajawab hai. Oil level perfect hai aur masalon ki aroma khulte hi poore kamre me phel jati hai. Highly recommended for every home!',
    location: 'Gurugram, Haryana',
    date: '3 weeks ago',
    isVerifiedBuyer: true
  }
];

export const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
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

  const { addToCart, freeShippingThreshold, freeShippingEnabled } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

  const variant = product?.variants?.[selectedVariantIdx] || { weight: '250g', price: 249, originalPrice: 299 };

  // Parse variant weight to kg helper
  const parseWeightToKg = (weightStr) => {
    if (!weightStr) return 0.5;
    const s = String(weightStr).toLowerCase().trim();
    if (s.includes('kg')) {
      const val = parseFloat(s.replace(/[^0-9.]/g, ''));
      return isNaN(val) || val <= 0 ? 1.0 : val;
    }
    if (s.includes('g') || s.includes('gm')) {
      const val = parseFloat(s.replace(/[^0-9.]/g, ''));
      return isNaN(val) || val <= 0 ? 0.5 : val / 1000;
    }
    const val = parseFloat(s.replace(/[^0-9.]/g, ''));
    return isNaN(val) || val <= 0 ? 0.5 : (val > 10 ? val / 1000 : val);
  };

  // Dynamic calculated weight for currently selected variant & quantity
  const currentWeightKg = useMemo(() => {
    const singleWeight = parseWeightToKg(variant?.weight);
    return Math.max(0.25, singleWeight * (quantity || 1));
  }, [variant?.weight, quantity]);

  // Normal Delivery Pincode & Date/Price state
  const [pincodeInput, setPincodeInput] = useState(() => {
    return localStorage.getItem('singodia_user_pincode') || '';
  });
  const [checkingPincode, setCheckingPincode] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryFee, setDeliveryFee] = useState(null);
  const [pincodeError, setPincodeError] = useState('');
  const initialCheckedRef = useRef(false);

  // Free delivery only applies if explicitly enabled in admin settings AND meets threshold
  const isFreeDelivery = Boolean(
    freeShippingEnabled && 
    freeShippingThreshold && 
    ((variant.price || 0) * quantity >= freeShippingThreshold)
  );

  // Official iThink Logistics zone rates based on destination pincode and weight
  const getZoneFallback = (cleanPin, weightKg = 0.5) => {
    const pin = String(cleanPin || '').trim();
    const weight = Math.max(0.25, Number(weightKg) || 0.5);
    const additionalUnits = Math.max(0, Math.ceil((weight - 0.5) / 0.5));

    let fallbackDays = 4;
    let baseRate = 80;
    let addRate = 40;

    if (/^331/.test(pin)) {
      fallbackDays = 2; // Local Sujangarh / Churu
      baseRate = 40;
      addRate = 20;
    } else if (/^3[0-4]/.test(pin)) {
      fallbackDays = 3; // Rajasthan
      baseRate = 50;
      addRate = 25;
    } else if (/^(11|12|13|14|15|16|20|21|22|23|24|25|26|27|28|38|39)/.test(pin)) {
      fallbackDays = 4; // North & Metro
      baseRate = 65;
      addRate = 35;
    } else if (/^(18|19|78|79|80|81|82|83|84|85|74|75|76|77)/.test(pin)) {
      fallbackDays = 6; // Special / North East
      baseRate = 95;
      addRate = 50;
    }

    const fee = baseRate + (additionalUnits * addRate);

    const d = new Date();
    d.setDate(d.getDate() + fallbackDays);
    const dateStr = d.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
    return { dateStr, fee };
  };

  const fallbackFee = useMemo(() => {
    const cleanPin = String(pincodeInput || '').trim().replace(/\D/g, '');
    if (/^\d{6}$/.test(cleanPin)) {
      return getZoneFallback(cleanPin, currentWeightKg).fee;
    }
    return getZoneFallback('302001', currentWeightKg).fee;
  }, [pincodeInput, currentWeightKg]);

  const activeDeliveryFee = isFreeDelivery ? 0 : (deliveryFee !== null ? deliveryFee : fallbackFee);

  const checkDelivery = useCallback(async (targetPin, isSilent = false, weightToUse = null) => {
    const cleanPin = String(targetPin || '').trim().replace(/\D/g, '');
    if (!/^\d{6}$/.test(cleanPin)) {
      if (!isSilent) setPincodeError('कृपया 6 अंकों का सही पिनकोड दर्ज करें');
      return;
    }

    if (!isSilent) setCheckingPincode(true);
    setPincodeError('');

    const calcWeight = weightToUse !== null ? weightToUse : currentWeightKg;
    const fallback = getZoneFallback(cleanPin, calcWeight);

    try {
      const ratePromise = shippingAPI.calculateRate({
        toPincode: cleanPin,
        weight: calcWeight,
        paymentMethod: 'Prepaid'
      });
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 3000)
      );

      const rateData = await Promise.race([ratePromise, timeoutPromise]);
      const daysStr = rateData?.expectedDeliveryDays || '3 to 4 Days';
      const numbers = String(daysStr).match(/\d+/g);
      const daysToAdd = numbers && numbers.length > 0 ? (parseInt(numbers[numbers.length - 1], 10) || 4) : 4;

      const d = new Date();
      d.setDate(d.getDate() + daysToAdd);
      const dateStr = d.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      });

      setDeliveryDate(dateStr);
      const cost = Number(rateData?.rate || rateData?.estimatedCost) || fallback.fee;
      setDeliveryFee(cost);
      localStorage.setItem('singodia_user_pincode', cleanPin);
    } catch {
      setDeliveryDate(fallback.dateStr);
      setDeliveryFee(fallback.fee);
      localStorage.setItem('singodia_user_pincode', cleanPin);
    } finally {
      setCheckingPincode(false);
    }
  }, [currentWeightKg]);

  // Dynamically recalculate delivery fee when variant or quantity changes
  useEffect(() => {
    const cleanPin = String(pincodeInput || '').trim().replace(/\D/g, '');
    if (/^\d{6}$/.test(cleanPin) && initialCheckedRef.current) {
      checkDelivery(cleanPin, true, currentWeightKg);
    }
  }, [selectedVariantIdx, quantity, currentWeightKg, checkDelivery, pincodeInput]);

  // Run only once on initial mount if saved pin exists (silent check)
  useEffect(() => {
    if (initialCheckedRef.current) return;
    initialCheckedRef.current = true;

    const defaultAddressPin = user?.addresses?.find(a => a.isDefault)?.pincode;
    const firstAddressPin = user?.addresses?.[0]?.pincode;
    const savedPin = defaultAddressPin || firstAddressPin || localStorage.getItem('singodia_user_pincode');
    
    if (savedPin && /^\d{6}$/.test(String(savedPin))) {
      setPincodeInput(String(savedPin));
      checkDelivery(String(savedPin), true);
    }
  }, [user, checkDelivery]);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      setActiveImageIdx(0);
      const cleanSlug = (slug || '').toLowerCase().replace(/\/$/, '');
      try {
        const res = await productAPI.getProductBySlug(cleanSlug);
        if (res && res.product) {
          setProduct(res.product);
          setRelatedProducts(res.relatedProducts || []);
          if (Array.isArray(res.reviews) && res.reviews.length > 0) {
            setReviews(res.reviews);
          } else if (Array.isArray(res.product.reviews) && res.product.reviews.length > 0) {
            setReviews(res.product.reviews);
          } else {
            setReviews(DEFAULT_PRODUCT_REVIEWS);
          }
        } else {
          setProduct(null);
        }
      } catch (err) {
        setProduct(null);
      } finally {
        setLoading(false);
        window.scrollTo(0, 0);
      }
    };
    fetchProductData();
  }, [slug]);

  const imagesList = (product?.images && product.images.length > 0) ? product.images : ['/hero-banner.png'];
  const totalImages = imagesList.length;

  const touchStartXRef = useRef(null);
  const touchEndXRef = useRef(null);
  const mainImageRef = useRef(null);
  const [mainImageHeight, setMainImageHeight] = useState(0);

  useEffect(() => {
    if (!mainImageRef.current) return;
    const updateHeight = () => {
      if (mainImageRef.current) {
        setMainImageHeight(mainImageRef.current.offsetHeight);
      }
    };
    updateHeight();
    const ro = new ResizeObserver(updateHeight);
    ro.observe(mainImageRef.current);
    window.addEventListener('resize', updateHeight);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateHeight);
    };
  }, [product]);

  const handleNextImage = useCallback(() => {
    setActiveImageIdx((prev) => (prev + 1) % totalImages);
  }, [totalImages]);

  const handlePrevImage = useCallback(() => {
    setActiveImageIdx((prev) => (prev - 1 + totalImages) % totalImages);
  }, [totalImages]);

  useEffect(() => {
    const thumbEl = document.getElementById(`product-thumb-${activeImageIdx}`);
    if (thumbEl) {
      thumbEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
  }, [activeImageIdx]);

  if (loading) {
    return (
      <div className="py-24 text-center min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-20 px-4 min-h-[65vh] flex flex-col items-center justify-center text-center bg-[#FAF6EF]">
        <div className="w-20 h-20 rounded-full bg-amber-100/90 border border-amber-300 flex items-center justify-center text-3xl mb-4 shadow-sm">
          🏺
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-charcoal mb-2">
          यह उत्पाद अभी उपलब्ध नहीं है
        </h2>
        <p className="text-earth-brown text-sm sm:text-base max-w-md mb-6 leading-relaxed">
          यह उत्पाद अभी तक स्टोर पर अपलोड नहीं हुआ है। जैसे ही एडमिन पैनल से यह उत्पाद जोड़ा जाएगा, आप इसे यहाँ लाइव देख पाएंगे।
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/allpickles"
            className="px-6 py-2.5 bg-brand-green text-white text-xs sm:text-sm font-bold rounded-full hover:bg-emerald-800 transition-colors shadow-sm"
          >
            सभी उपलब्ध उत्पाद देखें (Browse Store)
          </Link>
          <Link
            to="/"
            className="px-6 py-2.5 bg-white border border-gray-300 text-charcoal text-xs sm:text-sm font-semibold rounded-full hover:bg-gray-50 transition-colors"
          >
            होम पेज (Home)
          </Link>
        </div>
      </div>
    );
  }

  const discount = calculateDiscount(variant.price, variant.originalPrice);
  const inWishlist = isInWishlist(product._id || product.slug);

  // Stock calculations
  const maxAvailableStock = (variant?.stockCount !== undefined && variant?.stockCount !== null)
    ? Number(variant.stockCount)
    : 50;
  const isOutOfStock = variant?.inStock === false || maxAvailableStock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, variant, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, variant, quantity, true);
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

  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchEndXRef.current = null;
  };

  const handleTouchMove = (e) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current !== null && touchEndXRef.current !== null) {
      const diffX = touchStartXRef.current - touchEndXRef.current;
      if (Math.abs(diffX) > 35) {
        if (diffX > 0) {
          handleNextImage();
        } else {
          handlePrevImage();
        }
      }
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  const currentMedia = imagesList[activeImageIdx] || imagesList[0];
  const isCurrentVideo = isVideoUrl(currentMedia);

  return (
    <div className="py-8 sm:py-12 bg-[#FAF6EF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="text-xs text-earth-brown mb-6 flex items-center gap-1.5 flex-wrap">
          <Link to="/" className="hover:text-brand-green">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/allpickles" className="hover:text-brand-green">All Pickles</Link>
          {product.category && (
            <>
              <ChevronRight className="w-3 h-3" />
              <Link to={`/category/${product.category}/`} className="hover:text-brand-green capitalize">
                {product.category.replace(/-/g, ' ')}
              </Link>
            </>
          )}
          <ChevronRight className="w-3 h-3" />
          <span className="font-bold text-charcoal">{product.name}</span>
        </div>

        {/* Product Details Main Hero Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-cream-200 shadow-card mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left: Gallery (Vertical Thumbnails on the left + Swipeable Main Viewport with Arrows) */}
            <div className="lg:col-span-6 flex flex-row gap-2 sm:gap-4 items-start">
              
              {/* Left Column: Vertical Thumbnails Strip (Scrollable - max 4-5 items visible, rest scrolls) */}
              {totalImages > 1 && (
                <div 
                  className="flex flex-col gap-1.5 sm:gap-2.5 overflow-y-auto w-12 xs:w-14 sm:w-20 shrink-0 scrollbar-none py-0.5 select-none"
                  style={{ 
                    maxHeight: mainImageHeight > 0 ? `${mainImageHeight}px` : '360px',
                    height: mainImageHeight > 0 ? `${mainImageHeight}px` : 'auto',
                    scrollbarWidth: 'none', 
                    msOverflowStyle: 'none' 
                  }}
                >
                  {imagesList.map((mediaUrl, idx) => {
                    const isVid = isVideoUrl(mediaUrl);
                    const isActive = activeImageIdx === idx;
                    return (
                      <button
                        key={idx}
                        id={`product-thumb-${idx}`}
                        type="button"
                        onClick={() => setActiveImageIdx(idx)}
                        className={`relative w-12 h-12 xs:w-14 xs:h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                          isActive
                            ? 'border-brand-green ring-2 ring-brand-green/30 scale-[1.03] shadow-md'
                            : 'border-cream-200 opacity-75 hover:opacity-100 hover:border-amber-400'
                        }`}
                        title={`View ${isVid ? 'video' : 'photo'} ${idx + 1}`}
                      >
                        {isVid ? (
                          <div className="w-full h-full bg-black/90 flex items-center justify-center relative">
                            <video src={mediaUrl} className="w-full h-full object-cover opacity-60" muted playsInline />
                            <span className="absolute inset-0 flex items-center justify-center text-white">
                              <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white text-white drop-shadow" />
                            </span>
                            <span className="absolute bottom-1 right-1 bg-black/80 text-[7px] sm:text-[8px] text-white font-extrabold px-1 rounded uppercase">
                              Video
                            </span>
                          </div>
                        ) : (
                          <img
                            src={resolveProductImage(mediaUrl)}
                            alt={`${product.name} thumbnail ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Right: Main Image / Video Viewport with Touch/Mouse Swipe & Navigation Arrows */}
              <div 
                ref={mainImageRef}
                className="flex-1 w-full relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-cream-50 border border-cream-200 shadow-xs select-none touch-pan-y"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {/* Media Render */}
                {isCurrentVideo ? (
                  <div className="w-full h-full flex items-center justify-center bg-black">
                    <video
                      key={currentMedia}
                      src={currentMedia}
                      controls
                      autoPlay
                      muted
                      playsInline
                      loop
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <img
                    key={currentMedia}
                    src={resolveProductImage(currentMedia)}
                    alt={product.name}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                )}

                {/* Badges */}
                {discount > 0 && (
                  <span className="absolute top-4 left-4 bg-chilli text-white text-xs font-black px-3 py-1 rounded-full shadow-xs z-10 pointer-events-none">
                    {discount}% OFF
                  </span>
                )}
                {product.isBestSeller && (
                  <span className="absolute top-4 right-4 bg-brand-green text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-xs z-10 pointer-events-none">
                    Bestseller
                  </span>
                )}

                {/* Side Slide Arrows (Left & Right) */}
                {totalImages > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                      className="absolute left-2.5 sm:left-3.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-gray-800 hover:text-brand-green shadow-lg flex items-center justify-center transition-all hover:scale-110 cursor-pointer border border-gray-200/90 backdrop-blur-xs"
                      aria-label="Previous photo"
                      title="Previous photo (Loops back to last photo)"
                    >
                      <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                      className="absolute right-2.5 sm:right-3.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-gray-800 hover:text-brand-green shadow-lg flex items-center justify-center transition-all hover:scale-110 cursor-pointer border border-gray-200/90 backdrop-blur-xs"
                      aria-label="Next photo"
                      title="Next photo (Loops back to first photo)"
                    >
                      <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
                    </button>

                    {/* Counter Pill */}
                    <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-full backdrop-blur-xs pointer-events-none z-10">
                      {activeImageIdx + 1} / {totalImages}
                    </div>
                  </>
                )}
              </div>

            </div>

            {/* Right: Product Buy Box */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-5">
              <div>
                
                {/* Ratings */}
                <div className="flex items-center gap-3 mb-2.5">
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

                {/* Live Stock Indicator Badge */}
                <div className="mb-4">
                  {isOutOfStock ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-red-100 text-red-700 border border-red-200">
                      ● Out of Stock (फिलहाल उपलब्ध नहीं है)
                    </span>
                  ) : maxAvailableStock <= 5 ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-300">
                      ⚠️ Hurry! Only {maxAvailableStock} left in stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      ✓ In Stock ({maxAvailableStock} units available)
                    </span>
                  )}
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-xs font-bold text-charcoal uppercase tracking-wider">
                    Quantity:
                  </span>
                  <div className="flex items-center border border-cream-300 rounded-xl bg-cream-50">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={isOutOfStock || quantity <= 1}
                      className="px-3 py-1.5 text-charcoal hover:text-brand-green font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-3 text-sm font-bold text-charcoal min-w-[30px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(maxAvailableStock, quantity + 1))}
                      disabled={isOutOfStock || quantity >= maxAvailableStock}
                      className={`px-3 py-1.5 font-bold text-sm ${
                        isOutOfStock || quantity >= maxAvailableStock
                          ? 'opacity-30 cursor-not-allowed text-gray-400'
                          : 'text-charcoal hover:text-brand-green cursor-pointer'
                      }`}
                      title={quantity >= maxAvailableStock ? `Max stock (${maxAvailableStock}) reached` : 'Increase'}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons: Add to Cart & Buy Now */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`flex-1 py-4 px-6 rounded-xl font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm ${
                      isOutOfStock
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : isAdded
                          ? 'bg-emerald-600 text-white cursor-pointer'
                          : 'bg-mustard hover:bg-mustard-dark text-brand-green-dark hover:shadow-md cursor-pointer'
                    }`}
                  >
                    {isOutOfStock ? (
                      'Out of Stock'
                    ) : isAdded ? (
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
                    disabled={isOutOfStock}
                    className={`flex-1 py-4 px-6 rounded-xl font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 ${
                      isOutOfStock
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-brand-green hover:bg-brand-green-light text-white cursor-pointer'
                    }`}
                  >
                    {isOutOfStock ? 'Unavailable' : 'Buy Now'}
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

              {/* Normal Delivery Pincode & Date/Price */}
              <div className="pt-4 border-t border-cream-200">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    checkDelivery(pincodeInput);
                  }}
                  className="space-y-2 max-w-sm"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={pincodeInput}
                      onChange={(e) => {
                        setPincodeInput(e.target.value.replace(/\D/g, '').slice(0, 6));
                        setPincodeError('');
                      }}
                      placeholder="Enter 6-digit Pincode"
                      className="flex-1 px-3.5 py-2 text-sm bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-brand-green font-medium"
                    />
                    <button
                      type="submit"
                      disabled={checkingPincode || pincodeInput.length !== 6}
                      className="px-4 sm:px-5 py-2 bg-brand-green hover:bg-brand-green-light text-white text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer disabled:opacity-60 shrink-0 flex items-center justify-center gap-1.5 min-w-[92px]"
                    >
                      {checkingPincode ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Checking...</span>
                        </>
                      ) : (
                        <span>Check</span>
                      )}
                    </button>
                  </div>

                  {pincodeError && (
                    <p className="text-xs text-red-600 font-medium">
                      {pincodeError}
                    </p>
                  )}

                  {deliveryDate && (
                    <div className="pt-2 text-xs sm:text-sm text-charcoal font-medium">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-brand-green shrink-0" />
                          <span>Delivery by <strong className="text-brand-green font-bold">{deliveryDate}</strong></span>
                        </div>
                        <span className="text-gray-300 hidden xs:inline">•</span>
                        <div className="flex items-center gap-1">
                          <span>Delivery:</span>
                          {activeDeliveryFee === 0 ? (
                            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              FREE
                            </span>
                          ) : (
                            <strong className="text-brand-green font-bold bg-cream-100 px-2 py-0.5 rounded">
                              {formatPrice(activeDeliveryFee)}
                            </strong>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </form>
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
                <p>Oil Used: <strong className="font-bold">{product.oilType || 'Traditional Pure Oil'}</strong></p>
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
                  <li>Do not refrigerate traditional pickles. Keep in a dry, cool pantry.</li>
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
                    Thank you! Your review has been submitted and shared with the Singodia Foods team.
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
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

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { HeroBanner } from '../components/home/HeroBanner';
import { BestSellersSection } from '../components/home/BestSellersSection';
import { FeaturedTrialPackBanner } from '../components/home/FeaturedTrialPackBanner';
import { FlavoursShowcaseSection } from '../components/home/FlavoursShowcaseSection';
import { CustomerReviewsSection } from '../components/home/CustomerReviewsSection';
import { TrustBadges } from '../components/common/TrustBadges';
import { FaqSection } from '../components/home/FaqSection';
import { QuickViewModal } from '../components/product/QuickViewModal';
import { productAPI } from '../services/api';

export const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#trial-pack') {
      setTimeout(() => {
        const el = document.getElementById('trial-pack');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    }
  }, [location.hash]);

  useEffect(() => {
    let isMounted = true;
    const loadFeatured = async () => {
      try {
        const res = await productAPI.getProducts({ limit: 8 });
        if (!isMounted) return;
        if (Array.isArray(res.products) && res.products.length > 0) {
          const featured = res.products.filter(p => p.isFeatured);
          setFeaturedProducts(featured.length > 0 ? featured.slice(0, 4) : res.products.slice(0, 4));
        }
      } catch (err) {
        console.warn('Error loading home products:', err);
      }
    };
    loadFeatured();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="space-y-0 min-h-[60vh]">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Trust Badges */}
      <TrustBadges />

      {/* Best Sellers / Featured Section (Strictly Max 4 Products) */}
      {featuredProducts.length > 0 && (
        <BestSellersSection
          products={featuredProducts}
          onQuickView={(p) => setQuickViewProduct(p)}
        />
      )}

      {/* Featured Dadi's Special Trial Pack Interactive Banner */}
      <FeaturedTrialPackBanner />

      {/* Aunty Ji's Sab Flavours Showcase Section */}
      <FlavoursShowcaseSection />

      {/* Verified Google Reviews Section */}
      <CustomerReviewsSection />

      {/* FAQ Section */}
      <FaqSection />

      {/* Global Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};

export default HomePage;

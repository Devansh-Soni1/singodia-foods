import React, { useState, useEffect } from 'react';
import { HeroBanner } from '../components/home/HeroBanner';
import { BestSellersSection } from '../components/home/BestSellersSection';
import { FeaturedTrialPackBanner } from '../components/home/FeaturedTrialPackBanner';
import { TrustBadges } from '../components/common/TrustBadges';
import { FaqSection } from '../components/home/FaqSection';
import { QuickViewModal } from '../components/product/QuickViewModal';
import { productAPI } from '../services/api';

export const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const res = await productAPI.getProducts({ limit: 100 });
        if (Array.isArray(res.products) && res.products.length > 0) {
          // Strictly take products marked as isFeatured, max 4
          const featured = res.products.filter(p => p.isFeatured);
          if (featured.length > 0) {
            setFeaturedProducts(featured.slice(0, 4));
          } else {
            // fallback to top 4 active products if none flagged yet
            setFeaturedProducts(res.products.slice(0, 4));
          }
        }
      } catch (err) {
        console.warn('Error loading home products:', err);
      }
    };
    loadFeatured();
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

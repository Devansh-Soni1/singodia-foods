import React, { useState, useEffect } from 'react';
import { HeroBanner } from '../components/home/HeroBanner';
import { TrustBadges } from '../components/common/TrustBadges';
import { BestSellersSection } from '../components/home/BestSellersSection';
import { CategorySection } from '../components/home/CategorySection';
import { HomemadePromiseSection } from '../components/home/HomemadePromiseSection';
import { ComboHampersSection } from '../components/home/ComboHampersSection';
import { WhyChooseSection } from '../components/home/WhyChooseSection';
import { HowToEnjoySection } from '../components/home/HowToEnjoySection';
import { CustomerReviewsSection } from '../components/home/CustomerReviewsSection';
import { OffersAndNewsletter } from '../components/home/OffersAndNewsletter';
import { FaqSection } from '../components/home/FaqSection';
import { QuickViewModal } from '../components/product/QuickViewModal';
import { productAPI } from '../services/api';
import { SAMPLE_PRODUCTS } from '../utils/sampleData';

export const HomePage = () => {
  const [bestsellers, setBestsellers] = useState(SAMPLE_PRODUCTS);
  const [combos, setCombos] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [featuredRes, allRes] = await Promise.all([
          productAPI.getFeatured(),
          productAPI.getProducts({ limit: 100 })
        ]);
        
        if (featuredRes.bestsellers && featuredRes.bestsellers.length > 0) {
          setBestsellers(featuredRes.bestsellers);
        } else if (allRes.products && allRes.products.length > 0) {
          setBestsellers(allRes.products.slice(0, 8));
        }

        if (allRes.products && allRes.products.length > 0) {
          const comboList = allRes.products.filter(p => p.category === 'combo-packs');
          setCombos(comboList);
        }
      } catch (err) {
        console.warn('Fallback sample data loaded:', err);
      }
    };
    loadHomeData();
  }, []);

  return (
    <div className="space-y-0">
      
      {/* 3. Hero Banner */}
      <HeroBanner />

      {/* 4. Trust Badges */}
      <TrustBadges />

      {/* 5. Best-Selling Pickles Section */}
      <BestSellersSection
        products={bestsellers}
        onQuickView={(p) => setQuickViewProduct(p)}
      />

      {/* 6. Shop by Category Section */}
      <CategorySection />

      {/* 7. Our Homemade Promise Section */}
      <HomemadePromiseSection />

      {/* 8. Featured Combo Packs and Family Pickle Hampers */}
      <ComboHampersSection comboProducts={combos} />

      {/* 9. Why Choose Singodhia Foods Section */}
      <WhyChooseSection />

      {/* 10. How to Enjoy Our Pickles Section */}
      <HowToEnjoySection />

      {/* 11. Customer Reviews and Ratings */}
      <CustomerReviewsSection />

      {/* 12. Special Offers and Newsletter Subscription */}
      <OffersAndNewsletter />

      {/* 13. Frequently Asked Questions */}
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


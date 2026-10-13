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
        const res = await productAPI.getFeatured();
        if (res.bestsellers?.length > 0) {
          setBestsellers(res.bestsellers);
        }
      } catch (err) {
        console.warn('Fallback sample bestsellers loaded');
      }
    };
    loadHomeData();

    // Combos
    const comboList = SAMPLE_PRODUCTS.filter(p => p.category === 'combo-packs');
    setCombos(comboList);
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


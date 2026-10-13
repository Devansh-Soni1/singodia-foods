import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '../product/ProductCard';

export const BestSellersSection = ({ products = [], onQuickView }) => {
  // Ensure the top 4 products are displayed prominently
  const displayProducts = products.slice(0, 4);

  return (
    <section className="py-10 sm:py-14 bg-white border-b border-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading: "SHOP HOMEMADE PICKLES ONLINE" */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-950 uppercase tracking-tight font-sans">
            SHOP HOMEMADE PICKLES ONLINE
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-xl mx-auto">
            100% Traditional homemade recipes cured under the sun with pure mustard oil.
          </p>
        </div>

        {/* 4 Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayProducts.map((product) => (
            <ProductCard
              key={product._id || product.slug}
              product={product}
              onQuickView={onQuickView}
            />
          ))}
        </div>

        {/* View All Pickles Link */}
        <div className="mt-8 text-center">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-light text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-xs hover:shadow-md transition-all"
          >
            <span>Explore All Pickles (सभी अचार देखें)</span>
            <ArrowRight className="w-4 h-4 text-mustard" />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default BestSellersSection;

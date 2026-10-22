import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { categoryAPI } from '../../services/api';
import { SAMPLE_CATEGORIES } from '../../utils/sampleData';

export const CategorySection = () => {
  const [categories, setCategories] = useState(SAMPLE_CATEGORIES);

  useEffect(() => {
    const fetchDynamicCategories = async () => {
      try {
        const res = await categoryAPI.getCategories();
        if (Array.isArray(res.categories) && res.categories.length > 0) {
          setCategories(res.categories);
        }
      } catch (e) {
        // Fallback to SAMPLE_CATEGORIES
      }
    };
    fetchDynamicCategories();
  }, []);

  return (
    <section className="py-14 sm:py-20 bg-white border-y border-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-bold text-mustard-dark uppercase tracking-widest block mb-2">
            Authentic Flavors of Rajasthan
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-charcoal font-serif">
            Shop by Category
          </h2>
          <p className="text-xs sm:text-sm text-earth-brown mt-2">
            Every pickle has its own soul and story. Explore by your preferred taste profile and spice craving.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/product/${(cat.slug || '').replace(/s$/, '')}/`}
              className="group relative rounded-2xl overflow-hidden bg-cream-50 border border-cream-200 shadow-xs hover:shadow-hover transition-all duration-300 flex flex-col"
            >
              {/* Category Image */}
              <div className="aspect-[4/3] sm:aspect-square overflow-hidden bg-cream-100 relative">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Hindi Title Overlay */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-xs font-semibold text-mustard-light block">
                    {cat.hindiName}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold font-serif line-clamp-1">
                    {cat.name}
                  </h3>
                </div>
              </div>

              {/* Description & Action */}
              <div className="p-3 sm:p-4 bg-white flex-1 flex flex-col justify-between">
                <p className="text-[11px] text-earth-brown line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
                <div className="mt-2 pt-2 border-t border-cream-100 flex items-center justify-between text-xs font-bold text-brand-green group-hover:text-mustard-dark transition-colors">
                  <span>Explore Jars</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>

            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CategorySection;


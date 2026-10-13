import React from 'react';
import { Star, CheckCircle, Quote, Sparkles } from 'lucide-react';
import { SAMPLE_REVIEWS } from '../../utils/sampleData';

export const CustomerReviewsSection = ({ reviews = SAMPLE_REVIEWS }) => {
  return (
    <section className="py-16 sm:py-24 bg-[#FAF6EF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Rating Badge */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mustard-light/70 border border-mustard/30 text-brand-green-dark text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-mustard-dark fill-mustard" />
            <span>10,000+ Happy Households Across India</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal font-serif">
            Loved By Families Everywhere
          </h2>
          <p className="text-xs sm:text-sm text-earth-brown mt-2">
            Real feedback from verified pickle lovers who appreciate the authenticity of homemade Rajasthani flavors.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev, idx) => (
            <div
              key={rev._id || rev.id || idx}
              className="bg-white rounded-2xl p-6 border border-cream-200/90 shadow-card hover:shadow-hover transition-all duration-300 flex flex-col justify-between relative"
            >
              <div>
                <Quote className="w-8 h-8 text-cream-200 absolute top-4 right-4 -z-0" />
                
                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < rev.rating ? 'fill-mustard text-mustard' : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>

                <h4 className="text-sm font-bold text-charcoal font-serif mb-2 line-clamp-1">
                  "{rev.title || 'Incredible authentic taste!'}"
                </h4>

                <p className="text-xs text-earth-brown leading-relaxed italic line-clamp-4">
                  "{rev.comment}"
                </p>
              </div>

              {/* Reviewer Details */}
              <div className="pt-4 mt-4 border-t border-cream-100 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-charcoal">
                    {rev.reviewerName}
                  </h5>
                  <p className="text-[10px] text-earth-brown">
                    {rev.location || 'India'}
                  </p>
                </div>
                {rev.isVerifiedBuyer && (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                    <CheckCircle className="w-3 h-3 text-emerald-600" /> Verified
                  </span>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CustomerReviewsSection;


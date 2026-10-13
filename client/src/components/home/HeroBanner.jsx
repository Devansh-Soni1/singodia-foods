import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { adminAPI } from '../../services/api';

export const HeroBanner = ({ customHeroImage }) => {
  const [heroImage, setHeroImage] = useState(customHeroImage || '/hero-banner.png');

  useEffect(() => {
    if (customHeroImage) {
      setHeroImage(customHeroImage);
      return;
    }
    const loadBannerSetting = async () => {
      try {
        const res = await adminAPI.getSettings();
        if (res.settings?.heroBannerImage) {
          setHeroImage(res.settings.heroBannerImage);
        }
      } catch (err) {
        // graceful fallback to default
      }
    };
    loadBannerSetting();
  }, [customHeroImage]);

  return (
    <section className="relative bg-gradient-to-b from-[#F5EEDB] via-[#FAF6EF] to-[#FAF6EF] pt-3 pb-4 sm:pt-4 sm:pb-6 border-b border-cream-200">
      
      {/* Background warm ambient glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 left-1/4 w-80 h-80 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        
        {/* MAIN HERO BANNER IMAGE (Clickable directly to shop) */}
        <Link 
          to="/shop" 
          className="group block relative w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-amber-200/90 shadow-[0_8px_30px_rgba(204,18,38,0.08)] hover:shadow-[0_12px_40px_rgba(204,18,38,0.18)] transition-all duration-300 bg-amber-50"
          title="Click to Shop Singodia Foods Homemade Pickles"
        >
          {/* Dynamic Hero Banner Image */}
          <img
            src={heroImage}
            alt="Singodia Foods - पारंपरिक देसी घर के बने अचार"
            className="w-full h-auto object-cover sm:object-contain block transition-transform duration-500 group-hover:scale-[1.008]"
            loading="eager"
            fetchPriority="high"
            onError={(e) => {
              if (heroImage !== '/hero-banner.png') {
                setHeroImage('/hero-banner.png');
              }
            }}
          />

          {/* Subtle hover sheen overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 sm:pb-6 pointer-events-none">
            <span className="hidden sm:inline-flex items-center gap-2 bg-white/95 text-brand-green font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-lg border border-amber-300 transform translate-y-2 group-hover:translate-y-0 transition-transform">
              <span>Explore All Pickles (अचार की पूरी वेरायटी देखें)</span>
              <ArrowRight className="w-4 h-4 text-amber-600" />
            </span>
          </div>
        </Link>

      </div>

    </section>
  );
};

export default HeroBanner;

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Gift, Flame } from 'lucide-react';

export const HeroBanner = () => {
  const quickPicks = [
    { name: 'आम का अचार (Mango)', slug: 'mango-pickles', icon: '🥭' },
    { name: 'भरवां लाल मिर्च (Red Chilli)', slug: 'red-chilli-pickles', icon: '🌶️' },
    { name: 'हरी मिर्च का अचार (Green Chilli)', slug: 'green-chilli-pickles', icon: '🫑' },
    { name: 'खट्टा मीठा नीम्बू (Lemon)', slug: 'lemon-pickles', icon: '🍋' },
    { name: 'शाही कैर सांगरी (Royal Marwadi)', slug: 'rajasthani-specials', icon: '👑' },
    { name: 'दादी का ट्रायल बॉक्स (5 Jars)', slug: 'combo-packs', icon: '🎁' },
  ];

  return (
    <section className="relative bg-gradient-to-b from-[#F5EEDB] via-[#FAF6EF] to-[#FAF6EF] pt-3 pb-8 sm:pt-4 sm:pb-10 border-b border-cream-200">
      
      {/* Background warm ambient glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 left-1/4 w-80 h-80 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10 space-y-4">
        
        {/* MAIN HERO BANNER IMAGE (Clickable directly to shop) */}
        <Link 
          to="/shop" 
          className="group block relative w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-amber-200/90 shadow-[0_8px_30px_rgba(204,18,38,0.08)] hover:shadow-[0_12px_40px_rgba(204,18,38,0.18)] transition-all duration-300 bg-amber-50"
          title="Click to Shop Singodia Foods Homemade Pickles"
        >
          {/* Hero Banner Image */}
          <img
            src="/hero-banner.png"
            alt="Singodia Foods - पारंपरिक देसी घर के बने अचार"
            className="w-full h-auto object-cover sm:object-contain block transition-transform duration-500 group-hover:scale-[1.008]"
            loading="eager"
            fetchPriority="high"
          />

          {/* Subtle hover sheen overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 sm:pb-6 pointer-events-none">
            <span className="hidden sm:inline-flex items-center gap-2 bg-white/95 text-brand-green font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-lg border border-amber-300 transform translate-y-2 group-hover:translate-y-0 transition-transform">
              <span>Explore All Pickles (अचार की पूरी वेरायटी देखें)</span>
              <ArrowRight className="w-4 h-4 text-amber-600" />
            </span>
          </div>
        </Link>

        {/* ACTION BUTTONS & POPULAR CHIPS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <Link
              to="/shop"
              className="flex-1 sm:flex-initial bg-brand-green hover:bg-brand-green-light text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Shop All Pickles (सभी अचार देखें)</span>
              <ArrowRight className="w-4 h-4 text-mustard" />
            </Link>

            <Link
              to="/build-combo"
              className="flex-1 sm:flex-initial bg-white hover:bg-amber-50 text-gray-800 border border-gray-300 hover:border-amber-400 text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
            >
              <Gift className="w-4 h-4 text-amber-600" />
              <span>Custom Combo Box</span>
            </Link>
          </div>

          {/* Quick Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto no-scrollbar">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-chilli" /> Popular:
            </span>
            {quickPicks.slice(0, 4).map((pick) => (
              <Link
                key={pick.slug}
                to={`/shop?category=${pick.slug}`}
                className="shrink-0 flex items-center gap-1 bg-white hover:bg-amber-50 px-2.5 py-1 rounded-full border border-gray-200 hover:border-amber-300 text-[11px] font-semibold text-gray-700 hover:text-amber-900 transition-colors shadow-2xs"
              >
                <span>{pick.icon}</span>
                <span>{pick.name.split(' ')[0]}</span>
              </Link>
            ))}
          </div>

        </div>

      </div>

    </section>
  );
};

export default HeroBanner;

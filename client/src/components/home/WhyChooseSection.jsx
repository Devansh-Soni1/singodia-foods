import React from 'react';
import { Sun, Sparkles, ShieldCheck, HeartHandshake, Award, PackageCheck } from 'lucide-react';

export const WhyChooseSection = () => {
  const reasons = [
    {
      icon: Sun,
      title: 'Sun-Cured In Glazed Barnis',
      desc: 'We never rush fermentation in heating ovens. Jars spend up to 60 days absorbing natural Rajasthan sunlight on our terrace courtyards.',
      bg: 'bg-amber-50 text-amber-600'
    },
    {
      icon: Sparkles,
      title: 'Pure Kachi Ghani Mustard Oil',
      desc: 'Cold-pressed from indigenous mustard seeds. Natural preservation without artificial chemicals or cheap refined oil dilutions.',
      bg: 'bg-yellow-50 text-yellow-600'
    },
    {
      icon: ShieldCheck,
      title: 'Zero Chemical Preservatives',
      desc: 'No synthetic acetic acid, artificial coloring, or sodium benzoate. Only pure sendha salt, mustard oil, and citrus brine.',
      bg: 'bg-emerald-50 text-emerald-600'
    },
    {
      icon: HeartHandshake,
      title: '40-Year Family Tradition',
      desc: 'Heirloom family recipes passed down across three generations of homemakers in Jaipur, preserving original spice secrets.',
      bg: 'bg-red-50 text-red-600'
    },
    {
      icon: Award,
      title: 'Hathras Hing & Mathania Mirch',
      desc: 'We source single-origin pure spices: pungent Hathras asafoetida resin and vibrant Mathania red chillies for authentic depth.',
      bg: 'bg-orange-50 text-orange-600'
    },
    {
      icon: PackageCheck,
      title: 'Leak-Proof Safe Shipping',
      desc: 'Triple-sealed food-grade packaging designed specifically for oil-rich pickles. 100% replacement guarantee if damaged.',
      bg: 'bg-green-50 text-green-600'
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#FAF6EF] border-t border-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-mustard-dark uppercase tracking-widest block mb-2">
            The Singodhia Standard
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal font-serif">
            Why Choose Singodhia Foods?
          </h2>
          <p className="text-xs sm:text-sm text-earth-brown mt-2">
            Because a real Indian meal deserves real homemade achar, not industrial processed mass production.
          </p>
        </div>

        {/* 6 Grid items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {reasons.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-cream-200/90 shadow-card hover:shadow-hover hover:border-brand-green/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-charcoal font-serif mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-earth-brown leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default WhyChooseSection;


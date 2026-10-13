import React from 'react';
import { Sun, ShieldCheck, HeartHandshake, Sparkles, PackageCheck } from 'lucide-react';

export const TrustBadges = ({ layout = 'row' }) => {
  const badges = [
    {
      icon: Sun,
      title: '100% Sun-Cured',
      desc: 'Naturally aged in ceramic barnis under the sun',
      color: 'text-amber-600 bg-amber-50'
    },
    {
      icon: Sparkles,
      title: 'Kachi Ghani Mustard Oil',
      desc: 'Cold-pressed pure oil, zero refined blends',
      color: 'text-yellow-600 bg-yellow-50'
    },
    {
      icon: HeartHandshake,
      title: 'Heirloom Family Recipes',
      desc: 'Authentic 40-year Rajasthani heritage taste',
      color: 'text-emerald-700 bg-emerald-50'
    },
    {
      icon: ShieldCheck,
      title: 'Zero Chemical Preservatives',
      desc: 'No synthetic vinegar or artificial colours',
      color: 'text-green-700 bg-green-50'
    },
    {
      icon: PackageCheck,
      title: 'Spill-Proof Packing',
      desc: 'Airtight, sealed jars delivered safely',
      color: 'text-orange-600 bg-orange-50'
    }
  ];

  if (layout === 'compact') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 py-4">
        {badges.map((b, idx) => {
          const Icon = b.icon;
          return (
            <div key={idx} className="flex items-center gap-2 p-2.5 rounded-lg bg-cream-50 border border-cream-200">
              <div className={`p-2 rounded-md ${b.color} flex-shrink-0`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-charcoal">{b.title}</p>
                <p className="text-[10px] text-earth-brown">{b.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="bg-cream-50/80 border-y border-cream-200 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {badges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div 
                key={idx} 
                className="flex flex-col items-center text-center p-4 rounded-xl bg-white border border-cream-200/80 shadow-xs hover:shadow-card transition-shadow duration-200"
              >
                <div className={`w-12 h-12 rounded-full ${badge.color} flex items-center justify-center mb-3 shadow-inner`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-charcoal mb-1 font-sans">{badge.title}</h4>
                <p className="text-xs text-earth-brown leading-relaxed">{badge.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrustBadges;


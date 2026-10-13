import React from 'react';
import { Sun, Heart, Sparkles, ShieldCheck, Award } from 'lucide-react';
import { TrustBadges } from '../components/common/TrustBadges';

export const AboutPage = () => {
  return (
    <div className="py-12 sm:py-20 bg-[#FAF6EF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Story Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-mustard-dark uppercase tracking-widest block mb-2">
            The Singodhia Heritage • जयपुर का पारंपरिक स्वाद
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1E4334] font-serif leading-tight">
            Reviving the Lost Art of Desi Homemade Pickling
          </h1>
          <p className="text-sm sm:text-base text-earth-brown mt-4 leading-relaxed">
            Born in the historic courtyards of Jaipur, Rajasthan in 1984, Singodhia Foods was founded on a simple family principle: 
            <strong> real achar requires patience, authentic sunlight, and pure mustard oil—never chemical preservatives.</strong>
          </p>
        </div>

        {/* Narrative & Image Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-6 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-cream-100 aspect-[4/3]">
            <img
              src="https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80"
              alt="Rajasthani traditional heritage cooking"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="lg:col-span-6 space-y-5 text-xs sm:text-sm text-earth-brown leading-relaxed">
            <h2 className="text-2xl font-bold text-charcoal font-serif">
              Grandmother’s Rooftop Courtyard in Jaipur
            </h2>
            <p>
              Decades ago, every summer in Jaipur began with the arrival of raw Ramkela mangoes and whole Banarasi chillies. 
              Our dadi (grandmother) would lead the women of the neighborhood in slicing, salting, and stone-roasting spices.
            </p>
            <p>
              Ceramic martabans wrapped with red muslin cloths were aligned across the white terrace in rows to bask in the intense Rajasthani sunshine for weeks. That slow, gentle sun-curing gave the pickle an extraordinary aroma that filled the entire lane.
            </p>
            <p>
              When commercial brands took over the markets with artificial synthetic vinegar (acetic acid) and mechanical blending, the true soul of Indian pickles was lost. We created Singodhia Foods to preserve that endangered heirloom tradition.
            </p>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mb-16">
          <TrustBadges />
        </div>

      </div>
    </div>
  );
};

export default AboutPage;


import React from 'react';
import { Sun, Heart, CheckCircle2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HomemadePromiseSection = () => {
  return (
    <section className="py-16 sm:py-24 bg-[#F5EEDB] relative overflow-hidden">
      
      {/* Decorative background blur */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-mustard/15 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Story Image Grid */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md">
              
              {/* Primary Photo: Sun-curing barnis */}
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] bg-cream-100">
                <img
                  src="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80"
                  alt="Traditional Indian pickle barnis sun-curing"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Overlaid Secondary Badge */}
              <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-white p-4 sm:p-5 rounded-2xl shadow-xl border border-cream-200 max-w-[220px]">
                <div className="flex items-center gap-2 text-brand-green font-bold text-xs mb-1">
                  <Sun className="w-4 h-4 text-mustard flex-shrink-0" />
                  <span>30-60 Days in Sunlight</span>
                </div>
                <p className="text-[11px] text-earth-brown leading-tight">
                  Natural fermentation gives real tang without a drop of chemical vinegar.
                </p>
              </div>

            </div>
          </div>

          {/* Right: The Promise Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-bold text-mustard-dark uppercase tracking-widest block mb-2">
                दादी के हाथों का शुद्ध स्वाद • The Singodhia Heritage
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1E4334] font-serif leading-tight">
                Our Homemade Promise: <br />
                <span className="italic font-normal text-charcoal">Pure Ingredients, Zero Shortcuts.</span>
              </h2>
            </div>

            <p className="text-sm sm:text-base text-earth-brown leading-relaxed">
              At <strong>Singodhia Foods</strong>, we believe commercial factory pickles packed with artificial acetic acid and preservatives have robbed Indian homes of the genuine taste of our grandmothers’ kitchens. We refuse to cut corners.
            </p>

            {/* The 4 pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {[
                {
                  title: 'Cold-Pressed Mustard Oil',
                  desc: 'We use 100% pure Kachi Ghani mustard oil that naturally preserves while adding pungency.'
                },
                {
                  title: 'Ceramic Martabans (बरनी)',
                  desc: 'Pickles breathe and mature in food-grade glazed clay barnis, maintaining taste for years.'
                },
                {
                  title: 'Slow Sun-Drying',
                  desc: 'Every batch absorbs warmth from real sunlight, unlocking natural spice aromas slowly.'
                },
                {
                  title: 'Whole Roasted Spices',
                  desc: 'Hand-roasted Fennel, Methi, Hathras Hing, and Yellow Mustard ground coarsely.'
                }
              ].map((pillar, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-white/80 border border-cream-200/90 shadow-xs">
                  <CheckCircle2 className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-charcoal">{pillar.title}</h4>
                    <p className="text-[11px] text-earth-brown leading-relaxed mt-0.5">{pillar.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex items-center gap-4">
              <Link
                to="/about"
                className="bg-brand-green hover:bg-brand-green-light text-white text-xs sm:text-sm font-bold px-6 py-3.5 rounded-xl transition-all shadow-sm"
              >
                Read Our Story & Journey
              </Link>
              <Link
                to="/shop"
                className="text-xs sm:text-sm font-bold text-brand-green hover:underline underline-offset-4"
              >
                Taste the Tradition →
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default HomemadePromiseSection;


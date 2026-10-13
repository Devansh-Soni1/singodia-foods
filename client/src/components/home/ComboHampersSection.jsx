import React from 'react';
import { Link } from 'react-router-dom';
import { Gift, Sparkles, ArrowRight, Check, Star } from 'lucide-react';
import { formatPrice } from '../../utils/formatCurrency';
import { useCart } from '../../context/CartContext';

export const ComboHampersSection = ({ comboProducts = [] }) => {
  const { addToCart } = useCart();

  return (
    <section className="py-14 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-mustard-dark uppercase tracking-wider mb-2">
              <Gift className="w-3.5 h-3.5" />
              <span>Gifting & Family Hampers</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-charcoal font-serif">
              Featured Combos & Festive Gift Hampers
            </h2>
            <p className="text-xs sm:text-sm text-earth-brown mt-1 max-w-xl">
              Can’t decide on one? Experience our curated sampler boxes or gift traditional Rajasthani royalty in authentic ceramic martabans.
            </p>
          </div>

          <Link
            to="/build-combo"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 bg-mustard-light/60 hover:bg-mustard text-brand-green-dark px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-mustard-dark" />
            <span>Customize Your Own Box</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Hampers Showcase Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: Dadi's Trial Box */}
          <div className="bg-[#FAF6EF] rounded-3xl p-6 sm:p-8 border-2 border-cream-200/90 shadow-card hover:shadow-hover transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="bg-brand-green text-white text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full">
                  ⭐ Top Rated Sampler
                </span>
                <span className="text-xs font-bold text-mustard-dark">
                  5 x 75g Mini Barni Jars
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center mb-6">
                <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-cream-200 shadow-xs">
                  <img
                    src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80"
                    alt="Dadi's Special Pickle Trial Box"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-charcoal font-serif">
                    Dadi's Special Pickle Trial Box
                  </h3>
                  <p className="text-xs text-earth-brown leading-relaxed">
                    Includes 5 signature varieties: Kachi Keri Aam, Banarasi Lal Mirch, Hari Mirch Tipore, Khatta Meetha Nimbu, and Mix Achar.
                  </p>
                  <ul className="text-xs space-y-1.5 text-charcoal pt-1">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-brand-green" /> Perfect for tasting & finding favorites
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-brand-green" /> Travel-friendly leak-proof glass jars
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-cream-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 line-through mr-2">₹599</span>
                <span className="text-2xl font-extrabold text-brand-green">₹499</span>
              </div>
              <button
                onClick={() => {
                  const item = comboProducts.find(p => p.slug === 'dadis-special-pickle-trial-box') || {
                    name: "Dadi's Special Pickle Trial Box (Set of 5)",
                    slug: 'dadis-special-pickle-trial-box',
                    variants: [{ weight: '5 x 75g Jars', price: 499 }]
                  };
                  addToCart(item, item.variants?.[0], 1);
                }}
                className="bg-brand-green hover:bg-brand-green-light text-white text-xs font-bold px-6 py-3 rounded-xl transition-all shadow-sm"
              >
                Add Trial Box to Cart
              </button>
            </div>
          </div>

          {/* Card 2: Royal Rajasthani Martaban Hamper */}
          <div className="bg-[#FAF6EF] rounded-3xl p-6 sm:p-8 border-2 border-mustard/30 shadow-card hover:shadow-hover transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="bg-mustard text-brand-green-dark text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full">
                  👑 Royal Luxury Gift Box
                </span>
                <span className="text-xs font-bold text-brand-green">
                  2 Ceramic Barnis + Brass Spoon
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center mb-6">
                <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-cream-200 shadow-xs">
                  <img
                    src="https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80"
                    alt="Royal Rajasthani Martaban Hamper"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-charcoal font-serif">
                    Rajasthani Shahi Martaban Hamper
                  </h3>
                  <p className="text-xs text-earth-brown leading-relaxed">
                    Featuring 500g Marwadi Kair Sangri + 500g Banarasi Lal Mirch Bharwa in authentic glazed ceramic barnis, complete with a handcrafted brass pickle spoon.
                  </p>
                  <ul className="text-xs space-y-1.5 text-charcoal pt-1">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-brand-green" /> Reusable glazed ceramic martabans
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-brand-green" /> Royal festive keepsake gift box
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-cream-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 line-through mr-2">₹1,450</span>
                <span className="text-2xl font-extrabold text-brand-green">₹1,199</span>
              </div>
              <button
                onClick={() => {
                  const item = comboProducts.find(p => p.slug === 'rajasthani-shahi-martaban-hamper') || {
                    name: 'Rajasthani Shahi Martaban Hamper',
                    slug: 'rajasthani-shahi-martaban-hamper',
                    variants: [{ weight: '2 x 500g Ceramic Barnis', price: 1199 }]
                  };
                  addToCart(item, item.variants?.[0], 1);
                }}
                className="bg-mustard hover:bg-mustard-dark text-brand-green-dark text-xs font-extrabold px-6 py-3 rounded-xl transition-all shadow-sm"
              >
                Add Shahi Hamper to Cart
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default ComboHampersSection;


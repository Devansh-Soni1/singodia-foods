import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const FLAVOURS = [
  {
    id: 'mango',
    name: 'Mango Pickle',
    image: '/flavours/mango-pickle.webp',
    link: '/category/mango-pickles/',
    hindiName: 'आम का अचार'
  },
  {
    id: 'sweet',
    name: 'Sweet Pickle',
    image: '/flavours/sweet-pickle.webp',
    link: '/shop?taste=sweet',
    hindiName: 'मीठा अचार'
  },
  {
    id: 'spicy',
    name: 'Spicy Pickle',
    image: '/flavours/spicy-pickle.webp',
    link: '/category/red-chilli-pickles/',
    hindiName: 'तीखी लाल मिर्च'
  },
  {
    id: 'mixed',
    name: 'Mixed Pickle',
    image: '/flavours/mixed-pickle.webp',
    link: '/category/mixed-pickles/',
    hindiName: 'पचरंगा मिक्स'
  },
  {
    id: 'papad',
    name: 'Papad',
    image: '/flavours/papad.webp',
    link: '/category/papad/',
    hindiName: 'देसी पापड़'
  },
  {
    id: 'lemon',
    name: 'Lemon Pickle',
    image: '/flavours/lemon-pickle.webp',
    link: '/category/lemon-pickles/',
    hindiName: 'नीम्बू अचार'
  }
];

export const FlavoursShowcaseSection = () => {
  return (
    <section className="py-10 sm:py-14 bg-white border-b border-[#F0E2C4]/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <span className="font-serif text-2xl sm:text-4xl font-extrabold text-[#1F4D36] block leading-tight tracking-wide mb-1">
            Achar Wali Aunty Ji ke paas
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#1A1A1A] uppercase tracking-tight">
            SAB FLAVOURS <span className="text-[#D12027]">hai!</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#6B5A48] font-medium mt-3 max-w-2xl mx-auto leading-relaxed">
            From zesty sun-cured raw mango to stone-pounded royal masalas, crisp hand-rolled papads and traditional barni pickles, tap any flavour to inspect and taste
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4 mb-8">
          {FLAVOURS.map((f) => (
            <Link
              key={f.id}
              to={f.link}
              className="bg-[#FDFAF6] border border-[#FBC464] rounded-2xl p-1.5 sm:p-2 text-center shadow-[0px_4px_10px_rgba(0,0,0,0.06)] hover:shadow-[0px_10px_22px_rgba(0,0,0,0.12)] hover:border-[#D12027] transition-all duration-300 flex flex-col group hover:-translate-y-1.5"
            >
              {/* Image Wrapper */}
              <div className="w-full rounded-xl overflow-hidden aspect-square bg-amber-50 relative">
                <img
                  src={f.image}
                  alt={f.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              </div>

              {/* Title */}
              <div className="pt-2.5 pb-1">
                <span className="text-xs sm:text-sm font-bold text-[#1A1A1A] group-hover:text-[#D12027] transition-colors block line-clamp-1">
                  {f.name}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Section Footer */}
        <div className="border-t border-[#F0E2C4] pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 font-semibold text-gray-700">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1C7A45] inline-block animate-pulse"></span>
            <span>Zero Preservatives • Sun-Cured in Barnis • Handcrafted Homemade Taste</span>
          </div>
          <Link
            to="/shop"
            className="font-bold text-[#D12027] hover:underline flex items-center gap-1.5 group cursor-pointer"
          >
            <span>Explore All Singodia Foods Products</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default FlavoursShowcaseSection;


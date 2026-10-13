import React from 'react';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HowToEnjoySection = () => {
  const pairings = [
    {
      meal: 'Crispy Paratha & White Makkhan',
      hindiMeal: 'गरमा-गरम पराठा और मक्खन',
      pickle: 'Banarasi Lal Mirch Bharwa',
      image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=600&q=80',
      desc: 'Crack open a whole stuffed red chilli with crispy aloo or gobi paratha for an explosion of roasted saunf and mustard.'
    },
    {
      meal: 'Comforting Dal Chawal & Ghee',
      hindiMeal: 'दाल-चावल और देसी घी',
      pickle: 'Kachi Keri Desi Aam Ka Achar',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      desc: 'A spoonful of sour raw mango pickle turns humble yellow dal and steaming basmati rice into heaven on a plate.'
    },
    {
      meal: 'Soothing Moong Dal Khichdi',
      hindiMeal: 'मूंग दाल खिचड़ी',
      pickle: 'Khatta Meetha Nimbu (Oil-Free)',
      image: 'https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&w=600&q=80',
      desc: 'Sun-matured sweet & sour lemon preserve provides refreshing digestive balance to light khichdi.'
    },
    {
      meal: 'Bajra Roti & Dal Baati',
      hindiMeal: 'बाजरा रोटी और दाल बाटी',
      pickle: 'Marwadi Kair Sangri Ka Shahi Achar',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
      desc: 'The quintessential royal Rajasthani banquet pairing. Earthy desert capers and mustard oil complement rustic bajra rotis.'
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-y border-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-mustard-dark uppercase tracking-widest block mb-2">
            The Art of Desi Dining
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal font-serif">
            How to Enjoy Our Pickles
          </h2>
          <p className="text-xs sm:text-sm text-earth-brown mt-2">
            In Indian tradition, a meal without achar is incomplete. Here is how our patrons love elevating their daily thalis.
          </p>
        </div>

        {/* Pairing Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pairings.map((item, idx) => (
            <div
              key={idx}
              className="group bg-cream-50 rounded-2xl overflow-hidden border border-cream-200 shadow-card hover:shadow-hover transition-all duration-300 flex flex-col justify-between"
            >
              <div className="aspect-[4/3] overflow-hidden bg-cream-200 relative">
                <img
                  src={item.image}
                  alt={item.meal}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                  {item.hindiMeal}
                </div>
              </div>

              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-charcoal font-serif mb-1">
                    {item.meal}
                  </h3>
                  <div className="text-xs font-bold text-brand-green mb-2 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-mustard" />
                    <span>Pairs with: {item.pickle}</span>
                  </div>
                  <p className="text-xs text-earth-brown leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-cream-200/80">
                  <Link
                    to="/shop"
                    className="text-xs font-bold text-mustard-dark hover:text-brand-green transition-colors flex items-center justify-between"
                  >
                    <span>Try This Pairing</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowToEnjoySection;


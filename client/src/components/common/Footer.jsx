import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, MessageCircle, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#143025] text-[#FAF6EF] pt-14 pb-8 border-t-4 border-mustard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-white/10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block bg-[#FAF6EF] p-3 sm:p-4 rounded-2xl shadow-md hover:shadow-lg transition-all group">
              <img 
                src="/logo.png" 
                alt="Singodia Foods" 
                className="h-20 sm:h-24 w-auto object-contain drop-shadow-sm transition-transform group-hover:scale-105" 
              />
            </Link>
            <p className="text-xs sm:text-sm text-cream-200/90 leading-relaxed max-w-sm">
              Authentic Rajasthani homemade pickles prepared using time-honoured family recipes. 
              Sun-cured naturally in glazed ceramic martabans with pure cold-pressed Kachi Ghani mustard oil and zero artificial preservatives.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-mustard font-semibold">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> 100% Traditional
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> FSSAI Certified Kitchen
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-mustard font-sans">
              Explore Pickles
            </h4>
            <ul className="space-y-2 text-xs text-cream-200/80">
              <li>
                <Link to="/shop" className="hover:text-mustard transition-colors">
                  All Pickles (सभी आचार)
                </Link>
              </li>
              <li>
                <Link to="/shop?bestsellers=true" className="hover:text-mustard transition-colors">
                  Bestsellers
                </Link>
              </li>
              <li>
                <Link to="/build-combo" className="hover:text-mustard transition-colors text-mustard font-semibold">
                  Build Your Own Combo
                </Link>
              </li>
              <li>
                <Link to="/shop?category=combo-packs" className="hover:text-mustard transition-colors">
                  Festive Gift Hampers
                </Link>
              </li>
              <li>
                <Link to="/shop?category=rajasthani-specials" className="hover:text-mustard transition-colors">
                  Rajasthani Specials (कैर सांगरी)
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-mustard font-sans">
              Pickle Categories
            </h4>
            <ul className="space-y-2 text-xs text-cream-200/80">
              <li>
                <Link to="/shop?category=mango-pickles" className="hover:text-mustard transition-colors">
                  Mango Pickle (Aam Ka Achar)
                </Link>
              </li>
              <li>
                <Link to="/shop?category=red-chilli-pickles" className="hover:text-mustard transition-colors">
                  Red Chilli (Banarasi Bharwa)
                </Link>
              </li>
              <li>
                <Link to="/shop?category=green-chilli-pickles" className="hover:text-mustard transition-colors">
                  Green Chilli (Hari Mirch)
                </Link>
              </li>
              <li>
                <Link to="/shop?category=lemon-pickles" className="hover:text-mustard transition-colors">
                  Lemon Pickle (Oil-Free Nimbu)
                </Link>
              </li>
              <li>
                <Link to="/shop?category=garlic-pickles" className="hover:text-mustard transition-colors">
                  Garlic Pickle (Lahsun Ka Achar)
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-mustard font-sans">
              Contact & Support
            </h4>
            <ul className="space-y-2.5 text-xs text-cream-200/80">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-mustard flex-shrink-0 mt-0.5" />
                <span>Prem Niwas, Bagreche Bass, Sujangarh, Rajasthan 331507</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-mustard flex-shrink-0" />
                <a href="tel:+919782983909" className="hover:text-mustard transition-colors">+91 97829 83909</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-mustard flex-shrink-0" />
                <a href="mailto:premsingodiya861@gmail.com" className="hover:text-mustard transition-colors">premsingodiya861@gmail.com</a>
              </li>
              <li className="pt-1">
                <a
                  href="https://wa.me/919782983909?text=Namaste%20Singodhia%20Foods!%20Mujhe%20order%20%2F%20products%20ke%20sambandh%20me%20query%20%2F%20issue%20ke%20liye%20help%20chahiye."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] text-white font-bold text-xs hover:bg-[#20ba5a] transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white text-[#25D366]" />
                  Chat on WhatsApp
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar with payment badges and policies */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-cream-200/70">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <span>© {new Date().getFullYear()} Singodhia Foods. All Rights Reserved.</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Handcrafted with <Heart className="w-3 h-3 text-chilli fill-current" /> in Rajasthan
            </span>
          </div>

          {/* Payment Methods */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[11px] text-cream-200/60 uppercase mr-1">Accepted:</span>
            <span className="px-2 py-1 bg-white/10 rounded font-semibold text-[10px]">UPI</span>
            <span className="px-2 py-1 bg-white/10 rounded font-semibold text-[10px]">Google Pay</span>
            <span className="px-2 py-1 bg-white/10 rounded font-semibold text-[10px]">PhonePe</span>
            <span className="px-2 py-1 bg-white/10 rounded font-semibold text-[10px]">Cards</span>
            <span className="px-2 py-1 bg-white/10 rounded font-semibold text-[10px]">Cash on Delivery</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;


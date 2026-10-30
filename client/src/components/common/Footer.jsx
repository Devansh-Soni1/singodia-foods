import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, MessageCircle, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#143025] text-[#FAF6EF] pt-8 sm:pt-12 pb-6 sm:pb-8 border-t-4 border-mustard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid: On desktop 5 cols, on mobile links sit side-by-side in 2 cols */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8 pb-6 sm:pb-8 border-b border-white/10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-2.5 sm:space-y-4">
            <Link to="/" className="inline-block transition-all group">
              <img 
                src="/logo.png" 
                alt="Singodia Foods" 
                className="h-16 sm:h-24 md:h-32 w-auto object-contain drop-shadow-md transition-transform group-hover:scale-105" 
              />
            </Link>
            <p className="text-xs sm:text-sm text-cream-200/90 leading-relaxed max-w-sm">
              Authentic Rajasthani homemade pickles prepared using time-honoured family recipes. 
              Sun-cured naturally in glazed ceramic martabans with pure cold-pressed Kachi Ghani mustard oil and zero artificial preservatives.
            </p>
            <div className="pt-1 flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-mustard font-semibold">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> 100% Traditional
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> FSSAI Certified Kitchen
              </span>
            </div>
          </div>

          {/* Links Section: 2-column grid on mobile to keep vertical height minimal */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4 sm:gap-6">
            
            {/* Quick Links */}
            <div className="space-y-2 sm:space-y-3">
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-mustard font-sans">
                Explore Pickles
              </h4>
              <ul className="space-y-1.5 sm:space-y-2 text-[11px] sm:text-xs text-cream-200/80">
                <li>
                  <Link to="/shop" className="hover:text-mustard transition-colors">
                    All Pickles (सभी आचार)
                  </Link>
                </li>
                <li>
                  <Link to="/shop/" className="hover:text-mustard transition-colors">
                    Bestsellers
                  </Link>
                </li>
                <li>
                  <Link to="/build-combo" className="hover:text-mustard transition-colors text-mustard font-semibold">
                    Build Combo
                  </Link>
                </li>
                <li>
                  <Link to="/product/combo-packs/" className="hover:text-mustard transition-colors">
                    Gift Hampers
                  </Link>
                </li>
                <li>
                  <Link to="/product/rajasthani-specials/" className="hover:text-mustard transition-colors">
                    Rajasthani Specials
                  </Link>
                </li>
              </ul>
            </div>

            {/* Categories */}
            <div className="space-y-2 sm:space-y-3">
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-mustard font-sans">
                Pickle Categories
              </h4>
              <ul className="space-y-1.5 sm:space-y-2 text-[11px] sm:text-xs text-cream-200/80">
                <li>
                  <Link to="/product/mango-pickle/" className="hover:text-mustard transition-colors">
                    Mango (Aam Ka Achar)
                  </Link>
                </li>
                <li>
                  <Link to="/product/red-chilli-pickle/" className="hover:text-mustard transition-colors">
                    Red Chilli (Banarasi)
                  </Link>
                </li>
                <li>
                  <Link to="/product/green-chilli-pickle/" className="hover:text-mustard transition-colors">
                    Green Chilli (Hari Mirch)
                  </Link>
                </li>
                <li>
                  <Link to="/product/lemon-pickle/" className="hover:text-mustard transition-colors">
                    Lemon (Oil-Free Nimbu)
                  </Link>
                </li>
                <li>
                  <Link to="/product/garlic-pickle/" className="hover:text-mustard transition-colors">
                    Garlic (Lahsun)
                  </Link>
                </li>
              </ul>
            </div>

          </div>

          {/* Contact Details */}
          <div className="lg:col-span-1 space-y-2 sm:space-y-3">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-mustard font-sans">
              Contact & Support
            </h4>
            <ul className="space-y-2 text-[11px] sm:text-xs text-cream-200/80">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-mustard flex-shrink-0 mt-0.5" />
                <span>Prem Niwas, Bagreche Bass, Sujangarh, Rajasthan 331507</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-mustard flex-shrink-0" />
                <a href="tel:+919782983909" className="hover:text-mustard transition-colors">+91 97829 83909</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-mustard flex-shrink-0" />
                <a href="mailto:premsingodiya861@gmail.com" className="hover:text-mustard transition-colors truncate">premsingodiya861@gmail.com</a>
              </li>
              <li className="pt-1">
                <a
                  href="https://wa.me/919782983909?text=Hello%20Singodhia%20Foods%2C%20I%20have%20an%20inquiry%20regarding%20products%20and%20orders."
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
        <div className="pt-4 sm:pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] sm:text-xs text-cream-200/70">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-4 text-center md:text-left">
            <span>© {new Date().getFullYear()} Singodhia Foods. All Rights Reserved.</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1">
              Handcrafted with <Heart className="w-3 h-3 text-chilli fill-current" /> in Rajasthan
            </span>
          </div>

          {/* Payment Methods */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 text-[10px]">
            <span className="text-cream-200/60 uppercase mr-1">Accepted:</span>
            <span className="px-2 py-0.5 bg-white/10 rounded font-semibold">UPI</span>
            <span className="px-2 py-0.5 bg-white/10 rounded font-semibold">GPay</span>
            <span className="px-2 py-0.5 bg-white/10 rounded font-semibold">PhonePe</span>
            <span className="px-2 py-0.5 bg-white/10 rounded font-semibold">Cards</span>
            <span className="px-2 py-0.5 bg-white/10 rounded font-semibold">NetBanking</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

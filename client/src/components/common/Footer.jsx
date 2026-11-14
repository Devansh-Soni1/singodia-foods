import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, MessageCircle, ShieldCheck, Heart, Sparkles, Star, ExternalLink, Building2 } from 'lucide-react';
import footerLogo from '../../assets/footer-logo.png';
import { InstagramIcon, YouTubeIcon, FacebookIcon } from './SocialLinks';

export const Footer = () => {
  return (
    <footer className="bg-[#143025] text-[#FAF6EF] pt-8 sm:pt-12 pb-6 sm:pb-8 border-t-4 border-mustard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid: On desktop 5 cols, on mobile links sit side-by-side */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8 pb-6 sm:pb-8 border-b border-white/10">
          
          {/* Brand Col */}
          <div className="col-span-2 lg:col-span-2 space-y-2.5 sm:space-y-4">
            <Link to="/" className="inline-block transition-all group">
              <img 
                src={footerLogo} 
                alt="Singodia Foods" 
                className="h-20 sm:h-28 md:h-36 w-auto object-contain drop-shadow-md transition-transform group-hover:scale-105" 
                onError={(e) => { e.target.src = '/footer-logo.png'; }}
              />
            </Link>
            <p className="text-xs sm:text-sm text-cream-200/90 leading-relaxed max-w-sm">
              Authentic Rajasthani homemade pickles prepared using time-honoured family recipes. 
              Sun-cured naturally in glazed ceramic martabans with authentic hand-ground spices and zero artificial preservatives.
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

            {/* Social Media Channels */}
            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-mustard block mb-2 font-sans">
                Follow Us (सोशल मीडिया)
              </span>
              <div className="flex items-center gap-2">
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/singodiafoods?obrf=Y3l0aGw1enh2bTl6"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  title="Instagram (@singodiafoods)"
                  className="group inline-flex items-center h-8 px-2 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden hover:pr-3 cursor-pointer"
                >
                  <InstagramIcon className="w-4 h-4 shrink-0" />
                  <span className="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-1.5 transition-all duration-300 ease-out whitespace-nowrap text-xs font-bold pointer-events-none">
                    Instagram
                  </span>
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com/@singodiafoods?si=a4PR1N-ItrTXdKgx"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  title="YouTube (@singodiafoods)"
                  className="group inline-flex items-center h-8 px-2 rounded-full bg-[#FF0000] text-white shadow-xs hover:bg-[#d90000] hover:shadow-md transition-all duration-300 overflow-hidden hover:pr-3 cursor-pointer"
                >
                  <YouTubeIcon className="w-4 h-4 shrink-0" />
                  <span className="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-1.5 transition-all duration-300 ease-out whitespace-nowrap text-xs font-bold pointer-events-none">
                    YouTube
                  </span>
                </a>

                {/* Facebook */}
                <a
                  href="https://www.facebook.com/share/1DTfda4oNd/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  title="Facebook (Singodia Foods)"
                  className="group inline-flex items-center h-8 px-2 rounded-full bg-[#1877F2] text-white shadow-xs hover:bg-[#0d65d9] hover:shadow-md transition-all duration-300 overflow-hidden hover:pr-3 cursor-pointer"
                >
                  <FacebookIcon className="w-4 h-4 shrink-0" />
                  <span className="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-1.5 transition-all duration-300 ease-out whitespace-nowrap text-xs font-bold pointer-events-none">
                    Facebook
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Explore Pickles */}
          <div className="col-span-1 space-y-2 sm:space-y-3">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-mustard font-sans">
              Explore Pickles
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 text-[11px] sm:text-xs text-cream-200/80">
              <li>
                <Link to="/allpickles" className="hover:text-mustard transition-colors">
                  All Pickles (सभी आचार)
                </Link>
              </li>
              <li>
                <a 
                  href="/#trial-pack" 
                  onClick={(e) => {
                    if (window.location.pathname === '/') {
                      e.preventDefault();
                      document.getElementById('trial-pack')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="hover:text-mustard transition-colors text-mustard font-semibold"
                >
                  Trial Pack (ट्रायल पैक)
                </a>
              </li>
              <li>
                <Link to="/category/mango-pickles/" className="hover:text-mustard transition-colors">
                  Mango (आम का अचार)
                </Link>
              </li>
              <li>
                <Link to="/category/red-chilli-pickles/" className="hover:text-mustard transition-colors">
                  Banarasi Lal Mirch
                </Link>
              </li>
              <li>
                <Link to="/category/green-chilli-pickles/" className="hover:text-mustard transition-colors">
                  Green Chilli (हरी मिर्च)
                </Link>
              </li>
              <li>
                <Link to="/category/garlic-pickles/" className="hover:text-mustard transition-colors">
                  Garlic (लहसुन अचार)
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Policies */}
          <div className="col-span-1 space-y-2 sm:space-y-3">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-mustard font-sans">
              Company & Policies
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 text-[11px] sm:text-xs text-cream-200/80">
              <li>
                <Link to="/about" className="hover:text-mustard transition-colors">
                  About Us (हमारी कहानी)
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-mustard transition-colors">
                  Contact Us (संपर्क करें)
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-mustard transition-colors">
                  Terms & Conditions (नियम)
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-mustard transition-colors">
                  Privacy Policy (गोपनीयता)
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="hover:text-mustard transition-colors">
                  Shipping Policy (शिपिंग)
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-mustard transition-colors">
                  Refund & Return (रिफंड)
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="col-span-2 md:col-span-2 lg:col-span-1 space-y-2 sm:space-y-3">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-mustard font-sans">
              Contact & Support
            </h4>
            <ul className="space-y-2 text-[11px] sm:text-xs text-cream-200/80">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-mustard flex-shrink-0 mt-0.5" />
                <span>Sujangarh, Rajasthan 331507</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-mustard flex-shrink-0" />
                <a href="tel:+917597966707" className="hover:text-mustard transition-colors">+91 75979 66707</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-mustard flex-shrink-0" />
                <a href="mailto:premsingodiya861@gmail.com" className="hover:text-mustard transition-colors truncate">premsingodiya861@gmail.com</a>
              </li>
              <li className="flex items-center gap-2">
                <Star className="w-3.5 h-3.5 text-mustard fill-mustard flex-shrink-0" />
                <a
                  href="https://share.google/6uEBWLjWGXSZhmBRI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-mustard transition-colors font-semibold flex items-center gap-1"
                >
                  <span>4.9★ on Google Reviews</span>
                  <ExternalLink className="w-3 h-3 text-mustard" />
                </a>
              </li>
              <li className="pt-1 flex flex-wrap gap-2">
                <a
                  href="https://wa.me/917597966707?text=Hello%20Singodia%20Foods%2C%20I%20have%20an%20inquiry%20regarding%20products%20and%20orders."
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

        {/* Dedicated 100% Secure Payment Logos Strip */}
        <div className="pt-6 pb-4 border-t border-white/10 mt-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-cream-200/80 uppercase tracking-wider flex items-center gap-1.5">
              <span>🔒 100% Secure Payments Powered by</span>
              <span className="text-white font-extrabold tracking-normal">Razorpay</span>
            </span>
          </div>

          {/* Payment Method Brand Logos - Round Shape */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 select-none">
            {/* Google Pay */}
            <div 
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white flex items-center justify-center shadow-xs border border-white/20 shrink-0 hover:scale-110 transition-transform cursor-pointer" 
              title="Google Pay"
            >
              <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            </div>

            {/* PhonePe */}
            <div 
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#5f259f] flex items-center justify-center shadow-xs border border-white/20 shrink-0 hover:scale-110 transition-transform cursor-pointer" 
              title="PhonePe"
            >
              <span className="text-white font-black text-sm sm:text-base leading-none select-none font-sans">
                पे
              </span>
            </div>

            {/* Paytm */}
            <div 
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white flex items-center justify-center shadow-xs border border-white/20 shrink-0 hover:scale-110 transition-transform cursor-pointer px-1" 
              title="Paytm"
            >
              <span className="text-[9.5px] sm:text-[10.5px] font-black tracking-tighter flex items-baseline">
                <span className="text-[#002E6E]">pay</span>
                <span className="text-[#00BAF2]">tm</span>
              </span>
            </div>

            {/* BHIM UPI */}
            <div 
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white flex items-center justify-center shadow-xs border border-white/20 shrink-0 hover:scale-110 transition-transform cursor-pointer" 
              title="BHIM UPI"
            >
              <div className="flex flex-col items-center justify-center -space-y-0.5">
                <span className="text-[8.5px] sm:text-[9.5px] font-black tracking-wider text-[#002E6E] leading-none">UPI</span>
                <div className="flex gap-0.5 mt-0.5">
                  <span className="w-1.5 h-1 bg-[#F47920] skew-x-12 rounded-2xs block" />
                  <span className="w-1.5 h-1 bg-[#0FA348] -skew-x-12 rounded-2xs block" />
                </div>
              </div>
            </div>

            {/* RuPay */}
            <div 
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white flex items-center justify-center shadow-xs border border-white/20 shrink-0 hover:scale-110 transition-transform cursor-pointer" 
              title="RuPay"
            >
              <span className="text-[9px] sm:text-[10px] font-black tracking-tighter flex items-center">
                <span className="text-[#0C2340]">Ru</span>
                <span className="text-[#E31837]">Pay</span>
              </span>
            </div>

            {/* VISA */}
            <div 
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white flex items-center justify-center shadow-xs border border-white/20 shrink-0 hover:scale-110 transition-transform cursor-pointer" 
              title="Visa"
            >
              <span className="text-[10px] sm:text-[11px] font-black italic tracking-tighter text-[#1A1F71]">VISA</span>
            </div>

            {/* Mastercard */}
            <div 
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white flex items-center justify-center shadow-xs border border-white/20 shrink-0 hover:scale-110 transition-transform cursor-pointer" 
              title="Mastercard"
            >
              <div className="flex -space-x-1.5 items-center">
                <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#EB001B]" />
                <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#F79E1B] opacity-90" />
              </div>
            </div>

            {/* Net Banking */}
            <div 
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white flex items-center justify-center shadow-xs border border-white/20 shrink-0 hover:scale-110 transition-transform cursor-pointer text-emerald-800" 
              title="Net Banking"
            >
              <Building2 className="w-4 h-4 text-emerald-800" />
            </div>

            {/* Cash on Delivery (COD) */}
            <div 
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-xs border border-white/20 shrink-0 hover:scale-110 transition-transform cursor-pointer font-black text-[9px] sm:text-[10px] tracking-tight" 
              title="Cash on Delivery Available"
            >
              COD
            </div>

            {/* 100% Secure via Razorpay */}
            <div 
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-xs border border-white/20 shrink-0 hover:scale-110 transition-transform cursor-pointer" 
              title="100% Secure SSL Payment"
            >
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* Bottom bar with copyright and policies */}
        <div className="pt-4 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] sm:text-xs text-cream-200/70 border-t border-white/5">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-4 text-center md:text-left">
            <span>© {new Date().getFullYear()} Singodia Foods. All Rights Reserved.</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1">
              Handcrafted with <Heart className="w-3 h-3 text-chilli fill-current" /> in Rajasthan
            </span>
          </div>

          {/* Quick Policies Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[11px] text-cream-200/80">
            <Link to="/about" className="hover:text-mustard transition-colors">About Us</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-mustard transition-colors">Terms</Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-mustard transition-colors">Privacy</Link>
            <span>•</span>
            <Link to="/shipping-policy" className="hover:text-mustard transition-colors">Shipping</Link>
            <span>•</span>
            <Link to="/refund-policy" className="hover:text-mustard transition-colors">Refund & Return</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

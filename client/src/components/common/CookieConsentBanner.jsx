import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, X } from 'lucide-react';
import { getCookie, setCookie } from '../../utils/cookieUtils';

export const CookieConsentBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user already consented
    const consentCookie = getCookie('singodia_cookie_consent');
    const consentStorage = localStorage.getItem('singodia_cookie_consent');
    
    if (!consentCookie && !consentStorage) {
      // Delay showing by 1.5 seconds so page loads smoothly first
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    setCookie('singodia_cookie_consent', 'accepted', 365);
    localStorage.setItem('singodia_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleNecessaryOnly = () => {
    setCookie('singodia_cookie_consent', 'necessary', 180);
    localStorage.setItem('singodia_cookie_consent', 'necessary');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside 
      aria-label="Cookie Consent"
      className="fixed bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-auto sm:max-w-md z-50 animate-cart-slide-up"
    >
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-cream-300 shadow-2xl space-y-3 ring-1 ring-black/5 text-charcoal">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl" role="img" aria-label="Cookie">🍪</span>
            <h4 className="text-xs sm:text-sm font-bold text-charcoal font-serif">
              कुकीज़ एवं डेटा गोपनीयता (Cookie Consent)
            </h4>
          </div>
          <button
            onClick={handleNecessaryOnly}
            className="text-gray-400 hover:text-charcoal p-1 rounded-lg transition-colors cursor-pointer"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[11px] sm:text-xs text-earth-brown leading-relaxed">
          हम आपके शॉपिंग कार्ट को याद रखने, सुरक्षित लॉगिन बनाए रखने और तेज़ डिलीवरी अनुमान के लिए आवश्यक कुकीज़ का उपयोग करते हैं।
        </p>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleAcceptAll}
            className="flex-1 py-2 px-3.5 bg-brand-green hover:bg-brand-green-light text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer text-center"
          >
            सभी स्वीकार करें (Accept)
          </button>
          <button
            onClick={handleNecessaryOnly}
            className="py-2 px-3 bg-cream-100 hover:bg-cream-200 text-charcoal text-[11px] font-semibold rounded-xl transition-all cursor-pointer text-center border border-cream-200"
          >
            केवल आवश्यक
          </button>
        </div>

        <div className="pt-1 flex items-center justify-between text-[10px] text-gray-400 border-t border-cream-100">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-brand-green" /> 100% सुरक्षित एवं निजी
          </span>
          <Link to="/privacy-policy" className="text-brand-green font-semibold hover:underline">
            गोपनीयता नीति (Privacy Policy)
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default CookieConsentBanner;

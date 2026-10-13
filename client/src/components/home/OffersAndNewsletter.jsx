import React, { useState } from 'react';
import { Mail, Check, Gift, Sparkles, Send } from 'lucide-react';

export const OffersAndNewsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setIsSubscribed(true);
    setTimeout(() => {
      setEmail('');
    }, 3000);
  };

  return (
    <section className="py-14 sm:py-20 bg-gradient-to-r from-[#143025] to-[#1E4334] text-white relative overflow-hidden">
      
      {/* Decorative background glow */}
      <div className="absolute right-0 top-0 w-80 h-80 bg-mustard/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-12 backdrop-blur-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mustard text-brand-green-dark text-xs font-extrabold uppercase tracking-wider">
              <Gift className="w-3.5 h-3.5" />
              <span>Special Welcome Offer</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold font-serif leading-tight">
              Get 10% OFF on Your First Order!
            </h2>

            <p className="text-xs sm:text-sm text-cream-200/90 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Subscribe to the Singodhia Family Newsletter for secret seasonal recipes, festival harvest hampers, and exclusive coupon codes.
            </p>

            {/* Promo Code Box */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <span className="text-xs text-cream-200">Use Coupon Code:</span>
              <span className="bg-mustard text-brand-green-dark px-3 py-1 rounded-lg text-xs font-black tracking-widest uppercase border border-mustard-light select-all">
                DESI10
              </span>
              <span className="text-[11px] text-cream-200/70">
                (Valid on all orders above ₹399)
              </span>
            </div>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-5">
            {isSubscribed ? (
              <div className="bg-emerald-800/60 border border-emerald-500/50 rounded-2xl p-6 text-center space-y-2 animate-in fade-in duration-300">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white font-serif">You are Subscribed!</h4>
                <p className="text-xs text-cream-200">
                  Welcome to the Singodhia family! Your 10% off code <strong>DESI10</strong> is ready to use at checkout.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-white text-charcoal placeholder-gray-400 text-xs sm:text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-mustard font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-mustard hover:bg-mustard-dark text-brand-green-dark font-extrabold text-xs sm:text-sm py-3.5 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Claim My 10% Discount</span>
                  <Send className="w-4 h-4" />
                </button>
                <p className="text-[10px] text-center text-cream-200/60">
                  🔒 We respect your privacy. No spam ever, only delicious updates!
                </p>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default OffersAndNewsletter;


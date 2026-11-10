import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, Heart, Sparkles, ShieldCheck, Award, ArrowRight, CheckCircle2, Users, Flame, Truck } from 'lucide-react';
import { TrustBadges } from '../components/common/TrustBadges';

export const AboutPage = () => {
  return (
    <div className="py-12 sm:py-20 bg-[#FAF6EF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Story Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-mustard-dark uppercase tracking-widest block mb-2">
            The Singodia Heritage • सुजानगढ़ (राजस्थान) का पारंपरिक स्वाद
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1E4334] font-serif leading-tight">
            Reviving the Lost Art of Desi Homemade Pickling
          </h1>
          <p className="text-sm sm:text-base text-earth-brown mt-4 leading-relaxed">
            Born in the historic royal town of <strong>Sujangarh, Churu (Rajasthan)</strong>, Singodia Foods was founded on an unshakeable family principle: 
            <strong> असली आचार समय, धूप और दादी मां की पारंपरिक विधि मांगता है — मशीनों के केमिकल्स और सिरका नहीं।</strong>
          </p>
        </div>

        {/* Narrative & Visual Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
          <div className="lg:col-span-6 rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-cream-100 aspect-[4/3] relative">
            <img
              src="https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80"
              alt="Rajasthani traditional heritage cooking and spices"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-6">
              <span className="text-white text-xs font-bold bg-brand-green/90 px-3 py-1.5 rounded-full backdrop-blur-xs">
                Handcrafted in Sujangarh, Rajasthan (331507)
              </span>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4 text-xs sm:text-sm text-earth-brown leading-relaxed">
            <span className="text-xs font-bold text-mustard-dark uppercase tracking-wider block">हमारी कहानी (Our Story)</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-charcoal font-serif">
              Grandmother’s Sunlit Terrace in Sujangarh
            </h2>
            <p>
              Decades ago, every summer in Sujangarh began with the seasonal arrival of fresh raw Ramkela mangoes, thick Banarasi red chillies, and sun-dried Kair Sangri from the Thar desert.
            </p>
            <p>
              Our grandmother (दादी मां) would lead the women of the family in hand-chopping, salting, and stone-roasting whole spices. Ceramic martabans (चीनी मिट्टी की बरनियां) wrapped with red cotton cloths were lined up across the white terrace under the intense desert sunshine for weeks.
            </p>
            <p>
              That slow, natural sun-curing infused each spice grain deep into the mangoes and chillies, creating an irresistible aroma that filled our entire neighborhood.
            </p>
            <p>
              When commercial factory brands began flooding markets with synthetic acetic acid (artificial vinegar) and chemical preservatives to rush production in 24 hours, the authentic soul of Indian achar was lost. We created <strong>Singodia Foods</strong> to keep that priceless heirloom heritage alive.
            </p>
          </div>
        </div>

        {/* 4 Pillars of Singodia Foods */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-cream-200 shadow-card mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-mustard-dark uppercase tracking-widest block mb-1">
              शुद्धता के 4 नियम (The 4 Sacred Pillars)
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-charcoal font-serif">
              Why Singodia Pickles Taste Just Like Home
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-[#FAF6EF] border border-cream-200/80 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                <Sun className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-charcoal font-serif text-base">100% Sun-Cured</h4>
              <p className="text-xs text-earth-brown leading-relaxed">
                Aged naturally under real desert sunlight in glazed ceramic martabans for weeks to unlock heirloom taste.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF6EF] border border-cream-200/80 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-brand-green text-white flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-charcoal font-serif text-base">Pure Stone-Ground Spices</h4>
              <p className="text-xs text-earth-brown leading-relaxed">
                Hand-picked fennel, methi, kalonji, mustard, and pure cold-pressed mustard oil with rich pungent aroma.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF6EF] border border-cream-200/80 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-charcoal font-serif text-base">Zero Chemicals</h4>
              <p className="text-xs text-earth-brown leading-relaxed">
                Strictly NO synthetic acetic acid (vinegar), NO artificial colours, and NO chemical preservatives.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF6EF] border border-cream-200/80 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-700 text-white flex items-center justify-center font-bold">
                <Heart className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-charcoal font-serif text-base">Women Artisans</h4>
              <p className="text-xs text-earth-brown leading-relaxed">
                Handcrafted with maternal care by local women artisans in Sujangarh, fostering rural empowerment.
              </p>
            </div>
          </div>
        </div>

        {/* Heritage Trust Badges */}
        <div className="mb-16">
          <TrustBadges />
        </div>

        {/* Explore Store Call to Action */}
        <div className="bg-gradient-to-r from-[#143025] to-[#1E4334] rounded-3xl p-8 sm:p-12 text-center text-white space-y-4 shadow-xl">
          <span className="text-xs uppercase tracking-widest text-mustard font-bold block">
            स्वाद जो बचपन की याद दिला दे
          </span>
          <h3 className="text-2xl sm:text-4xl font-extrabold font-serif">
            Bring the Taste of Royal Rajasthan to Your Home
          </h3>
          <p className="text-xs sm:text-sm text-cream-200/90 max-w-xl mx-auto leading-relaxed">
            Order your fresh jar of handmade pickle today, delivered pan-India with safe, leak-proof packaging.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/shop"
              className="px-6 py-3 bg-mustard hover:bg-mustard-light text-brand-green-dark text-xs sm:text-sm font-black rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <span>Explore All Pickles (सभी आचार देखें)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors"
            >
              <span>Contact Us</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;

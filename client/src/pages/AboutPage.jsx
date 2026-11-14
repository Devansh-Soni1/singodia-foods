import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sun, 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  MapPin 
} from 'lucide-react';
import { TrustBadges } from '../components/common/TrustBadges';
import { useSEO } from '../hooks/useSEO';

export const AboutPage = () => {
  useSEO({
    title: 'हमारी कहानी (Our Story) — Traditional Homemade Rajasthani Pickles | Singodia Foods',
    description: 'Born in Sujangarh, Rajasthan, Singodia Foods is dedicated to the traditional heritage of sun-cured, artisanal homemade pickles made without preservatives or synthetic chemicals.',
    url: '/about'
  });

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
          {/* Left: Handcrafted Heritage Image */}
          <div className="lg:col-span-6 rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-cream-100 aspect-square relative group">
            <img
              src="/about-heritage.jpg"
              alt="Singodia Foods — Handcrafted in Sujangarh, Rajasthan (331507)"
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-5 sm:p-6 pointer-events-none">
              <span className="text-white text-xs sm:text-sm font-bold bg-brand-green/95 px-4 py-2 rounded-full shadow-lg backdrop-blur-xs flex items-center gap-2 border border-white/20">
                <MapPin className="w-4 h-4 text-mustard shrink-0" />
                <span>Handcrafted in Sujangarh, Rajasthan (331507)</span>
              </span>
            </div>
          </div>

          {/* Right: Narrative */}
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

        {/* Developer Section (Clean, Compact Card with Horizontal App Icons) */}
        <div className="max-w-xl mx-auto bg-white/95 rounded-3xl p-6 sm:p-8 border border-cream-200/90 shadow-card mb-16 text-left">
          <div className="space-y-3">
            <div>
              <span className="inline-block bg-[#FBEFE3] text-[#7A4B29] text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-full mb-2.5">
                DEVELOPER
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#2A231D] tracking-tight">
                Devansh Soni
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-[#665749] mt-0.5">
                Full Stack Developer
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#736353] leading-relaxed">
              Designed and developed this project with a responsive React-based frontend and a clean storefront structure for Singodia Foods.
            </p>

            <div className="pt-3 border-t border-[#F0E6D8]/80">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8C7A6B] block mb-1">
                EMAIL
              </span>
              <a
                href="mailto:sonidevansh899@gmail.com"
                className="text-sm sm:text-base font-serif font-bold text-[#2A231D] hover:text-brand-green transition-colors"
              >
                sonidevansh899@gmail.com
              </a>
            </div>

            {/* Horizontally Aligned Application Icons (All Exactly Same Size) */}
            <div className="flex items-center gap-3 pt-3">
              {/* Portfolio */}
              <a
                href="https://devansh-soni-portfolio.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                title="Portfolio"
                className="w-11 h-11 rounded-2xl bg-[#FBEFE3] hover:bg-[#7A4B29] text-[#7A4B29] hover:text-white flex items-center justify-center transition-all duration-300 shadow-2xs hover:scale-105 shrink-0"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 4H5a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3Zm1 13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-5h16v5Zm0-7H4V7a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v3Z" />
                  <rect x="6" y="14" width="4" height="2" rx="0.5" />
                  <rect x="12" y="14" width="6" height="2" rx="0.5" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/devansh-soni1/"
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
                className="w-11 h-11 rounded-2xl bg-[#FBEFE3] hover:bg-[#0077B5] text-[#7A4B29] hover:text-white flex items-center justify-center transition-all duration-300 shadow-2xs hover:scale-105 shrink-0"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                </svg>
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/Devansh-Soni1"
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub"
                className="w-11 h-11 rounded-2xl bg-[#FBEFE3] hover:bg-[#24292F] text-[#7A4B29] hover:text-white flex items-center justify-center transition-all duration-300 shadow-2xs hover:scale-105 shrink-0"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/__devansh_soni__/"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                className="w-11 h-11 rounded-2xl bg-[#FBEFE3] hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] text-[#7A4B29] hover:text-white flex items-center justify-center transition-all duration-300 shadow-2xs hover:scale-105 shrink-0"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>
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
              to="/allpickles"
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

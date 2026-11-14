import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sun, 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  MapPin, 
  Code2, 
  Mail, 
  ExternalLink, 
  Laptop 
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

        {/* Developer & Creator Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-cream-200 shadow-card mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-green/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left: Avatar & Profile Info */}
            <div className="md:col-span-4 flex flex-col items-center text-center p-4 bg-[#FAF6EF] rounded-2xl border border-cream-200/80">
              <div className="relative mb-3">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-brand-green via-[#1E4334] to-[#122A1F] text-white flex items-center justify-center shadow-lg border-4 border-white">
                  <Code2 className="w-12 h-12 text-mustard" />
                </div>
                <span className="absolute -bottom-2 -right-1 bg-brand-green text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow border-2 border-white flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-mustard" /> Developer
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-charcoal font-serif">Devansh Soni</h3>
              <p className="text-xs font-bold text-brand-green mt-0.5">Full Stack Developer & Designer</p>
              <p className="text-xs text-earth-brown mt-1.5 flex items-center gap-1 justify-center">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>Sujangarh, Rajasthan (331507)</span>
              </p>
            </div>

            {/* Right: Story, Tech Stack & Action Links */}
            <div className="md:col-span-8 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-mustard-dark bg-amber-50 px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1.5">
                  <Laptop className="w-3.5 h-3.5 text-brand-green" />
                  <span>डिजिटल निर्माता एवं डेवलपर (Behind the Digital Platform)</span>
                </span>
              </div>
              
              <h4 className="text-xl sm:text-2xl font-bold text-charcoal font-serif">
                Crafted with Modern Tech & Marwadi Passion
              </h4>

              <p className="text-xs sm:text-sm text-earth-brown leading-relaxed">
                Singodia Foods का यह संपूर्ण डिजिटल प्लेटफॉर्म <strong>Devansh Soni</strong> द्वारा अत्याधुनिक वेब टेक्नोलॉजीज (React, Vite, Node.js, Express, MongoDB, Tailwind CSS, Cloudinary और Razorpay) के साथ तैयार किया गया है। इसका उद्देश्य सुजानगढ़ की पारंपरिक मारवाड़ी अचार धरोहर और दादी मां के हाथों के प्रामाणिक स्वाद को भारत के हर कोने तक सुपरफास्ट, सुरक्षित और आधुनिक ई-कॉमर्स अनुभव के साथ पहुंचाना है।
              </p>

              {/* Tech Stack Badges */}
              <div className="flex flex-wrap gap-2 pt-1">
                {['React 18', 'Vite', 'Node.js', 'Express', 'Tailwind CSS', 'MongoDB', 'Razorpay', 'iThink Logistics', 'Cloudinary'].map((tech) => (
                  <span
                    key={tech}
                    className="text-[11px] font-bold bg-[#FAF6EF] text-charcoal px-3 py-1 rounded-lg border border-cream-200 shadow-2xs"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Developer Links */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href="https://github.com/Devansh-Soni1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#1E4334] hover:bg-brand-green text-white text-xs font-bold rounded-xl transition-all shadow-xs"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>GitHub Profile</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>

                <a
                  href="mailto:premsingodiya861@gmail.com"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-cream-100 hover:bg-cream-200 text-charcoal text-xs font-bold rounded-xl transition-all border border-cream-300"
                >
                  <Mail className="w-3.5 h-3.5 text-brand-green" />
                  <span>Contact Developer</span>
                </a>
              </div>
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

import React, { useState } from 'react';
import { Star, CheckCircle, ExternalLink, MessageSquarePlus, ThumbsUp } from 'lucide-react';

const GOOGLE_REVIEW_URL = 'https://share.google/6uEBWLjWGXSZhmBRI';

const GOOGLE_REVIEWS = [
  {
    id: 'gr1',
    name: 'Meenakshi Sharma',
    avatar: 'M',
    avatarBg: 'bg-emerald-600',
    location: 'Jaipur, Rajasthan',
    rating: 5,
    date: '3 days ago',
    tag: 'Local Guide • 14 reviews',
    title: 'Dadi ke haath jaisa authentic swad!',
    comment: 'Bhai sach me dadi ke haath jaisa swad hai! The Banarasi Bharwa Lal Mirch achar reminded me exactly of homemade winter pickles in Jaipur. Masala is perfectly roasted and not overly salty. Finished the first jar in 2 weeks!',
    product: 'Banarasi Lal Mirch',
    helpfulCount: 18
  },
  {
    id: 'gr2',
    name: 'Rohit Agrawal',
    avatar: 'R',
    avatarBg: 'bg-blue-600',
    location: 'Gurugram, Haryana',
    rating: 5,
    date: '1 week ago',
    tag: 'Verified Google Review',
    title: 'Authentic Kair Sangri is unbelievable',
    comment: 'Real Kair Sangri pickle is so hard to find outside Rajasthan! Singodia Foods has completely nailed the authentic royal Marwadi taste. Fresh mustard oil aroma and perfect crunchy texture. Repurchasing 1kg now!',
    product: 'Kair Sangri Shahi',
    helpfulCount: 12
  },
  {
    id: 'gr3',
    name: 'Pooja Iyer',
    avatar: 'P',
    avatarBg: 'bg-purple-600',
    location: 'Bengaluru, Karnataka',
    rating: 5,
    date: '2 weeks ago',
    tag: 'Verified Google Review',
    title: 'Oil-Free Sun-Aged Lemon Pickle is divine',
    comment: 'My parents cannot consume heavy oil pickles due to diet restrictions, and this sun-aged oil-free lemon pickle was a revelation for them. Soft peel, natural jaggery, rock salt and zero chemical preservatives!',
    product: 'Khatta Meetha Nimbu',
    helpfulCount: 9
  },
  {
    id: 'gr4',
    name: 'Vikas Verma',
    avatar: 'V',
    avatarBg: 'bg-amber-600',
    location: 'New Delhi',
    rating: 5,
    date: '2 weeks ago',
    tag: 'Local Guide • 38 reviews',
    title: 'Best trial pack with triple safe packing',
    comment: 'Ordered the 8-Pack Trial Box after hearing about Aunty Ji\'s pickles in Sujangarh. Triple-bubble wrapped, arrived with zero leakage in 3 days. Hathras Hing Aam and Teekhi Mirch are completely out of the world!',
    product: '8-Jar Trial Box',
    helpfulCount: 15
  },
  {
    id: 'gr5',
    name: 'Ankit Singhania',
    avatar: 'A',
    avatarBg: 'bg-rose-600',
    location: 'Kolkata, West Bengal',
    rating: 5,
    date: '3 weeks ago',
    tag: 'Verified Google Review',
    title: 'Pure Kachi Ghani oil & zero chemicals',
    comment: 'Original Rajasthani homemade swad after years in Kolkata! No synthetic vinegar or preservatives. You can smell the pure cold-pressed Kachi Ghani mustard oil as soon as you pop the lid. 100% recommended!',
    product: 'Traditional Mango Pickle',
    helpfulCount: 7
  },
  {
    id: 'gr6',
    name: 'Sunita Choudhary',
    avatar: 'S',
    avatarBg: 'bg-teal-600',
    location: 'Sujangarh, Rajasthan',
    rating: 5,
    date: '1 month ago',
    tag: 'Local Patron • Sujangarh',
    title: 'Achar Wali Aunty Ji ke hath ka jadu',
    comment: 'Hum local Sujangarh se hain aur Singodia Foods ke achar saalon se hamare ghar par bante aur aate hain. Achar wali aunty ji ke hath ka jadu hai. Best quality, hygienic and fresh!',
    product: 'All Pickles Combo',
    helpfulCount: 24
  }
];

export const CustomerReviewsSection = () => {
  const [activeFilter, setActiveFilter] = useState('ALL');

  const filters = ['ALL', 'Mango Pickle', 'Banarasi Lal Mirch', 'Kair Sangri', '8-Jar Trial Box'];

  const filteredReviews = activeFilter === 'ALL'
    ? GOOGLE_REVIEWS
    : GOOGLE_REVIEWS.filter(r => r.product.toLowerCase().includes(activeFilter.toLowerCase()) || activeFilter.toLowerCase().includes(r.product.toLowerCase()));

  return (
    <section className="py-12 sm:py-16 bg-[#FDFBF7] border-y border-[#F0E2C4]/80 relative overflow-hidden">
      
      {/* Decorative background blurs */}
      <div className="absolute top-0 right-10 w-72 h-72 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Top Google Rating Overview Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#E8DCC4] shadow-sm mb-10 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Left: Google Logo & Rating */}
            <div className="flex items-center gap-4 text-center md:text-left">
              {/* Google 4-Color Official G Icon */}
              <div className="w-14 h-14 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-center justify-center shrink-0">
                <svg className="w-8 h-8" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                </svg>
              </div>

              <div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-gray-900 leading-none">4.9</span>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-[#FBBC05] text-[#FBBC05]" />
                    ))}
                  </div>
                </div>
                <div className="text-xs text-gray-600 font-medium mt-1">
                  <span className="font-bold text-gray-900">Singodia Foods Pickles</span> • 5.0 Star Rating on Google
                </div>
              </div>
            </div>

            {/* Middle Divider */}
            <div className="hidden md:block h-12 w-px bg-gray-200" />

            {/* Right: Write Review & View Link Buttons */}
            <div className="flex items-center gap-3 shrink-0 flex-wrap justify-center">
              <a
                href={GOOGLE_REVIEW_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1A73E8] hover:bg-[#1557B0] text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>Write a Review on Google</span>
              </a>

              <a
                href={GOOGLE_REVIEW_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-300 text-xs sm:text-sm font-bold px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Google Reviews</span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
              </a>
            </div>

          </div>
        </div>

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-widest block mb-1">
            Real Customer Feedback
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1F4D36] font-serif">
            Loved By Families On Google
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">
            Read what verified customers have to say about our traditional homemade Rajasthani pickles.
          </p>

          {/* Quick Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setActiveFilter(f)}
                className={`text-xs font-bold px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                  activeFilter === f
                    ? 'bg-[#1F4D36] text-white shadow-xs'
                    : 'bg-white border border-[#E8DCC4] text-gray-700 hover:bg-amber-50'
                }`}
              >
                {f === 'ALL' ? '⭐ All Google Reviews' : f}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EADBCE] shadow-[0px_4px_12px_rgba(0,0,0,0.04)] hover:shadow-[0px_8px_20px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col justify-between relative group hover:-translate-y-1"
            >
              <div>
                {/* Header: Avatar, Name & Google Badge */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${rev.avatarBg} text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs`}>
                      {rev.avatar}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 leading-tight">
                        {rev.name}
                      </h4>
                      <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                        {rev.location}
                      </p>
                    </div>
                  </div>

                  {/* Tiny Google G Icon */}
                  <div className="w-5 h-5 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-2xs" title="Google Verified Review">
                    <svg className="w-3 h-3" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z" />
                      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                    </svg>
                  </div>
                </div>

                {/* Rating & Date */}
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < rev.rating ? 'fill-[#FBBC05] text-[#FBBC05]' : 'text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-gray-400 font-medium">
                    • {rev.date}
                  </span>
                </div>

                {/* Title */}
                <h5 className="text-xs sm:text-sm font-bold text-gray-900 mb-1.5 line-clamp-1">
                  "{rev.title}"
                </h5>

                {/* Comment Text */}
                <p className="text-xs text-gray-700 leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              {/* Bottom Tag & Product Mention */}
              <div className="pt-3 mt-4 border-t border-gray-100 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  {rev.tag}
                </span>

                <span className="text-gray-500 font-medium">
                  {rev.product}
                </span>
              </div>

            </div>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div className="text-center pt-4">
          <a
            href={GOOGLE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-bold text-sm text-[#1A73E8] hover:text-[#1557B0] hover:underline cursor-pointer group"
          >
            <span>Have you tasted our pickles? Share your review on Google</span>
            <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

      </div>
    </section>
  );
};

export default CustomerReviewsSection;

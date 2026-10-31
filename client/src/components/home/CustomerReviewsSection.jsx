import React, { useState, useEffect, useRef } from 'react';
import { 
  Star, 
  CheckCircle, 
  ExternalLink, 
  MessageSquarePlus, 
  ChevronLeft, 
  ChevronRight, 
  Quote, 
  Sparkles,
  Play,
  Pause,
  Volume2,
  VolumeX
} from 'lucide-react';

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
  // Left column review slider state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [slideDirection, setSlideDirection] = useState('next');
  const [animating, setAnimating] = useState(false);

  // Right column video player state
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  const totalReviews = GOOGLE_REVIEWS.length;

  const goToNext = () => {
    if (animating) return;
    setAnimating(true);
    setSlideDirection('next');
    setCurrentIndex((prev) => (prev + 1) % totalReviews);
    setTimeout(() => setAnimating(false), 400);
  };

  const goToPrev = () => {
    if (animating) return;
    setAnimating(true);
    setSlideDirection('prev');
    setCurrentIndex((prev) => (prev - 1 + totalReviews) % totalReviews);
    setTimeout(() => setAnimating(false), 400);
  };

  const selectIndex = (idx) => {
    if (animating || idx === currentIndex) return;
    setAnimating(true);
    setSlideDirection(idx > currentIndex ? 'next' : 'prev');
    setCurrentIndex(idx);
    setTimeout(() => setAnimating(false), 400);
  };

  // Auto-play sliding every 5 seconds for reviews
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      goToNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, currentIndex, animating]);

  // Video playback controls
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsVideoPlaying(true);
    } else {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
  };

  const toggleSound = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const currentRev = GOOGLE_REVIEWS[currentIndex];

  return (
    <section className="py-12 sm:py-16 bg-[#FDFBF7] border-y border-[#F0E2C4]/80 relative overflow-hidden">
      
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-[11px] font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            <span>Customer Love & Kitchen Videos</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1F4D36] font-serif">
            Loved on Google • Fresh from Our Kitchen
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-2 max-w-xl mx-auto">
            Read verified 5-star customer reviews on the left, and watch authentic Singodia Foods homemade pickle making on the right.
          </p>
        </div>

        {/* 2-COLUMN SPLIT: Left = Single Sliding Google Review | Right = Real Video Player */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* ========================================================= */}
          {/* LEFT COLUMN: Google Ratings & Single Sliding Review Card */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Google Rating Overview Banner */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8DCC4] shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* Official Google 4-Color 'G' Logo */}
                <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 shadow-2xs flex items-center justify-center shrink-0">
                  <svg className="w-7 h-7" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z" />
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl sm:text-2xl font-black text-gray-900 leading-none">4.9</span>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#FBBC05] text-[#FBBC05]" />
                      ))}
                    </div>
                  </div>
                  <div className="text-[11px] text-gray-600 font-medium mt-0.5">
                    <span className="font-bold text-gray-900">Singodia Foods Pickles</span> • 5.0 Star Rating on Google
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={GOOGLE_REVIEW_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#1A73E8] hover:bg-[#1557B0] text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <MessageSquarePlus className="w-3.5 h-3.5" />
                  <span>Write Review</span>
                </a>
                <a
                  href={GOOGLE_REVIEW_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-300 text-xs font-bold px-2.5 py-2 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                  title="View Google Reviews"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* SINGLE SLIDING REVIEW CONTAINER */}
            <div 
              className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#EADBCE] shadow-[0px_8px_24px_rgba(0,0,0,0.06)] relative overflow-hidden min-h-[300px] flex flex-col justify-between"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Subtle Giant Quote Mark Watermark */}
              <Quote className="w-20 h-20 text-amber-500/10 absolute -top-2 right-4 pointer-events-none" />

              {/* Animated Slide Content */}
              <div 
                key={currentRev.id} 
                className={`transition-all duration-300 ease-out ${
                  animating 
                    ? slideDirection === 'next' 
                      ? 'opacity-0 translate-x-8' 
                      : 'opacity-0 -translate-x-8' 
                    : 'opacity-100 translate-x-0'
                }`}
              >
                
                {/* Header: Reviewer Avatar, Name, Location & Google Badge */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full ${currentRev.avatarBg} text-white font-black text-lg flex items-center justify-center shrink-0 shadow-md`}>
                      {currentRev.avatar}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-gray-900 leading-tight">
                        {currentRev.name}
                      </h4>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">
                        {currentRev.location}
                      </p>
                    </div>
                  </div>

                  {/* Google Verified Review Badge */}
                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 shadow-2xs">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{currentRev.tag}</span>
                  </span>
                </div>

                {/* Star Rating & Relative Time */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < currentRev.rating ? 'fill-[#FBBC05] text-[#FBBC05]' : 'text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-gray-400">
                    • Reviewed on Google • {currentRev.date}
                  </span>
                </div>

                {/* Review Title */}
                <h5 className="text-base sm:text-lg font-bold text-gray-900 font-serif mb-2">
                  "{currentRev.title}"
                </h5>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic">
                  "{currentRev.comment}"
                </p>

                {/* Product Tag */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60">
                    Favorite: <strong>{currentRev.product}</strong>
                  </span>
                  <span className="text-gray-400 font-medium">
                    Verified Customer Purchase
                  </span>
                </div>

              </div>

              {/* Slider Bottom Controls: Prev/Next Arrow Buttons & Progress Dots */}
              <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between">
                
                {/* Dots indicator */}
                <div className="flex items-center gap-2">
                  {GOOGLE_REVIEWS.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => selectIndex(idx)}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        currentIndex === idx 
                          ? 'w-7 bg-[#1F4D36]' 
                          : 'w-2 bg-gray-200 hover:bg-gray-300'
                      }`}
                      title={`Go to review ${idx + 1}`}
                    />
                  ))}
                  <span className="text-[11px] font-bold text-gray-400 ml-1">
                    {currentIndex + 1}/{totalReviews}
                  </span>
                </div>

                {/* Prev & Next Arrows */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={goToPrev}
                    className="w-9 h-9 rounded-full bg-cream-100 hover:bg-[#1F4D36] hover:text-white text-gray-700 flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-xs"
                    title="Previous Review"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={goToNext}
                    className="w-9 h-9 rounded-full bg-cream-100 hover:bg-[#1F4D36] hover:text-white text-gray-700 flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-xs"
                    title="Next Review"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

              </div>

            </div>

            {/* Bottom link to view all reviews on Google */}
            <div className="text-center sm:text-left pl-2">
              <a
                href={GOOGLE_REVIEW_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1A73E8] hover:text-[#1557B0] hover:underline"
              >
                <span>Read all verified reviews on Google Maps profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: Real Playing Video Showcase                  */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 flex flex-col items-center w-full">
            <div className="w-full max-w-sm">

              {/* Video Header Branding Pill */}
              <div className="bg-white rounded-2xl p-3 sm:p-3.5 border border-[#E8DCC4] shadow-xs mb-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-0.5 rounded-full bg-amber-500/20 border border-amber-400/50">
                    <img 
                      src="/logo.png" 
                      alt="Singodia Foods" 
                      className="w-9 h-9 rounded-full object-cover" 
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs sm:text-sm font-black text-gray-900 leading-tight">
                        Singodia Foods
                      </span>
                      <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[8px] font-bold">
                        ✓
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-500 block leading-tight">
                      100% Traditional Homemade Achar • Sujangarh
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>Desi Swad</span>
                </div>
              </div>

              {/* Video Player Frame with User's Playing Video */}
              <div 
                className="relative rounded-[28px] border-4 border-[#1F4D36]/20 bg-neutral-950 shadow-2xl overflow-hidden aspect-[9/16] max-h-[500px] w-full mx-auto group cursor-pointer"
                onClick={togglePlay}
              >
                {/* HTML5 Playing Video */}
                <video
                  ref={videoRef}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  src="/videos/singodia-video.mp4"
                  className="w-full h-full object-cover rounded-[22px] bg-neutral-950"
                />

                {/* Top Overlay: Live Status & Mute/Unmute Toggle */}
                <div className="absolute top-4 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
                  {/* Pulsing Live badge */}
                  <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 text-white text-[10px] font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>SINGODIA FOODS</span>
                  </div>

                  {/* Sound Toggle Button */}
                  <button
                    type="button"
                    onClick={toggleSound}
                    className="pointer-events-auto bg-black/60 hover:bg-black/80 backdrop-blur-md text-white p-2 rounded-full border border-white/20 transition-all cursor-pointer active:scale-90"
                    title={isMuted ? "Click to unmute sound" : "Mute sound"}
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4 text-white/90" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-emerald-400" />
                    )}
                  </button>
                </div>

                {/* Center Play/Pause Indicator (Shown when paused) */}
                {!isVideoPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20 pointer-events-none">
                    <div className="w-14 h-14 rounded-full bg-white/90 text-black flex items-center justify-center shadow-xl">
                      <Play className="w-6 h-6 fill-black ml-1" />
                    </div>
                  </div>
                )}

                {/* Bottom Overlay: Video Details */}
                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/95 via-black/60 to-transparent z-20 text-white flex flex-col justify-end">
                  
                  {/* Brand Tag */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <img 
                      src="/logo.png" 
                      alt="Singodia Foods" 
                      className="w-6 h-6 rounded-full border border-white/40 object-cover" 
                    />
                    <span className="text-xs font-black text-white">Singodia Foods Pickles</span>
                    <span className="text-[10px] bg-[#1F4D36] text-white font-bold px-1.5 py-0.5 rounded">
                      Authentic
                    </span>
                  </div>

                  {/* Video Hindi Title */}
                  <h4 className="text-sm font-bold text-white leading-snug line-clamp-1 mb-1 font-serif">
                    दादी-नानी के हाथों का असली राजस्थानी अचार
                  </h4>
                  <p className="text-[11px] text-gray-200 line-clamp-2 leading-relaxed mb-3">
                    कच्ची घानी सरसों का तेल, सुजानगढ़ की शुद्ध हिंग और धूप में पके पारंपरिक मसाले।
                  </p>

                  {/* Equalizer Wave + Sound Indicator & Play/Pause */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/15">
                    <div className="flex items-center gap-1">
                      <span className={`w-1 bg-amber-400 rounded-full transition-all ${isVideoPlaying ? 'h-4 animate-pulse' : 'h-1.5'}`} />
                      <span className={`w-1 bg-amber-400 rounded-full transition-all ${isVideoPlaying ? 'h-6 animate-pulse delay-75' : 'h-2'}`} />
                      <span className={`w-1 bg-amber-400 rounded-full transition-all ${isVideoPlaying ? 'h-3 animate-pulse delay-150' : 'h-1.5'}`} />
                      <span className={`w-1 bg-amber-400 rounded-full transition-all ${isVideoPlaying ? 'h-5 animate-pulse delay-100' : 'h-2'}`} />
                      <span className="text-[9px] text-gray-300 font-medium ml-1">
                        {isMuted ? 'Muted (Tap to unmute)' : 'Sound On'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={togglePlay}
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                    >
                      {isVideoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{isVideoPlaying ? 'Pause' : 'Play'}</span>
                    </button>
                  </div>

                </div>
              </div>

              {/* Bottom Feature Badges */}
              <div className="mt-3.5 grid grid-cols-3 gap-2 text-center">
                <div className="bg-white p-2 rounded-xl border border-[#E8DCC4] shadow-2xs">
                  <span className="block text-[11px] font-black text-[#1F4D36]">100%</span>
                  <span className="text-[9px] text-gray-500 font-medium">Homemade</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-[#E8DCC4] shadow-2xs">
                  <span className="block text-[11px] font-black text-amber-700">Kachi Ghani</span>
                  <span className="text-[9px] text-gray-500 font-medium">Pure Mustard Oil</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-[#E8DCC4] shadow-2xs">
                  <span className="block text-[11px] font-black text-emerald-700">Sun-Aged</span>
                  <span className="text-[9px] text-gray-500 font-medium">Zero Chemicals</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default CustomerReviewsSection;

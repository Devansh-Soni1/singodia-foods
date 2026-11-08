import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const RajasthaniAudioPlayer = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(() => {
    try {
      return localStorage.getItem('singodhia_audio_muted') === 'true';
    } catch {
      return false;
    }
  });

  const { cartItems, isCartOpen } = useCart();
  const location = useLocation();

  // Check if Blinkit bottom floating cart bar is currently visible on screen
  const isCartBarVisible =
    cartItems &&
    cartItems.length > 0 &&
    !isCartOpen &&
    location.pathname !== '/checkout' &&
    location.pathname !== '/cart' &&
    !location.pathname.startsWith('/admin');

  // Handle first user interaction autoplay (complying with modern browser autoplay policies)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set pleasant, soft ambient volume (22% volume - soothing background feel)
    audio.volume = 0.22;

    // If user has explicitly muted in the past, respect preference
    const savedMute = localStorage.getItem('singodhia_audio_muted') === 'true';
    if (savedMute) {
      setIsMuted(true);
      return;
    }

    const tryPlayAudio = () => {
      if (localStorage.getItem('singodhia_audio_muted') === 'true') return;
      audio.volume = 0.22;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsMuted(false);
          })
          .catch(() => {
            // Browser prevented audio, keep waiting for explicit user gesture
          });
      }
    };

    // Attempt direct play (works in browsers that allow autoplay or subsequent page transitions)
    tryPlayAudio();

    // Listen to first user touch/click/scroll anywhere to initiate soft background music
    const handleFirstGesture = () => {
      tryPlayAudio();
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('scroll', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };

    window.addEventListener('click', handleFirstGesture, { once: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('scroll', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('scroll', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
  }, []);

  // Sync isMuted state with audio element
  const toggleMusic = (e) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying && !audio.paused) {
      // Pause & Mute
      audio.pause();
      setIsPlaying(false);
      setIsMuted(true);
      try {
        localStorage.setItem('singodhia_audio_muted', 'true');
      } catch (err) {
        // Ignore localStorage error
      }
    } else {
      // Unmute & Play
      audio.volume = 0.22;
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsMuted(false);
          try {
            localStorage.setItem('singodhia_audio_muted', 'false');
          } catch (err) {
            // Ignore localStorage error
          }
        })
        .catch((err) => {
          console.error('Audio playback error:', err);
        });
    }
  };

  return (
    <>
      {/* Background Audio Source with looping and preload */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source src="/audio/rajasthani-tune.mp3" type="audio/mpeg" />
        <source src="/audio/rajasthani-tune.ogg" type="audio/ogg" />
      </audio>

      {/* Floating Rajasthani Music Controller */}
      <aside aria-label="Rajasthani Background Music">
        <button
          type="button"
          onClick={toggleMusic}
          aria-label={isPlaying ? 'Mute Rajasthani Tune' : 'Play Rajasthani Tune'}
          title={isPlaying ? 'राजस्थानी धुन बंद करें (Mute)' : 'राजस्थानी धुन चालू करें (Unmute)'}
          className={`fixed z-40 transition-all duration-300 transform active:scale-95 cursor-pointer flex items-center gap-2 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-full select-none left-4 sm:left-6 ${
            isCartBarVisible ? 'bottom-16 sm:bottom-20' : 'bottom-5 sm:bottom-6'
          } ${
            isPlaying
              ? 'bg-gradient-to-r from-[#78350F] via-[#92400E] to-[#B45309] text-amber-100 border border-amber-400/50 shadow-[0_4px_18px_rgba(146,64,14,0.35)] hover:shadow-[0_6px_24px_rgba(146,64,14,0.55)]'
              : 'bg-[#292524]/90 backdrop-blur-md text-stone-300 border border-stone-700/60 shadow-[0_4px_16px_rgba(0,0,0,0.3)] hover:bg-[#1C1917] hover:text-white'
          }`}
        >
          {/* Animated Equalizer Waves or Muted Icon */}
          <div className="flex items-center justify-center shrink-0">
            {isPlaying ? (
              <div className="flex items-end gap-0.5 h-3.5 w-3.5 justify-center py-0.5">
                <span className="w-0.5 bg-amber-300 rounded-full animate-soundbar-1" />
                <span className="w-0.5 bg-amber-200 rounded-full animate-soundbar-2" />
                <span className="w-0.5 bg-amber-300 rounded-full animate-soundbar-3" />
              </div>
            ) : (
              <VolumeX className="w-4 h-4 text-stone-400" />
            )}
          </div>

          {/* Label Text */}
          <div className="flex flex-col text-left leading-none">
            <span className="text-[10.5px] sm:text-[11.5px] font-extrabold tracking-tight whitespace-nowrap">
              {isPlaying ? 'राजस्थानी धुन' : 'धुन चालू करें'}
            </span>
            <span className="text-[8px] sm:text-[8.5px] opacity-75 font-medium hidden xs:inline">
              {isPlaying ? 'धीमी आवाज़ में चालू' : 'क्लिक करके सुनें'}
            </span>
          </div>

          {/* Subtle Speaker icon indicator */}
          {isPlaying && (
            <Volume2 className="w-3.5 h-3.5 text-amber-300/90 hidden sm:inline-block ml-0.5" />
          )}
        </button>
      </aside>
    </>
  );
};

export default RajasthaniAudioPlayer;

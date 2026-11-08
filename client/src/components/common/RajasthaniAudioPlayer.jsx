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

  // Ambient Target Volume: 10% (0.10) for truly soft, peaceful background sound
  const TARGET_VOLUME = 0.10;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Respect saved mute preference
    const savedMute = localStorage.getItem('singodhia_audio_muted') === 'true';
    if (savedMute) {
      setIsMuted(true);
      return;
    }

    // Function to softly start playback with a smooth fade-in
    const startSoftPlayback = () => {
      if (!audio) return;
      if (localStorage.getItem('singodhia_audio_muted') === 'true') return;
      if (!audio.paused) return; // already playing

      audio.volume = 0.03;
      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsMuted(false);

            // Smooth 1-second fade-in up to TARGET_VOLUME (0.10)
            let currentVol = 0.03;
            const stepTimer = setInterval(() => {
              currentVol += 0.015;
              if (currentVol >= TARGET_VOLUME) {
                audio.volume = TARGET_VOLUME;
                clearInterval(stepTimer);
              } else {
                audio.volume = currentVol;
              }
            }, 120);
          })
          .catch(() => {
            // Browser policy blocked automatic unmuted play; waiting for first user touch
          });
      }
    };

    // 1. Attempt immediate autoplay upon page load
    startSoftPlayback();

    // 2. High-priority capture listeners: start instantly on first touch/scroll/click/interaction
    const interactionEvents = [
      'pointerdown',
      'touchstart',
      'click',
      'scroll',
      'wheel',
      'keydown'
    ];

    const handleImmediateGesture = () => {
      startSoftPlayback();
      cleanupListeners();
    };

    const cleanupListeners = () => {
      interactionEvents.forEach((evt) => {
        window.removeEventListener(evt, handleImmediateGesture, { capture: true });
        document.removeEventListener(evt, handleImmediateGesture, { capture: true });
      });
    };

    interactionEvents.forEach((evt) => {
      window.addEventListener(evt, handleImmediateGesture, { capture: true, passive: true });
      document.addEventListener(evt, handleImmediateGesture, { capture: true, passive: true });
    });

    return () => {
      cleanupListeners();
    };
  }, []);

  // Sync Mute / Unmute Toggle Button
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
      // Unmute & Play Softly
      audio.volume = TARGET_VOLUME;
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
      <aside aria-label="Rajasthani Ambient Background Music">
        <button
          type="button"
          onClick={toggleMusic}
          aria-label={isPlaying ? 'Mute Rajasthani Flute Tune' : 'Play Rajasthani Flute Tune'}
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

import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Volume2, VolumeX } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const RajasthaniAudioPlayer = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

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

  // Ambient Target Volume: 10% (0.10) for soft, peaceful background sound
  const TARGET_VOLUME = 0.10;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Reset volume to soft level
    audio.volume = TARGET_VOLUME;

    const playAudio = () => {
      if (!audio) return;
      audio.volume = TARGET_VOLUME;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsMuted(false);
          })
          .catch(() => {
            // Autoplay waiting for user gesture (click/touch/scroll)
          });
      }
    };

    // 1. Attempt play immediately when component mounts
    playAudio();

    // 2. Also attempt play as soon as audio data is ready to play
    audio.addEventListener('canplay', playAudio, { once: true });
    audio.addEventListener('loadeddata', playAudio, { once: true });

    // 3. High-priority capture interaction listeners:
    // As soon as the user touches, scrolls, or clicks anywhere on the site, audio starts immediately
    const interactionEvents = [
      'pointerdown',
      'touchstart',
      'touchend',
      'click',
      'scroll',
      'wheel',
      'keydown'
    ];

    const handleInteraction = () => {
      if (audioRef.current && audioRef.current.paused) {
        playAudio();
      }
    };

    interactionEvents.forEach((evt) => {
      window.addEventListener(evt, handleInteraction, { capture: true, passive: true });
      document.addEventListener(evt, handleInteraction, { capture: true, passive: true });
    });

    const handleAudioPlaying = () => {
      setIsPlaying(true);
      setIsMuted(false);
      // Remove interaction listeners once audio is successfully playing
      interactionEvents.forEach((evt) => {
        window.removeEventListener(evt, handleInteraction, { capture: true });
        document.removeEventListener(evt, handleInteraction, { capture: true });
      });
    };

    audio.addEventListener('playing', handleAudioPlaying);

    return () => {
      audio.removeEventListener('canplay', playAudio);
      audio.removeEventListener('loadeddata', playAudio);
      audio.removeEventListener('playing', handleAudioPlaying);
      interactionEvents.forEach((evt) => {
        window.removeEventListener(evt, handleInteraction, { capture: true });
        document.removeEventListener(evt, handleInteraction, { capture: true });
      });
    };
  }, []);

  // Mute / Unmute Toggle Button (Icon only)
  const toggleMusic = (e) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying && !audio.paused) {
      // Pause & Mute
      audio.pause();
      setIsPlaying(false);
      setIsMuted(true);
    } else {
      // Play & Unmute
      audio.volume = TARGET_VOLUME;
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsMuted(false);
        })
        .catch((err) => {
          console.error('Audio playback error:', err);
        });
    }
  };

  return (
    <>
      {/* Background Audio Source with autoPlay, loop, and preload */}
      <audio
        ref={audioRef}
        autoPlay
        playsInline
        loop
        preload="auto"
        onPlay={() => {
          setIsPlaying(true);
          setIsMuted(false);
        }}
        onPause={() => {
          setIsPlaying(false);
        }}
      >
        <source src="/audio/rajasthani-tune.mp3" type="audio/mpeg" />
        <source src="/audio/rajasthani-tune.ogg" type="audio/ogg" />
      </audio>

      {/* Floating Audio Controller (Icon only, no text) */}
      <aside aria-label="Audio Controller">
        <button
          type="button"
          onClick={toggleMusic}
          aria-label={isPlaying ? 'Mute Audio' : 'Unmute Audio'}
          title={isPlaying ? 'Mute' : 'Unmute'}
          className={`fixed z-40 transition-all duration-300 transform active:scale-90 cursor-pointer flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full select-none left-4 sm:left-6 ${
            isCartBarVisible ? 'bottom-16 sm:bottom-20' : 'bottom-5 sm:bottom-6'
          } ${
            isPlaying
              ? 'bg-gradient-to-tr from-[#92400E] to-[#B45309] text-white shadow-[0_4px_16px_rgba(180,83,9,0.45)] hover:shadow-[0_6px_22px_rgba(180,83,9,0.6)] border-2 border-amber-300/40 hover:scale-105'
              : 'bg-[#292524]/90 backdrop-blur-md text-stone-300 border border-stone-600/60 shadow-[0_4px_14px_rgba(0,0,0,0.35)] hover:bg-[#1C1917] hover:text-white'
          }`}
        >
          {isPlaying ? (
            <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-white stroke-[2.2]" />
          ) : (
            <VolumeX className="w-5 h-5 sm:w-6 sm:h-6 text-stone-300 stroke-[2.2]" />
          )}
        </button>
      </aside>
    </>
  );
};

export default RajasthaniAudioPlayer;

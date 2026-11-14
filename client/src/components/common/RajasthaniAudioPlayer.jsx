import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Volume2, VolumeX } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const RajasthaniAudioPlayer = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const isPlayingRef = useRef(false);
  const isAttemptingRef = useRef(false);
  const userMutedRef = useRef(false);

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

  // Ambient Target Volume: 40% (0.40) for clear, rich, and pleasant audibility on both laptops and mobile devices
  const TARGET_VOLUME = 0.40;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = TARGET_VOLUME;

    const playAudio = () => {
      // Don't auto-resume if user actively muted during this session
      if (!audio || isPlayingRef.current || isAttemptingRef.current || userMutedRef.current) return;

      isAttemptingRef.current = true;
      audio.volume = TARGET_VOLUME;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            isPlayingRef.current = true;
            isAttemptingRef.current = false;
            setIsPlaying(true);
            setIsMuted(false);
          })
          .catch(() => {
            isAttemptingRef.current = false;
            // Awaiting first user gesture (touch, click, scroll, mouse movement)
          });
      }
    };

    const unlockAudioAndPlay = () => {
      if (userMutedRef.current) return;
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          if (ctx.state === 'suspended') {
            ctx.resume();
          }
        }
      } catch (_) {}
      playAudio();
    };

    // 1. Immediate play attempt as soon as component mounts (site landing)
    playAudio();

    // 2. Play attempt when audio data is ready
    audio.addEventListener('canplay', playAudio, { once: true });
    audio.addEventListener('loadeddata', playAudio, { once: true });

    // 3. Capture interaction events across all devices (Mobile & Laptop)
    const interactionEvents = [
      'click',
      'touchstart',
      'touchend',
      'pointerdown',
      'pointerup',
      'mousedown',
      'mouseup',
      'keydown',
      'wheel',
      'scroll',
      'mousemove'
    ];

    const handleInteraction = () => {
      if (audioRef.current && (audioRef.current.paused || !isPlayingRef.current)) {
        unlockAudioAndPlay();
      }
    };

    interactionEvents.forEach((evt) => {
      window.addEventListener(evt, handleInteraction, { capture: true, passive: true });
      document.addEventListener(evt, handleInteraction, { capture: true, passive: true });
    });

    const handleAudioPlaying = () => {
      isPlayingRef.current = true;
      setIsPlaying(true);
      setIsMuted(false);
    };

    const handleAudioPause = () => {
      isPlayingRef.current = false;
      setIsPlaying(false);
    };

    audio.addEventListener('playing', handleAudioPlaying);
    audio.addEventListener('pause', handleAudioPause);

    return () => {
      audio.removeEventListener('canplay', playAudio);
      audio.removeEventListener('loadeddata', playAudio);
      audio.removeEventListener('playing', handleAudioPlaying);
      audio.removeEventListener('pause', handleAudioPause);
      interactionEvents.forEach((evt) => {
        window.removeEventListener(evt, handleInteraction, { capture: true });
        document.removeEventListener(evt, handleInteraction, { capture: true });
      });
    };
  }, []);

  // Mute / Unmute Toggle Button (Normal round shape)
  const toggleMusic = (e) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying && !audio.paused) {
      // Pause & Remember user explicitly muted
      audio.pause();
      userMutedRef.current = true;
      isPlayingRef.current = false;
      setIsPlaying(false);
      setIsMuted(true);
    } else {
      // Play & Reset user mute preference
      userMutedRef.current = false;
      audio.volume = TARGET_VOLUME;
      audio
        .play()
        .then(() => {
          isPlayingRef.current = true;
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
      {/* Background Audio Source with loop and cache-buster */}
      <audio
        ref={audioRef}
        autoPlay
        playsInline
        loop
        preload="auto"
        onPlay={() => {
          isPlayingRef.current = true;
          setIsPlaying(true);
          setIsMuted(false);
        }}
        onPause={() => {
          isPlayingRef.current = false;
          setIsPlaying(false);
        }}
      >
        <source src="/audio/rajasthani-tune.mp3?v=2" type="audio/mpeg" />
      </audio>

      {/* Floating Audio Controller - Only Round Normal Logo */}
      <aside aria-label="Music Controller">
        <button
          type="button"
          onClick={toggleMusic}
          aria-label={isPlaying ? 'Mute Music' : 'Unmute Music'}
          title={isPlaying ? 'Mute' : 'Play Music'}
          className={`fixed z-40 transition-all duration-300 transform active:scale-95 cursor-pointer flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full select-none shadow-md left-4 sm:left-6 ${
            isCartBarVisible ? 'bottom-16 sm:bottom-20' : 'bottom-5 sm:bottom-6'
          } ${
            isPlaying
              ? 'bg-gradient-to-tr from-[#92400E] to-[#B45309] text-white shadow-[0_4px_16px_rgba(180,83,9,0.35)] hover:scale-105 border border-amber-300/40'
              : 'bg-[#292524]/90 backdrop-blur-md text-stone-300 border border-stone-600/60 shadow-[0_4px_14px_rgba(0,0,0,0.3)] hover:bg-[#1C1917] hover:text-white hover:scale-105'
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

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

  // Ambient Target Volume: 35% (0.35) for clear, pleasant audibility on both laptop speakers and mobile phones
  const TARGET_VOLUME = 0.35;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = TARGET_VOLUME;

    const playAudio = () => {
      if (!audio || isPlayingRef.current || isAttemptingRef.current) return;

      // Don't auto-play if user explicitly clicked mute previously
      const userPref = localStorage.getItem('singodia_music_pref');
      if (userPref === 'muted') return;

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
            // Autoplay waiting for user gesture (click/touch/mouse/scroll)
          });
      }
    };

    const unlockAudioAndPlay = () => {
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

    // 1. Initial play attempt on mount
    playAudio();

    // 2. Play attempt when audio metadata is ready
    audio.addEventListener('canplay', playAudio, { once: true });
    audio.addEventListener('loadeddata', playAudio, { once: true });

    // 3. User interaction capture events (covers laptops, desktops, and mobile devices)
    const interactionEvents = [
      'click',
      'mousedown',
      'mouseup',
      'pointerdown',
      'pointerup',
      'mousemove',
      'touchstart',
      'touchend',
      'keydown',
      'wheel',
      'scroll'
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
      // Clean up interaction listeners once audio is successfully playing
      interactionEvents.forEach((evt) => {
        window.removeEventListener(evt, handleInteraction, { capture: true });
        document.removeEventListener(evt, handleInteraction, { capture: true });
      });
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

  // Mute / Unmute Toggle Button
  const toggleMusic = (e) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying && !audio.paused) {
      // Pause & Remember user preference
      audio.pause();
      isPlayingRef.current = false;
      setIsPlaying(false);
      setIsMuted(true);
      localStorage.setItem('singodia_music_pref', 'muted');
    } else {
      // Play & Clear mute preference
      localStorage.removeItem('singodia_music_pref');
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
      {/* Background Audio Source with loop and preload */}
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
        <source src="/audio/rajasthani-tune.mp3" type="audio/mpeg" />
      </audio>

      {/* Floating Audio Controller - Only Round Normal Mute/Unmute Logo */}
      <aside aria-label="Music Controller">
        <button
          type="button"
          onClick={toggleMusic}
          aria-label={isPlaying ? 'Mute Music' : 'Unmute Music'}
          title={isPlaying ? 'Mute' : 'Play Music'}
          className={`fixed z-40 transition-all duration-300 transform active:scale-95 cursor-pointer flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full select-none shadow-md left-4 sm:left-6 ${
            isCartBarVisible ? 'bottom-16 sm:bottom-20' : 'bottom-5 sm:bottom-6'
          } ${
            isPlaying
              ? 'bg-gradient-to-tr from-[#92400E] to-[#B45309] text-white shadow-[0_4px_16px_rgba(180,83,9,0.35)] hover:scale-105 border border-amber-300/40'
              : 'bg-[#292524]/90 backdrop-blur-md text-stone-300 border border-stone-600/60 shadow-[0_4px_14px_rgba(0,0,0,0.3)] hover:bg-[#1C1917] hover:text-white hover:scale-105'
          }`}
        >
          {isPlaying ? (
            <Volume2 className="w-5 h-5 text-white stroke-[2.2]" />
          ) : (
            <VolumeX className="w-5 h-5 text-stone-300 stroke-[2.2]" />
          )}
        </button>
      </aside>
    </>
  );
};

export default RajasthaniAudioPlayer;

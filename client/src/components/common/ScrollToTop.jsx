import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Global Scroll-to-Top Component
 * Ensures every page navigation starts cleanly at the top of the viewport
 * instead of preserving bottom/footer scroll offsets.
 */
export const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // Disable browser's automatic scroll restoration on SPA navigations
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // If an anchor hash exists (e.g. #trial-pack), scroll smoothly to that section
    if (hash) {
      const targetId = hash.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    // Instantly reset window, html, and body scroll offsets to the absolute top
    const scrollToTopImmediate = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    };

    scrollToTopImmediate();

    // Micro-delay frame callbacks to handle any async images or layout reflows
    const rafId = requestAnimationFrame(scrollToTopImmediate);
    const timer = setTimeout(scrollToTopImmediate, 30);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
    };
  }, [pathname, search, hash]);

  return null;
};

export default ScrollToTop;


import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Global Scroll-to-Top Component
 * Ensures page navigations (different routes) start at the top of the viewport
 * while preserving scroll position when simply switching tabs or query params on the same page.
 */
export const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    // If an anchor hash exists (e.g. #trial-pack), scroll smoothly to that section
    if (hash) {
      const targetId = hash.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    // Only scroll to top when navigating to a DIFFERENT page/route
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;

      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }

      const scrollToTopImmediate = () => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        if (document.documentElement) document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;
      };

      scrollToTopImmediate();
      const rafId = requestAnimationFrame(scrollToTopImmediate);
      const timer = setTimeout(scrollToTopImmediate, 30);

      return () => {
        cancelAnimationFrame(rafId);
        clearTimeout(timer);
      };
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;

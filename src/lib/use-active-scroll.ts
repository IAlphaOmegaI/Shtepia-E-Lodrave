import { RefObject, useEffect } from 'react';

export const useActiveScroll = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  offset = 0
) => {
  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    let rafId: number | null = null;
    let prevScrollY = window.scrollY;

    const handleScroll = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const scrollingDown = currentScrollY > prevScrollY;
        const isPastOffset = currentScrollY > offset;

        if (scrollingDown && isPastOffset) {
          element.classList.add('is-scrolling');
        } else {
          element.classList.remove('is-scrolling');
        }

        prevScrollY = currentScrollY;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [ref, offset]);
};
import { Variants } from 'framer-motion';

export function fadeInRight(duration: number = 0.3): Variants {
  return {
    from: {
      right: '-100%',
      transition: {
        type: 'tween',
        ease: 'easeInOut',
        duration: duration,
      },
    },
    to: {
      right: 0,
      transition: {
        type: 'tween',
        ease: 'easeInOut',
        duration: duration,
      },
    },
  };
}
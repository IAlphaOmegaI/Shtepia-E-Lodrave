import { Variants } from 'framer-motion';

export function fadeInLeft (duration:number = 0.3): Variants {
  return {
    from: { 
      left: '-100%',
      transition: {
        type: 'tween',
        ease: 'easeInOut',
        duration: duration,
      } 
    },
    to: { 
      left: 0,
      transition: {
        type: 'tween',
        ease: 'easeInOut',
        duration: duration,
      } 
    },
  }
}
import { Variants } from 'framer-motion';

export function fadeInOut (duration:number = 0.2): Variants {
  return {
    from: { 
      opacity: 0,
      transition: {
        type: 'tween',
        ease: 'easeInOut',
        duration: duration,
      } 
    },
    to: { 
      opacity: 1,
      transition: {
        type: 'tween',
        ease: 'easeInOut',
        duration: duration,
      } 
    },
  }
}
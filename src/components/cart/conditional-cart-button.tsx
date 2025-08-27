'use client';

import { usePathname } from 'next/navigation';
import CartCounterButton from './cart-counter-button';

export default function ConditionalCartButton() {
  const pathname = usePathname();
  
  // Don't show cart button on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }
  
  return <CartCounterButton />;
}
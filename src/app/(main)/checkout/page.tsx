'use client';

import { useEffect } from 'react';
import { useCart } from '@/store/quick-cart/cart.context';
import { useRouter } from 'next/navigation';
import { Routes } from '@/config/routes';
import dynamic from 'next/dynamic';

// Dynamically import the entire checkout content to avoid SSR
const CheckoutContent = dynamic(
  () => import('@/components/checkout/checkout-content'),
  { 
    ssr: false,
    loading: () => null
  }
);

export default function CheckoutPage() {
  const { items } = useCart();
  const router = useRouter();

  // Redirect to cart if empty
  useEffect(() => {
    if (items.length === 0) {
      router.push(Routes.cart);
    }
  }, [items, router]);

  return <CheckoutContent />;
}
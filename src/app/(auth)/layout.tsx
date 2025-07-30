'use client';

import Link from 'next/link';
import { Routes } from '@/config/routes';
import { ArrowLeft } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Back to cart link */}
        <Link 
          href={Routes.cart}
          className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span>Go back to cart</span>
        </Link>
        
        {children}
      </div>
    </div>
  );
}
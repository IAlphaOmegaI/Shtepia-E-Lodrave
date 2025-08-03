'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import PageHeader from '@/components/common/page-header';
import Header from '@/components/layouts/header';
import Footer from '@/components/layouts/footer/footer';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/register' || pathname === '/login';

  useEffect(() => {
    if (isAuthPage) {
      document.body.classList.add('darker-v3');
    }
    return () => {
      document.body.classList.remove('darker-v3');
    };
  }, [isAuthPage]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />
      
      {/* Page Header without title and clouds */}
      <PageHeader showTitle={false} showClouds={false} />
      
      {/* Content - positioned to overlap with page header */}
      <div className="flex-1 flex items-start justify-center p-10 -mt-64 ">
        <div className="w-full max-w-md mt-8 ">
          {children}
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
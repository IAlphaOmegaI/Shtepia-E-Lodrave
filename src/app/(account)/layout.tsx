'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services';
import { FavoriteIcon } from '@/components/icons/favorite';
import { ShoppingCartIcon } from '@/components/icons/shopping-cart';
import { CreditCardIcon } from '@/components/icons/credit-card';
import { UserIcon } from '@/components/icons/user';
import { Routes } from '@/config/routes';
import Header from '@/components/layouts/header';
import Footer from '@/components/layouts/footer/footer';
import { ShoppingCart } from 'lucide-react';

const menuItems = [
  {
    label: "Porositë",
    href: "/account/orders",
    icon: ShoppingCart,
  },
  {
    label: "Karta e besnikërisë",
    href: "/account/loyalty-card",
    icon: CreditCardIcon,
  },
  {
    label: "Profili",
    href: "/account/profile",
    icon: UserIcon,
  },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !AuthService.isAuthenticated()) {
      router.push(Routes.login);
    }
  }, [isClient, router]);

  if (!isClient || !AuthService.isAuthenticated()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* Mobile Tabs */}
      <div className="lg:hidden bg-white border-b border-gray-200">
        <nav className="flex overflow-x-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-1 min-w-0 flex flex-col items-center gap-2 px-4 py-4 border-b-2 transition-colors ${
                  isActive
                    ? "border-red-500 text-red-600 bg-red-50"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-albertsans font-medium text-xs sm:text-sm text-center">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 min-h-full">
          <nav className="h-full">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-4 px-8 py-6 transition-colors ${
                    isActive
                      ? "bg-[#FEC949] text-gray-900"
                      : "bg-white text-gray-700 hover:bg-[#FFE8B3]"
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                  )}
                  <Icon className="w-6 h-6" />
                  <span className="font-albertsans font-medium text-lg">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 sm:p-8 lg:p-12 bg-[#FFFAEE] min-h-[calc(100vh-theme(spacing.64))]">
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
}
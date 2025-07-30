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

const menuItems = [
  {
    label: 'Preferencat',
    href: '/account/favorites',
    icon: FavoriteIcon,
  },
  {
    label: 'Porositë',
    href: '/account/orders',
    icon: ShoppingCartIcon,
  },
  {
    label: 'Karta e besnikërisë',
    href: '/account/loyalty-card',
    icon: CreditCardIcon,
  },
  {
    label: 'Profili',
    href: '/account/profile',
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold font-grandstander mb-8">Llogaria ime</h1>
        
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 bg-white rounded-lg shadow-sm p-4">
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-red-50 text-red-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-albertsans font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthService } from '@/services/auth.service';
import Link from 'next/link';
import Image from 'next/image';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Tag, 
  Settings,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser();
        if (!currentUser || currentUser.role !== 'admin') {
          router.push('/login');
          return;
        }
        setUser(currentUser);
      } catch (error) {
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const toggleMenu = (menu: string) => {
    setExpandedMenu(expandedMenu === menu ? null : menu);
  };

  const menuItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/admin/dashboard',
      active: pathname === '/admin/dashboard'
    },
    {
      label: 'Category Management',
      icon: Tag,
      href: '/admin/categories',
      active: pathname.includes('/admin/categories')
    },
    {
      label: 'Products',
      icon: Package,
      href: '/admin/products',
      active: pathname.includes('/admin/products')
    },
    {
      label: 'Order Management',
      icon: ShoppingBag,
      href: '/admin/orders',
      active: pathname.includes('/admin/orders'),
      expandable: true,
      subItems: [
        { label: 'All Orders', href: '/admin/orders' },
        { label: 'Pending', href: '/admin/orders?status=pending' },
        { label: 'Processing', href: '/admin/orders?status=processing' },
        { label: 'Completed', href: '/admin/orders?status=completed' },
        { label: 'Cancelled', href: '/admin/orders?status=cancelled' },
      ]
    },
    {
      label: 'Customer Management',
      icon: Users,
      href: '/admin/customers',
      active: pathname.includes('/admin/customers')
    },
    {
      label: 'Promotional Management',
      icon: Tag,
      href: '/admin/promotions',
      active: pathname.includes('/admin/promotions')
    },
    {
      label: 'Site settings',
      icon: Settings,
      href: '/admin/settings',
      active: pathname.includes('/admin/settings')
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <div className="bg-[#E94B3C] h-16 flex items-center px-6">
        <div className="flex items-center flex-1">
          <Link href="/admin/dashboard" className="flex items-center">
            <div className="bg-[#FEC949] rounded-full p-2 mr-3">
              <svg className="w-6 h-6 text-[#E94B3C]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg">Shtëpia e Lodrave</span>
          </Link>
        </div>
        
        {/* Search Bar */}
        <div className="flex-1 max-w-xl mx-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full px-4 py-2 rounded-lg text-gray-700 bg-white"
            />
            <button className="absolute right-2 top-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="flex items-center">
          <div className="bg-white rounded-full p-2 mr-3">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="text-white">
            <div className="text-sm">User's name</div>
            <div className="text-xs opacity-75">Super Admin</div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md min-h-[calc(100vh-4rem)]">
          <nav className="p-4">
            {menuItems.map((item) => (
              <div key={item.label} className="mb-2">
                {item.expandable ? (
                  <>
                    <button
                      onClick={() => toggleMenu(item.label)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                        item.active 
                          ? 'bg-[#FEC949] text-gray-800' 
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center">
                        <item.icon className="w-5 h-5 mr-3" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                      {expandedMenu === item.label ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                    {expandedMenu === item.label && item.subItems && (
                      <div className="ml-8 mt-1">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.label}
                            href={subItem.href}
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                      item.active 
                        ? 'bg-[#FEC949] text-gray-800' 
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
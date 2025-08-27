'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthService } from '@/services/auth.service';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Tag, 
  Settings,
  ChevronDown,
  ChevronUp,
  LogOut,
  User as UserIcon,
  Award
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

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
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  // Fetch user data
  const { data: userData } = useQuery({
    queryKey: ['user', 'me'],
    queryFn: async () => {
      const data = await api.auth.me();
      console.log('User data from API:', data);
      return data;
    },
    enabled: !!user,
  });

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

  // Handle click outside for user menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    router.push('/login');
    window.location.reload();
  };

  const toggleMenu = (menu: string) => {
    setExpandedMenu(expandedMenu === menu ? null : menu);
  };

  type MenuItem = {
    label: string;
    icon: LucideIcon;
    href: string;
    active: boolean;
    expandable?: boolean;
    subItems?: { label: string; href: string }[];
  };

  const menuItems: MenuItem[] = [
    {
      label: 'Paneli Kryesor',
      icon: LayoutDashboard,
      href: '/admin/dashboard',
      active: pathname === '/admin/dashboard'
    },
    {
      label: 'Menaxhimi i Kategorive',
      icon: Tag,
      href: '/admin/categories',
      active: pathname.includes('/admin/categories')
    },
    {
      label: 'Produktet',
      icon: Package,
      href: '/admin/products',
      active: pathname.includes('/admin/products')
    },
    {
      label: 'Porositë',
      icon: ShoppingBag,
      href: '/admin/orders',
      active: pathname.includes('/admin/orders')
    },
    {
      label: 'Brendet',
      icon: Award,
      href: '/admin/brands',
      active: pathname.includes('/admin/brands')
    },
    {
      label: 'Menaxhimi i Klientëve',
      icon: Users,
      href: '/admin/customers',
      active: pathname.includes('/admin/customers')
    },
    {
      label: 'Konfigurimet e Faqes',
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
      <div className="bg-[#E94B3C] h-16 flex items-center justify-between px-6">
        <div className="flex items-center">
          <Link href="/admin/dashboard" className="flex items-center">
            <div className="bg-[#FEC949] rounded-full p-2 mr-3">
              <svg className="w-6 h-6 text-[#E94B3C]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg">Shtëpia e Lodrave</span>
          </Link>
        </div>

        {/* User Info */}
        <div className="relative" ref={userMenuRef}>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center hover:opacity-90 transition-opacity cursor-pointer"
          >
            <div className="bg-white rounded-full p-2 mr-3">
              <UserIcon className="w-6 h-6 text-gray-600" />
            </div>
            <div className="text-white text-left">
              <div className="text-sm font-medium">
                {(() => {
                  // Check if we have valid name data (not "string" placeholder)
                  const firstName = userData?.first_name;
                  const lastName = userData?.last_name;
                  
                  if (firstName && firstName !== 'string' && lastName && lastName !== 'string') {
                    return `${firstName} ${lastName}`;
                  } else if (firstName && firstName !== 'string') {
                    return firstName;
                  } else if (lastName && lastName !== 'string') {
                    return lastName;
                  } else {
                    return userData?.email || user?.email || 'Administrator';
                  }
                })()}
              </div>
              <div className="text-xs opacity-75">Administrator</div>
            </div>
            <ChevronDown className="w-4 h-4 text-white ml-2" />
          </motion.button>

          {/* User Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-900">
                  {(() => {
                    const firstName = userData?.first_name;
                    const lastName = userData?.last_name;
                    
                    if (firstName && firstName !== 'string' && lastName && lastName !== 'string') {
                      return `${firstName} ${lastName}`;
                    } else if (firstName && firstName !== 'string') {
                      return firstName;
                    } else if (lastName && lastName !== 'string') {
                      return lastName;
                    } else {
                      return 'Administrator';
                    }
                  })()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {userData?.email || user?.email || 'admin@shtepialodrave.com'}
                </p>
              </div>
              
              <div className="py-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Dilni
                </button>
              </div>
            </div>
          )}
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
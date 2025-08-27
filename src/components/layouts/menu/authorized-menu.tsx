'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { AuthService } from '@/services';
import { useAuthStore } from '@/store/use-auth';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

const AuthorizedMenu: React.FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { unauthorize } = useAuthStore();

  const { data: userData } = useQuery({
    queryKey: ['user', 'me'],
    queryFn: () => api.auth.me(),
    enabled: AuthService.isAuthenticated(),
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    unauthorize();
    router.push('/');
    window.location.reload();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileTap={{ scale: 0.88 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center p-2 focus:outline-0"
      >
        <Image
          src="/avatar.svg"
          alt="User avatar"
          width={28}
          height={28}
          className="rounded-full"
        />
      </motion.button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-3 w-72 bg-white rounded-2xl shadow-2xl overflow-hidden z-[9999]">
          <div className="absolute -top-2 right-8 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-white"></div>
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <Image
                src="/avatar.svg"
                alt="User avatar"
                width={50}
                height={50}
                className="rounded-full"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-600 break-all">
                  {userData?.email || "user@example.com"}
                </p>
                <a
                  href={userData?.role === 'admin' ? '/admin/dashboard' : '/account/profile'}
                  className="text-sm text-gray-700 hover:text-gray-900 flex items-center mt-1 group"
                  onClick={() => setIsOpen(false)}
                >
                  <span>{userData?.role === 'admin' ? 'Admin Dashboard' : 'Profili Im'}</span>
                  <svg className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          {userData?.role !== 'admin' && (
            <div className="py-1">
              <a
                href="/account/loyalty-card"
                className="block px-4 py-3 text-sm text-gray-900 hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Karta ime e besnikërisë
              </a>
              <a
                href="/account/orders"
                className="block px-4 py-3 text-sm text-gray-900 hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Porositë
              </a>
            </div>
          )}
          <div className="border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-3 text-sm text-gray-900 hover:bg-gray-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorizedMenu;
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
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-full items-center justify-center p-2 text-white hover:opacity-80 focus:outline-0"
      >
        <Image
          src="/avatar.svg"
          alt="User Avatar"
          width={28}
          height={28}
          className="rounded-full"
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-50"
          >
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-md font-medium text-blue-600 break-all">
                {userData?.email || 'user@example.com'}
              </p>
            </div>

            <a
              href="/account/profile"
              className="block px-4 py-3 text-gray-700 hover:bg-gray-50 font-albertsans"
            >
              Profili im
            </a>

            <a
              href="/account/loyalty-card"
              className="block px-4 py-3 text-gray-700 hover:bg-gray-50 font-albertsans"
            >
              Karta ime e besnikërisë
            </a>

            <div className="border-t border-gray-100 mt-2 pt-2">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 font-albertsans"
              >
                Dil
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthorizedMenu;
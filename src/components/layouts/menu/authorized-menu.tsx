'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { UserIcon } from '@/components/icons/user';

const AuthorizedMenu: React.FC = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/profile')}
      className="flex h-full items-center justify-center p-2 text-white hover:opacity-80 focus:outline-0"
    >
      <UserIcon height={22} />
    </button>
  );
};

export default AuthorizedMenu;
'use client';

import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { authorizationAtom } from '@/store/authorization-atom';
import { AuthService } from '@/services';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [, setAuthorized] = useAtom(authorizationAtom);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    // Check authentication status on mount and set the atom
    const isAuthenticated = AuthService.isAuthenticated();
    setAuthorized(isAuthenticated);
  }, [setAuthorized, isClient]);

  return <>{children}</>;
}
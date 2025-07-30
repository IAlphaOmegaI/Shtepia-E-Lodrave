import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { authorizationAtom } from '@/store/authorization-atom';
import { AuthService } from '@/services';

export function useAuthCheck() {
  const [isAuthorized, setAuthorized] = useAtom(authorizationAtom);

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = () => {
      const isAuthenticated = AuthService.isAuthenticated();
      setAuthorized(isAuthenticated);
    };

    checkAuth();

    // Optional: Set up an interval to periodically check auth status
    // This can help catch token expiration
    const interval = setInterval(checkAuth, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [setAuthorized]);

  return isAuthorized;
}
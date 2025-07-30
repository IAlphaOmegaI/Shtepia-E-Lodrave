import { useAtom } from 'jotai';
import { authorizationAtom } from './authorization-atom';
import { AuthService } from '@/services';

export function useAuthStore() {
  const [isAuthorized, setAuthorized] = useAtom(authorizationAtom);

  const authorize = () => {
    setAuthorized(true);
  };

  const unauthorize = () => {
    AuthService.logout();
    setAuthorized(false);
    // Clear the persisted auth state
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isAuthorized');
    }
  };

  return {
    isAuthorized,
    authorize,
    unauthorize,
  };
}
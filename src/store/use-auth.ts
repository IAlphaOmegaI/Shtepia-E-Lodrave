import { useAtom } from 'jotai';
import { authorizationAtom } from './authorization-atom';
import { AuthService } from '@/services';

export function useAuthStore() {
  const [isAuthorized, setAuthorized] = useAtom(authorizationAtom);

  const authorize = () => {
    setAuthorized(true);
  };

  const unauthorize = () => {
    setAuthorized(false);
    AuthService.logout();
  };

  return {
    isAuthorized,
    authorize,
    unauthorize,
  };
}
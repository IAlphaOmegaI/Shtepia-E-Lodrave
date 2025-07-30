import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { AuthService } from '@/services/auth.service';

export function useUser() {
  const isAuthenticated = AuthService.isAuthenticated();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', 'me'],
    queryFn: () => api.auth.me(),
    enabled: isAuthenticated,
    retry: false,
  });

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
  };
}
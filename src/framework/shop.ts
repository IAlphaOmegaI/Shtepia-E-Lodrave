import { useQuery, useMutation } from '@tanstack/react-query';

interface Shop {
  id: number;
  name: string;
  slug: string;
  settings?: {
    shopMaintenance?: {
      start?: string;
    };
    isShopUnderMaintenance?: boolean;
  };
}

export const useShop = ({ slug, enabled }: { slug: string; enabled: boolean }) => {
  return useQuery<Shop>({
    queryKey: ['shop', slug],
    queryFn: async () => {
      // Placeholder for actual API call
      return {
        id: 1,
        name: 'Sample Shop',
        slug,
        settings: {},
      };
    },
    enabled,
  });
};

export const useShopMaintenanceEvent = () => {
  const createShopMaintenanceEventRequest = useMutation({
    mutationFn: async (data: any) => {
      // Placeholder for actual API call
      console.log('Shop maintenance event:', data);
    },
  });

  return { createShopMaintenanceEventRequest: createShopMaintenanceEventRequest.mutate };
};
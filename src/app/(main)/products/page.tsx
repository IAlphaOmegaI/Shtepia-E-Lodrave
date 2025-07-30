import { api } from '@/services/api';
import ShopPageClient from './shop-page-client';

// Server Component - fetches initial data
export default async function ShopPage() {
  // Fetch initial products server-side
  const initialData = await api.products.getAll({
    page: 1,
    limit: 12,
  });

  return <ShopPageClient initialData={initialData} />;
}
import { api } from '@/services/api';
import ShopPageClient from './shop-page-client';

// Server Component - fetches initial data
export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ brand_id?: string }>;
}) {
  const params = await searchParams;
  const brandId = params.brand_id;

  // Fetch initial products server-side (optionally filtered by brand)
  const initialData = await api.products.getAll({
    page: 1,
    limit: 12,
    ...(brandId && { brand: brandId }),
  });


  return <ShopPageClient initialData={initialData} brandId={brandId} />;
}
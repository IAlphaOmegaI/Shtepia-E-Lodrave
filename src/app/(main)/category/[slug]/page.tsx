import { api } from '@/services/api';
import CategoryPageClient from './category-page-client';

// Server Component - fetches initial data
export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Fetch initial products server-side
  const initialData = await api.products.getAll({
    categories__slug: slug,
    page: 1,
    limit: 12,
  });

  return <CategoryPageClient slug={slug} initialData={initialData} />;
}
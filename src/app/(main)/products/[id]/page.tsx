import { api } from '@/services/api';
import ProductPageClient from './product-page-client';
import { notFound } from 'next/navigation';

// Server Component - fetches data at request time
export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  try {
    // Fetch product data server-side
    const product = await api.products.getById(id);
    
    if (!product) {
      notFound();
    }
    
    return <ProductPageClient product={product} />;
  } catch (error) {
    console.error('Error fetching product:', error);
    notFound();
  }
}
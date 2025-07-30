import ProductDetailsSkeleton from '@/components/products/product-details-skeleton';

export default function Loading() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <ProductDetailsSkeleton />
      </div>
    </div>
  );
}
'use client';

import ProductDetails from '@/components/products/product-details';
import { Product } from '@/types/product.types';

type ProductPageClientProps = {
  product: Product;
};

export default function ProductPageClient({ product }: ProductPageClientProps) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <ProductDetails product={product} />
      </div>
    </div>
  );
}
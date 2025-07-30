'use client';

import { useWishlist } from '@/framework/rest/wishlist';
import ProductCardHorizontal from '@/components/products/product-card-horizontal';
import Link from 'next/link';

export default function FavoritesPage() {
  const { items } = useWishlist();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-[32px] font-bold text-[#C32929] font-albertsans">Favorite items</h1>
          {items.length > 0 && (
            <span className="text-[18px] text-[#666] font-albertsans">
              {items.length} {items.length === 1 ? 'product' : 'products'}
            </span>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[20px] text-gray-600 mb-4 font-albertsans">
            Nuk keni asnjë produkt në listën e dëshirave
          </p>
          <Link 
            href="/products"
            className="inline-block bg-[#FEBC1B] hover:bg-[#FEB000] text-[#252323] font-semibold py-3 px-8 rounded-lg transition-colors font-albertsans"
          >
            Shiko produktet
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <ProductCardHorizontal key={item.id} product={item as any} />
          ))}
        </div>
      )}
    </div>
  );
}
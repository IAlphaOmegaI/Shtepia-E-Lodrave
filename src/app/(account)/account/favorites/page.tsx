'use client';

import { useWishlist } from '@/framework/rest/wishlist';
import Image from 'next/image';
import { TrashIcon } from '@/components/icons/trash';
import { FavoriteIcon } from '@/components/icons/favorite';
import { useCart } from '@/store/quick-cart/cart.context';

export default function FavoritesPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addItem } = useCart();

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      image: product.image,
      price: product.price,
      sale_price: product.sale_price,
      quantity: 1,
    });
  };

  if (wishlist.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-16 text-center">
        <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <FavoriteIcon className="w-16 h-16 text-gray-400" />
        </div>
        <h2 className="text-2xl font-grandstander font-bold text-gray-900 mb-2">
          Lista e preferencave është bosh
        </h2>
        <p className="text-gray-600 font-albertsans mb-6">
          Shtoni produkte në listën tuaj të preferencave për t'i gjetur më lehtë më vonë.
        </p>
        <a
          href="/"
          className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-albertsans font-medium"
        >
          Shfleto produkte
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-grandstander font-bold">Preferencat e mia</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {wishlist.map((product) => (
          <div key={product.id} className="bg-white border rounded-lg overflow-hidden group">
            <div className="relative aspect-square">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
              <button
                onClick={() => removeFromWishlist(product.id)}
                className="absolute top-2 right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors"
              >
                <TrashIcon className="w-5 h-5 text-red-600" />
              </button>
            </div>
            
            <div className="p-4">
              <h3 className="font-albertsans font-medium text-gray-900 mb-2 line-clamp-2">
                {product.name}
              </h3>
              
              <div className="flex items-center gap-2 mb-4">
                {product.sale_price ? (
                  <>
                    <span className="font-albertsans font-bold text-lg text-red-600">
                      {product.sale_price} Lekë
                    </span>
                    <span className="font-albertsans text-sm text-gray-500 line-through">
                      {product.price} Lekë
                    </span>
                  </>
                ) : (
                  <span className="font-albertsans font-bold text-lg">
                    {product.price} Lekë
                  </span>
                )}
              </div>
              
              <button
                onClick={() => handleAddToCart(product)}
                className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-albertsans font-medium"
              >
                Shtoje në shportë
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
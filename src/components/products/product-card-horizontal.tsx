'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/store/quick-cart/cart.context';
import { useWishlist } from '@/framework/rest/wishlist';
import { useToast } from '@/contexts/toast-context';
import type { Product } from '@/types';
import { ShoppingCartIcon, X } from 'lucide-react';

type ProductCardHorizontalProps = {
  product: Product;
};

const ProductCardHorizontal: React.FC<ProductCardHorizontalProps> = ({ product }) => {
  const { addItem } = useCart();
  const { removeFromWishlist } = useWishlist();
  const { showToast } = useToast();
  
  const { name, image, quantity, sale_price, price, discount, brand } = product ?? {};
  
  const displayPrice = sale_price || price || '0';
  const originalPrice = price || '0';
  
  // Calculate discount percentage if discount object exists
  let displayDiscount = '';
  if (discount) {
    const discountValue = parseFloat(discount.value);
    if (discount.type === 'percentage') {
      displayDiscount = `${discountValue % 1 === 0 ? discountValue.toFixed(0) : discountValue}% OFF`;
    } else {
      displayDiscount = `${discountValue.toFixed(0)} Lekë OFF`;
    }
  } else if (sale_price && price) {
    const discountPercent = Math.round(((parseFloat(price) - parseFloat(sale_price)) / parseFloat(price)) * 100);
    if (discountPercent > 0) {
      displayDiscount = `${discountPercent}% OFF`;
    }
  }
  
  let imageUrl = '/placeholder.jpg';
  if (typeof image === 'string' && image.trim() !== '') {
    imageUrl = image;
  } else if (typeof image === 'object' && image !== null) {
    imageUrl = (image as any).url || (image as any).src || '/placeholder.jpg';
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: parseFloat(displayPrice),
      basePrice: originalPrice !== displayPrice ? parseFloat(originalPrice) : undefined,
      discount: displayDiscount,
      quantity: 1,
      image: imageUrl,
    });
    
    showToast(`${product.name} u shtua në shportë!`, 'success');
  };

  const handleRemoveFromWishlist = () => {
    removeFromWishlist(product.id);
    showToast(`${product.name} u hoq nga lista e dëshirave!`, 'info');
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex gap-4 relative">
      {/* Remove button */}
      <button
        onClick={handleRemoveFromWishlist}
        className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Remove from wishlist"
      >
        <X className="w-5 h-5 text-gray-500" />
      </button>

      {/* Product image */}
      <Link href={`/products/${product.id}`} className="flex-shrink-0">
        <div className="relative w-[120px] h-[120px] rounded-lg overflow-hidden">
          <Image
            src={imageUrl}
            alt={`${name} image`}
            fill
            className="object-contain p-2"
          />
        </div>
      </Link>

      {/* Product details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/products/${product.id}`}>
            <h3 className="text-[#252323] font-albertsans text-[18px] font-bold leading-[24px] hover:text-[#1A66EA] transition-colors">
              {name}
            </h3>
          </Link>
          
          {brand && (
            <p className="text-[#777] font-albertsans text-[14px] font-medium mt-1">
              {typeof brand === 'string' ? brand : brand.name}
            </p>
          )}

          <div className="flex items-center gap-3 mt-2">
            {originalPrice !== displayPrice && (
              <span className="text-[#c1c1c1] font-albertsans text-[16px] font-medium line-through">
                {originalPrice} Lekë
              </span>
            )}
            <span className="text-[#1A66EA] font-albertsans text-[20px] font-bold">
              {displayPrice} Lekë
            </span>
            {displayDiscount && (
              <span className="text-[14px] text-[#1A66EA] font-albertsans font-semibold bg-[#D1E0FB] px-3 py-1 rounded-full">
                {displayDiscount}
              </span>
            )}
          </div>
        </div>

        {/* Add to cart button */}
        <button
          onClick={handleAddToCart}
          disabled={Number(quantity) === 0}
          className="mt-4 w-full max-w-[250px] bg-[#FEBC1B] hover:bg-[#FEB000] text-[#252323] font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 text-[16px] font-albertsans"
        >
          <ShoppingCartIcon className="w-5 h-5" />
          Shtoje në shportë
        </button>
      </div>
    </div>
  );
};

export default ProductCardHorizontal;
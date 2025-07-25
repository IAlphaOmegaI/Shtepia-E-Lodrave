'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/store/quick-cart/cart.context';
import type { Product } from '@/types';

type ProductCardProps = {
  product: Product;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();
  const { addItem } = useCart();
  const { name, image, unit, quantity, min_price, max_price, sale_price, price, discount, brand } = product ?? {};

  const displayPrice = sale_price || price || '0';
  const originalPrice = max_price || price || '0';
  
  // Calculate discount percentage if discount object exists
  let displayDiscount = '';
  if (discount) {
    const discountValue = parseFloat(discount.value);
    if (discount.type === 'percentage') {
      // Format percentage to remove unnecessary decimals (10.00 -> 10, 10.50 -> 10.5)
      displayDiscount = `${discountValue % 1 === 0 ? discountValue.toFixed(0) : discountValue}% OFF`;
    } else {
      // For fixed amount discounts
      displayDiscount = `${discountValue.toFixed(0)} Lekë OFF`;
    }
  } else if (sale_price && price) {
    const discountPercent = Math.round(((parseFloat(price) - parseFloat(sale_price)) / parseFloat(price)) * 100);
    if (discountPercent > 0) {
      displayDiscount = `${discountPercent}% OFF`;
    }
  }
  
  // Check if image is a valid URL string or extract from object
  const imageUrl = (typeof image === 'string' && image.trim() !== '') 
    ? image 
    : (image?.url || image?.src || '/icons/newCollection-card.svg');

  function handleProductClick() {
    router.push(`/products/${product.slug}`);
  }

  function handleAddToCart(e: React.MouseEvent) {
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: parseFloat(displayPrice),
      basePrice: originalPrice !== displayPrice ? parseFloat(originalPrice) : undefined,
      discount: displayDiscount,
      quantity: 1,
      image: imageUrl,
    });
  }

  return (
    <div className="bg-white w-full rounded-lg border p-4 max-w-xs mx-auto text-left relative flex flex-col">
      <div className="relative h-[210px] mb-4 cursor-pointer" onClick={handleProductClick}>
        <Image
          src={imageUrl}
          alt={`${name} image`}
          fill
          className="object-contain"
        />
      </div>
      <h3 className="text-[#252323] font-albertsans text-[20px] font-bold leading-[26px]">
        {name}
      </h3>
      <p className="text-[#777] font-albertsans text-[16px] font-medium leading-[20px] mb-1">
        {brand?.name || 'Brand'}
      </p>
      <div className="flex items-end justify-between gap-2 flex-wrap mb-2 mt-auto">
        <div className="flex flex-col items-start pt-[28px]">
          {originalPrice !== displayPrice && (
            <span className="text-[#c1c1c1] font-albertsans text-[16px] font-medium leading-[24px] line-through">
              {originalPrice} Lekë
            </span>
          )}
          <span className="text-[#1A66EA] font-albertsans text-[24px] font-extrabold leading-[32px]">
            {displayPrice} Lekë
          </span>
        </div>
        {displayDiscount && (
          <span className="text-[16px] text-[#1A66EA] font-albertsans font-semibold leading-[24px] bg-[#D1E0FB] px-[8px] py-[4px] rounded-[40px]">
            {displayDiscount}
          </span>
        )}
      </div>
      <div>
        {Number(quantity) > 0 && (
          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 h-[44px] px-4 border border-[#F11602] text-[#F11602] font-semibold rounded-[8px] hover:bg-[#F11602] hover:text-white transition-colors"
          >
            <Image src="/icons/cart-icon.svg" alt="Cart" width={20} height={20} />
            <span className="text-[16px] leading-[20px] font-[500] font-albertsans text-center">
              Shtoje në shportë
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
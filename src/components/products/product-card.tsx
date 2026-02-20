'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/store/quick-cart/cart.context';
import { useWishlist } from '@/framework/rest/wishlist';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/contexts/toast-context';
import type { Product } from '@/types';
import { ShoppingCartIcon, Heart } from 'lucide-react';

type ProductCardProps = {
  product: Product;
  removeMaxWidth?: boolean;
};

const ProductCard: React.FC<ProductCardProps> = ({ product, removeMaxWidth = false }) => {
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [imageError, setImageError] = useState(false);
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
  let imageUrl = '/product-placeholder.jpg';
  if (typeof image === 'string' && image.trim() !== '') {
    imageUrl = image;
  } else if (typeof image === 'object' && image !== null) {
    imageUrl = (image as any).url || (image as any).src || '/product-placeholder.jpg';
  }

  // Use placeholder if there's an image error  
  if (imageError) {
    imageUrl = '/product-placeholder.jpg';
  } else if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('//')) {
    // For media files, we need the base domain without the /api path
    // NEXT_PUBLIC_API_URL is https://api.shtepialodrave.com/api
    // We need https://api.shtepialodrave.com for media files
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.shtepialodrave.com/api';

    // Remove only the trailing /api (not the 'api' in the domain)
    let baseUrl = apiUrl;
    if (apiUrl.endsWith('/api')) {
      baseUrl = apiUrl.substring(0, apiUrl.length - 4);
    }

    imageUrl = `${baseUrl}${imageUrl}`;
  }

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsAddingToCart(true);

    // Add item to cart
    addItem({
      id: product.id,
      name: product.name,
      price: parseFloat(displayPrice),
      basePrice: originalPrice !== displayPrice ? parseFloat(originalPrice) : undefined,
      discount: displayDiscount,
      quantity: 1,
      image: imageUrl,
    });

    // Show success toast
    showToast(`${product.name} u shtua në shportë!`, 'success');

    // Simulate loading animation
    setTimeout(() => {
      setIsAddingToCart(false);
    }, 500);
  }

  function handleToggleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const isInList = isInWishlist(product.id);

    if (isInList) {
      removeFromWishlist(product.id);
      showToast(`${product.name} u hoq nga lista e dëshirave!`, 'info');
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: parseFloat(displayPrice),
        image: imageUrl,
        slug: product.slug,
        brand: brand,
      });
      showToast(`${product.name} u shtua në listën e dëshirave!`, 'success');
    }
  }

  if (isAddingToCart) {
    // Show skeleton for entire card while adding to cart
    return (
      <div className={`bg-white w-full rounded-lg border p-4 ${removeMaxWidth ? '' : 'max-w-xs'} mx-auto relative`}>
        <Skeleton className="h-[210px] mb-4" />
        <Skeleton className="h-[26px] mb-2" />
        <Skeleton className="h-[20px] w-2/3 mb-4" />
        <Skeleton className="h-[32px] w-1/2 mb-4" />
        <Skeleton className="h-[44px]" />
      </div>
    );
  }

  return (
    <div
      className={`bg-white w-full rounded-lg border self-stretch p-4 ${removeMaxWidth ? "" : "max-w-xs"
        } mx-auto text-left relative gap-1.5 flex flex-col h-full`}
    >
      {/* Wishlist button */}
      <button
        onClick={handleToggleWishlist}
        className={`absolute top-2 right-2 z-10 p-2 rounded-full transition-all ${isInWishlist(product.id)
          ? 'bg-[#F11602] hover:bg-red-600'
          : 'bg-white hover:bg-gray-100 shadow-md'
          }`}
      >
        <Heart
          className={`w-5 h-5 transition-colors ${isInWishlist(product.id) ? 'text-white fill-white' : 'text-[#F11602]'
            }`}
        />
      </button>

      <Link
        href={`/products/${product.id}`}
        className="relative mb-4 cursor-pointer block"
      >
        <Image
          src={imageUrl}
          alt={`${name} image`}
          width={100}
          height={100}
          className="object-contain h-35 sm:h-45 w-full object-top"
          onError={() => setImageError(true)}
        />
      </Link>
      <div className='space-y-2.5'>
      <h3 className="text-[#252323] font-albertsans text-[20px] font-bold leading-[20px] line-clamp-1">
        {name}
      </h3>
      <p className="text-[#777] font-albertsans text-[14px] leading-[15px]  font-medium line-clamp-1">
        {brand?.name || "Brand"}
      </p>
      <div className="flex items-end justify-between gap-2 flex-wrap mt-auto">
        <div className="flex flex-col items-start">
          <div>
            {originalPrice !== displayPrice && (
              <span className="text-[#c1c1c1] font-albertsans text-[16px] font-medium leading-[24px] line-through">
                {originalPrice} Lekë
              </span>
            )}
          </div>
          <span className="text-[#1A66EA] font-albertsans text-[23px] leading-[20px] font-extrabold">
            {displayPrice} Lekë
          </span>
        </div>
        {displayDiscount && (
          <span className="text-[16px] text-[#1A66EA] font-albertsans font-semibold leading-[24px] bg-[#D1E0FB] px-[8px] py-[4px] rounded-[40px]">
            {displayDiscount}
          </span>
        )}
      </div>
      {Number(quantity) > 0 && (
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className="cursor-pointer w-full flex items-center justify-center gap-2 h-[44px] px-4 border border-[#F11602] text-[#F11602] font-semibold rounded-[8px] hover:bg-[#F11602] hover:text-white transition-colors group"
        >
          <ShoppingCartIcon className="w-5 h-5 text-[#F11602] group-hover:text-[#fff]" />
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
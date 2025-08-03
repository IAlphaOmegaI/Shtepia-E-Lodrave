'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
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
  let imageUrl = (typeof image === 'string' && image.trim() !== '') 
    ? image 
    : (image?.url || image?.src || '/product-placeholder.jpg');
  
  // Use placeholder if there's an image error
  if (imageError) {
    imageUrl = '/product-placeholder.jpg';
  } else if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('//')) {
    // Prepend NEXT_PUBLIC_URL if the image is a relative path
    imageUrl = `${process.env.NEXT_PUBLIC_URL || 'http://63.178.242.103'}${imageUrl}`;
  }

  function handleProductClick() {
    router.push(`/products/${product.id}`);
  }

  async function handleAddToCart(e: React.MouseEvent) {
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
      className={`bg-white w-full rounded-lg border p-4 ${
        removeMaxWidth ? "" : "max-w-xs"
      } mx-auto text-left relative flex flex-col h-full`}
    >
      {/* Wishlist button */}
      <button
        onClick={handleToggleWishlist}
        className={`absolute top-2 right-2 z-10 p-2 rounded-full transition-all ${
          isInWishlist(product.id)
            ? 'bg-[#F11602] hover:bg-red-600'
            : 'bg-white hover:bg-gray-100 shadow-md'
        }`}
      >
        <Heart 
          className={`w-5 h-5 transition-colors ${
            isInWishlist(product.id) ? 'text-white fill-white' : 'text-[#F11602]'
          }`}
        />
      </button>
      
      <div
        className="relative h-[210px] mb-4 cursor-pointer"
        onClick={handleProductClick}
      >
        <Image
          src={imageUrl}
          alt={`${name} image`}
          fill
          className="object-contain"
          onError={() => setImageError(true)}
        />
      </div>
      <h3 className="text-[#252323] font-albertsans text-[20px] font-bold leading-[26px] line-clamp-2 min-h-[52px]">
        {name}
      </h3>
      <p className="text-[#777] font-albertsans text-[16px] font-medium leading-[20px] mb-1">
        {brand?.name || "Brand"}
      </p>
      <div className="flex items-end justify-between gap-2 flex-wrap mb-2 mt-auto">
        <div className="flex flex-col items-start pt-[28px]">
          <div className="min-h-[24px]">
            {originalPrice !== displayPrice && (
              <span className="text-[#c1c1c1] font-albertsans text-[16px] font-medium leading-[24px] line-through">
                {originalPrice} Lekë
              </span>
            )}
          </div>
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
          // On hover we should make the icon color red 
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
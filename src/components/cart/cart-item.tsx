'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Counter from '@/components/ui/counter';
import { CloseIcon } from '@/components/icons/close-icon';
import { fadeInOut } from '@/lib/motion/fade-in-out';
import usePrice from '@/lib/use-price';
import { useCart } from '@/store/quick-cart/cart.context';

interface CartItemProps {
  item: any;
}

const CartItem = ({ item }: CartItemProps) => {
  const { removeItem, updateItem } = useCart();
  const [imageError, setImageError] = useState(false);

  const { price } = usePrice({
    amount: item.price,
  });
  
  const { price: itemPrice } = usePrice({
    amount: item.price * item.quantity,
  });

  function handleIncrement(e: any) {
    e.stopPropagation();
    updateItem(item.id, item.quantity + 1);
  }
  
  function handleDecrement(e: any) {
    e.stopPropagation();
    if (item.quantity > 1) {
      updateItem(item.id, item.quantity - 1);
    } else {
      removeItem(item.id);
    }
  }

  const outOfStock = false; // TODO: Implement stock checking

  return (
    <motion.div
      layout
      initial="from"
      animate="to"
      exit="from"
      variants={fadeInOut(0.25)}
      className="relative bg-white border border-gray-200 rounded-lg p-4"
    >
      {/* Close button - top right */}
      <button
        className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
        onClick={() => removeItem(item.id)}
      >
        <span className="sr-only">Remove item</span>
        <CloseIcon className="h-4 w-4" />
      </button>

      <div className="flex items-start space-x-4">
        {/* Product Image */}
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden bg-gray-100 rounded-lg">
          {item?.image && !imageError ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL || 'https://api.shtepialodrave.com'}${item.image}`}
              alt={item.name}
              fill
              sizes="64px"
              className="object-contain"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100">
              <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 font-albertsans text-lg leading-tight">
            {item.name}
          </h3>
          <p className="text-sm text-gray-600 font-albertsans mt-1">
            LEGO
          </p>
          
          {/* Price and Quantity Row */}
          <div className="flex items-center justify-between mt-3">
            {/* Quantity Controls */}
            <div className="flex items-center border border-gray-300 rounded">
              <button
                onClick={handleDecrement}
                className="flex h-8 w-8 items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <span className="text-base font-medium">−</span>
              </button>
              <input
                type="text"
                value={item.quantity}
                readOnly
                className="h-8 w-10 text-center text-sm font-medium text-gray-900 bg-white border-l border-r border-gray-300 focus:outline-none"
              />
              <button
                onClick={handleIncrement}
                className="flex h-8 w-8 items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <span className="text-base font-medium">+</span>
              </button>
            </div>
            
            {/* Price */}
            <div className="text-right">
              {item.basePrice && (
                <div className="text-sm text-gray-400 line-through font-albertsans">
                  {item.basePrice}
                </div>
              )}
              <div className="text-lg font-bold text-blue-600 font-albertsans">
                {itemPrice}
              </div>
              {item.discount && (
                <span className="inline-block mt-1 px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
                  {item.discount}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;
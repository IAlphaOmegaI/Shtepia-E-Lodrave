'use client';

import { useCart } from '@/store/quick-cart/cart.context';
import Link from 'next/link';
import { Routes } from '@/config/routes';
import CartItem from '@/components/cart/cart-item';

export default function CartPage() {
  const { items, total, isEmpty, removeItem, updateItem } = useCart();

  const formatPrice = (amount: number) => new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  if (isEmpty) {
    return (
      <div className="bg-[#FFF8F0] min-h-screen px-4 py-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
          <div className="bg-white rounded-lg shadow-sm p-12">
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <Link 
              href={Routes.products}
              className="inline-block bg-orange-400 text-white px-6 py-3 rounded-lg hover:bg-orange-500 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFF8F0] min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(total)} Lekë</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-600">Calculated at checkout</span>
                </div>
              </div>
              
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-lg font-semibold text-blue-600">
                    {formatPrice(total)} Lekë
                  </span>
                </div>
              </div>
              
              <Link
                href={Routes.checkout}
                className="block w-full bg-orange-400 text-white text-center py-3 px-4 rounded-lg font-medium hover:bg-orange-500 transition-colors"
              >
                Proceed to Checkout
              </Link>
              
              <Link
                href={Routes.products}
                className="block text-center text-sm text-gray-600 hover:text-gray-800 mt-4"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
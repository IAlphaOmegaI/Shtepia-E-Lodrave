'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/store/quick-cart/cart.context';
import { Product } from '@/types/product.types';
import { ArrowDownIcon } from '@/components/icons';
import { HeartIcon } from '@/components/icons/heart';
import Counter from '@/components/ui/counter';
import Button from '@/components/ui/button';

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);
  const [isSpecsOpen, setIsSpecsOpen] = useState(true);
  const { addItem } = useCart();

  // Default images if no gallery is provided
  const defaultImages = [
    '/placeholder.jpg',
    '/placeholder.jpg',
    '/placeholder.jpg',
    '/placeholder.jpg',
    '/placeholder.jpg'
  ];
  
  const images = product.gallery?.length > 0 ? product.gallery : defaultImages;

  const handleAddToCart = () => {
    const priceValue = product.sale_price ? parseFloat(product.sale_price) : parseFloat(product.price);
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      image: product.image || '/placeholder.jpg',
      price: priceValue,
      quantity: quantity,
    });
  };

  // Calculate prices
  const originalPrice = parseFloat(product.price);
  const discountValue = product.discount?.type === 'percentage' 
    ? (originalPrice * parseFloat(product.discount.value)) / 100
    : parseFloat(product.discount?.value || '0');
  const finalPrice = originalPrice - discountValue;
  const discount = product.discount?.value ? parseInt(product.discount.value) : 0;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left side - Image Gallery */}
        <div className="flex gap-4">
          {/* Thumbnail column */}
          <div className="flex flex-col gap-2 w-20">
            {images.slice(0, 5).map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`border-2 rounded-lg overflow-hidden transition-all ${
                  selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                }`}
              >
                <div className="relative w-full aspect-square">
                  <Image
                    src={image || '/placeholder.jpg'}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </button>
            ))}
            {images.length > 5 && (
              <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden">
                <div className="w-full aspect-square bg-gray-100 flex items-center justify-center text-gray-600 font-semibold">
                  5+
                </div>
              </div>
            )}
          </div>

          {/* Main image */}
          <div className="flex-1">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={images[selectedImage] || '/placeholder.jpg'}
                alt={product.name}
                fill
                className="object-cover"
              />
              {discount > 0 && (
                <div className="absolute top-4 right-4 bg-blue-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  {discount}% OFF
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right side - Product Info */}
        <div className="flex flex-col">
          <div className="text-gray-600 text-sm font-medium mb-2">
            {product.brand?.name || 'LEGO'}
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {product.name}
          </h1>

          <div className="mb-6">
            {discount > 0 && (
              <div className="text-gray-400 line-through text-lg">
                {originalPrice.toFixed(2)} Lekë
              </div>
            )}
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-bold text-blue-600">
                {finalPrice.toFixed(2)} Lekë
              </span>
              {discount > 0 && (
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                  {discount}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="flex items-center gap-4 mb-6">
            <Counter
              value={quantity}
              onIncrement={() => setQuantity(q => Math.min(q + 1, product.quantity))}
              onDecrement={() => setQuantity(q => Math.max(1, q - 1))}
              variant="big"
            />
            
            <span className="text-gray-600 text-sm">
              ({product.quantity} units available)
            </span>
          </div>

          <div className="flex gap-4 mb-8">
            <Button
              onClick={handleAddToCart}
              disabled={product.quantity === 0}
              className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Shto në shportë
            </Button>
            
            <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <HeartIcon className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Shipping Info */}
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <span>Ships nationwide</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Estimated delivery: 3-5 business days</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Shipping cost calculated at checkout</span>
            </div>
          </div>
        </div>
      </div>

      {/* About this item section */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6">About this item</h2>
        
        {/* Description */}
        <div className="border-t border-gray-200">
          <button
            className="w-full py-4 flex items-center justify-between text-left"
            onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
          >
            <span className="font-semibold text-gray-900">Description</span>
            <ArrowDownIcon
              className={`w-5 h-5 text-gray-500 transition-transform ${
                isDescriptionOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
          
          {isDescriptionOpen && (
            <div className="pb-6 text-gray-600 space-y-4">
              <p>
                {product.description || 'With 90 years of experience, Lego is one of the world\'s leading manufacturers of play materials. For the brand, play is vital to the development of all children, helping them thrive in a complex and challenging world. Its main goal is to inspire and develop the builders of tomorrow, as well as generating a positive impact on society and the planet. Lego sets provide the possibility of continuous discovery by offering the magical opportunity to create something new every time.'}
              </p>
              <div>
                <p className="font-semibold mb-2">Easy transport and storage</p>
                <p>- Its boxed packaging allows you to take your set everywhere comfortably and conveniently. It is useful not only for transporting it, but also for easy storage anywhere in your home.</p>
              </div>
              <div>
                <p className="font-semibold mb-2">Use under supervision</p>
                <p>Recommended for use from {product.age_range || 4} years old. Please supervise young children to avoid accidents.</p>
              </div>
              <div>
                <p className="font-semibold mb-2">Legal notice</p>
                <p>• Recommended for ages {product.age_range || 4} and up.</p>
              </div>
            </div>
          )}
        </div>

        {/* Specifications */}
        <div className="border-t border-gray-200">
          <button
            className="w-full py-4 flex items-center justify-between text-left"
            onClick={() => setIsSpecsOpen(!isSpecsOpen)}
          >
            <span className="font-semibold text-gray-900">Specifications</span>
            <ArrowDownIcon
              className={`w-5 h-5 text-gray-500 transition-transform ${
                isSpecsOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
          
          {isSpecsOpen && (
            <div className="pb-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="font-semibold text-gray-700">Brand:</span>
                <span className="text-gray-600">{product.brand?.name || 'Lego'}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="font-semibold text-gray-700">Height:</span>
                <span className="text-gray-600">{product.height ? `${product.height} cm` : '13 cm'}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="font-semibold text-gray-700">Line:</span>
                <span className="text-gray-600">{product.categories?.[0]?.name || 'Gabby\'s Dollhouse'}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="font-semibold text-gray-700">Broad:</span>
                <span className="text-gray-600">{product.width ? `${product.width} cm` : '11 cm'}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="font-semibold text-gray-700">Model:</span>
                <span className="text-gray-600">{product.code || '10787'}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="font-semibold text-gray-700">Long:</span>
                <span className="text-gray-600">{product.length ? `${product.length} cm` : '17 cm'}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="font-semibold text-gray-700">Number of pieces:</span>
                <span className="text-gray-600">130</span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="font-semibold text-gray-700">Materials:</span>
                <span className="text-gray-600">Plastic</span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="font-semibold text-gray-700">Presentation:</span>
                <span className="text-gray-600">Box</span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="font-semibold text-gray-700">Minimum recommended age:</span>
                <span className="text-gray-600">{product.age_range ? `${product.age_range} years` : '4 years'}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
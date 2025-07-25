'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Button from '../ui/button';
import { ShoppingCartIcon } from '../icons/shopping-cart';
import ProductCarousel from '../products/product-carousel';

const CATEGORIES = ['Lodra', 'Veshje', 'Aksesorë'];

const dummyProducts = [
  {
    id: 1,
    name: "LEGO Kitty Fairy's Garden",
    description:
      'Blueberries are perennial flowering plants with blue or purple berries. They are classified in the section Cyanococcus within the genus Vaccinium. Vaccinium also includes cranberries, bilberries, huckleberries and Madeira blueberries. Commercial blueberries—both wild and cultivated —are all native to North America.',
    price: '3.700 Lekë',
    basePrice: '9.700 Lekë',
    discount: '60% OFF',
    image: '/icons/newCollection-card.svg',
    slug: 'lego-kitty-fairys-garden',
    language: 'en',
    translated_languages: ['en'],
    product_type: 'simple',
    sale_price: 38.59,
    max_price: 42,
    min_price: 42,
    status: 'publish',
    quantity: 30,
    unit: '1pc(s)',
    sku: '1003',
    sold_quantity: 0,
    in_flash_sale: 0,
    visibility: 'visibility_public',
  },
  {
    id: 2,
    name: "LEGO Kitty Fairy's Garden",
    description:
      'Blueberries are perennial flowering plants with blue or purple berries. They are classified in the section Cyanococcus within the genus Vaccinium. Vaccinium also includes cranberries, bilberries, huckleberries and Madeira blueberries. Commercial blueberries—both wild and cultivated —are all native to North America.',
    price: '3.700 Lekë',
    basePrice: '9.700 Lekë',
    discount: '60% OFF',
    image: '/icons/newCollection-card.svg',
    slug: 'lego-kitty-fairys-garden',
    language: 'en',
    translated_languages: ['en'],
    product_type: 'simple',
    sale_price: 38.59,
    max_price: 42,
    min_price: 42,
    status: 'publish',
    quantity: 30,
    unit: '1pc(s)',
    sku: '1003',
    sold_quantity: 0,
    in_flash_sale: 0,
    visibility: 'visibility_public',
  },
  {
    id: 3,
    name: "LEGO Kitty Fairy's Garden",
    description:
      'Blueberries are perennial flowering plants with blue or purple berries. They are classified in the section Cyanococcus within the genus Vaccinium. Vaccinium also includes cranberries, bilberries, huckleberries and Madeira blueberries. Commercial blueberries—both wild and cultivated —are all native to North America.',
    price: '3.700 Lekë',
    basePrice: '9.700 Lekë',
    discount: '60% OFF',
    image: '/icons/newCollection-card.svg',
    slug: 'lego-kitty-fairys-garden',
    language: 'en',
    translated_languages: ['en'],
    product_type: 'simple',
    sale_price: 38.59,
    max_price: 42,
    min_price: 42,
    status: 'publish',
    quantity: 30,
    unit: '1pc(s)',
    sku: '1003',
    sold_quantity: 0,
    in_flash_sale: 0,
    visibility: 'visibility_public',
  },
  {
    id: 4,
    name: "LEGO Kitty Fairy's Garden",
    description:
      'Blueberries are perennial flowering plants with blue or purple berries. They are classified in the section Cyanococcus within the genus Vaccinium. Vaccinium also includes cranberries, bilberries, huckleberries and Madeira blueberries. Commercial blueberries—both wild and cultivated —are all native to North America.',
    price: '3.700 Lekë',
    basePrice: '9.700 Lekë',
    discount: '60% OFF',
    image: '/icons/newCollection-card.svg',
    slug: 'lego-kitty-fairys-garden',
    language: 'en',
    translated_languages: ['en'],
    product_type: 'simple',
    sale_price: 38.59,
    max_price: 42,
    min_price: 42,
    status: 'publish',
    quantity: 30,
    unit: '1pc(s)',
    sku: '1003',
    sold_quantity: 0,
    in_flash_sale: 0,
    visibility: 'visibility_public',
  },
  {
    id: 5,
    name: "LEGO Kitty Fairy's Garden",
    description:
      'Blueberries are perennial flowering plants with blue or purple berries. They are classified in the section Cyanococcus within the genus Vaccinium. Vaccinium also includes cranberries, bilberries, huckleberries and Madeira blueberries. Commercial blueberries—both wild and cultivated —are all native to North America.',
    price: '3.700 Lekë',
    basePrice: '9.700 Lekë',
    discount: '60% OFF',
    image: '/icons/newCollection-card.svg',
    slug: 'lego-kitty-fairys-garden',
    language: 'en',
    translated_languages: ['en'],
    product_type: 'simple',
    sale_price: 38.59,
    max_price: 42,
    min_price: 42,
    status: 'publish',
    quantity: 30,
    unit: '1pc(s)',
    sku: '1003',
    sold_quantity: 0,
    in_flash_sale: 0,
    visibility: 'visibility_public',
  },
];

const breakpoints = {
  320: { slidesPerView: 1, spaceBetween: 10 },
  580: { slidesPerView: 2, spaceBetween: 16 },
  1024: { slidesPerView: 3, spaceBetween: 24 },
  1440: { slidesPerView: 4, spaceBetween: 24 },
};

const BestSellingProducts = () => {
  const [activeTab, setActiveTab] = useState('Lodra');

  return (
    <div className="w-full bg-[#fff] pb-12">
      <div className="bg-[#FFCB47] pb-20">
        <div
          className="w-full bg-no-repeat bg-cover bg-center flex justify-center pt-20 pb-20"
          style={{ backgroundImage: "url('/icons/confetti-section.svg')" }}
        >
          <h1
            className="text-white text-center font-grandstander font-extrabold text-[50px] leading-[60px] whitespace-pre-line"
            style={{
              WebkitTextStrokeWidth: '4px',
              WebkitTextStrokeColor: '#F11602',
            }}
          >
            Produktet më {'\n'}të kërkuara
          </h1>
        </div>

        <div className="flex justify-center gap-4 mb-10 mt-[-41px]">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={
                'px-6 py-2 rounded-t-[16px] font-semibold transition-colors border-t border-l border-r ' +
                (activeTab === cat
                  ? 'bg-[#FFCB47] text-[#000] border-[#FFCB47] border-none'
                  : 'bg-[#FFF] text-[#777] hover:bg-white')
              }
            >
              {cat}
            </button>
          ))}
        </div>

        <ProductCarousel products={dummyProducts} breakpoints={breakpoints} />
      </div>
      <Image
        src={'/icons/yellow-wave.svg'}
        alt="Wave"
        width={1920}
        height={1080}
        className="w-full h-auto"
      ></Image>
    </div>
  );
};

export default BestSellingProducts;
'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Button from '../ui/button';
import { ShoppingCartIcon } from '../icons/shopping-cart';
import ProductCarousel from '../products/product-carousel';
import { api } from '@/services/api';
import type { PopularProductCategory, PopularProduct, Product } from '@/types';
import { useQuery } from '@tanstack/react-query';

// Function to convert PopularProduct to Product format for ProductCard compatibility
const convertToProductFormat = (popularProduct: PopularProduct): Product => {
  return {
    id: popularProduct.id,
    name: popularProduct.name,
    code: popularProduct.code,
    slug: popularProduct.slug,
    description: popularProduct.description,
    price: popularProduct.price,
    sale_price: popularProduct.sale_price,
    min_price: popularProduct.price,
    max_price: popularProduct.price,
    discount: null,
    image: popularProduct.image || '/icons/newCollection-card.svg',
    gallery: [],
    shop: popularProduct.shop,
    categories: [],
    brand: popularProduct.brand,
    tags: [],
    age_range: 0,
    gender: 'unisex',
    size: null,
    loyalty_points: 0,
    quantity: popularProduct.quantity,
    availability: popularProduct.availability,
    stickers: [],
    language: 'sq',
    translated_languages: ['sq'],
    product_type: 'simple',
    unit: '1pc(s)',
    sku: popularProduct.code,
    sold_quantity: 0,
    in_flash_sale: false,
    visibility: 'visibility_public',
    status: popularProduct.status,
    in_stock: popularProduct.in_stock,
    height: null,
    width: null,
    length: null,
    variations: [],
    variation_options: [],
    related_products: [],
    created_at: popularProduct.created_at,
    updated_at: popularProduct.created_at,
    average_rating: 0,
    total_reviews: 0,
    ratings: [],
    average_product_rating: 0,
  };
};

const breakpoints = {
  320: { slidesPerView: 1, spaceBetween: 10 },
  580: { slidesPerView: 2, spaceBetween: 16 },
  1024: { slidesPerView: 3, spaceBetween: 24 },
  1440: { slidesPerView: 4, spaceBetween: 24 },
};

// Number of categories to display
const MAX_CATEGORIES_TO_DISPLAY = 3;

const BestSellingProducts = () => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [popularCategories, setPopularCategories] = useState<PopularProductCategory[]>([]);
  
  const { data, isLoading } = useQuery({
    queryKey: ['popularProducts'],
    queryFn: () => api.products.getPopular(),
  });

  useEffect(() => {
    if (data?.popular_products) {
      setPopularCategories(data.popular_products);
      // Set first category as active if not already set
      if (!activeTab && data.popular_products.length > 0) {
        setActiveTab(data.popular_products[0].category.name);
      }
    }
  }, [data, activeTab]);

  // Get products for active tab (only from displayed categories)
  const displayedCategories = popularCategories.slice(0, MAX_CATEGORIES_TO_DISPLAY);
  const activeProducts = displayedCategories.find(
    (cat) => cat.category.name === activeTab
  )?.products || [];

  // Convert products to the format expected by ProductCarousel
  const formattedProducts = activeProducts.map(convertToProductFormat);

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

        <div className="flex justify-center gap-4 mb-10 mt-[-41px] flex-wrap">
          {popularCategories.slice(0, MAX_CATEGORIES_TO_DISPLAY).map((cat) => (
            <button
              key={cat.category.id}
              onClick={() => setActiveTab(cat.category.name)}
              className={
                'px-8 py-3 rounded-[20px] font-albertsans font-semibold text-[18px] transition-all duration-200 capitalize ' +
                (activeTab === cat.category.name
                  ? 'bg-[#FFF] text-[#000] shadow-lg transform scale-105'
                  : 'bg-[#FFE4A1] text-[#666] hover:bg-[#FFD98F] hover:text-[#333]')
              }
            >
              {cat.category.name === 'veshje' ? 'Veshje' : 
               cat.category.name === 'lodra' ? 'Lodra' : 
               cat.category.name === 'aksesore' ? 'Aksesorë' :
               cat.category.name === 'pantallona' ? 'Pantallona' :
               cat.category.name === 'puzzle' ? 'Puzzle' :
               cat.category.name === 'fustane' ? 'Fustane' :
               cat.category.name.charAt(0).toUpperCase() + cat.category.name.slice(1)}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F11602]"></div>
          </div>
        ) : (
          <ProductCarousel products={formattedProducts} breakpoints={breakpoints} />
        )}
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
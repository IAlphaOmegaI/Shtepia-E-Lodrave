'use client';
import { api } from '@/services/api';
import type { PopularProduct, PopularProductCategory, Product } from '@/types';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import ProductCarousel from '../products/product-carousel';
import Confetti1Image from '../../../public/home/confetti-1.png';
import Confetti2Image from '../../../public/home/confetti-2.png';
import Confetti1MobileImage from '../../../public/home/confetti-1-mobile.png';
import Confetti2MobileImage from '../../../public/home/confetti-2-mobile.png';

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
  320: { slidesPerView: 2, spaceBetween: 10 },
  580: { slidesPerView: 3, spaceBetween: 16 },
  1024: { slidesPerView: 4, spaceBetween: 12 },
  1920: { slidesPerView: 5, spaceBetween: 10 },
};

// Number of categories to display
const MAX_CATEGORIES_TO_DISPLAY = 4;

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
    <div className="w-full mb-6 md:mb-12">
      <div className="bg-[#FFCB47] pb-6 md:pb-12 flex flex-col gap-6 md:gap-8 relative overflow-hidden">
        {/* Mobile: decorative confetti in top corners */}
        <Image
          src={Confetti1MobileImage}
          alt=""
          aria-hidden
          className="sm:hidden absolute h-[90px] w-[70px] -top-1 pointer-events-none"
        />
        <Image
          src={Confetti2MobileImage}
          alt=""
          aria-hidden
          className="sm:hidden absolute -top-1 right-0 h-[90px] w-[70px] pointer-events-none"
        />

        {/* Header: centered on mobile, three-column on sm+ */}
        <div className="flex justify-center sm:justify-between overflow-hidden pt-8 sm:pt-16 lg:pt-0">
          <Image
            src={Confetti1Image}
            alt=""
            aria-hidden
            className="hidden sm:block max-w-[420px] shrink-0"
          />
          <div className="mt-auto flex flex-col items-center mx-0 sm:mx-4">
            <h1
              className="text-white text-center font-grandstander grow text-[32px] xs:text-[36px] sm:text-[40px] md:text-[50px] font-black leading-tight sm:leading-[60px] max-w-[90vw] sm:max-w-none"
              style={{
                WebkitTextStrokeWidth: '2.5px',
                WebkitTextStrokeColor: 'red',
              }}
            >
              Produktet<br /> popullore
            </h1>
          </div>
          <Image
            src={Confetti2Image}
            alt=""
            aria-hidden
            className="hidden sm:block max-w-[420px] shrink-0"
          />
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
        src="/icons/yellow-wave.svg"
        alt=""
        aria-hidden
        width={1920}
        height={1080}
        className="w-full h-auto"
      />
    </div>
  );
};

export default BestSellingProducts;
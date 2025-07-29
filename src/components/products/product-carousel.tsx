'use client';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import ProductCard from './product-card';
import { ArrowNext, ArrowPrev } from '../icons';
import Image from 'next/image';
import type { Product } from '@/types';

type CarouselProps = {
  products: Product[];
  breakpoints?: any;
};

const ProductCarousel: React.FC<CarouselProps> = ({
  products,
  breakpoints,
}) => {
  return (
    <div className="relative mx-5">
      <Swiper
        modules={[Navigation]}
        navigation={{
          nextEl: '.next-button',
          prevEl: '.prev-button',
        }}
        breakpoints={breakpoints}
        className="py-5"
      >
        {products.map((item) => (
          <SwiperSlide key={item.id}>
            <ProductCard product={item} />
          </SwiperSlide>
        ))}
      </Swiper>

      <div
        className="prev-button absolute top-2/4 z-10 -mt-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#F11602] border-opacity-70 bg-light text-[#F11602] shadow-xl transition-all duration-200 hover:border-[#F11602] hover:bg-[#F11602] hover:text-light ltr:-left-4 rtl:-right-4 md:-mt-5 md:h-9 md:w-9 ltr:md:-left-5 rtl:md:-right-5"
        role="button"
      >
        <ArrowPrev width={18} height={18} />
      </div>
      <div
        className="next-button absolute top-2/4 z-10 -mt-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#F11602] border-opacity-70 bg-light text-[#F11602] shadow-xl transition-all duration-200 hover:border-[#F11602] hover:bg-[#F11602] hover:text-light ltr:-right-4 rtl:-left-4 md:-mt-5 md:h-9 md:w-9 ltr:md:-right-5"
        role="button"
      >
        <ArrowNext width={18} height={18} />
      </div>
    </div>
  );
};

export default ProductCarousel;
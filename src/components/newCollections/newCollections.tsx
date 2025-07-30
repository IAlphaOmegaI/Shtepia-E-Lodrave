'use client';

import React from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { ArrowNext, ArrowPrev } from '@/components/icons';
import { useRouter } from 'next/navigation';
import ProductCard from '../products/product-card';
import type { Product } from '@/types';
import { NEW_COLLECTIONS_CATEGORY_ID, NEW_COLLECTIONS_CATEGORY_SLUG } from '@/lib/constants';
import { Routes } from '@/config/routes';

interface NewCollectionsProps {
  products: Product[];
}

const breakpoints = {
  320: { slidesPerView: 1, spaceBetween: 10 },
  580: { slidesPerView: 2, spaceBetween: 16 },
  1024: { slidesPerView: 3, spaceBetween: 12 },
  1440: { slidesPerView: 4, spaceBetween: 12 },
  1920: { slidesPerView: 5, spaceBetween: 10 },
};

const NewCollections: React.FC<NewCollectionsProps> = ({ products }) => {
  const router = useRouter();
  
  // Ensure we have at most 20 products
  const displayProducts = products.slice(0, 20);
  return (
    <div className="bg-[#fff]">
      <div
        className="bg-cover bg-center bg-no-repeat px-5 py-[160px] text-center"
        style={{ backgroundImage: "url('/icons/Sectionclouds.svg')" }}
      >
        <h1
          className="text-[#F11602] font-grandstander text-[40px] md:text-[50px] font-black leading-[60px]"
          style={{
            WebkitTextStrokeWidth: "4px",
            WebkitTextStrokeColor: "#FFF",
          }}
        >
          Koleksionet e Reja
        </h1>
        <p className="text-[#555] text-[20px] md:text-[28px] font-grandstander font-medium leading-[38px] mt-2">
          Zbulo koleksionet e reja
        </p>

        <div className="mx-auto my-5 w-72 h-20 relative">
          <Image
            src="/icons/newCollections.svg"
            alt="New Collection"
            width={560}
            height={58}
          />
        </div>

        <div className="relative pl-32 pr-32">
          <Swiper
            modules={[Navigation]}
            navigation={{
              nextEl: ".next",
              prevEl: ".prev",
            }}
            breakpoints={breakpoints}
            className="py-5"
          >
            {displayProducts.map((item) => (
              <SwiperSlide key={item.id}>
                <ProductCard product={item} />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="mt-[48px] flex justify-center items-center ">
            <button
              className="flex items-center justify-center gap-[10px] h-[52px] px-4 rounded-[8px] bg-[#1A66EA] shadow-[0px_4px_16px_rgba(19,30,69,0.10)]"
              onClick={() => router.push(Routes.category(NEW_COLLECTIONS_CATEGORY_SLUG))}
            >
              <span className="text-white text-[18px] leading-[24px] font-[600] font-albertsans text-center">
                Shiko të gjitha
              </span>
              <Image
                src="/icons/arrow-right.svg"
                alt="Arrow Right"
                width={20}
                height={20}
              />
            </button>
          </div>
          {/* Navigation Buttons */}
          <div
            className="prev swiperButtonPrev absolute top-1/2 z-10 -mt-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#F11602] border-opacity-70 bg-light text-[#F11602] shadow-xl transition-all duration-200 hover:border-[#F11602] hover:bg-[#F11602] hover:text-light ltr:-left-4 rtl:-right-4 md:-mt-5 md:h-9 md:w-9 ltr:md:-left-5"
            role="button"
          >
            <ArrowPrev width={18} height={18} />
          </div>
          <div
            className="next swiperButtonNext absolute top-1/2 z-10 -mt-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#F11602] border-opacity-70 bg-light text-[#F11602] shadow-xl transition-all duration-200 hover:border-[#F11602] hover:bg-[#F11602] hover:text-light ltr:-right-4 rtl:-left-4 md:-mt-5 md:h-9 md:w-9 ltr:md:-right-5"
            role="button"
          >
            <ArrowNext width={18} height={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewCollections;
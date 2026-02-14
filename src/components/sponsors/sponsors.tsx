'use client';

import React from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { useRouter } from 'next/navigation';
import { FilteredRoutes } from '@/config/routes';
import type { Brand } from '@/types';
import { ArrowNext, ArrowPrev } from '../icons';

const BASE_IMAGE_URL = 'https://api.shtepialodrave.com';

interface SponsorsProps {
  brands: Brand[];
}

const breakpoints = {
  320: { slidesPerView: 1, spaceBetween: 20 },
  640: { slidesPerView: 3, spaceBetween: 20 },
  768: { slidesPerView: 4, spaceBetween: 30 },
  1024: { slidesPerView: 5, spaceBetween: 30 },
  1280: { slidesPerView: 6, spaceBetween: 40 },
};

const Sponsors: React.FC<SponsorsProps> = ({ brands }) => {
  const router = useRouter();

  const handleBrandClick = (brandId: number) => {
    router.push(FilteredRoutes.productsByBrand(brandId));
  };

  if (!brands || brands.length === 0) {
    return null;
  }

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className='flex justify-between items-center mb-12'>
          <h2 className="text-3xl sm:absolute z-0 inset-x-0 mx-auto font-bold text-center text-gray-800">
            Brendet Partnere
          </h2>
          <div className='flex z-10 ml-auto gap-1'>
            <button
              className="prev-button-sponsors hover:text-[#FFCB47] bg-white flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#F11602] border-opacity-70 bg-light text-[#F11602] shadow-xl transition-all duration-200 hover:border-[#F11602] hover:bg-[#F11602] hover:text-light md:h-9 md:w-9"
            >
              <ArrowPrev width={18} height={18} />
            </button>
            <button
              className="next-button-sponsors bg-white hover:text-[#FFCB47] flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#F11602] border-opacity-70 bg-light text-[#F11602] shadow-xl transition-all duration-200 hover:border-[#F11602] hover:bg-[#F11602] hover:text-light md:h-9 md:w-9"
            >
              <ArrowNext width={18} height={18} />
            </button>
          </div>
        </div>

        <Swiper
          modules={[Navigation, Autoplay]}
          navigation={{
            nextEl: ".next-button-sponsors",
            prevEl: ".prev-button-sponsors",
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          loop={true}
          breakpoints={breakpoints}
          className="brands-swiper"
        >
          {brands.filter(brand => brand.logo).map((brand) => (
            <SwiperSlide key={brand.id}>
              <div
                className="flex items-center justify-center p-8  cursor-pointer h-32"
                onClick={() => handleBrandClick(brand.id)}
              >
                {brand.logo ? (
                  <Image
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    width={120}
                    height={60}
                    className="object-contain"
                  />
                ) : (
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-700">
                      {brand.name}
                    </h3>
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Sponsors;
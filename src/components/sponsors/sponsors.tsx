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

interface SponsorsProps {
  brands: Brand[];
}

const breakpoints = {
  320: { slidesPerView: 2, spaceBetween: 20 },
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
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Brendet Partnere
        </h2>
        
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          loop={true}
          breakpoints={breakpoints}
          className="brands-swiper"
        >
          {brands.map((brand) => (
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
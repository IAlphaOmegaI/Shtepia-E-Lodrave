'use client';

import React, { useId } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { ArrowNext, ArrowPrev } from '../icons';

/** Each banner image links to a brand page. Edit brandSlug to match your brands. */
const BANNER_ITEMS: { src: string; link: string; alt: string }[] = [
  { src: '/home/home-banner/1.svg', link: '/category/oferta', alt: 'Banner 1' },
  { src: '/home/home-banner/2.svg', link: '/brands/cool-club', alt: 'Banner 2' },
  { src: '/home/home-banner/3.svg', link: '/brands/brb', alt: 'Banner 3' },
  { src: '/home/home-banner/4.svg', link: '/category/veshje', alt: 'Banner 4' },
  { src: '/home/home-banner/5.svg', link: '/brands/lego', alt: 'Banner 5' },
];

const LodraBanner = () => {
  const id = useId().replace(/:/g, '');

  return (
    <div className="relative w-full overflow-hidden bg-[#fff9f0]">
  <Link
              href={"/category/oferta"}
              className="block relative w-full min-h-[200px] sm:min-h-[280px] md:min-h-[340px] lg:min-h-[500px]"
            >
              <Image
                src={"/home/home-banner/1.svg"}
                alt={"Banner 1"}
                fill
                className="object-cover object-bottom"
                sizes="100vw"
                priority
              />
            </Link>

      {/* Carousel */}
      {/* <Swiper
        modules={[Navigation, Autoplay]}
        navigation={{
          nextEl: `.lodra-banner-next-${id}`,
          prevEl: `.lodra-banner-prev-${id}`,
        }}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        slidesPerView={1}
        spaceBetween={0}
        className="lodra-banner-swiper !overflow-hidden"
      >
        {BANNER_ITEMS.map((item, index) => (
          <SwiperSlide key={`${item.src}-${index}`}>
            <Link
              href={item.link}
              className="block relative w-full min-h-[200px] sm:min-h-[280px] md:min-h-[340px] lg:min-h-[500px]"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover object-bottom"
                sizes="100vw"
                priority={index === 0}
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper> */}

      {/* Absolute prev/next – same style as product carousel */}
      {/* <div
        className={`lodra-banner-prev-${id} absolute top-2/5 z-10 hidden md:flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#F11602] border-opacity-70 bg-white text-[#F11602] shadow-xl transition-all duration-200 hover:border-[#F11602] hover:bg-[#F11602] hover:text-white ltr:left-4 rtl:-right-4 md:h-9 md:w-9 ltr:md:left-5 rtl:md:right-5`}
        role="button"
        aria-label="Previous slide"
      >
        <ArrowPrev width={18} height={18} />
      </div>
      <div
        className={`lodra-banner-next-${id} absolute top-2/5 z-10 hidden md:flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#F11602] border-opacity-70 bg-white text-[#F11602] shadow-xl transition-all duration-200 hover:border-[#F11602] hover:bg-[#F11602] hover:text-white ltr:right-4 rtl:-left-4 md:h-9 md:w-9 ltr:md:right-5 rtl:md:left-5`}
        role="button"
        aria-label="Next slide"
      >
        <ArrowNext width={18} height={18} />
      </div> */}
    </div>
  );
};

export default LodraBanner;

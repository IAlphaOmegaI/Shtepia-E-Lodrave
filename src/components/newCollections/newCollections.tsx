'use client';
import { Routes } from '@/config/routes';
import { NEW_COLLECTIONS_CATEGORY_SLUG } from '@/lib/constants';
import type { Product } from '@/types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import 'swiper/css';
import 'swiper/css/navigation';
import Confetti1Image from '../../../public/home/new-collections-1.png';
import Confetti2Image from '../../../public/home/new-collections-2.png';
import Confetti1MobileImage from '../../../public/home/new-collections-1-mobile.png';
import Confetti2MobileImage from '../../../public/home/new-collections-2-mobile.png';
import ProductCarousel from '../products/product-carousel';

interface NewCollectionsProps {
  products: Product[];
}

const breakpoints = {
  320: { slidesPerView: 2, spaceBetween: 10 },
  580: { slidesPerView: 3, spaceBetween: 16 },
  1024: { slidesPerView: 4, spaceBetween: 12 },
  1920: { slidesPerView: 5, spaceBetween: 10 },
};

const NewCollections = ({ products }: NewCollectionsProps) => {
  const router = useRouter();

  return (
    <div>
      <div className="bg-[#FFCB47] pb-6 md:pb-12 flex flex-col gap-6 md:gap-8 relative overflow-hidden">
        {/* Mobile: decorative confetti in top corners */}
        <Image
          src={Confetti1MobileImage}
          alt=""
          aria-hidden
          className="sm:hidden absolute -top-1 size-24 object-contain pointer-events-none"
        />
        <Image
          src={Confetti2MobileImage}
          alt=""
          aria-hidden
          className="sm:hidden absolute -top-1 right-0 size-24 object-contain pointer-events-none"
        />

        {/* Header: centered on mobile, three-column on sm+ */}
        <div className="flex justify-center sm:justify-between overflow-hidden pt-6 sm:pt-16 lg:pt-0">
          <Image
            src={Confetti1Image}
            alt=""
            aria-hidden
            className="hidden sm:block max-w-[300px] object-contain shrink-0"
          />
          <div className="mt-auto flex flex-col items-center mx-0 sm:mx-4">
            <h1
              className="text-red-500 text-center font-grandstander grow text-[32px] xs:text-[36px] sm:text-[40px] md:text-[50px] font-black leading-tight sm:leading-[60px] max-w-[90vw] sm:max-w-none"
              style={{
                WebkitTextStrokeWidth: '2.5px',
                WebkitTextStrokeColor: 'white',
              }}
            >
              Koleksionet
              <br  className='sm:hidden'/>
              e Reja
            </h1>
            <p className="text-[#555] text-base sm:text-[20px] md:text-[28px] font-grandstander font-medium leading-snug sm:leading-[38px] mt-1 sm:mt-2 text-center hidden sm:block">
              Zbulo koleksionet e reja
            </p>
          </div>
          <Image
            src={Confetti2Image}
            alt=""
            aria-hidden
            className="hidden sm:block max-w-[300px] shrink-0"
          />
        </div>

        <ProductCarousel products={products} breakpoints={breakpoints} />

        <div className="flex justify-center items-center px-4">
          <button
            className="flex items-center justify-center gap-2 sm:gap-[10px] h-12 sm:h-[52px] px-4 rounded-[8px] bg-[#1A66EA] shadow-[0px_4px_16px_rgba(19,30,69,0.10)]"
            onClick={() =>
              router.push(Routes.category(NEW_COLLECTIONS_CATEGORY_SLUG))
            }
          >
            <span className="text-white text-base sm:text-[18px] leading-[24px] font-[600] font-albertsans text-center">
              Shiko të gjitha
            </span>
            <Image
              src="/icons/arrow-right.svg"
              alt=""
              width={20}
              height={20}
            />
          </button>
        </div>
      </div>

      {/* Desktop cloud wave */}
      <Image
        src="/home/new-collections-cloud.png"
        alt=""
        aria-hidden
        width={1920}
        height={1080}
        className="w-full h-auto hidden md:block"
      />
      {/* Mobile cloud wave */}
      <Image
        src="/home/new-collections-cloud-mobile.png"
        alt=""
        aria-hidden
        width={768}
        height={120}
        className="w-full h-auto md:hidden"
      />
    </div>
  );
};

export default NewCollections;
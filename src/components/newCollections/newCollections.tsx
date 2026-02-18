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
import ProductCarousel from '../products/product-carousel';

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

// const NewCollections: React.FC<NewCollectionsProps> = ({ products }) => {
//   const router = useRouter();

//   // Ensure we have at most 20 products
//   const displayProducts = products.slice(0, 20);
//   return (
//     <div className="bg-[#fff]">
//       <div
//         className="bg-cover bg-center bg-no-repeat px-5 py-[160px] text-center"
//         style={{ backgroundImage: "url('/icons/Sectionclouds.svg')" }}
//       >
//         <h1
//           className="text-[#F11602] font-grandstander text-[40px] md:text-[50px] font-black leading-[60px]"
//           style={{
//             WebkitTextStrokeWidth: "4px",
//             WebkitTextStrokeColor: "#FFF",
//           }}
//         >
//           Koleksionet e Reja
//         </h1>
//         <p className="text-[#555] text-[20px] md:text-[28px] font-grandstander font-medium leading-[38px] mt-2">
//           Zbulo koleksionet e reja
//         </p>

//         {/* <div className="mx-auto my-5 w-72 h-20 relative">
//           <Image
//             src="/icons/newCollections.svg"
//             alt="New Collection"
//             width={560}
//             height={58}
//           />
//         </div> */}

//         <div className="relative pl-0 pr-0 md:pl-32 pt-8 md:pr-32">
//           <Swiper
//             modules={[Navigation]}
//             navigation={{
//               nextEl: ".next",
//               prevEl: ".prev",
//             }}
//             breakpoints={breakpoints}
//             className="py-5 swiper-equal-height"
//           >
//             {displayProducts.map((item) => (
//               <SwiperSlide key={item.id}>
//                 <ProductCard product={item} />
//               </SwiperSlide>
//             ))}
//           </Swiper>
//           <div className="mt-[48px] flex justify-center items-center ">
//             <button
//               className="flex items-center justify-center gap-[10px] h-[52px] px-4 rounded-[8px] bg-[#1A66EA] shadow-[0px_4px_16px_rgba(19,30,69,0.10)]"
//               onClick={() => router.push(Routes.category(NEW_COLLECTIONS_CATEGORY_SLUG))}
//             >
//               <span className="text-white text-[18px] leading-[24px] font-[600] font-albertsans text-center">
//                 Shiko të gjitha
//               </span>
//               <Image
//                 src="/icons/arrow-right.svg"
//                 alt="Arrow Right"
//                 width={20}
//                 height={20}
//               />
//             </button>
//           </div>
//           {/* Navigation Buttons */}
//           <div
//             className="prev absolute hover:text-[#FFCB47] bg-white top-2/4 z-10 -mt-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#F11602] border-opacity-70 bg-light text-[#F11602] shadow-xl transition-all duration-200 hover:border-[#F11602] hover:bg-[#F11602] hover:text-light ltr:-left-4 rtl:-right-4 md:-mt-5 md:h-9 md:w-9 ltr:md:-left-5 rtl:md:-right-5"
//             role="button"
//           >
//             <ArrowPrev width={18} height={18} />
//           </div>
//           <div
//             className="next absolute top-2/4 z-10 bg-white hover:text-[#FFCB47] -mt-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#F11602] border-opacity-70 bg-light text-[#F11602] shadow-xl transition-all duration-200 hover:border-[#F11602] hover:bg-[#F11602] hover:text-light ltr:-right-4 rtl:-left-4 md:-mt-5 md:h-9 md:w-9 ltr:md:-right-5"
//             role="button"
//           >
//             <ArrowNext width={18} height={18} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };


const NewCollections=({products}:NewCollectionsProps)=>{
  const router = useRouter();

  return  (<div className="w-full bg-[#FFFAEE] pb-12">
  <div className="bg-[#FFCB47] pb-20 flex flex-col gap-8">

    <div className="flex justify-center sm:justify-between overflow-hidden pt-16 lg:pt-0 px-2 sm:px-0">
      <Image
        src={Confetti1Image}
        alt="New Products 1"
        className="hidden sm:block max-w-[450px] shrink-0"
      />
      <div className='mt-auto flex flex-col items-center pb-10 sm:pb-0 mx-2 sm:mx-4'>
      <h1
        className="text-white text-center font-grandstander grow text-[40px] md:text-[50px] font-black leading-tight sm:leading-[60px]"
        style={{
          WebkitTextStrokeWidth: "3px",
          WebkitTextStrokeColor: "red",
        }}
      >
        Koleksionet e Reja
      </h1>
      <p className="text-[#555] text-[20px] md:text-[28px] font-grandstander font-medium leading-[38px] mt-2">
          Zbulo koleksionet e reja
        </p>
        </div>

      <Image
        src={Confetti2Image}
        alt="New Products 2"
        className="hidden sm:block max-w-[450px] shrink-0"
      />
    </div>   
      <ProductCarousel products={products} breakpoints={breakpoints} />
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
  </div>
  <Image
    src={'/home/new-collections-cloud.png'}
    alt="Wave"
    width={1920}
    height={1080}
    className="w-full h-auto"
  />
</div>)
}

export default NewCollections;
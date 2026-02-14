import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Routes } from '@/config/routes';
import LoyaltyCardImage from '../../../public/home/loyalty-card.png';

const LoyaltyCard = () => {
  return (
    <div className="flex flex-col md:flex-row overflow-hidden max-w-[1020px] mt-12 sm:mt-20 md:mt-32 mx-8 lg:mx-auto md:mx-16 bg-[#F44535] rounded-2xl sm:rounded-3xl">
      <div className="relative w-full md:min-w-0 md:flex-1 md:max-w-[45%] shrink-0">
        <Image
          src={LoyaltyCardImage}
          alt="Loyalty Card"
          className="w-full h-auto object-contain object-center md:object-cover md:h-full min-h-[180px] sm:min-h-[220px]"
        />
      </div>
      <div className="flex-1 flex flex-col justify-center p-4 sm:p-6 md:p-8 md:pt-16 md:pb-16 md:px-8 space-y-3 sm:space-y-4 md:space-y-6">
        <h1 className="loyalty-card-title text-[#FFCB47] font-grandstander text-4xl md:text-[50px] lg:text-[60px] font-black leading-tight">
          Loyalty Card
        </h1>
        <p className="text-white text-sm sm:text-base md:text-lg max-w-110">
          Bëhu pjesë e familjes së Shtëpisë së Lodrave dhe përfito çdo herë që blen!
          Çdo lodër që merr të sjell më afër dhuratave, uljeve dhe surprizave të veçanta.
        </p>
        <Link
          href={Routes.register}
          className="inline-block cursor-pointer hover:opacity-90 bg-[#1A66EA] w-fit px-4 py-3 sm:px-5 sm:py-3 rounded-lg text-white text-sm sm:text-base font-medium transition-opacity touch-manipulation"
        >
          Join now!
        </Link>
      </div>
    </div>
  );
};

export default LoyaltyCard;
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Routes } from '@/config/routes';

const LoyaltyCard = () => {
  return (
    <div className="bg-[#fff] py-20 px-16">
      <Link href={Routes.register} className="block cursor-pointer hover:opacity-90 transition-opacity">
        <Image
          src={'/icons/loyalty-card.svg'}
          alt="Loyalty Card"
          width={1920}
          height={1080}
          className="w-full h-auto mx-auto"
        />
      </Link>
    </div>
  );
};

export default LoyaltyCard;
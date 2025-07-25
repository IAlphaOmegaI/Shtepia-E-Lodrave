import Image from 'next/image';
import React from 'react';

const LoyaltyCard = () => {
  return (
    <div className="bg-[#fff] py-20 px-16">
      <Image
        src={'/icons/loyalty-card.svg'}
        alt="Loyalty Card"
        width={1920}
        height={1080}
        className="w-full h-auto mx-auto"
      ></Image>
    </div>
  );
};

export default LoyaltyCard;
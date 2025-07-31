'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import Image from 'next/image';

export default function LoyaltyCardPage() {
  const { data: userData } = useQuery({
    queryKey: ['user', 'me'],
    queryFn: () => api.auth.me(),
  });

  const points = userData?.total_points || 0;
  const hasPoints = points > 0;

  return (
    <div className="min-h-[400px] md:min-h-[600px] bg-[#FEC949] rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Left illustration */}
        <Image
          src="/pageHeader_Illustration_Left.svg"
          alt=""
          width={400}
          height={400}
          className="absolute top-0 left-0 w-32 sm:w-48 md:w-64 lg:w-80 xl:w-96 h-auto"
        />

        {/* Right illustration */}
        <Image
          src="/pageHeader_Illustration_Right.svg"
          alt=""
          width={400}
          height={400}
          className="absolute top-0 right-0 w-32 sm:w-48 md:w-64 lg:w-80 xl:w-96 h-auto"
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-[64px] font-bold text-[#F11602] text-center mb-6 sm:mb-8 md:mb-12 lg:mb-16 font-grandstander font-extrabold"
          style={{
            letterSpacing: "-3px",
            WebkitTextStroke: "2px #fff",
          }}
        >
          Loyalty card
        </h1>
        {/* Card */}
        <div className="bg-[#F11602] rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 pb-12 sm:pb-16 md:pb-20 shadow-2xl max-w-5xl mx-auto relative">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8 mx-auto max-w-xl">
            {/* Gift icon with progress */}
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 flex-shrink-0">
              <Image
                src="/cart_progress.svg"
                alt=""
                width={225}
                height={225}
                className="w-full h-full"
              />
            </div>

            {/* Points display */}
            <div className="text-center md:text-left">
              <div 
                className="text-[#FEC949] text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold font-grandstander mb-2" 
                style={{
                  fontWeight: "900 !important",
                  letterSpacing: "-3px",
                  WebkitTextStroke: "2px #fff",
                }}
              >
                0 pts
              </div>
              <p className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-albertsans max-w-xs sm:max-w-sm md:max-w-md mx-auto md:mx-0">
                {hasPoints
                  ? "Congrats on your points! You can use them in your next order"
                  : "Order more to earn more points"}
              </p>
            </div>
          </div>

          {/* Bottom decorative clouds */}
          <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
            <Image
              src="/clouds_cart.svg"
              alt=""
              width={900}
              height={43}
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
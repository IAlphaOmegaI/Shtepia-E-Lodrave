import React from "react";
import Link from "next/link";

const LodraBanner = () => {
  return (
    <div className="relative flex min-h-[510px] sm:min-h-[550px] md:min-h-[700px] lg:min-h-[800px] xl:min-h-[950px] overflow-hidden mb-[50px] bg-[#fff9f0] bg-[url('/home/festiv.jpg')] bg-cover bg-center bg-no-repeat">
      {/* Top Clouds - left-aligned on mobile, centered on larger screens */}
      <div className="absolute top-0 left-0 right-0 w-full h-[141px] z-[1] bg-[url('/home/cloud.svg')] bg-left bg-no-repeat bg-cover sm:bg-center" />

      {/* Text Content Section */}
      <div className="absolute bottom-0 left-0 right-0 w-full z-[50] pb-[30px] sm:pb-[40px] md:pb-[60px] lg:pb-[100px]">
        <div className="relative z-[50] px-5">
          <h3 className="font-grandstander text-[36px] font-[900] leading-[40px] text-center text-[#febc1b] [-webkit-text-stroke:2.5px_#fff] [text-stroke:2.5px_#fff] tracking-[-1px] relative z-[51] m-0 sm:text-[40px] sm:leading-[44px] md:text-[40px] md:leading-[44px] md:[-webkit-text-stroke:3px_#fff] md:[text-stroke:3px_#fff] lg:text-[64px] lg:leading-[66px] lg:tracking-[-4px]">
            Mirësevini te
          </h3>
          <h1 className="font-grandstander text-[40px] font-[900] leading-[44px] text-center text-[#febc1b] [-webkit-text-stroke:3px_#fff] [text-stroke:3px_#fff] tracking-[-1px] relative z-[99] m-0 mb-[15px] sm:text-[48px] sm:leading-[52px] sm:tracking-[-2px] sm:[-webkit-text-stroke:4px_#fff] sm:[text-stroke:4px_#fff] md:text-[56px] md:leading-[60px] md:tracking-[-3px] lg:text-[90px] lg:leading-[94px] lg:tracking-[-4px]">
            Shtëpia e Lodrave
          </h1>

          <Link
            href="/products"
            className="flex justify-center items-center mx-auto mt-[15px] mb-[10px] relative cursor-pointer z-[10] w-full h-auto min-h-[40px] max-w-full text-center bg-[#4885ee] rounded-lg px-[10px] py-[8px] gap-[8px] font-grandstander font-medium text-[14px] text-white no-underline transition-all duration-300 hover:bg-[#3670d8] hover:scale-[1.02] sm:text-[18px] sm:max-w-[320px] sm:h-[44px] sm:px-[14px] sm:py-[6px] md:text-[22px] md:max-w-[380px] md:h-[48px] md:mt-[15px] md:hover:scale-105 lg:text-[28px] lg:max-w-[450px] lg:h-[46px] xl:text-[32px] xl:max-w-[550px]"
          >
            <span className="whitespace-nowrap">
              Zhvillo imagjinaten me LEGO!
            </span>
          </Link>
        </div>
      </div>

      {/* Bottom Waves */}
      <div className="absolute bottom-[-60px] w-full h-[120px] z-[40] bg-[url('/home/wavedesign.svg')] bg-cover bg-center bg-no-repeat sm:bottom-[-80px] sm:h-[150px] md:bottom-[-110px] md:h-[200px] lg:bottom-[-140px] lg:h-[250px] xs:bg-none" />
    </div>
  );
};

export default LodraBanner;

import React from "react";
import Image from "next/image";
import Link from "next/link";

const LodraBanner = () => {
  return (
    <div className="relative flex min-h-[510px] sm:min-h-[550px] md:min-h-[700px] lg:min-h-[800px] xl:min-h-[950px] overflow-hidden mb-[50px] bg-[#fff9f0] bg-[url('/home/legoBG.png')] bg-cover bg-center bg-no-repeat md:bg-center sm:bg-[center_bottom]">
      {/* Top Clouds */}
      <div className="absolute top-0 left-0 right-0 w-full h-[141px] z-[1] bg-[url('/home/cloud.svg')] bg-center bg-no-repeat bg-cover" />

      {/* Yellow Section with Ellipsis */}
      <div className="absolute top-0 left-0 right-0 mx-auto text-center flex justify-center items-center h-[400px] sm:h-[500px] md:h-[700px] lg:h-[800px] xl:h-[982px] sm:top-0 md:top-[-50px] lg:top-[-60px] xl:top-[-85px]">
        <Image
          src="/home/ellipsisOnTopOfLego.svg"
          alt="ellipsis"
          width={982}
          height={982}
          className="object-contain mix-blend-multiply w-full h-full max-w-[600px] md:max-w-[800px] xl:max-w-[982px]"
        />
      </div>

      {/* Festive Banner - occupies the same space as the three images */}
      <div className="absolute top-[30px] left-0 right-0 w-full z-[10] flex justify-center sm:top-[40px] md:top-[50px] lg:top-[70px]">
        <Image
          src="/home/festiv.jpg"
          alt="festive banner"
          width={1400}
          height={657}
          className="w-[250px] h-auto object-contain mx-auto sm:w-[300px] md:w-[400px] lg:w-[512px] xl:w-full xl:max-w-[1400px]"
        />
      </div>

      {/* Ground Section */}
      <div className="absolute bottom-0 w-full h-[240px] sm:h-[240px] md:h-[400px] lg:h-[462px] z-[50] bg-[url('/home/ground.svg')] bg-cover bg-center bg-no-repeat sm:bg-[length:120%_100%] sm:bg-[center_bottom] xs:bg-none">
        <div className="relative pt-[30px] z-[50] px-5 sm:pt-[30px] sm:mt-0 md:pt-[60px] md:mt-5 lg:pt-[100px]">
          <h3 className="font-grandstander text-[58px] font-[900] leading-[76px] text-center text-[#febc1b] [-webkit-text-stroke:2.5px_#fff] [text-stroke:2.5px_#fff] tracking-[-1px] relative z-[51] m-0 sm:text-[36px] sm:leading-[40px] md:text-[40px] md:leading-[44px] md:[-webkit-text-stroke:3px_#fff] md:[text-stroke:3px_#fff] lg:text-[64px] lg:leading-[66px] lg:tracking-[-4px]">
            Mirësevini te
          </h3>
          <h1 className="font-grandstander text-[61px] font-[900] leading-[64px] text-center text-[#febc1b] [-webkit-text-stroke:3px_#fff] [text-stroke:3px_#fff] tracking-[-1px] relative z-[99] m-0 mb-[15px] sm:text-[52px] sm:leading-[56px] sm:tracking-[-2px] sm:[-webkit-text-stroke:4px_#fff] sm:[text-stroke:4px_#fff] md:text-[56px] md:leading-[60px] md:tracking-[-3px] lg:text-[90px] lg:leading-[94px] lg:tracking-[-4px]">
            Shtëpia e Lodrave
          </h1>

          <Link
            href="/products"
            className="flex justify-center items-center mx-auto mt-[15px] mb-[10px] relative cursor-pointer z-[10] w-full h-[44px] max-w-full text-center bg-[#4885ee] rounded-lg px-[14px] py-[6px] gap-[10px] font-grandstander font-medium text-[20px] text-white no-underline transition-all duration-300 hover:bg-[#3670d8] hover:scale-[1.02] sm:text-[22px] sm:max-w-[320px] sm:h-[44px] md:text-[26px] md:max-w-[380px] md:h-[48px] md:mt-[15px] md:hover:scale-105 lg:text-[28px] lg:max-w-[450px] lg:h-[46px] xl:text-[32px] xl:max-w-[550px]"
          >
            <span>Zhvillo imagjinaten me LEGO!</span>
          </Link>
        </div>
      </div>

      {/* Bottom Waves */}
      <div className="absolute bottom-[-60px] w-full h-[120px] z-[40] bg-[url('/home/wavedesign.svg')] bg-cover bg-center bg-no-repeat sm:bottom-[-80px] sm:h-[150px] md:bottom-[-110px] md:h-[200px] lg:bottom-[-140px] lg:h-[250px] xs:bg-none" />
    </div>
  );
};

export default LodraBanner;

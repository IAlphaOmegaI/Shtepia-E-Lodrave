import React from "react";

const LodraBanner = () => {
  return (
    <div className="relative flex min-h-[510px] sm:min-h-[550px] md:min-h-[700px] lg:min-h-[800px] xl:min-h-[950px] overflow-hidden mb-[50px] bg-[#fff9f0] bg-[url('/home/festiv.jpg')] bg-cover bg-center bg-no-repeat">
      {/* Top Clouds - left-aligned on mobile, centered on larger screens */}
      <div className="absolute top-0 left-0 right-0 w-full h-[141px] z-[1] bg-[url('/home/cloud.svg')] bg-left bg-no-repeat bg-cover sm:bg-center" />
    </div>
  );
};

export default LodraBanner;

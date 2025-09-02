import React from 'react';
import Image from 'next/image';

interface PageHeaderProps {
  title?: string;
  showTitle?: boolean;
  showClouds?: boolean;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title = '', 
  showTitle = true,
  showClouds = true,
  className = '' 
}) => {
  return (
    <div className={`relative bg-[#FEC949] min-h-[208px]  ${className} mb-50 overflow-hidden sm:overflow-visible`}>
      {/* Left illustration */}
      <div className="absolute left-[-190px] md:-left-20 lg:-left-32 top-0 h-full ">
        <Image
          src="/pageHeader_Illustration_Left.svg"
          alt="Left decoration"
          width={390}
          height={211}
          className="h-full w-auto"
          priority
        />
      </div>

      {/* Right illustration */}
      <div className="absolute right-[-167px] md:-right-20 lg:-right-32 top-0 h-full">
        <Image
          src="/pageHeader_Illustration_Right.svg"
          alt="Right decoration"
          width={390}
          height={211}
          className="h-full w-auto"
          priority
        />
      </div>

      {/* Title in the center - conditional */}
      {showTitle && title && (
        <div className="relative z-10 h-full min-h-[208px] flex items-center justify-center px-4">
          <h1 className="text-white font-grandstander font-bold text-[50px] md:text-[70px] lg:text-[80px] leading-tight text-center">
            {title}
          </h1>
        </div>
      )}

      {/* Bottom clouds - conditional */}
      {showClouds && (
        <div className="bottom-[-80px] absolute left-0 right-0 z-10 h-[80px] w-full">
          <Image
            src="/pageHeader_Illustration_CloudsBottom.svg"
            alt="Bottom clouds"
            fill
            className="object-cover"
            priority
          />
        </div>
      )}
    </div>
  );
};

export default PageHeader;
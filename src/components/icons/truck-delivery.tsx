import React, { FC } from 'react';

type TruckDeliveryIconProps = {
  width?: number;
  height?: number;
  className?: string;
  stroke?: string;
};

export const TruckDeliveryIcon: FC<TruckDeliveryIconProps> = ({
  width = 32,
  height = 32,
  className,
  stroke = 'white',
}) => {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="1" y="3" width="15" height="13" stroke={stroke} strokeWidth="2"/>
      <path d="M16 8h4l3 3v5h-7V8z" stroke={stroke} strokeWidth="2"/>
      <circle cx="5.5" cy="18.5" r="2.5" stroke={stroke} strokeWidth="2"/>
      <circle cx="18.5" cy="18.5" r="2.5" stroke={stroke} strokeWidth="2"/>
    </svg>
  );
};
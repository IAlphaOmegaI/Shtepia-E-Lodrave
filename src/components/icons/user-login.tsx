import React, { FC } from 'react';

type LoginUserIconProps = {
  width?: number;
  height?: number;
  className?: string;
  stroke?: string;
};

export const LoginUserIcon: FC<LoginUserIconProps> = ({
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
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={stroke} strokeWidth="2"/>
      <circle cx="12" cy="7" r="4" stroke={stroke} strokeWidth="2"/>
    </svg>
  );
};
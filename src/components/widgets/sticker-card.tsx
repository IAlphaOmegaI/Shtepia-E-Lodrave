import React from 'react';

interface StickerCardProps {
  title: string;
  icon: React.ReactNode;
  color: string;
  price: string | number;
  indicator?: 'up' | 'down';
  indicatorText?: string;
  note?: string;
}

const StickerCard: React.FC<StickerCardProps> = ({
  title,
  icon,
  color,
  price,
  indicator,
  indicatorText,
  note,
}) => {
  return (
    <div
      className="flex h-full w-full flex-col rounded-lg border border-b-4 border-gray-200 bg-white p-5 md:p-6"
      style={{ borderBottomColor: color }}
    >
      <div className="mb-auto flex w-full items-center justify-between">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded bg-gray-100/80 me-3">
          {icon}
        </div>
        <div className="flex w-full flex-col text-end">
          <span className="mb-1 text-base font-normal text-gray-600">
            {title}
          </span>
          <span className="mb-2 text-2xl font-semibold text-gray-900">
            {price}
          </span>
        </div>
      </div>

      {indicator === 'up' && (
        <span className="inline-block text-sm font-semibold text-green-500">
          ↑ {indicatorText}
          <span className="text-sm font-normal text-gray-600"> {note}</span>
        </span>
      )}
      {indicator === 'down' && (
        <span className="inline-block text-sm font-semibold text-red-500">
          ↓ {indicatorText}
          <span className="text-sm font-normal text-gray-600"> {note}</span>
        </span>
      )}
    </div>
  );
};

export default StickerCard;
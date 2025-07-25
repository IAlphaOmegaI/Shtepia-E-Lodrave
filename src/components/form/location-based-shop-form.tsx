'use client';

import React from 'react';
import cn from 'classnames';

interface LocationBasedShopFormProps {
  className?: string;
  closeLocation: () => void;
}

const LocationBasedShopForm: React.FC<LocationBasedShopFormProps> = ({
  className,
  closeLocation,
}) => {
  return (
    <div className={cn('p-4 shadow-lg', className)}>
      <h3 className="mb-4 text-lg font-semibold">Select Your Location</h3>
      <p className="text-sm text-gray-600">
        Choose a location to see shops near you
      </p>
      <button
        onClick={closeLocation}
        className="mt-4 w-full rounded bg-accent px-4 py-2 text-white hover:bg-accent-hover"
      >
        Close
      </button>
    </div>
  );
};

export default LocationBasedShopForm;
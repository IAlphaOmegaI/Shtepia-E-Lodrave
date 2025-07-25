'use client';

import React, { useState } from 'react';

type TreeMenuProps = {
  items: { name: string }[];
  className?: string;
};

const FilterSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="border-b border-[#D9D9D9]">
      <div
        className={`flex items-center justify-between cursor-pointer ${
          open
            ? 'bg-[#FFF2D1] border-b border-[#FED776] pb-6 px-4 pt-[18px]'
            : 'bg-white px-4 py-5'
        }`}
        onClick={() => setOpen(!open)}
      >
        <span className="text-[#252323] font-albertsans text-[16px] font-medium leading-[22px]">
          {title}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>

      {open && (
        <div className="flex flex-col justify-center items-start gap-3 w-full p-[16px_16px_24px_16px]">
          {children}
        </div>
      )}
    </div>
  );
};
const TreeMenu: React.FC<TreeMenuProps> = ({ items, className }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'Arts, Crafts & Music',
  ]);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [selectedAge, setSelectedAge] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const toggleSelection = (
    value: string,
    selectedList: string[],
    setSelectedList: (list: string[]) => void,
  ) => {
    setSelectedList(
      selectedList.includes(value)
        ? selectedList.filter((item) => item !== value)
        : [...selectedList, value],
    );
  };

  const categories = [
    'Arts, Crafts & Music',
    'Category 2',
    'Category 3',
    'Category 4',
    'Category 5',
  ];
  const priceRanges = ['0-10€', '10€-50€', '50€-100€', '100€+'];
  const ageRanges = ['0-10', '10-20', '20-30', '30-40', '40-50', '50-60'];
  const brands = ['Brand 1', 'Brand 2'];

  return (
    <div className={`${className} border rounded-lg`}>
      <div className="flex items-center gap-[6px] p-[12px_16px] bg-[#FEBC1B] border border-[#FEBC1B] rounded-t-[8px]">
        <span className="text-[24px] font-medium leading-[38px] font-grandstander text-[#252323]">
          Filters
        </span>
        <button
          onClick={() => {
            setSelectedCategories([]);
            setSelectedPrices([]);
            setSelectedAge([]);
            setSelectedBrands([]);
          }}
          className="ml-auto text-center text-[18px] font-semibold leading-[24px] underline font-albertsans text-[#252323] px-4 py-2 rounded-[8px] flex justify-center items-center h-[52px] gap-[10px]"
        >
          Clear
        </button>
      </div>

      <FilterSection title="Kategoritë">
        <div className="flex flex-col gap-2 text-sm text-gray-700">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() =>
                  toggleSelection(
                    cat,
                    selectedCategories,
                    setSelectedCategories,
                  )
                }
                className="filter-checkbox"
              />
              <span className="text-[#555] font-[500] text-[16px] leading-[22px] font-albertsans">
                {cat}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Çmimi">
        <div className="flex flex-col gap-2 text-sm text-gray-700">
          {priceRanges.map((price) => (
            <label key={price} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedPrices.includes(price)}
                onChange={() =>
                  toggleSelection(price, selectedPrices, setSelectedPrices)
                }
                className="filter-checkbox"
              />
              <span className="text-[#555] font-[500] text-[16px] leading-[22px] font-albertsans">
                {price}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Mosha">
        <div className="flex flex-col gap-2 text-sm text-gray-700">
          {ageRanges.map((age) => (
            <label key={age} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedAge.includes(age)}
                onChange={() =>
                  toggleSelection(age, selectedAge, setSelectedAge)
                }
                className="filter-checkbox"
              />
              <span className="text-[#555] font-[500] text-[16px] leading-[22px] font-albertsans">
                {age}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Brand">
        <div className="flex flex-col gap-2 text-sm text-gray-700">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() =>
                  toggleSelection(brand, selectedBrands, setSelectedBrands)
                }
                className="filter-checkbox"
              />
              <span className="text-[#555] font-[500] text-[16px] leading-[22px] font-albertsans">
                {brand}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );
};

export default TreeMenu;
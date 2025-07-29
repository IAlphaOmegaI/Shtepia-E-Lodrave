'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/services/api';
import Button from '@/components/ui/button';

type TreeMenuProps = {
  categorySlug?: string;
  className?: string;
  onFiltersApplied?: (filters: FilterParams) => void;
};

type FilterData = {
  categories: { id: number; name: string }[];
  brands: { id: number; name: string }[];
  ages: { id: number; label: string }[];
};

type OfferData = {
  id: number;
  label: string;
};

type PriceRange = {
  label: string;
  min?: number;
  max?: number;
};

export type FilterParams = {
  categories__slug: string;
  categories?: string;
  brand?: string;
  age_range?: string;
  min_price?: number;
  max_price?: number;
  ordering?: string;
  discount_id?: string;
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

const TreeMenu: React.FC<TreeMenuProps> = ({ categorySlug = 'lodra', className, onFiltersApplied }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filterData, setFilterData] = useState<FilterData>({
    categories: [],
    brands: [],
    ages: [],
  });
  const [offerData, setOfferData] = useState<OfferData[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('');
  const [selectedAge, setSelectedAge] = useState<number | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<number | null>(null);

  // Pre-defined price ranges
  const priceRanges: PriceRange[] = [
    { label: '0-50 Lekë', max: 50 },
    { label: '50-100 Lekë', min: 50, max: 100 },
    { label: '100-200 Lekë', min: 100, max: 200 },
    { label: '200-500 Lekë', min: 200, max: 500 },
    { label: '500+ Lekë', min: 500 },
  ];

  // Fetch filter data
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        setLoading(true);
        // Fetch category filters
        const response = await api.filters.getByCategory(categorySlug);
        if (response && response[categorySlug]) {
          setFilterData(response[categorySlug]);
        }
        
        // Fetch offers
        const offersResponse = await api.filters.getOffers();
        if (offersResponse && offersResponse.oferta) {
          setOfferData(offersResponse.oferta);
        }
      } catch (error) {
        console.error('Failed to fetch filters:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilters();
  }, [categorySlug]);

  // Initialize filters from URL params
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Categories
    const catParam = params.get('categories');
    if (catParam) {
      const categoryId = parseInt(catParam);
      if (!isNaN(categoryId)) {
        setSelectedCategory(categoryId);
      }
    }
    
    // Brands
    const brandParam = params.get('brand');
    if (brandParam) {
      const brandId = parseInt(brandParam);
      if (!isNaN(brandId)) {
        setSelectedBrand(brandId);
      }
    }
    
    // Ages
    const ageParam = params.get('age_range');
    if (ageParam) {
      const ageId = parseInt(ageParam);
      if (!isNaN(ageId)) {
        setSelectedAge(ageId);
      }
    }
    
    // Price
    const minPrice = params.get('min_price');
    const maxPrice = params.get('max_price');
    if (minPrice || maxPrice) {
      const range = priceRanges.find(r => 
        r.min === (minPrice ? parseInt(minPrice) : undefined) &&
        r.max === (maxPrice ? parseInt(maxPrice) : undefined)
      );
      if (range) {
        setSelectedPriceRange(range.label);
      }
    }
    
    // Offers
    const offerParam = params.get('discount_id');
    if (offerParam) {
      const offerId = parseInt(offerParam);
      if (!isNaN(offerId)) {
        setSelectedOffer(offerId);
      }
    }
  }, [searchParams]);


  const handleApplyFilters = async () => {
    if (!onFiltersApplied) return;
    
    setApplying(true);
    
    // Build filter params
    const filterParams: FilterParams = {
      categories__slug: categorySlug,
    };
    
    // Add selected category
    if (selectedCategory !== null) {
      filterParams.categories = selectedCategory.toString();
    }
    
    // Add selected brand
    if (selectedBrand !== null) {
      filterParams.brand = selectedBrand.toString();
    }
    
    // Add selected age
    if (selectedAge !== null) {
      filterParams.age_range = selectedAge.toString();
    }
    
    // Add price range
    if (selectedPriceRange) {
      const range = priceRanges.find(r => r.label === selectedPriceRange);
      if (range) {
        if (range.min !== undefined) filterParams.min_price = range.min;
        if (range.max !== undefined) filterParams.max_price = range.max;
      }
    }
    
    // Add selected offer
    if (selectedOffer !== null) {
      filterParams.discount_id = selectedOffer.toString();
    }
    
    // Call the callback with filter params
    onFiltersApplied(filterParams);
    setApplying(false);
  };

  const handleClearFilters = () => {
    setSelectedCategory(null);
    setSelectedPriceRange('');
    setSelectedAge(null);
    setSelectedBrand(null);
    setSelectedOffer(null);
    
    // Apply cleared filters
    if (onFiltersApplied) {
      onFiltersApplied({
        categories__slug: categorySlug,
      });
    }
  };

  if (loading) {
    return (
      <div className={`${className} border rounded-lg p-4`}>
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} border rounded-lg`}>
      <div className="flex items-center gap-[6px] p-[12px_16px] bg-[#FEBC1B] border border-[#FEBC1B] rounded-t-[8px]">
        <span className="text-[24px] font-medium leading-[38px] font-grandstander text-[#252323]">
          Filters
        </span>
        <button
          onClick={handleClearFilters}
          className="ml-auto text-center text-[18px] font-semibold leading-[24px] underline font-albertsans text-[#252323] px-4 py-2 rounded-[8px] flex justify-center items-center h-[52px] gap-[10px] cursor-pointer hover:opacity-70 transition-opacity"
        >
          Clear
        </button>
      </div>

      {filterData.categories.length > 0 && (
        <FilterSection title="Kategoritë">
          <div className="flex flex-col gap-2 text-sm text-gray-700">
            {filterData.categories.map((cat) => (
              <label key={cat.id} className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity">
                <input
                  type="checkbox"
                  checked={selectedCategory === cat.id}
                  onChange={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                  className="filter-checkbox"
                />
                <span className="text-[#555] font-[500] text-[16px] leading-[22px] font-albertsans capitalize">
                  {cat.name}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      <FilterSection title="Çmimi">
        <div className="flex flex-col gap-2 text-sm text-gray-700">
          {priceRanges.map((price) => (
            <label key={price.label} className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity">
              <input
                type="checkbox"
                checked={selectedPriceRange === price.label}
                onChange={() => setSelectedPriceRange(selectedPriceRange === price.label ? '' : price.label)}
                className="filter-checkbox"
              />
              <span className="text-[#555] font-[500] text-[16px] leading-[22px] font-albertsans">
                {price.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {filterData.ages.length > 0 && (
        <FilterSection title="Mosha">
          <div className="flex flex-col gap-2 text-sm text-gray-700">
            {filterData.ages.map((age) => (
              <label key={age.id} className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity">
                <input
                  type="checkbox"
                  checked={selectedAge === age.id}
                  onChange={() => setSelectedAge(selectedAge === age.id ? null : age.id)}
                  className="filter-checkbox"
                />
                <span className="text-[#555] font-[500] text-[16px] leading-[22px] font-albertsans capitalize">
                  {age.label}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      {filterData.brands.length > 0 && (
        <FilterSection title="Brand">
          <div className="flex flex-col gap-2 text-sm text-gray-700">
            {filterData.brands.map((brand) => (
              <label key={brand.id} className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity">
                <input
                  type="checkbox"
                  checked={selectedBrand === brand.id}
                  onChange={() => setSelectedBrand(selectedBrand === brand.id ? null : brand.id)}
                  className="filter-checkbox"
                />
                <span className="text-[#555] font-[500] text-[16px] leading-[22px] font-albertsans capitalize">
                  {brand.name}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      {offerData.length > 0 && (
        <FilterSection title="Oferta">
          <div className="flex flex-col gap-2 text-sm text-gray-700">
            {offerData.map((offer) => (
              <label key={offer.id} className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity">
                <input
                  type="checkbox"
                  checked={selectedOffer === offer.id}
                  onChange={() => setSelectedOffer(selectedOffer === offer.id ? null : offer.id)}
                  className="filter-checkbox"
                />
                <span className="text-[#555] font-[500] text-[16px] leading-[22px] font-albertsans">
                  {offer.label}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Apply Filters Button */}
      <div className="p-4 border-t border-[#D9D9D9]">
        <Button
          onClick={handleApplyFilters}
          disabled={applying}
          className="w-full bg-[#FEBC1B] hover:bg-[#FEB000] text-black font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          {applying ? 'Applying...' : 'Apply Filters'}
        </Button>
      </div>
    </div>
  );
};

export default TreeMenu;
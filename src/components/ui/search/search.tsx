import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SearchIcon } from '@/components/icons/search';
import { CloseIcon } from '@/components/icons/close';
import cn from 'classnames';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductService } from '@/services/product.service';

interface SearchProps {
  className?: string;
  label?: string;
  variant?: 'minimal' | 'flat' | 'normal';
  placeholder?: string;
  inputClassName?: string;
}

interface SearchResult {
  id: number;
  name: string;
  price: string;
  sale_price?: string | null;
  image?: string | null;
  slug?: string;
  in_stock?: boolean;
  quantity?: number;
}

const Search: React.FC<SearchProps> = ({
  className = 'md:w-[730px]',
  label,
  variant = 'normal',
  placeholder = 'Search...',
  inputClassName,
}) => {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Debounced search function
  const performSearch = useCallback(async (query: string) => {
    if (query.length < 3) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setIsLoading(true);
    try {
      const results = await ProductService.searchProducts(query, 8);
      setSearchResults(results);
      setShowDropdown(results.length > 0);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setShowDropdown(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle input change with debouncing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    setSelectedIndex(-1);

    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer for debouncing (500ms delay)
    if (value.trim()) {
      debounceTimerRef.current = setTimeout(() => {
        performSearch(value);
      }, 500);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || searchResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => 
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
          handleProductClick(searchResults[selectedIndex]);
        }
        // Do nothing if no product is selected - just prevent form submission
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Do nothing - prevent navigation to search page
  };

  const handleProductClick = (product: SearchResult) => {
    setShowDropdown(false);
    setSearchText('');
    // Navigate to product page using ID
    window.location.href = `/products/${product.id}`;
  };

  const clearSearch = () => {
    setSearchText('');
    setSearchResults([]);
    setShowDropdown(false);
    setSelectedIndex(-1);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
  };

  return (
    <div ref={searchRef} className={cn("relative w-full", className)}>
      <form onSubmit={handleSearch} className="relative flex w-full">
        <label htmlFor={label} className="sr-only">
          {label}
        </label>
        <div className={cn("relative flex w-full items-center")}>
          <input
            ref={inputRef}
            id={label}
            type="text"
            value={searchText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
            placeholder={placeholder}
            className={cn(
              "w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pl-11 pr-10 text-sm text-gray-900 placeholder-gray-500 focus:border-accent focus:outline-none",
              {
                "border-gray-200 bg-gray-50": variant === "minimal",
                "border-0 bg-gray-100": variant === "flat",
                "rounded-b-none": showDropdown,
              },
              inputClassName
            )}
          />
          <button
            type="submit"
            className="absolute left-0 flex h-full w-10 items-center justify-center text-gray-600"
          >
            {isLoading ? (
              <div className="h-[18px] w-[18px] animate-spin rounded-full border-2 border-gray-300 border-t-[#F44535]"></div>
            ) : (
              <SearchIcon className="h-[18px] w-[18px]" />
            )}
          </button>
          {searchText && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-0 flex h-full w-10 items-center justify-center text-gray-600 hover:text-gray-900"
            >
              <CloseIcon className="h-[14px] w-[14px]" />
            </button>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 z-50 mt-0 max-h-96 overflow-y-auto rounded-b-lg bg-white shadow-lg border border-t-0 border-gray-300"
          >
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-[#F44535]"></div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="py-2">
                {searchResults.map((product, index) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    onClick={() => {
                      setShowDropdown(false);
                      setSearchText('');
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors",
                      {
                        "bg-gray-100": selectedIndex === index,
                      }
                    )}
                  >
                    {/* Product Image */}
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      {product.image && !imageErrors[product.id] ? (
                        <Image
                          src={(() => {
                            // For media files, we need the base domain without the /api path
                            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.shtepialodrave.com/api';
                            let baseUrl = apiUrl;
                            if (apiUrl.endsWith('/api')) {
                              baseUrl = apiUrl.substring(0, apiUrl.length - 4);
                            }
                            return `${baseUrl}${product.image}`;
                          })()}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                          onError={() => {
                            setImageErrors(prev => ({ ...prev, [product.id]: true }));
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-100">
                          <SearchIcon className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </p>
                      <div className="flex items-center gap-2">
                        {product.sale_price ? (
                          <>
                            <p className="text-xs text-[#F44535] font-semibold">
                              ALL {product.sale_price}
                            </p>
                            <p className="text-xs text-gray-400 line-through">
                              ALL {product.price}
                            </p>
                          </>
                        ) : (
                          <p className="text-xs text-gray-500">
                            {product.price
                              ? `ALL ${product.price}`
                              : "Price not available"}
                          </p>
                        )}
                        {product.in_stock === false && (
                          <span className="text-xs text-red-500 font-medium">
                            Out of stock
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="px-4 py-8 text-center text-sm text-gray-500">
                No products found for "{searchText}"
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Search;
'use client';

import { useState } from 'react';
import TreeMenu, { FilterParams } from '@/components/ui/tree-menu';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import ProductCard from '@/components/products/product-card';
import PageHeader from '@/components/common/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface ShopPageClientProps {
  initialData: any;
}

export default function ShopPageClient({ initialData }: ShopPageClientProps) {
  const [sortBy, setSortBy] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filterParams, setFilterParams] = useState<FilterParams>({});
  
  // Check if we should use initial data (only for the first page with no filters)
  const isInitialLoad = currentPage === 1 && 
    Object.keys(filterParams).length === 0 &&
    !sortBy;

  // Fetch products from API with filters
  const { data, isLoading, error } = useQuery({
    queryKey: ['shopProducts', currentPage, itemsPerPage, sortBy, JSON.stringify(filterParams)],
    queryFn: () => {
      const params: any = {
        ...filterParams,
        page: currentPage,
        limit: itemsPerPage,
      };
      
      // Override ordering based on sortBy
      if (sortBy === 'price_asc') {
        params.ordering = 'price';
      } else if (sortBy === 'price_desc') {
        params.ordering = '-price';
      } else if (sortBy === 'newest') {
        params.ordering = '-created_at';
      } else if (sortBy === 'sales') {
        params.ordering = '-sold_quantity';
      }
      // If no sort is selected (default), don't add ordering parameter
      
      console.log('Fetching products with params:', params);
      return api.products.getAll(params);
    },
    initialData: isInitialLoad ? initialData : undefined,
  });

  const products = data?.data || [];
  const paginatorInfo = data?.paginatorInfo;

  // Handle filters applied
  const handleFiltersApplied = (filters: FilterParams) => {
    setFilterParams(filters);
    setCurrentPage(1); // Reset to first page when filters change
    // Scroll to top of products section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Shop Header */}
      <PageHeader 
        title="Të gjitha produktet" 
        showClouds={true} 
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 sm:mt-20 -mt-50">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="w-full bg-[#FEBC1B] text-black font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-[#FEB000] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="21" x2="4" y2="14"></line>
              <line x1="4" y1="10" x2="4" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12" y2="3"></line>
              <line x1="20" y1="21" x2="20" y2="16"></line>
              <line x1="20" y1="12" x2="20" y2="3"></line>
              <line x1="1" y1="14" x2="7" y2="14"></line>
              <line x1="9" y1="8" x2="15" y2="8"></line>
              <line x1="17" y1="16" x2="23" y2="16"></line>
            </svg>
            Filters
          </button>
        </div>

        {/* Mobile overlay backdrop */}
        {showMobileFilters && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setShowMobileFilters(false)} />
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Single TreeMenu that adapts position based on screen size */}
          <aside className={`
            ${showMobileFilters ? 'fixed right-0 top-0 h-full w-full max-w-sm z-50' : 'hidden'}
            lg:relative lg:block lg:right-auto lg:top-auto lg:h-auto lg:w-64 lg:max-w-none lg:z-auto
            flex-shrink-0
          `}>
            <div className={`
              ${showMobileFilters ? 'h-full bg-white shadow-lg' : ''}
              lg:h-auto lg:bg-transparent lg:shadow-none
            `}>
              {/* Mobile header - only visible on mobile when filters are open */}
              <div className={`${showMobileFilters ? 'flex' : 'hidden'} items-center justify-between p-4 border-b lg:hidden`}>
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              
              {/* TreeMenu wrapper - pass isShopPage prop */}
              <div className={`
                ${showMobileFilters ? 'overflow-y-auto h-[calc(100%-64px)] p-4' : ''}
                lg:overflow-visible lg:h-auto lg:p-0 lg:sticky lg:top-4
              `}>
                <TreeMenu 
                  isShopPage={true}
                  className="bg-white" 
                  onFiltersApplied={(filters) => {
                    handleFiltersApplied(filters);
                    setShowMobileFilters(false);
                  }}
                />
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {/* Products Header */}
            <div className="bg-white rounded-lg p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-gray-600 font-albertsans">{paginatorInfo?.total || 0} produkte</p>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto">
                  <span className="text-gray-600 font-albertsans text-sm sm:text-base">Produkte:</span>
                  <select 
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="border border-gray-300 rounded px-3 py-1 font-albertsans text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#FEBC1B] focus:border-[#FEBC1B] cursor-pointer sm:flex-initial"
                  >
                    <option value={12}>12</option>
                    <option value={24}>24</option>
                    <option value={36}>36</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                  <span className="text-gray-600 font-albertsans text-sm sm:text-base">Sort:</span>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-1 font-albertsans text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#FEBC1B] focus:border-[#FEBC1B] cursor-pointer sm:flex-initial"
                  >
                    <option value="">Default</option>
                    <option value="sales">Sort by Sales</option>
                    <option value="price_asc">Price low to high</option>
                    <option value="price_desc">Price high to low</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg border p-4">
                    <Skeleton className="h-[210px] w-full mb-4" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <div className="flex justify-between items-center mb-2">
                      <Skeleton className="h-8 w-24" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <Skeleton className="h-11 w-full" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500">Error loading products</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-lg p-8">
                <p className="text-gray-500 text-lg">No products found with the selected filters</p>
                <p className="text-gray-400 mt-2">Try adjusting your filters to see more results</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {products.map((product: any) => (
                  <ProductCard key={product.id} product={product} removeMaxWidth={true} />
                ))}
              </div>
            )}
            
            {/* Pagination */}
            {paginatorInfo && paginatorInfo.last_page > 1 && (
              <div className="mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    
                    {/* Generate page numbers */}
                    {(() => {
                      const pages = [];
                      const maxPagesToShow = 5;
                      const halfRange = Math.floor(maxPagesToShow / 2);
                      let startPage = Math.max(1, currentPage - halfRange);
                      const endPage = Math.min(paginatorInfo.last_page, startPage + maxPagesToShow - 1);
                      
                      // Adjust start if we're near the end
                      if (endPage - startPage < maxPagesToShow - 1) {
                        startPage = Math.max(1, endPage - maxPagesToShow + 1);
                      }
                      
                      // Add first page and ellipsis if needed
                      if (startPage > 1) {
                        pages.push(
                          <PaginationItem key={1}>
                            <PaginationLink 
                              onClick={() => setCurrentPage(1)}
                              className="cursor-pointer"
                            >
                              1
                            </PaginationLink>
                          </PaginationItem>
                        );
                        if (startPage > 2) {
                          pages.push(
                            <PaginationItem key="ellipsis-start">
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }
                      }
                      
                      // Add page numbers
                      for (let i = startPage; i <= endPage; i++) {
                        pages.push(
                          <PaginationItem key={i}>
                            <PaginationLink 
                              onClick={() => setCurrentPage(i)}
                              isActive={currentPage === i}
                              className="cursor-pointer"
                            >
                              {i}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      
                      // Add ellipsis and last page if needed
                      if (endPage < paginatorInfo.last_page) {
                        if (endPage < paginatorInfo.last_page - 1) {
                          pages.push(
                            <PaginationItem key="ellipsis-end">
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }
                        pages.push(
                          <PaginationItem key={paginatorInfo.last_page}>
                            <PaginationLink 
                              onClick={() => setCurrentPage(paginatorInfo.last_page)}
                              className="cursor-pointer"
                            >
                              {paginatorInfo.last_page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      
                      return pages;
                    })()}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, paginatorInfo.last_page))}
                        className={currentPage === paginatorInfo.last_page ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
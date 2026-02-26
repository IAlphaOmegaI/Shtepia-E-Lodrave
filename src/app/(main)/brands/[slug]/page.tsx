'use client';

import { PageHeader } from '@/components/common';
import ProductCard from '@/components/products/product-card';
import { BrandService } from '@/services';
import { api } from '@/services/api';
import type { Brand, Product } from '@/types';
import Image from 'next/image';
import { use, useEffect, useState } from 'react';
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

const BASE_IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || 'https://api.shtepialodrave.com';

interface BrandPageProps {
  params: Promise<{ slug: string }>;
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-[#D9D9D9]">
      <div
        className={`flex items-center justify-between cursor-pointer ${
          open ? 'bg-[#FFF2D1] border-b border-[#FED776] pb-6 px-4 pt-[18px]' : 'bg-white px-4 py-5'
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
}

export default function BrandPage({ params }: BrandPageProps) {
  const resolvedParams = use(params);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatorInfo, setPaginatorInfo] = useState<any>(null);
  const [selectedSubBrandId, setSelectedSubBrandId] = useState<number | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        setLoading(true);
        const brandData = await BrandService.getBySlug(resolvedParams.slug);
        setBrand(brandData);
      } catch (error) {
        console.error('Error fetching brand:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrand();
  }, [resolvedParams.slug]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!brand) return;

      try {
        setProductsLoading(true);
        const brandId = selectedSubBrandId ?? brand.id;
        const params: any = {
          brand: brandId,
          page: currentPage,
          limit: itemsPerPage,
        };

        if (sortBy === 'price_asc') params.ordering = 'price';
        else if (sortBy === 'price_desc') params.ordering = '-price';
        else if (sortBy === 'newest') params.ordering = '-created_at';
        else if (sortBy === 'sales') params.ordering = '-sold_quantity';
        else if (sortBy === 'name') params.ordering = 'name';

        const response = await api.products.getAll(params);
        setProducts(response.data || []);
        setPaginatorInfo(response.paginatorInfo || null);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, [brand, selectedSubBrandId, sortBy, currentPage, itemsPerPage]);

  const getImageUrl = (path: string | null | undefined) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${BASE_IMAGE_URL}${cleanPath}`;
  };

  if (loading) {
    return (
      <>
        <PageHeader title="Duke ngarkuar..." />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-64"></div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!brand) {
    return (
      <>
        <PageHeader title="Brand nuk u gjet" />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-gray-500">Brandi që po kërkoni nuk u gjet.</p>
          </div>
        </div>
      </>
    );
  }

  const subBrands = brand.children || [];
  const hasSubBrands = subBrands.length > 0;

  const handleSubBrandFilter = (subBrandId: number | null) => {
    setSelectedSubBrandId(subBrandId);
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <PageHeader title={brand.name} />

      <div className="container mx-auto px-4 py-8">
        {/* Brand Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {brand.logo && (
              <div className="w-32 h-32 relative flex-shrink-0">
                <Image
                  src={getImageUrl(brand.logo)!}
                  alt={brand.name}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{brand.name}</h1>
            </div>
          </div>
        </div>

        {/* Mobile Filter Button - only when there are sub-brands */}
        {hasSubBrands && (
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
              Filtra
            </button>
          </div>
        )}

        {showMobileFilters && hasSubBrands && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setShowMobileFilters(false)} />
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sub-brands filter panel */}
          {hasSubBrands && (
            <aside
              className={`
                ${showMobileFilters ? 'fixed right-0 top-0 h-full w-full max-w-sm z-50' : 'hidden'}
                lg:relative lg:block lg:right-auto lg:top-auto lg:h-auto lg:w-64 lg:max-w-none lg:z-auto
                flex-shrink-0
              `}
            >
              <div
                className={`
                  ${showMobileFilters ? 'h-full bg-white shadow-lg' : ''}
                  lg:h-auto lg:bg-transparent lg:shadow-none
                `}
              >
                <div className={`${showMobileFilters ? 'flex' : 'hidden'} items-center justify-between p-4 border-b lg:hidden`}>
                  <h2 className="text-lg font-semibold">Filtra</h2>
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
                <div className={`${showMobileFilters ? 'overflow-y-auto h-[calc(100%-64px)] p-4' : ''} lg:overflow-visible lg:h-auto lg:p-0 lg:sticky lg:top-4`}>
                  <div className="bg-white rounded-lg border border-[#D9D9D9] overflow-hidden">
                    <FilterSection title="Nën-brendet">
                      <label className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity">
                        <input
                          type="radio"
                          name="subBrand"
                          checked={selectedSubBrandId === null}
                          onChange={() => {
                            handleSubBrandFilter(null);
                            setShowMobileFilters(false);
                          }}
                          className="rounded border-gray-300 text-[#FEBC1B] focus:ring-[#FEBC1B]"
                        />
                        <span className="font-albertsans text-[#252323]">Të gjitha</span>
                      </label>
                      {subBrands.map((sub) => (
                        <label key={sub.id} className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity">
                          <input
                            type="radio"
                            name="subBrand"
                            checked={selectedSubBrandId === sub.id}
                            onChange={() => {
                              handleSubBrandFilter(sub.id);
                              setShowMobileFilters(false);
                            }}
                            className="rounded border-gray-300 text-[#FEBC1B] focus:ring-[#FEBC1B]"
                          />
                          <span className="font-albertsans text-[#252323]">{sub.name}</span>
                        </label>
                      ))}
                    </FilterSection>
                  </div>
                </div>
              </div>
            </aside>
          )}

          {/* Products */}
          <main className="flex-1">
            <div className="bg-white rounded-lg p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-gray-600 font-albertsans">{paginatorInfo?.total ?? 0} produkte</p>
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
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="border border-gray-300 rounded px-3 py-1 font-albertsans text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#FEBC1B] focus:border-[#FEBC1B] cursor-pointer sm:flex-initial"
                  >
                    <option value="">Default</option>
                    <option value="name">Emri (A-Z)</option>
                    <option value="sales">Sort by Sales</option>
                    <option value="price_asc">Price low to high</option>
                    <option value="price_desc">Price high to low</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
              </div>
            </div>

            {productsLoading ? (
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
            ) : products.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-lg p-8">
                <p className="text-gray-500 text-lg">Nuk ka produkte me filtrat e zgjedhur.</p>
                <p className="text-gray-400 mt-2">Provoni të ndryshoni filtrat për më shumë rezultate</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} removeMaxWidth={true} />
                  ))}
                </div>

                {paginatorInfo && paginatorInfo.last_page > 1 && (
                  <div className="mt-8">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                        {(() => {
                          const pages = [];
                          const maxPagesToShow = 5;
                          const halfRange = Math.floor(maxPagesToShow / 2);
                          let startPage = Math.max(1, currentPage - halfRange);
                          const endPage = Math.min(paginatorInfo.last_page, startPage + maxPagesToShow - 1);
                          if (endPage - startPage < maxPagesToShow - 1) {
                            startPage = Math.max(1, endPage - maxPagesToShow + 1);
                          }
                          if (startPage > 1) {
                            pages.push(
                              <PaginationItem key={1}>
                                <PaginationLink onClick={() => setCurrentPage(1)} className="cursor-pointer">1</PaginationLink>
                              </PaginationItem>
                            );
                            if (startPage > 2) {
                              pages.push(<PaginationItem key="ellipsis-start"><PaginationEllipsis /></PaginationItem>);
                            }
                          }
                          for (let i = startPage; i <= endPage; i++) {
                            pages.push(
                              <PaginationItem key={i}>
                                <PaginationLink onClick={() => setCurrentPage(i)} isActive={currentPage === i} className="cursor-pointer">{i}</PaginationLink>
                              </PaginationItem>
                            );
                          }
                          if (endPage < paginatorInfo.last_page) {
                            if (endPage < paginatorInfo.last_page - 1) {
                              pages.push(<PaginationItem key="ellipsis-end"><PaginationEllipsis /></PaginationItem>);
                            }
                            pages.push(
                              <PaginationItem key={paginatorInfo.last_page}>
                                <PaginationLink onClick={() => setCurrentPage(paginatorInfo.last_page)} className="cursor-pointer">{paginatorInfo.last_page}</PaginationLink>
                              </PaginationItem>
                            );
                          }
                          return pages;
                        })()}
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, paginatorInfo.last_page))}
                            className={currentPage === paginatorInfo.last_page ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
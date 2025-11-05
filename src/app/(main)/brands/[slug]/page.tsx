'use client';

import { PageHeader } from '@/components/common';
import ProductCard from '@/components/products/product-card';
import { BrandService } from '@/services';
import { api } from '@/services/api';
import type { Brand, Product } from '@/types';
import Image from 'next/image';
import { use, useEffect, useState } from 'react';
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

export default function BrandPage({ params }: BrandPageProps) {
  const resolvedParams = use(params);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatorInfo, setPaginatorInfo] = useState<any>(null);

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
        // Fetch products filtered by brand
        const params: any = {
          brand: brand.id,
          page: currentPage,
          limit: 12,
        };

        // Add ordering based on sortBy
        if (sortBy === 'price_asc') {
          params.ordering = 'price';
        } else if (sortBy === 'price_desc') {
          params.ordering = '-price';
        } else if (sortBy === 'name') {
          params.ordering = 'name';
        }

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
  }, [brand, sortBy, currentPage]);

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

        {/* Filters and View Options */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">


          <div className="relative">


            {showSortDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    setSortBy('name');
                    setCurrentPage(1);
                    setShowSortDropdown(false);
                  }}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-50 ${sortBy === 'name' ? 'bg-gray-50 font-semibold' : ''}`}
                >
                  Emri (A-Z)
                </button>
                <button
                  onClick={() => {
                    setSortBy('price_asc');
                    setCurrentPage(1);
                    setShowSortDropdown(false);
                  }}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-50 ${sortBy === 'price_asc' ? 'bg-gray-50 font-semibold' : ''}`}
                >
                  Çmimi (më i ulëti)
                </button>
                <button
                  onClick={() => {
                    setSortBy('price_desc');
                    setCurrentPage(1);
                    setShowSortDropdown(false);
                  }}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-50 ${sortBy === 'price_desc' ? 'bg-gray-50 font-semibold' : ''}`}
                >
                  Çmimi (më i larti)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Products */}
        {productsLoading ? (
          <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'} gap-6`}>
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-64 animate-pulse"></div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500">Nuk ka produkte të disponueshme për këtë brand.</p>
          </div>
        ) : (
          <>
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'} gap-6`}>
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>

            {/* Pagination */}
            {paginatorInfo && paginatorInfo.last_page > 1 && (
              <div className="mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => {
                          setCurrentPage(prev => Math.max(prev - 1, 1));
                        }}
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
                              onClick={() => {
                                setCurrentPage(1);
                              }}
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
                              onClick={() => {
                                setCurrentPage(i);
                              }}
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
                              onClick={() => {
                                setCurrentPage(paginatorInfo.last_page);
                              }}
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
                        onClick={() => {
                          setCurrentPage(prev => Math.min(prev + 1, paginatorInfo.last_page));
                        }}
                        className={currentPage === paginatorInfo.last_page ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
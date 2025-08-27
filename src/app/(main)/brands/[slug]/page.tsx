'use client';

import { useState, useEffect, use } from 'react';
import { BrandService, ProductService } from '@/services';
import { PageHeader } from '@/components/common';
import ProductCard from '@/components/products/product-card';
import Image from 'next/image';
import type { Brand, Product } from '@/types';
import { ChevronDown, Grid3x3, List } from 'lucide-react';

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
        const productsData = await ProductService.getAll({ 
          brand: brand.id 
        });
        
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, [brand, sortBy]);

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
                    setShowSortDropdown(false);
                  }}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-50 ${sortBy === 'name' ? 'bg-gray-50 font-semibold' : ''}`}
                >
                  Emri (A-Z)
                </button>
                <button
                  onClick={() => {
                    setSortBy('price_asc');
                    setShowSortDropdown(false);
                  }}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-50 ${sortBy === 'price_asc' ? 'bg-gray-50 font-semibold' : ''}`}
                >
                  Çmimi (më i ulëti)
                </button>
                <button
                  onClick={() => {
                    setSortBy('price_desc');
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
          <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'} gap-6`}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
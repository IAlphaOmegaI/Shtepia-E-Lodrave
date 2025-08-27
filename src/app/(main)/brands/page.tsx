'use client';

import { useState, useEffect } from 'react';
import { BrandService } from '@/services';
import { Routes } from '@/config/routes';
import Link from 'next/link';
import Image from 'next/image';
import { PageHeader } from '@/components/common';
import type { Brand } from '@/types';

const BASE_IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || 'https://api.shtepialodrave.com';

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const data = await BrandService.getAll();
        setBrands(data);
      } catch (error) {
        console.error('Error fetching brands:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const getImageUrl = (path: string | null | undefined) => {
    if (!path) return '/placeholder.jpg';
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${BASE_IMAGE_URL}${cleanPath}`;
  };

  return (
    <>
      <PageHeader title="Brandet" />
      
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-40"></div>
                <div className="mt-3 h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : brands.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Nuk u gjetën brande</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={Routes.brand(brand.slug)}
                className="group cursor-pointer"
              >
                <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                  <div className="aspect-square relative bg-gray-50 p-4">
                    {brand.logo ? (
                      <Image
                        src={getImageUrl(brand.logo)}
                        alt={brand.name}
                        fill
                        className="object-contain p-4"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-400">
                          {brand.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-center font-semibold text-gray-800 group-hover:text-[#F44535] transition-colors">
                      {brand.name}
                    </h3>
                    {brand.products_count && brand.products_count > 0 && (
                      <p className="text-center text-sm text-gray-500 mt-1">
                        {brand.products_count} produkte
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
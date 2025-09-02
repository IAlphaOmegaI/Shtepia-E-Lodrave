'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Search, 
  Plus, 
  Edit2, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Package,
  Filter,
  Star,
  ExternalLink
} from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';

const BASE_IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || 'https://api.shtepialodrave.com';

interface ProductImage {
  id: number;
  url: string;
  field_name: string;
}

interface Category {
  id: number;
  name: string;
  parent_name?: string | null;
}

interface Product {
  id: number;
  name: string;
  code?: string;
  description?: string;
  shop?: number;
  brand?: number;
  brand_name?: string;
  categories?: Category[];
  gender?: 'male' | 'female' | 'unisex';
  size?: string | null;
  price: number;
  discount?: number;
  quantity: number;
  availability?: 'available' | 'unavailable';
  images?: ProductImage[];
  slug?: string;
  sale_price?: number;
  sku?: string;
  barcode?: string;
  unit?: string;
  status?: string;
  is_featured?: boolean;
  created_at?: string;
  updated_at?: string;
  rating?: number;
  reviews_count?: number;
  sales_count?: number;
}

interface ProductsResponse {
  data: {
    data: Product[];
  };
  paginatorInfo?: {
    total: number;
    count: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [ordering, setOrdering] = useState<string>('-created_at');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  
  const pageSize = 20;
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Fetch categories for filter
  const { data: categoriesData } = useQuery({
    queryKey: ['categories-filter'],
    queryFn: () => api.categories.getAll(),
  });

  // Fetch products with params
  const { data: productsData, isLoading, error } = useQuery<ProductsResponse>({
    queryKey: ['admin-products', currentPage, debouncedSearch, ordering, selectedCategory, priceRange],
    queryFn: () => api.products.getForAdmin({
      page: currentPage,
      limit: pageSize,
      search: debouncedSearch || undefined,
      ordering: ordering,
      categories: selectedCategory || undefined,
      min_price: priceRange.min ? Number(priceRange.min) : undefined,
      max_price: priceRange.max ? Number(priceRange.max) : undefined,
    }),
  });


  const toggleSorting = (field: string) => {
    if (ordering === field) {
      setOrdering(`-${field}`);
    } else if (ordering === `-${field}`) {
      setOrdering(field);
    } else {
      setOrdering(field);
    }
    setCurrentPage(1);
  };

  const getSortIcon = (field: string) => {
    if (ordering === field) {
      return <ArrowUp className="w-4 h-4 inline ml-1" />;
    } else if (ordering === `-${field}`) {
      return <ArrowDown className="w-4 h-4 inline ml-1" />;
    }
    return <ArrowUpDown className="w-4 h-4 inline ml-1 opacity-50" />;
  };



  const getProductImage = (product: Product) => {
    if (product.images && product.images.length > 0) {
      // Find the main image
      const mainImage = product.images.find(img => img.field_name === 'main_image');
      if (mainImage) {
        return getImageUrl(mainImage.url);
      }
      // Fallback to first image
      return getImageUrl(product.images[0].url);
    }
    return null;
  };

  const getImageUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    // Ensure no double slashes
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${BASE_IMAGE_URL}${cleanPath}`;
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString('sq-AL')} LEK`;
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-red-600">Gabim në ngarkim të produkteve</div>
      </div>
    );
  }

  const products = productsData?.data?.data || [];
  const totalCount = productsData?.paginatorInfo?.total || 0;
  const totalPages = productsData?.paginatorInfo?.last_page || Math.ceil(totalCount / pageSize);

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 md:mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Menaxhimi i Produkteve</h1>
          <p className="text-xs md:text-sm text-gray-600 mt-1">
            Total: {totalCount} produkte
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
          Shto Produkt
        </Link>
      </div>


      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produkti
                  </span>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => toggleSorting('sku')}
                    className="text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                  >
                    SKU
                    {getSortIcon('sku')}
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => toggleSorting('price')}
                    className="text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                  >
                    Çmimi
                    {getSortIcon('price')}
                  </button>
                </th>
                <th className="px-6 py-3 text-center">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategoria
                  </span>
                </th>
                <th className="px-6 py-3 text-center">
                  <button
                    onClick={() => toggleSorting('sales_count')}
                    className="text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                  >
                    Shitje
                    {getSortIcon('sales_count')}
                  </button>
                </th>
                <th className="px-6 py-3 text-right">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Veprime
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Nuk u gjetën produkte
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const productImage = getProductImage(product);
                  
                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {productImage ? (
                            <div className="relative w-12 h-12 mr-3">
                              <Image 
                                src={productImage} 
                                alt={product.name}
                                fill
                                className="rounded-lg object-cover"
                                sizes="48px"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center mr-3">
                              <Package className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                              {product.is_featured && (
                                <Star className="w-4 h-4 inline ml-1 text-yellow-500 fill-current" />
                              )}
                            </div>
                            {product.code && (
                              <div className="text-sm text-gray-500">
                                Code: {product.code}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600 font-mono">
                          {product.code || product.sku || '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          {product.sale_price && product.sale_price < product.price ? (
                            <>
                              <div className="text-sm font-medium text-gray-900">
                                {formatPrice(product.sale_price)}
                              </div>
                              <div className="text-xs text-gray-500 line-through">
                                {formatPrice(product.price)}
                              </div>
                            </>
                          ) : (
                            <div className="text-sm font-medium text-gray-900">
                              {formatPrice(product.price)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {product.categories && product.categories.length > 0 ? (
                          <div className="text-sm text-gray-600">
                            {product.categories.map(cat => 
                              cat.parent_name ? `${cat.parent_name} > ${cat.name}` : cat.name
                            ).join(', ')}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-sm text-gray-600">
                          {product.sales_count || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            href={`/products/${product.id}`}
                            target="_blank"
                            className="text-gray-600 hover:text-gray-900"
                            title="Shiko në faqe"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </Link>
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="text-blue-600 hover:text-blue-900"
                            title="Ndrysho"
                          >
                            <Edit2 className="w-5 h-5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked View */}
        <div className="md:hidden">
          {isLoading ? (
            <div className="p-4 text-center">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Nuk u gjetën produkte
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {products.map((product) => {
                const productImage = getProductImage(product);
                
                return (
                  <div key={product.id} className="p-4 hover:bg-gray-50">
                    {/* Product Header with Image */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start flex-1">
                        {productImage ? (
                          <div className="relative w-16 h-16 mr-3 flex-shrink-0">
                            <Image 
                              src={productImage} 
                              alt={product.name}
                              fill
                              className="rounded-lg object-cover"
                              sizes="64px"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center mr-3 flex-shrink-0">
                            <Package className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-gray-900">
                            {product.name}
                            {product.is_featured && (
                              <Star className="w-3 h-3 inline ml-1 text-yellow-500 fill-current" />
                            )}
                          </h3>
                          {product.code && (
                            <p className="text-xs text-gray-500 mt-1">
                              Code: {product.code}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 font-mono mt-1">
                            SKU: {product.code || product.sku || '—'}
                          </p>
                        </div>
                      </div>
                      {/* Action Buttons */}
                      <div className="flex gap-2 ml-2">
                        <Link
                          href={`/products/${product.id}`}
                          target="_blank"
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                          title="Shiko në faqe"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          title="Ndrysho"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                    
                    {/* Product Details */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {/* Price */}
                      <div>
                        <span className="text-gray-500">Çmimi:</span>
                        <div className="mt-1">
                          {product.sale_price && product.sale_price < product.price ? (
                            <>
                              <div className="font-semibold text-gray-900">
                                {formatPrice(product.sale_price)}
                              </div>
                              <div className="text-gray-500 line-through">
                                {formatPrice(product.price)}
                              </div>
                            </>
                          ) : (
                            <div className="font-semibold text-gray-900">
                              {formatPrice(product.price)}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Sales */}
                      <div>
                        <span className="text-gray-500">Shitje:</span>
                        <div className="font-semibold text-gray-900 mt-1">
                          {product.sales_count || 0}
                        </div>
                      </div>
                      
                      {/* Categories - Full Width */}
                      {product.categories && product.categories.length > 0 && (
                        <div className="col-span-2">
                          <span className="text-gray-500">Kategoria:</span>
                          <div className="text-gray-700 mt-1">
                            {product.categories.map(cat => 
                              cat.parent_name ? `${cat.parent_name} > ${cat.name}` : cat.name
                            ).join(', ')}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-4 py-3 border-t flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Mbrapa
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Para
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Duke shfaqur{' '}
                  <span className="font-medium">
                    {(currentPage - 1) * pageSize + 1}
                  </span>{' '}
                  deri{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * pageSize, totalCount)}
                  </span>{' '}
                  nga{' '}
                  <span className="font-medium">{totalCount}</span>{' '}
                  produkte
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  
                  {/* Page Numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNum
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
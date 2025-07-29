'use client';

import { useState, use } from 'react';
import TreeMenu, { FilterParams } from '@/components/ui/tree-menu';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import ProductCard from '@/components/products/product-card';
import PageHeader from '@/components/common/page-header';

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [sortBy, setSortBy] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterParams, setFilterParams] = useState<FilterParams>({
    categories__slug: slug,
  });
  
  // Fetch products from API with filters
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['categoryProducts', slug, currentPage, itemsPerPage, sortBy, filterParams],
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
      
      return api.products.getAll(params);
    },
  });

  const products = data?.data || [];
  const paginatorInfo = data?.paginatorInfo;
  
  // Get category name from the first product's categories
  const categoryName = products.length > 0 && products[0].categories?.length > 0 
    ? products[0].categories.find(cat => cat.slug === slug)?.name || slug
    : slug;

  // Handle filters applied
  const handleFiltersApplied = (filters: FilterParams) => {
    setFilterParams(filters);
    setCurrentPage(1); // Reset to first page when filters change
    // Scroll to top of products section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Category Header */}
      <PageHeader 
        title={categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} 
        showClouds={true} 
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="w-64 flex-shrink-0">
            <TreeMenu 
              categorySlug={slug} 
              className="bg-white" 
              onFiltersApplied={handleFiltersApplied}
            />
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {/* Products Header */}
            <div className="bg-white rounded-lg p-4 mb-6 flex items-center justify-between">
              <p className="text-gray-600 font-albertsans">{paginatorInfo?.total || 0} produkte</p>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 font-albertsans">Produkte ne faqe:</span>
                  <select 
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="border border-gray-300 rounded px-3 py-1 font-albertsans text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#FEBC1B] focus:border-[#FEBC1B] cursor-pointer"
                  >
                    <option value={12}>12</option>
                    <option value={24}>24</option>
                    <option value={36}>36</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 font-albertsans">Sort:</span>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-1 font-albertsans text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#FEBC1B] focus:border-[#FEBC1B] cursor-pointer"
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
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F11602]"></div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} removeMaxWidth={true} />
                ))}
              </div>
            )}
            
            {/* Pagination */}
            {paginatorInfo && paginatorInfo.last_page > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
                <span className="px-4 py-2 bg-white border rounded">
                  Page {currentPage} of {paginatorInfo.last_page}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, paginatorInfo.last_page))}
                  disabled={currentPage === paginatorInfo.last_page}
                  className="px-4 py-2 bg-white border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
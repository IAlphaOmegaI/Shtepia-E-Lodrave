'use client';

import { useState } from 'react';
import Image from 'next/image';
import TreeMenu from '@/components/ui/tree-menu';
import { ShoppingCartIcon } from '@/components/icons';

interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  discount: string;
  image: string;
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const [sortBy, setSortBy] = useState('Most popular');
  const [itemsPerPage, setItemsPerPage] = useState(12);
  
  // Mock products - in real app, this would come from API
  const products: Product[] = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    name: "LEGO Kitty Fairy's Garden",
    brand: "LEGO",
    price: 3700,
    originalPrice: 3700,
    discount: "60% OFF",
    image: "/featured_category.png" // Using placeholder from public folder
  }));

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Category Banner */}
      <div className="bg-[#FEBC1B] relative overflow-hidden">
        <div className="container mx-auto px-4 py-12">
          <div className="relative z-10 text-center">
            <h1 className="text-5xl font-bold text-[#F11602] font-grandstander mb-4">
              Lodrat
            </h1>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full">
            {/* Add decorative SVGs here similar to the image */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="w-64 flex-shrink-0">
            <TreeMenu items={[]} className="bg-white" />
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {/* Products Header */}
            <div className="bg-white rounded-lg p-4 mb-6 flex items-center justify-between">
              <p className="text-gray-600 font-albertsans">100 produkte</p>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 font-albertsans">Produkte ne faqe:</span>
                  <select 
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="border border-gray-300 rounded px-3 py-1 font-albertsans"
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
                    className="border border-gray-300 rounded px-3 py-1 font-albertsans"
                  >
                    <option value="Most popular">Most popular</option>
                    <option value="Price low to high">Price low to high</option>
                    <option value="Price high to low">Price high to low</option>
                    <option value="Newest">Newest</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                  {/* Product Image */}
                  <div className="relative aspect-square">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                    {product.discount && (
                      <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded">
                        {product.discount}
                      </span>
                    )}
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1 font-albertsans">
                      {product.name}
                    </h3>
                    <p className="text-gray-500 text-sm mb-2 font-albertsans">
                      {product.brand}
                    </p>
                    <div className="flex items-baseline gap-2 mb-3">
                      {product.originalPrice > product.price && (
                        <span className="text-gray-400 line-through text-sm font-albertsans">
                          {product.originalPrice} Lekë
                        </span>
                      )}
                      <span className="text-blue-600 font-bold text-lg font-albertsans">
                        {product.price} Lekë
                      </span>
                    </div>
                    <button className="w-full bg-white border border-red-500 text-red-500 py-2 px-4 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2 font-albertsans">
                      <ShoppingCartIcon className="w-5 h-5" />
                      Shtoje në shportë
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
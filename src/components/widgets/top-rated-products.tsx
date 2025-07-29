import React from 'react';

const TopRatedProducts: React.FC = () => {
  // Mock data for top rated products
  const products = [
    {
      id: 1,
      name: 'Interactive Learning Robot',
      rating: 4.9,
      reviews: 234,
      price: 79.99,
      image: '/placeholder.jpg',
    },
    {
      id: 2,
      name: 'Educational Building Blocks',
      rating: 4.8,
      reviews: 189,
      price: 45.99,
      image: '/placeholder.jpg',
    },
    {
      id: 3,
      name: 'Science Experiment Kit',
      rating: 4.8,
      reviews: 156,
      price: 54.99,
      image: '/placeholder.jpg',
    },
    {
      id: 4,
      name: 'Musical Activity Center',
      rating: 4.7,
      reviews: 143,
      price: 89.99,
      image: '/placeholder.jpg',
    },
    {
      id: 5,
      name: 'Creative Art Set',
      rating: 4.7,
      reviews: 128,
      price: 34.99,
      image: '/placeholder.jpg',
    },
  ];

  return (
    <div className="rounded-lg bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Top Rated Products</h3>
        <a href="/admin/products" className="text-sm text-blue-600 hover:text-blue-800">
          View all →
        </a>
      </div>

      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.id} className="flex items-center space-x-4">
            <div className="h-16 w-16 flex-shrink-0 rounded-lg bg-gray-200"></div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900">{product.name}</h4>
              <div className="mt-1 flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviews})
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">${product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopRatedProducts;
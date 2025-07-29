import React from 'react';

const ProductCountByCategory: React.FC = () => {
  // Mock data for product count by category
  const categories = [
    { name: 'Educational Toys', count: 145, percentage: 28 },
    { name: 'Building & Construction', count: 98, percentage: 19 },
    { name: 'Arts & Crafts', count: 87, percentage: 17 },
    { name: 'Sports & Outdoor', count: 76, percentage: 15 },
    { name: 'Electronic Toys', count: 54, percentage: 10 },
    { name: 'Board Games', count: 43, percentage: 8 },
    { name: 'Others', count: 15, percentage: 3 },
  ];

  const getBarColor = (index: number) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-gray-500',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="rounded-lg bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Products by Category</h3>
        <a href="/admin/categories" className="text-sm text-blue-600 hover:text-blue-800">
          View all →
        </a>
      </div>

      <div className="space-y-4">
        {categories.map((category, index) => (
          <div key={category.name}>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">{category.name}</span>
              <span className="text-gray-600">{category.count} products</span>
            </div>
            <div className="mt-2">
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className={`absolute left-0 top-0 h-full ${getBarColor(index)}`}
                  style={{ width: `${category.percentage}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 border-t pt-4">
        <div>
          <p className="text-sm text-gray-600">Total Products</p>
          <p className="text-2xl font-bold text-gray-900">518</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Categories</p>
          <p className="text-2xl font-bold text-gray-900">7</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCountByCategory;
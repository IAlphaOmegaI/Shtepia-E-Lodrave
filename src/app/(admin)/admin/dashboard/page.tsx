'use client';

import { useState } from 'react';
import { Package, ShoppingBag, Users, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  // Mock data - will be replaced with API calls later
  const [stats] = useState({
    products: 100,
    orders: 100,
    customers: 100,
    revenue: 100,
    orderStatus: {
      pending: 100,
      processing: 100,
      completed: 100,
      cancelled: 100
    }
  });

  const [products] = useState([
    { id: 1, name: 'Text', price: 'Text', stock: 'Text', status: 'Text' },
    { id: 2, name: 'Text', price: 'Text', stock: 'Text', status: 'Text' },
    { id: 3, name: 'Text', price: 'Text', stock: 'Text', status: 'Text' },
    { id: 4, name: 'Text', price: 'Text', stock: 'Text', status: 'Text' },
    { id: 5, name: 'Text', price: 'Text', stock: 'Text', status: 'Text' },
  ]);

  return (
    <div>
      {/* Page Title */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">My profile</h1>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-gray-100 p-3 rounded">
              <Package className="w-6 h-6 text-gray-600" />
            </div>
          </div>
          <div className="text-gray-600 text-sm mb-1">Total</div>
          <div className="text-3xl font-bold">{stats.products}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-gray-100 p-3 rounded">
              <ShoppingBag className="w-6 h-6 text-gray-600" />
            </div>
          </div>
          <div className="text-gray-600 text-sm mb-1">Total</div>
          <div className="text-3xl font-bold">{stats.orders}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-gray-100 p-3 rounded">
              <Users className="w-6 h-6 text-gray-600" />
            </div>
          </div>
          <div className="text-gray-600 text-sm mb-1">Total</div>
          <div className="text-3xl font-bold">{stats.customers}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-gray-100 p-3 rounded">
              <TrendingUp className="w-6 h-6 text-gray-600" />
            </div>
          </div>
          <div className="text-gray-600 text-sm mb-1">Total</div>
          <div className="text-3xl font-bold">{stats.revenue}</div>
        </div>
      </div>

      {/* Order Status Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Order status</h2>
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-gray-100 p-3 rounded">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-gray-600 text-sm mb-1">Pending</div>
            <div className="text-3xl font-bold">{stats.orderStatus.pending}</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-gray-100 p-3 rounded">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <div className="text-gray-600 text-sm mb-1">Processing</div>
            <div className="text-3xl font-bold">{stats.orderStatus.processing}</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-gray-100 p-3 rounded">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-gray-600 text-sm mb-1">Completed</div>
            <div className="text-3xl font-bold">{stats.orderStatus.completed}</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-gray-100 p-3 rounded">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-gray-600 text-sm mb-1">Cancelled</div>
            <div className="text-3xl font-bold">{stats.orderStatus.cancelled}</div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Products</h2>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add more
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#FEC949]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Text <button className="ml-1">⬆</button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Text <button className="ml-1">⬆</button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Text <button className="ml-1">⬆</button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Text <button className="ml-1">⬆</button>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
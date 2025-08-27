import React from 'react';
import Link from 'next/link';

interface RecentOrdersProps {
  className?: string;
}

const RecentOrders: React.FC<RecentOrdersProps> = ({ className }) => {
  // Mock data for recent orders
  const orders = [
    {
      id: '#3203',
      customer: 'John Doe',
      date: '2024-01-15',
      total: 125.50,
      status: 'completed',
      items: 3,
    },
    {
      id: '#3202',
      customer: 'Jane Smith',
      date: '2024-01-15',
      total: 89.99,
      status: 'processing',
      items: 2,
    },
    {
      id: '#3201',
      customer: 'Mike Johnson',
      date: '2024-01-14',
      total: 256.00,
      status: 'pending',
      items: 5,
    },
    {
      id: '#3200',
      customer: 'Sarah Williams',
      date: '2024-01-14',
      total: 45.80,
      status: 'completed',
      items: 1,
    },
    {
      id: '#3199',
      customer: 'David Brown',
      date: '2024-01-13',
      total: 178.25,
      status: 'cancelled',
      items: 4,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`rounded-lg bg-white p-6 ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
        <Link href="/admin/orders" className="text-sm text-blue-600 hover:text-blue-800">
          View all →
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left">
              <th className="pb-3 text-sm font-medium text-gray-700">Order ID</th>
              <th className="pb-3 text-sm font-medium text-gray-700">Customer</th>
              <th className="pb-3 text-sm font-medium text-gray-700">Date</th>
              <th className="pb-3 text-sm font-medium text-gray-700">Items</th>
              <th className="pb-3 text-sm font-medium text-gray-700">Total</th>
              <th className="pb-3 text-sm font-medium text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="py-3 text-sm">{order.id}</td>
                <td className="py-3 text-sm font-medium text-gray-900">{order.customer}</td>
                <td className="py-3 text-sm text-gray-600">{order.date}</td>
                <td className="py-3 text-sm text-gray-600">{order.items}</td>
                <td className="py-3 text-sm font-medium">${order.total.toFixed(2)}</td>
                <td className="py-3">
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;
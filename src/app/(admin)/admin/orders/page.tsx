'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Package,
  Eye,
  Edit,
  Calendar,
  User,
  DollarSign,
  Filter,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Truck,
  RefreshCw,
  PackageX,
  Home,
} from 'lucide-react';

interface OrderCustomer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
}

interface OrderItem {
  id: number;
  product: {
    id: number;
    name: string;
    brand?: string;
    price: string;
  };
  quantity: number;
  price: string;
  total_price: string;
}

interface Order {
  id: number;
  order_number: string;
  tracking_code: string;
  customer?: OrderCustomer;
  status: 'pending' | 'processing' | 'complete' | 'cancelled' | 'refunded' | 'failed' | 'local_facility' | 'out_for_delivery';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method: 'cash' | 'card' | 'paypal' | 'stripe';
  subtotal: string;
  shipping_cost: string;
  tax_amount: string;
  total_price: string;
  items?: OrderItem[];
  items_count?: string;
  created_at: string;
  updated_at: string;
  shipping_notes?: string;
  order_notes?: string;
}

interface PaginatorInfo {
  total: number;
  current_page: number;
  count: number;
  last_page: number;
  firstItem: number;
  lastItem: number;
  per_page: number;
  first_page_url: string;
  last_page_url: string;
  next_page_url: string | null;
  prev_page_url: string | null;
}

interface OrdersResponse {
  data: Order[];
  paginatorInfo: PaginatorInfo;
}

const statusConfig = {
  pending: { label: 'Në Pritje', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  processing: { label: 'Duke u Procesuar', color: 'bg-blue-100 text-blue-800', icon: RefreshCw },
  complete: { label: 'E Kompletuar', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  cancelled: { label: 'E Anuluar', color: 'bg-red-100 text-red-800', icon: XCircle },
  refunded: { label: 'E Rimbursuar', color: 'bg-purple-100 text-purple-800', icon: RefreshCw },
  failed: { label: 'Dështuar', color: 'bg-red-100 text-red-800', icon: AlertCircle },
  local_facility: { label: 'Në Depo Lokale', color: 'bg-indigo-100 text-indigo-800', icon: Home },
  out_for_delivery: { label: 'Në Shpërndarje', color: 'bg-orange-100 text-orange-800', icon: Truck },
};

const paymentStatusConfig = {
  pending: { label: 'Në Pritje', color: 'bg-yellow-100 text-yellow-800' },
  paid: { label: 'E Paguar', color: 'bg-green-100 text-green-800' },
  failed: { label: 'Dështuar', color: 'bg-red-100 text-red-800' },
  refunded: { label: 'E Rimbursuar', color: 'bg-purple-100 text-purple-800' },
};

export default function OrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1');

  // Fetch orders
  const { data: ordersData, isLoading } = useQuery<OrdersResponse>({
    queryKey: ['orders', currentPage],
    queryFn: () => api.orders.list({
      page: currentPage,
      limit: 10,
    }),
  });

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/admin/orders?${params.toString()}`);
  };

  const getStatusIcon = (status: Order['status']) => {
    const StatusIcon = statusConfig[status]?.icon || Package;
    return <StatusIcon className="w-4 h-4" />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const formatPrice = (price: string) => {
    return `${parseFloat(price).toFixed(2)} LEK`;
  };

  // Calculate total pages
  const totalPages = ordersData?.paginatorInfo?.last_page || 1;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Porositë</h1>
          <p className="text-sm text-gray-600 mt-1">
            Menaxho dhe shiko të gjitha porositë
          </p>
        </div>
      </div>


      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Porosia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Klienti
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statusi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pagesa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Totali
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Veprimet
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : ordersData?.data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Nuk u gjetën porosi
                  </td>
                </tr>
              ) : (
                ordersData?.data.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            #{order.order_number}
                          </div>
                          <div className="text-xs text-gray-500">
                            Kodi: {order.tracking_code}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.items_count || 0} artikuj
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {order.customer ? (
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {order.customer.first_name} {order.customer.last_name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {order.customer.email}
                            </div>
                            {order.customer.phone_number && (
                              <div className="text-xs text-gray-500">
                                {order.customer.phone_number}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Klient i paregjistruar</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(order.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusConfig[order.status]?.color || 'bg-gray-100 text-gray-800'}`}>
                            {statusConfig[order.status]?.label || order.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${paymentStatusConfig[order.payment_status]?.color || 'bg-gray-100 text-gray-800'}`}>
                          {paymentStatusConfig[order.payment_status]?.label || order.payment_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatPrice(order.total_price)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="Shiko Detajet"
                          >
                            <Eye className="w-5 h-5" />
                          </Link>
                          <Link
                            href={`/admin/orders/${order.id}/edit`}
                            className="text-green-600 hover:text-green-800 transition-colors"
                            title="Ndrysho"
                          >
                            <Edit className="w-5 h-5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {ordersData && ordersData.paginatorInfo.total > ordersData.paginatorInfo.per_page && (
          <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!ordersData.paginatorInfo.prev_page_url}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Mbrapa
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!ordersData.paginatorInfo.next_page_url}
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
                    {(currentPage - 1) * ordersData.paginatorInfo.per_page + 1}
                  </span>{' '}
                  deri{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * ordersData.paginatorInfo.per_page, ordersData.paginatorInfo.total)}
                  </span>{' '}
                  nga{' '}
                  <span className="font-medium">{ordersData.paginatorInfo.total}</span>{' '}
                  rezultate
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!ordersData.paginatorInfo.prev_page_url}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  
                  {/* Page numbers */}
                  {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = idx + 1;
                    } else if (currentPage <= 3) {
                      pageNum = idx + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + idx;
                    } else {
                      pageNum = currentPage - 2 + idx;
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handlePageChange(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          pageNum === currentPage
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!ordersData.paginatorInfo.next_page_url}
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
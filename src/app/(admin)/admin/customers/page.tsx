'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { 
  Users,
  Mail,
  ChevronLeft, 
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  UserCheck
} from 'lucide-react';

interface Customer {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user' | 'customer';
  phone_number?: string | null;
  date_of_birth?: string | null;
  address?: string;
  bio?: string;
  contact?: string | null;
}

interface CustomersResponse {
  data?: Customer[];
  results?: Customer[];
  count?: number;
  total?: number;
  current_page?: number;
  total_pages?: number;
  per_page?: number;
}

export default function CustomersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [ordering, setOrdering] = useState<string>('-id');
  
  const pageSize = 20;

  // Fetch customers
  const { data: customersData, isLoading, error } = useQuery<CustomersResponse>({
    queryKey: ['admin-customers', currentPage, ordering],
    queryFn: () => api.customers.getAll({
      page: currentPage,
      limit: pageSize,
      ordering: ordering,
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


  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-red-600">Gabim në ngarkim të klientëve</div>
      </div>
    );
  }

  const customers = customersData?.data || customersData?.results || [];
  const totalCount = customersData?.count || customersData?.total || 0;
  const totalPages = customersData?.total_pages || Math.ceil(totalCount / pageSize);

  return (
    <div>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Klientët</h1>
          <p className="text-xs md:text-sm text-gray-600 mt-0.5 md:mt-1">
            Total: {totalCount} klientë
          </p>
        </div>
      </div>

      {/* Customers Table - Desktop */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => toggleSorting('username')}
                    className="text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                  >
                    Klienti
                    {getSortIcon('username')}
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kontakti
                  </span>
                </th>
                <th className="px-6 py-3 text-left">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Telefon
                  </span>
                </th>
                <th className="px-6 py-3 text-left">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Adresa
                  </span>
                </th>
                <th className="px-6 py-3 text-center">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Roli
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Nuk u gjetën klientë
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                          <Users className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {customer.username}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: #{customer.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Mail className="w-4 h-4 mr-1 text-gray-400" />
                        {customer.email}
                      </div>
                      {customer.bio && (
                        <div className="text-sm text-gray-500 truncate max-w-xs" title={customer.bio}>
                          {customer.bio}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {customer.phone_number || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 truncate max-w-xs block" title={customer.address}>
                        {customer.address || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {customer.role === 'admin' ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                          <UserCheck className="w-3 h-3 mr-1" />
                          Admin
                        </span>
                      ) : customer.role === 'user' ? (
                        <span className="px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          <Users className="w-3 h-3 mr-1" />
                          Përdorues
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          <Users className="w-3 h-3 mr-1" />
                          Klient
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Customers Cards - Mobile */}
        <div className="md:hidden">
          {isLoading ? (
            <div className="p-4 text-center">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            </div>
          ) : customers.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Nuk u gjetën klientë
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {customers.map((customer) => (
                <div key={customer.id} className="p-4 hover:bg-gray-50">
                  {/* Customer Header */}
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                      <Users className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {customer.username}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: #{customer.id}
                      </div>
                    </div>
                    {customer.role === 'admin' ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                        <UserCheck className="w-3 h-3 mr-1" />
                        Admin
                      </span>
                    ) : customer.role === 'user' ? (
                      <span className="px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        <Users className="w-3 h-3 mr-1" />
                        Përdorues
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        <Users className="w-3 h-3 mr-1" />
                        Klient
                      </span>
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-900">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="truncate">{customer.email}</span>
                    </div>
                    {customer.phone_number && (
                      <div className="text-gray-900">
                        <span className="text-xs text-gray-500">Telefon: </span>
                        {customer.phone_number}
                      </div>
                    )}
                    {customer.address && (
                      <div className="text-gray-900">
                        <span className="text-xs text-gray-500">Adresa: </span>
                        <span className="truncate">{customer.address}</span>
                      </div>
                    )}
                    {customer.bio && (
                      <div className="text-gray-500 text-xs truncate">
                        {customer.bio}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-3 md:px-4 py-3 border-t flex items-center justify-between">
            <div className="flex-1 flex justify-between md:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 border border-gray-300 text-xs md:text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Mbrapa
              </button>
              <span className="text-xs text-gray-700 self-center">
                Faqe {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 border border-gray-300 text-xs md:text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Para
              </button>
            </div>
            <div className="hidden md:flex-1 md:flex md:items-center md:justify-between">
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
                  klientë
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
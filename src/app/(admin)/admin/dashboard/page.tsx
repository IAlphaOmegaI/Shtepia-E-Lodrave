'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Package, ShoppingBag, Users, TrendingUp, DollarSign, Calendar } from 'lucide-react';

interface AnalyticsData {
  totalRevenue: number;
  totalShops: number;
  totalVendors: number;
  todaysRevenue: number;
  totalOrders: number;
  newCustomers: number;
  todayTotalOrderByStatus: {
    pending: number;
    processing: number;
    complete: number;
    cancelled: number;
    refunded: number;
    failed: number;
    localFacility: number;
    outForDelivery: number;
  };
  weeklyTotalOrderByStatus: {
    pending: number;
    processing: number;
    complete: number;
    cancelled: number;
    refunded: number;
    failed: number;
    localFacility: number;
    outForDelivery: number;
  };
  monthlyTotalOrderByStatus: {
    pending: number;
    processing: number;
    complete: number;
    cancelled: number;
    refunded: number;
    failed: number;
    localFacility: number;
    outForDelivery: number;
  };
  yearlyTotalOrderByStatus: {
    pending: number;
    processing: number;
    complete: number;
    cancelled: number;
    refunded: number;
    failed: number;
    localFacility: number;
    outForDelivery: number;
  };
  totalYearSaleByMonth: Array<{
    month: string;
    total: number;
  }>;
}

export default function AdminDashboard() {
  const [activeTimeFrame, setActiveTimeFrame] = useState<'today' | 'weekly' | 'monthly' | 'yearly'>('today');
  
  // Fetch analytics data from API
  const { data: analyticsData, isLoading, error } = useQuery<AnalyticsData>({
    queryKey: ['analytics'],
    queryFn: () => api.analytics.getDashboard(),
    refetchInterval: 60000, // Refresh every minute
  });

  const getOrderStatusByTimeframe = () => {
    if (!analyticsData) return null;
    
    switch (activeTimeFrame) {
      case 'today':
        return analyticsData.todayTotalOrderByStatus;
      case 'weekly':
        return analyticsData.weeklyTotalOrderByStatus;
      case 'monthly':
        return analyticsData.monthlyTotalOrderByStatus;
      case 'yearly':
        return analyticsData.yearlyTotalOrderByStatus;
      default:
        return analyticsData.todayTotalOrderByStatus;
    }
  };

  const orderStatus = getOrderStatusByTimeframe();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Duke ngarkuar...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-red-600">Gabim në ngarkim të të dhënave</div>
      </div>
    );
  }

  if (!analyticsData) {
    return null;
  }

  // Calculate highest selling month
  const highestSellingMonth = analyticsData.totalYearSaleByMonth.reduce((prev, current) => 
    (prev.total > current.total) ? prev : current
  , { month: '', total: 0 });

  return (
    <div>
      {/* Page Title */}
      <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-6">Dashboard</h1>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-green-100 p-2 md:p-3 rounded">
              <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
            </div>
          </div>
          <div className="text-gray-600 text-xs md:text-sm mb-1">Total të Ardhurat</div>
          <div className="text-xl md:text-3xl font-bold"> {analyticsData.totalRevenue.toLocaleString()} LEK</div>
          <div className="text-xs md:text-sm text-gray-500 mt-1">Të gjitha kohët</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-blue-100 p-2 md:p-3 rounded">
              <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
            </div>
          </div>
          <div className="text-gray-600 text-xs md:text-sm mb-1">Total Porositë</div>
          <div className="text-xl md:text-3xl font-bold">{analyticsData.totalOrders}</div>
          <div className="text-xs md:text-sm text-gray-500 mt-1">Të gjitha kohët</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-purple-100 p-2 md:p-3 rounded">
              <Users className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
            </div>
          </div>
          <div className="text-gray-600 text-xs md:text-sm mb-1">Klientë të Rinj</div>
          <div className="text-xl md:text-3xl font-bold">{analyticsData.newCustomers}</div>
          <div className="text-xs md:text-sm text-gray-500 mt-1">Sot</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-orange-100 p-2 md:p-3 rounded">
              <Calendar className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
            </div>
          </div>
          <div className="text-gray-600 text-xs md:text-sm mb-1">Të Ardhurat e Sotme</div>
          <div className="text-xl md:text-3xl font-bold"> {analyticsData.todaysRevenue.toLocaleString()} LEK</div>
          <div className="text-xs md:text-sm text-gray-500 mt-1">Sot</div>
        </div>
      </div>

      {/* Order Status Section */}
      <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-3">
          <h2 className="text-base md:text-lg font-semibold text-gray-800">Statusi i Porosive</h2>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveTimeFrame('today')}
              className={`flex-1 sm:flex-initial px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base rounded ${
                activeTimeFrame === 'today' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Sot
            </button>
            <button
              onClick={() => setActiveTimeFrame('weekly')}
              className={`flex-1 sm:flex-initial px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base rounded ${
                activeTimeFrame === 'weekly' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Javore
            </button>
            <button
              onClick={() => setActiveTimeFrame('monthly')}
              className={`flex-1 sm:flex-initial px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base rounded ${
                activeTimeFrame === 'monthly' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Mujore
            </button>
            <button
              onClick={() => setActiveTimeFrame('yearly')}
              className={`flex-1 sm:flex-initial px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base rounded ${
                activeTimeFrame === 'yearly' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Vjetore
            </button>
          </div>
        </div>

        {orderStatus && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <div className="text-center p-3 md:p-4 bg-yellow-50 rounded">
              <div className="text-lg md:text-2xl font-bold text-yellow-600">{orderStatus.pending}</div>
              <div className="text-xs md:text-sm text-gray-600 mt-1">Në Pritje</div>
            </div>
            <div className="text-center p-3 md:p-4 bg-blue-50 rounded">
              <div className="text-lg md:text-2xl font-bold text-blue-600">{orderStatus.processing}</div>
              <div className="text-xs md:text-sm text-gray-600 mt-1">Në Përpunim</div>
            </div>
            <div className="text-center p-3 md:p-4 bg-green-50 rounded">
              <div className="text-lg md:text-2xl font-bold text-green-600">{orderStatus.complete}</div>
              <div className="text-xs md:text-sm text-gray-600 mt-1">Të Përfunduara</div>
            </div>
            <div className="text-center p-3 md:p-4 bg-red-50 rounded">
              <div className="text-lg md:text-2xl font-bold text-red-600">{orderStatus.cancelled}</div>
              <div className="text-xs md:text-sm text-gray-600 mt-1">Të Anuluara</div>
            </div>
          </div>
        )}
      </div>

      {/* Sales by Month */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Shitjet Sipas Muajit</h2>
          <div className="space-y-3">
            {analyticsData.totalYearSaleByMonth.slice(0, 6).map((monthData) => (
              <div key={monthData.month} className="flex justify-between items-center">
                <span className="text-gray-600">{monthData.month}</span>
                <span className="font-semibold">{monthData.total} porosi</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Statistika të Shpejta</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Total Dyqane</span>
              <span className="font-semibold text-lg">{analyticsData.totalShops}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Total Shitës</span>
              <span className="font-semibold text-lg">{analyticsData.totalVendors}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Muaji më i mirë</span>
              <span className="font-semibold text-lg">{highestSellingMonth.month}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Shitjet e muajit më të mirë</span>
              <span className="font-semibold text-lg">{highestSellingMonth.total} porosi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Sales Details */}
      <div className="bg-white rounded-lg shadow p-4 md:p-6 mt-4 md:mt-6">
        <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Detajet e Shitjeve Mujore</h2>
        <div className="overflow-x-auto -mx-4 md:mx-0">
          <table className="w-full min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Muaji
                </th>
                <th className="px-3 md:px-4 py-2 md:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Porosi
                </th>
                <th className="px-3 md:px-4 py-2 md:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statusi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analyticsData.totalYearSaleByMonth.map((monthData) => (
                <tr key={monthData.month}>
                  <td className="px-3 md:px-4 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium text-gray-900">
                    {monthData.month}
                  </td>
                  <td className="px-3 md:px-4 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500 text-right">
                    {monthData.total}
                  </td>
                  <td className="px-3 md:px-4 py-3 md:py-4 whitespace-nowrap text-right">
                    {monthData.total > 0 ? (
                      <span className="px-1.5 md:px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Aktiv
                      </span>
                    ) : (
                      <span className="px-1.5 md:px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        Pa aktivitet
                      </span>
                    )}
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
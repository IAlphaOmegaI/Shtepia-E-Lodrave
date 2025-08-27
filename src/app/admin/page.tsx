'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import StickerCard from '@/components/widgets/sticker-card';
import OrderStatusWidget from '@/components/widgets/order-status-widget';
import TopRatedProducts from '@/components/widgets/top-rated-products';
import ProductCountByCategory from '@/components/widgets/product-count-by-category';
import RecentOrders from '@/components/widgets/recent-orders';

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
  const [activeTimeFrame, setActiveTimeFrame] = useState(1);
  const [orderDataRange, setOrderDataRange] = useState<any>(null);

  const timeFrame = [
    { name: 'Today', day: 1 },
    { name: 'Weekly', day: 7 },
    { name: 'Monthly', day: 30 },
    { name: 'Yearly', day: 365 },
  ];

  // Fetch analytics data from API
  const { data: analyticsData, isLoading, error } = useQuery<AnalyticsData>({
    queryKey: ['analytics'],
    queryFn: () => api.analytics.getDashboard(),
    refetchInterval: 60000, // Refresh every minute
  });

  useEffect(() => {
    if (analyticsData) {
      // Map the order status data based on selected timeframe
      // Note: API uses 'cancelled' instead of 'cancel'
      const mapOrderStatus = (status: any) => ({
        pending: status.pending || 0,
        processing: status.processing || 0,
        complete: status.complete || 0,
        cancel: status.cancelled || 0, // Map cancelled to cancel for widget compatibility
      });

      switch (activeTimeFrame) {
        case 1:
          setOrderDataRange(mapOrderStatus(analyticsData.todayTotalOrderByStatus));
          break;
        case 7:
          setOrderDataRange(mapOrderStatus(analyticsData.weeklyTotalOrderByStatus));
          break;
        case 30:
          setOrderDataRange(mapOrderStatus(analyticsData.monthlyTotalOrderByStatus));
          break;
        case 365:
          setOrderDataRange(mapOrderStatus(analyticsData.yearlyTotalOrderByStatus));
          break;
        default:
          setOrderDataRange(mapOrderStatus(analyticsData.todayTotalOrderByStatus));
          break;
      }
    }
  }, [activeTimeFrame, analyticsData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Duke ngarkuar...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-red-600">Gabim në ngarkim të të dhënave</div>
      </div>
    );
  }

  if (!analyticsData) {
    return null;
  }

  const salesByYear = analyticsData.totalYearSaleByMonth.map((item) => item.total);

  return (
    <div className="grid gap-7 md:gap-8 lg:grid-cols-2 2xl:grid-cols-12">
      {/* Summary Cards */}
      <div className="col-span-full rounded-lg bg-white p-6 md:p-7">
        <div className="mb-5 flex items-center justify-between md:mb-7">
          <h3 className="text-lg font-semibold text-gray-900">Summary</h3>
        </div>

        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StickerCard
            title="Total Revenue"
            icon={
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            color="#1EAE98"
            price={`ALL ${analyticsData.totalRevenue.toLocaleString()}`}
          />
          <StickerCard
            title="Total Orders"
            icon={
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            }
            color="#865DFF"
            price={analyticsData.totalOrders}
          />
          <StickerCard
            title="New Customers"
            icon={
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            }
            color="#D74EFF"
            price={analyticsData.newCustomers}
          />
          <StickerCard
            title="Today's Revenue"
            icon={
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            }
            color="#E157A0"
            price={`ALL ${analyticsData.todaysRevenue.toLocaleString()}`}
          />
        </div>
      </div>

      {/* Order Status */}
      <div className="col-span-full rounded-lg bg-white p-6 md:p-7">
        <div className="mb-5 items-center justify-between sm:flex md:mb-7">
          <h3 className="text-lg font-semibold text-gray-900">Order Status</h3>
          <div className="mt-3.5 inline-flex rounded-full bg-gray-100/80 p-1.5 sm:mt-0">
            {timeFrame.map((time) => (
              <div key={time.day} className="relative">
                <button
                  className={`relative z-10 h-7 rounded-full px-2.5 text-sm font-medium transition-colors ${
                    time.day === activeTimeFrame
                      ? 'text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  type="button"
                  onClick={() => setActiveTimeFrame(time.day)}
                >
                  {time.name}
                </button>
                {time.day === activeTimeFrame && (
                  <div className="absolute inset-0 z-0 h-full rounded-full bg-blue-100" />
                )}
              </div>
            ))}
          </div>
        </div>

        {orderDataRange && <OrderStatusWidget order={orderDataRange} />}
      </div>

     

      {/* Recent Orders */}
      <RecentOrders className="col-span-full" />

      {/* Top Rated Products */}
      <div className="lg:col-span-1 2xl:col-span-5">
        <TopRatedProducts />
      </div>

      {/* Product Count by Category */}
      <div className="lg:col-span-1 2xl:col-span-7">
        <ProductCountByCategory />
      </div>
    </div>
  );
}
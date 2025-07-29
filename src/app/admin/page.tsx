'use client';

import { useEffect, useState } from 'react';
import StickerCard from '@/components/widgets/sticker-card';
import OrderStatusWidget from '@/components/widgets/order-status-widget';
import TopRatedProducts from '@/components/widgets/top-rated-products';
import ProductCountByCategory from '@/components/widgets/product-count-by-category';
import RecentOrders from '@/components/widgets/recent-orders';

export default function AdminDashboard() {
  const [activeTimeFrame, setActiveTimeFrame] = useState(1);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API calls
  const mockData = {
    totalRevenue: 125000,
    totalOrders: 345,
    totalVendors: 28,
    totalShops: 15,
    todayTotalOrderByStatus: {
      pending: 12,
      processing: 8,
      complete: 15,
      cancel: 2,
    },
    weeklyTotalOrderByStatus: {
      pending: 45,
      processing: 32,
      complete: 89,
      cancel: 12,
    },
    monthlyTotalOrderByStatus: {
      pending: 156,
      processing: 98,
      complete: 342,
      cancel: 45,
    },
    yearlyTotalOrderByStatus: {
      pending: 890,
      processing: 678,
      complete: 2341,
      cancel: 234,
    },
    totalYearSaleByMonth: [
      { total: 12000 }, { total: 15000 }, { total: 18000 },
      { total: 14000 }, { total: 22000 }, { total: 19000 },
      { total: 25000 }, { total: 28000 }, { total: 24000 },
      { total: 21000 }, { total: 18000 }, { total: 16000 },
    ],
  };

  const [orderDataRange, setOrderDataRange] = useState(mockData.todayTotalOrderByStatus);

  const timeFrame = [
    { name: 'Today', day: 1 },
    { name: 'Weekly', day: 7 },
    { name: 'Monthly', day: 30 },
    { name: 'Yearly', day: 365 },
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  useEffect(() => {
    switch (activeTimeFrame) {
      case 1:
        setOrderDataRange(mockData.todayTotalOrderByStatus);
        break;
      case 7:
        setOrderDataRange(mockData.weeklyTotalOrderByStatus);
        break;
      case 30:
        setOrderDataRange(mockData.monthlyTotalOrderByStatus);
        break;
      case 365:
        setOrderDataRange(mockData.yearlyTotalOrderByStatus);
        break;
      default:
        setOrderDataRange(mockData.todayTotalOrderByStatus);
        break;
    }
  }, [activeTimeFrame]);

  const salesByYear = mockData.totalYearSaleByMonth.map((item) => item.total);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

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
            price={`$${mockData.totalRevenue.toLocaleString()}`}
          />
          <StickerCard
            title="Total Orders"
            icon={
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            }
            color="#865DFF"
            price={mockData.totalOrders}
          />
          <StickerCard
            title="Active Vendors"
            icon={
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            color="#D74EFF"
            price={mockData.totalVendors}
          />
          <StickerCard
            title="Total Shops"
            icon={
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
            color="#E157A0"
            price={mockData.totalShops}
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

        <OrderStatusWidget order={orderDataRange} />
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
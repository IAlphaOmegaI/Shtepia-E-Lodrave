'use client';

import { useState } from 'react';
import { ChevronDownIcon } from '@/components/icons/chevron-down';
import { ChevronUpIcon } from '@/components/icons/chevron-up';
import { BoxIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { formatDistance } from 'date-fns';
import { sq } from 'date-fns/locale';
import Image from 'next/image';
import Link from 'next/link';
import { Routes } from '@/config/routes';

interface OrderItem {
  id: number;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  tracking_number: string;
  status: string;
  created_at: string;
  total: number;
  items: OrderItem[];
}

export default function OrdersPage() {
  const [expandedOrders, setExpandedOrders] = useState<number[]>([]);
  
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await api.orders.list();
      return response.data || [];
    },
  });

  const toggleOrderExpanded = (orderId: number) => {
    setExpandedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Në pritje';
      case 'processing':
        return 'Në përpunim';
      case 'completed':
        return 'Përfunduar';
      case 'cancelled':
        return 'Anuluar';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-16 text-center">
        <div className="w-12 h-12 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <BoxIcon className="w-12 h-12 text-[#D09A16]" />
        </div>
        <h2 className="text-2xl font-grandstander font-bold text-[#D09A16] mb-2">
          Ende pa porosi?
        </h2>
        <p className="text-gray-600 font-albertsans mb-6">
          Duket sikur nuk keni bërë asnjë porosi ende.
        </p>
        <Link
          href={Routes.products}
          className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-albertsans font-medium"
        >
          Filloni blerjet
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-grandstander font-bold">Porositë e mia</h2>
      </div>
      
      <div className="divide-y">
        {orders.map((order : Order) => {
          const isExpanded = expandedOrders.includes(order.id);
          
          return (
            <div key={order.id} className="p-6">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleOrderExpanded(order.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="font-albertsans font-medium">
                      Porosia #{order.tracking_number}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-albertsans ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 font-albertsans">
                    {formatDistance(new Date(order.created_at), new Date(), {
                      addSuffix: true,
                      locale: sq,
                    })}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="font-albertsans font-bold text-lg">
                    {order.total} Lekë
                  </span>
                  {isExpanded ? (
                    <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </div>
              
              {isExpanded && (
                <div className="mt-6 space-y-4">
                  {order.items.map((item : OrderItem) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <Image
                        src={item.product_image}
                        alt={item.product_name}
                        width={80}
                        height={80}
                        className="rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-albertsans font-medium">{item.product_name}</h4>
                        <p className="text-sm text-gray-600 font-albertsans">
                          Sasia: {item.quantity}
                        </p>
                      </div>
                      <span className="font-albertsans font-medium">
                        {item.price * item.quantity} Lekë
                      </span>
                    </div>
                  ))}
                  
                  <div className="flex justify-between items-center pt-4 border-t">
                    <button className="text-red-600 hover:text-red-700 font-albertsans font-medium">
                      Gjurmo porosinë
                    </button>
                    <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-albertsans">
                      Bli përsëri
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
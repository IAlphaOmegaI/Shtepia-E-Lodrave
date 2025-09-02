'use client';

import { useState, useEffect } from 'react';
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
import { useCart } from '@/store/quick-cart/cart.context';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/contexts/toast-context';

interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  sale_price: string | null;
  image: string | null;
  brand?: {
    id: number;
    name: string;
    logo: string | null;
  };
}

interface ShippingInfo {
  first_name?: string;
  last_name?: string;
  address?: string;
  city?: string;
  country?: string;
  zip_code?: string;
  contact_phone?: string;
}

interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  price: string;
  total_price: string;
}

interface Customer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  phone_number?: string;
  user_points: number;
  addresses: any[];
  loyalty_points: Array<{
    from_order: string;
    points: number;
    used: boolean;
    expiry: string;
    created_at: string;
    is_expired: boolean;
  }>;
}

interface Order {
  id: number;
  order_number: string;
  tracking_code: string;
  customer: Customer;
  shop?: {
    id: number;
    name: string;
  };
  vendor?: string;
  status: string;
  payment_status: string;
  payment_method: string;
  created_at: string;
  subtotal: string;
  shipping_cost: string;
  tax_amount?: string;
  total_price: string;
  loyalty_applied?: number;
  loyalty_points?: {
    value: number;
    used: boolean;
    expiry: string;
    created_at: string;
    is_expired: boolean;
  };
  items: OrderItem[];
  shipping_address?: ShippingInfo | null;
  billing_address?: ShippingInfo | null;
  shipping_notes?: string;
  order_notes?: string;
  items_count?: number;
  can_be_cancelled: boolean;
  can_be_refunded: boolean;
}

export default function OrdersPage() {
  const [expandedOrders, setExpandedOrders] = useState<number[]>([]);
  const itemsPerPage = 5;
  const { addItem, clearCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  
  // Get current page from URL params, default to 1
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  
  const { data: ordersResponse, isLoading } = useQuery({
    queryKey: ['orders', currentPage],
    queryFn: async () => {
      const response = await api.orders.list({ 
        page: currentPage, 
        limit: itemsPerPage 
      });
      return response;
    },
  });

  const orders = ordersResponse?.data || [];
  const totalPages = Math.ceil((ordersResponse?.paginatorInfo?.total || 0) / itemsPerPage);

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
      case 'delivered':
        return 'Dorëzuar';
      case 'shipped':
        return 'Dërguar';
      case 'placed':
        return 'Placed';
      default:
        return status;
    }
  };

  const formatAddress = (info?: ShippingInfo | null) => {
    if (!info) return 'N/A';
    const parts = [];
    if (info.address) parts.push(info.address);
    if (info.city) parts.push(info.city);
    if (info.country) parts.push(info.country);
    if (info.zip_code) parts.push(info.zip_code);
    return parts.join(', ') || 'N/A';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'cash':
        return 'Para në dorëzim';
      case 'card':
        return 'Kartë krediti';
      case 'paypal':
        return 'PayPal';
      default:
        return method;
    }
  };

  const getImageUrl = (url: string | null | undefined) => {
    if (!url) return '/product-placeholder.jpg';
    if (url.startsWith('http')) return url;
    return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
  };

  const handleOrderAgain = (order: Order) => {
    // Clear cart first
    clearCart();
    
    // Add all items from the order to cart
    order.items.forEach((item) => {
      const product = item.product;
      addItem({
        id: product.id,
        name: product.name,
        price: parseFloat(product.sale_price || product.price),
        quantity: item.quantity,
        image: getImageUrl(product.image),
      });
    });
    
    // Show success message
    showToast('Produktet u shtuan në shportë!', 'success');
    
    // Redirect to checkout
    router.push('/checkout');
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
            <div key={order.id} className="border-b last:border-b-0">
              {/* Order Header */}
              <div 
                className={`p-5 cursor-pointer transition-colors ${
                  isExpanded ? 'bg-[#FEE4B0]' : 'bg-white hover:bg-gray-50'
                }`}
                onClick={() => toggleOrderExpanded(order.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center flex-1 space-y-3 md:space-y-0">
                    {/* Order Number - Always at top on mobile */}
                    <div className="flex justify-between md:block">
                      <div className="text-sm text-gray-600 font-albertsans md:mb-1">Porosia</div>
                      <div className="font-albertsans font-semibold">{order.order_number}</div>
                    </div>
                    
                    {/* Total Price */}
                    <div className="flex justify-between md:block">
                      <div className="text-sm text-gray-600 font-albertsans md:mb-1">Çmimi total</div>
                      <div className="font-albertsans font-semibold">
                        {parseFloat(order.total_price).toFixed(0)} Lekë
                      </div>
                    </div>
                    
                    {/* Status - Centered on mobile */}
                    <div className="flex justify-between md:block items-center">
                      <div className="text-sm text-gray-600 font-albertsans md:mb-1">Statusi</div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-albertsans bg-blue-100 text-blue-800">
                        {getStatusText(order.status)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Chevron Icon */}
                  <div className="flex items-center min-w-[40px] md:min-w-[80px] justify-end ml-4">
                    {isExpanded ? (
                      <ChevronUpIcon className="w-5 h-5 text-gray-600" />
                    ) : (
                      <ChevronDownIcon className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Order Details */}
              {isExpanded && (
                <div className="bg-white">
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                      {/* Left Column - Total Amount */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Shuma totale</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Nëntotali ({order.items_count || order.items.length} produkte):</span>
                            <span className="font-medium">{parseFloat(order.subtotal).toFixed(0)} Lekë</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Kosto e transportit:</span>
                            <span className="font-medium">{parseFloat(order.shipping_cost).toFixed(0)} Lekë</span>
                          </div>
                          
                          <div className="flex justify-between pt-3 border-t mt-3">
                            <span className="font-semibold">Totali:</span>
                            <span className="font-semibold">{parseFloat(order.total_price).toFixed(0)} Lekë</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Column - Order Details */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Detajet e porosisë</h3>
                        <div className="space-y-2">
                          <div>
                            <span className="text-gray-600">Emri: </span>
                            <span className="font-medium">
                              {order.customer ? `${order.customer.first_name} ${order.customer.last_name}` : 'Emri i përdoruesit'}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Gjithsej artikuj: </span>
                            <span className="font-medium">{order.items.reduce((sum, item) => sum + item.quantity, 0)} artikuj</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Metoda e pagesës: </span>
                            <span className="font-medium">{getPaymentMethodText(order.payment_method)}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Adresa e dërgimit: </span>
                            <span className="font-medium">{formatAddress(order.shipping_address)}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Pikat e fituara: </span>
                            <span className="font-medium">
                              {order.loyalty_points ? `${order.loyalty_points.value.toFixed(2)} pikë` : 'N/A'}
                            </span>
                          </div>
                        </div>
                        
                        {/* Order Again Button - Positioned at bottom right */}
                        <div className="mt-6 flex justify-end">
                          <button 
                            onClick={() => handleOrderAgain(order)}
                            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-albertsans font-medium"
                          >
                            Porosit përsëri
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-4">
                      {order.items.map((item: OrderItem) => (
                        <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex flex-col sm:flex-row items-start gap-4">
                            {/* Product Image */}
                            <div className="relative w-full sm:w-[120px] h-[150px] sm:h-[120px] flex-shrink-0">
                              <Image
                                src={getImageUrl(item.product.image)}
                                alt={item.product.name}
                                fill
                                className="object-contain p-2"
                              />
                            </div>
                            
                            {/* Product Details */}
                            <div className="flex-1 w-full">
                              <div className="flex flex-col sm:flex-row justify-between items-start">
                                <div className="flex-1 w-full">
                                  <h4 className="text-[#252323] font-albertsans text-[16px] sm:text-[18px] font-bold leading-[24px]">
                                    {item.product.name}
                                  </h4>
                                  {item.product.brand && (
                                    <p className="text-[#777] font-albertsans text-[14px] font-medium mt-1">
                                      {item.product.brand.name}
                                    </p>
                                  )}
                                  
                                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3">
                                    {item.product.sale_price && (
                                      <span className="text-[#c1c1c1] font-albertsans text-[14px] sm:text-[16px] font-medium line-through">
                                        {parseFloat(item.product.price).toFixed(0)} Lekë
                                      </span>
                                    )}
                                    <span className="text-[#1A66EA] font-albertsans text-[18px] sm:text-[20px] font-bold">
                                      {parseFloat(item.product.sale_price || item.product.price).toFixed(0)} Lekë
                                    </span>
                                    {item.product.sale_price && (
                                      <span className="text-[12px] sm:text-[14px] text-[#1A66EA] font-albertsans font-semibold bg-[#D1E0FB] px-2 sm:px-3 py-1 rounded-full">
                                        {Math.round(((parseFloat(item.product.price) - parseFloat(item.product.sale_price)) / parseFloat(item.product.price)) * 100)}% OFF
                                      </span>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Quantity and See Product - Below on mobile, right on desktop */}
                                <div className="w-full sm:w-auto text-left sm:text-right mt-4 sm:mt-0 sm:ml-4">
                                  <p className="text-gray-600 font-albertsans text-sm mb-3">Sasia: {item.quantity}</p>
                                  <Link
                                    href={`/products/${item.product.id}`}
                                    className="inline-block px-4 sm:px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-albertsans font-medium w-full sm:w-auto text-center"
                                  >
                                    Shiko produktin
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Notes */}
                    {(order.order_notes || order.shipping_notes) && (
                      <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
                        {order.order_notes && (
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Shënime porosie:</span> {order.order_notes}
                          </p>
                        )}
                        {order.shipping_notes && (
                          <p className="text-sm text-gray-700 mt-2">
                            <span className="font-medium">Shënime dërgese:</span> {order.shipping_notes}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 p-6 border-t">
          <button
            onClick={() => {
              const newPage = Math.max(1, currentPage - 1);
              router.push(`/account/orders?page=${newPage}`);
            }}
            disabled={currentPage === 1}
            className={`p-2 rounded ${
              currentPage === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ChevronDownIcon className="w-5 h-5 rotate-90" />
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
            // Show first page, last page, current page, and pages around current
            if (
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1)
            ) {
              return (
                <button
                  key={page}
                  onClick={() => router.push(`/account/orders?page=${page}`)}
                  className={`min-w-[40px] h-10 rounded font-medium ${
                    page === currentPage
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              );
            }
            
            // Show ellipsis for gaps
            if (page === currentPage - 2 || page === currentPage + 2) {
              return <span key={page} className="px-2">...</span>;
            }
            
            return null;
          })}
          
          <button
            onClick={() => {
              const newPage = Math.min(totalPages, currentPage + 1);
              router.push(`/account/orders?page=${newPage}`);
            }}
            disabled={currentPage === totalPages}
            className={`p-2 rounded ${
              currentPage === totalPages
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ChevronDownIcon className="w-5 h-5 -rotate-90" />
          </button>
        </div>
      )}
    </div>
  );
}
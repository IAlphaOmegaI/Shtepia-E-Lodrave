'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import Link from 'next/link';
import type { LucideProps } from 'lucide-react';
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  CreditCard,
  Calendar,
  Clock,
  Truck,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Home,
  Mail,
  Phone,
  Hash,
  DollarSign,
  Edit,
  Copy,
  FileText,
} from 'lucide-react';

const BASE_IMAGE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'https://shtepialodrave.com';

interface Address {
  id: number;
  title: string;
  type: 'billing' | 'shipping';
  default: boolean;
  country: string;
  city: string;
  state: string;
  zip: string;
  street_address: string;
  phone_number: string;
}

interface OrderCustomer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  address?: string;
}

interface OrderProduct {
  id: number;
  name: string;
  brand?: string;
  price: string;
}

interface OrderItem {
  id: number;
  product: OrderProduct;
  quantity: number;
  price: string;
  total_price: string;
  discount_info?: string;
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
  loyalty_applied?: number;
  items?: OrderItem[];
  shipping_address?: Address;
  billing_address?: Address;
  shipping_notes?: string;
  order_notes?: string;
  created_at: string;
  updated_at: string;
  paid_at?: string;
  shipped_at?: string;
  delivered_at?: string;
  can_be_cancelled?: boolean;
  can_be_refunded?: boolean;
  items_count?: number;
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

const paymentMethodLabels = {
  cash: 'Para në dorë',
  card: 'Kartë krediti',
  paypal: 'PayPal',
  stripe: 'Stripe',
};

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  // Fetch order data
  const { data: orderData, isLoading, error } = useQuery<Order>({
    queryKey: ['order', orderId],
    queryFn: () => api.orders.getById(orderId),
    enabled: !!orderId,
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          Porosia nuk u gjet
        </div>
      </div>
    );
  }

  const StatusIcon = statusConfig[orderData.status]?.icon || Package;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-3">
        <div className="flex items-start sm:items-center gap-3 sm:gap-4">
          <Link
            href="/admin/orders"
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors mt-0.5 sm:mt-0"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
                Porosia #{orderData.order_number}
              </h1>
              <div className="flex items-center gap-2">
                <StatusIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className={`inline-flex px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-semibold rounded-full ${statusConfig[orderData.status]?.color}`}>
                  {statusConfig[orderData.status]?.label}
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">
              Krijuar më {formatDate(orderData.created_at)}
            </p>
          </div>
        </div>
        <Link
          href={`/admin/orders/${orderId}/edit`}
          className="flex items-center justify-center gap-1.5 sm:gap-2 bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto text-sm sm:text-base"
        >
          <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Ndrysho Porosinë
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6 order-2 lg:order-1">
          {/* Order Info */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200">
              <h2 className="text-base md:text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-4 h-4 md:w-5 md:h-5" />
                Informacioni i Porosisë
              </h2>
            </div>
            <div className="p-4 md:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Numri i Porosisë</p>
                  <div className="flex items-center gap-2">
                    <p className="text-base font-semibold text-gray-900">#{orderData.order_number}</p>
                    <button
                      onClick={() => copyToClipboard(orderData.order_number)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="Kopjo"
                    >
                      <Copy className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Kodi i Gjurmimit</p>
                  <div className="flex items-center gap-2">
                    <p className="text-base font-semibold text-gray-900">{orderData.tracking_code}</p>
                    <button
                      onClick={() => copyToClipboard(orderData.tracking_code)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="Kopjo"
                    >
                      <Copy className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Statusi i Pagesës</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${paymentStatusConfig[orderData.payment_status]?.color}`}>
                    {paymentStatusConfig[orderData.payment_status]?.label}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Metoda e Pagesës</p>
                  <p className="text-base text-gray-900">
                    {paymentMethodLabels[orderData.payment_method] || orderData.payment_method}
                  </p>
                </div>
              </div>

              {(orderData.shipping_notes || orderData.order_notes) && (
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                  {orderData.shipping_notes && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Shënime për Transportin</p>
                      <p className="text-sm text-gray-900">{orderData.shipping_notes}</p>
                    </div>
                  )}
                  {orderData.order_notes && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Shënime të Porosisë</p>
                      <p className="text-sm text-gray-900">{orderData.order_notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200">
              <h2 className="text-base md:text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Package className="w-4 h-4 md:w-5 md:h-5" />
                Artikujt e Porosisë ({orderData.items_count || orderData.items?.length || 0})
              </h2>
            </div>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produkti
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Çmimi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sasia
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Totali
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orderData.items?.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {item.product.name}
                          </p>
                          {item.product.brand && (
                            <p className="text-xs text-gray-500">
                              Brendi: {item.product.brand}
                            </p>
                          )}
                          {item.discount_info && (
                            <p className="text-xs text-red-600 mt-1">
                              {item.discount_info}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatPrice(item.price)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                        {formatPrice(item.total_price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked View */}
            <div className="md:hidden divide-y divide-gray-200">
              {orderData.items?.map((item) => (
                <div key={item.id} className="p-4">
                  <div className="mb-2">
                    <p className="text-sm font-medium text-gray-900">
                      {item.product.name}
                    </p>
                    {item.product.brand && (
                      <p className="text-xs text-gray-500">
                        Brendi: {item.product.brand}
                      </p>
                    )}
                    {item.discount_info && (
                      <p className="text-xs text-red-600 mt-1">
                        {item.discount_info}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="text-xs text-gray-500 block">Çmimi</span>
                      <span className="text-gray-900">{formatPrice(item.price)}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block">Sasia</span>
                      <span className="text-gray-900">{item.quantity}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500 block">Totali</span>
                      <span className="font-medium text-gray-900">{formatPrice(item.total_price)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Totals */}
            <div className="bg-gray-50 px-4 md:px-6 py-3 md:py-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Nëntotali:</span>
                  <span className="font-medium text-gray-900">{formatPrice(orderData.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Transporti:</span>
                  <span className="font-medium text-gray-900">{formatPrice(orderData.shipping_cost)}</span>
                </div>
                {parseFloat(orderData.tax_amount) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taksa:</span>
                    <span className="font-medium text-gray-900">{formatPrice(orderData.tax_amount)}</span>
                  </div>
                )}
                {orderData.loyalty_applied && orderData.loyalty_applied > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Pikë besnikërie të përdorura:</span>
                    <span className="font-medium text-green-600">-{orderData.loyalty_applied.toFixed(2)} LEK</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-semibold pt-2 border-t">
                  <span className="text-gray-900">Totali:</span>
                  <span className="text-blue-600">{formatPrice(orderData.total_price)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4 md:space-y-6 order-1 lg:order-2">
          {/* Customer Info */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User className="w-4 h-4 md:w-5 md:h-5" />
                Klienti
              </h3>
            </div>
            <div className="p-4 md:p-6">
              {orderData.customer ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Emri</p>
                    <p className="text-sm text-gray-900 mt-1">
                      {orderData.customer.first_name} {orderData.customer.last_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-sm text-gray-900 mt-1 flex items-center gap-1">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {orderData.customer.email}
                    </p>
                  </div>
                  {orderData.customer.phone_number && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Telefon</p>
                      <p className="text-sm text-gray-900 mt-1 flex items-center gap-1">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {orderData.customer.phone_number}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Klient i paregjistruar</p>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          {orderData.shipping_address && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                  Adresa e Dërgimit
                </h3>
              </div>
              <div className="p-4 md:p-6 space-y-2">
                <p className="text-sm text-gray-900">{orderData.shipping_address.street_address}</p>
                <p className="text-sm text-gray-900">
                  {orderData.shipping_address.city}
                  {orderData.shipping_address.state && `, ${orderData.shipping_address.state}`}
                  {orderData.shipping_address.zip && ` ${orderData.shipping_address.zip}`}
                </p>
                <p className="text-sm text-gray-900">{orderData.shipping_address.country}</p>
                {orderData.shipping_address.phone_number && (
                  <p className="text-sm text-gray-900 flex items-center gap-1 pt-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {orderData.shipping_address.phone_number}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Billing Address */}
          {orderData.billing_address && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 md:w-5 md:h-5" />
                  Adresa e Faturimit
                </h3>
              </div>
              <div className="p-4 md:p-6 space-y-2">
                <p className="text-sm text-gray-900">{orderData.billing_address.street_address}</p>
                <p className="text-sm text-gray-900">
                  {orderData.billing_address.city}
                  {orderData.billing_address.state && `, ${orderData.billing_address.state}`}
                  {orderData.billing_address.zip && ` ${orderData.billing_address.zip}`}
                </p>
                <p className="text-sm text-gray-900">{orderData.billing_address.country}</p>
                {orderData.billing_address.phone_number && (
                  <p className="text-sm text-gray-900 flex items-center gap-1 pt-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {orderData.billing_address.phone_number}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Order Timeline */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                Historia e Porosisë
              </h3>
            </div>
            <div className="p-4 md:p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Krijuar</p>
                  <p className="text-xs text-gray-500">{formatDate(orderData.created_at)}</p>
                </div>
              </div>
              
              {orderData.paid_at && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Paguar</p>
                    <p className="text-xs text-gray-500">{formatDate(orderData.paid_at)}</p>
                  </div>
                </div>
              )}
              
              {orderData.shipped_at && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Dërguar</p>
                    <p className="text-xs text-gray-500">{formatDate(orderData.shipped_at)}</p>
                  </div>
                </div>
              )}
              
              {orderData.delivered_at && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-1.5"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Dorëzuar</p>
                    <p className="text-xs text-gray-500">{formatDate(orderData.delivered_at)}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-400 rounded-full mt-1.5"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Përditësuar për herë të fundit</p>
                  <p className="text-xs text-gray-500">{formatDate(orderData.updated_at)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Actions */}
          {(orderData.can_be_cancelled || orderData.can_be_refunded) && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200">
                <h3 className="text-base md:text-lg font-semibold text-gray-900">Veprime</h3>
              </div>
              <div className="p-4 md:p-6 space-y-3">
                {orderData.can_be_cancelled && (
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Kjo porosi mund të anulohet
                  </p>
                )}
                {orderData.can_be_refunded && (
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Kjo porosi mund të rimbursohet
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
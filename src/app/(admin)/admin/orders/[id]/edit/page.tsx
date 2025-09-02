'use client';

import { useState, useEffect, use } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Package,
  User,
  MapPin,
  CreditCard,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Truck,
  RefreshCw,
  XCircle,
  Home,
  PackageX,
  FileText,
  DollarSign,
  Hash,
  Mail,
  Phone,
  Copy,
  Eye,
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
  can_be_cancelled?: string;
  can_be_refunded?: string;
}

const statusOptions = [
  { value: 'pending', label: 'Në Pritje', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  { value: 'processing', label: 'Duke u Procesuar', color: 'bg-blue-100 text-blue-800', icon: RefreshCw },
  { value: 'complete', label: 'E Kompletuar', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  { value: 'cancelled', label: 'E Anuluar', color: 'bg-red-100 text-red-800', icon: XCircle },
  { value: 'refunded', label: 'E Rimbursuar', color: 'bg-purple-100 text-purple-800', icon: RefreshCw },
  { value: 'failed', label: 'Dështuar', color: 'bg-red-100 text-red-800', icon: AlertCircle },
  { value: 'local_facility', label: 'Në Depo Lokale', color: 'bg-indigo-100 text-indigo-800', icon: Home },
  { value: 'out_for_delivery', label: 'Në Shpërndarje', color: 'bg-orange-100 text-orange-800', icon: Truck },
];

const paymentStatusOptions = [
  { value: 'pending', label: 'Në Pritje', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'paid', label: 'E Paguar', color: 'bg-green-100 text-green-800' },
  { value: 'failed', label: 'Dështuar', color: 'bg-red-100 text-red-800' },
  { value: 'refunded', label: 'E Rimbursuar', color: 'bg-purple-100 text-purple-800' },
];

export default function EditOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [trackingCode, setTrackingCode] = useState('');
  const [trackingData, setTrackingData] = useState<Order | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    status: 'pending' as Order['status'],
    payment_status: 'pending' as Order['payment_status'],
    shipping_notes: '',
    order_notes: '',
  });

  // Fetch order data
  const { data: orderData, isLoading: orderLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => api.orders.getById(orderId),
    enabled: !!orderId,
  });

  // Update order mutation
  const updateMutation = useMutation({
    mutationFn: (data: any) => api.orders.update(orderId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    },
    onError: (error: any) => {
      setErrorText(error.response?.data?.message || 'Ndodhi një gabim gjatë ruajtjes');
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 5000);
    },
  });

  // Track order mutation
  const trackMutation = useMutation({
    mutationFn: (code: string) => api.orders.trackByCode(code),
    onSuccess: (data) => {
      setTrackingData(data);
    },
    onError: (error: any) => {
      setErrorText(error.response?.data?.message || 'Nuk u gjet porosia me këtë kod');
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 5000);
    },
  });

  // Load order data into form
  useEffect(() => {
    if (orderData) {
      setFormData({
        status: orderData.status || 'pending',
        payment_status: orderData.payment_status || 'pending',
        shipping_notes: orderData.shipping_notes || '',
        order_notes: orderData.order_notes || '',
      });
    }
  }, [orderData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleTrackOrder = () => {
    if (trackingCode.trim()) {
      trackMutation.mutate(trackingCode.trim());
    }
  };

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

  const getStatusConfig = (status: Order['status']) => {
    return statusOptions.find(s => s.value === status) || statusOptions[0];
  };

  const getPaymentStatusConfig = (status: Order['payment_status']) => {
    return paymentStatusOptions.find(s => s.value === status) || paymentStatusOptions[0];
  };

  if (orderLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          Porosia nuk u gjet
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(orderData.status);
  const StatusIcon = statusConfig.icon;

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
            <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
              Porosia #{orderData.order_number}
            </h1>
            <div className="flex items-center gap-2 mt-0.5 sm:mt-1">
              <StatusIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className={`inline-flex px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-semibold rounded-full ${statusConfig.color}`}>
                {statusConfig.label}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={handleSubmit}
            disabled={updateMutation.isPending}
            className="flex items-center justify-center gap-1.5 sm:gap-2 bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex-1 sm:flex-initial text-sm sm:text-base"
          >
            <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {updateMutation.isPending ? 'Duke ruajtur...' : 'Ruaj Ndryshimet'}
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {showSuccessMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 flex items-center">
          <CheckCircle className="w-5 h-5 mr-2" />
          Porosia u përditësua me sukses!
        </div>
      )}
      {showErrorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {errorText}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6 order-2 lg:order-1">
          {/* Order Details */}
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 md:w-5 md:h-5" />
              Detajet e Porosisë
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Numri i Porosisë
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={orderData.order_number}
                      readOnly
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg"
                    />
                    <button
                      onClick={() => copyToClipboard(orderData.order_number)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Kopjo"
                    >
                      <Copy className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kodi i Gjurmimit
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={orderData.tracking_code}
                      readOnly
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg"
                    />
                    <button
                      onClick={() => copyToClipboard(orderData.tracking_code)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Kopjo"
                    >
                      <Copy className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Statusi i Porosisë *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Order['status'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Statusi i Pagesës *
                  </label>
                  <select
                    value={formData.payment_status}
                    onChange={(e) => setFormData({ ...formData, payment_status: e.target.value as Order['payment_status'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {paymentStatusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shënime për Transportin
                </label>
                <textarea
                  value={formData.shipping_notes}
                  onChange={(e) => setFormData({ ...formData, shipping_notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Shënime për transportin..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shënime të Porosisë
                </label>
                <textarea
                  value={formData.order_notes}
                  onChange={(e) => setFormData({ ...formData, order_notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Shënime të përgjithshme..."
                />
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 md:w-5 md:h-5" />
              Artikujt e Porosisë
            </h2>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Produkti
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Çmimi
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Sasia
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Totali
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orderData.items?.map((item: OrderItem) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {item.product.name}
                          </div>
                          {item.product.brand && (
                            <div className="text-xs text-gray-500">
                              Brendi: {item.product.brand}
                            </div>
                          )}
                          {item.discount_info && (
                            <div className="text-xs text-red-600">
                              {item.discount_info}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {formatPrice(item.price)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {formatPrice(item.total_price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                      Nëntotali:
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                      {formatPrice(orderData.subtotal)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                      Transporti:
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                      {formatPrice(orderData.shipping_cost)}
                    </td>
                  </tr>
                  {parseFloat(orderData.tax_amount) > 0 && (
                    <tr>
                      <td colSpan={3} className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                        Taksa:
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                        {formatPrice(orderData.tax_amount)}
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                      Totali:
                    </td>
                    <td className="px-4 py-3 text-lg font-bold text-blue-600">
                      {formatPrice(orderData.total_price)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Mobile Stacked View */}
            <div className="md:hidden space-y-4">
              {orderData.items?.map((item: OrderItem) => (
                <div key={item.id} className="border-b pb-4 last:border-b-0">
                  <div className="mb-2">
                    <div className="text-sm font-medium text-gray-900">
                      {item.product.name}
                    </div>
                    {item.product.brand && (
                      <div className="text-xs text-gray-500">
                        Brendi: {item.product.brand}
                      </div>
                    )}
                    {item.discount_info && (
                      <div className="text-xs text-red-600">
                        {item.discount_info}
                      </div>
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

              {/* Mobile Totals */}
              <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Nëntotali:</span>
                  <span className="font-semibold">{formatPrice(orderData.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Transporti:</span>
                  <span className="font-semibold">{formatPrice(orderData.shipping_cost)}</span>
                </div>
                {parseFloat(orderData.tax_amount) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Taksa:</span>
                    <span className="font-semibold">{formatPrice(orderData.tax_amount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold pt-2 border-t">
                  <span className="text-gray-900">Totali:</span>
                  <span className="text-blue-600">{formatPrice(orderData.total_price)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tracking Tool */}
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
              <Truck className="w-4 h-4 md:w-5 md:h-5" />
              Gjurmimi i Porosisë
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                placeholder="Vendos kodin e gjurmimit..."
                className="flex-1 px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
              <button
                onClick={handleTrackOrder}
                disabled={trackMutation.isPending}
                className="flex items-center justify-center gap-1.5 sm:gap-2 bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm sm:text-base"
              >
                <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {trackMutation.isPending ? 'Duke kërkuar...' : 'Gjurmo'}
              </button>
            </div>

            {trackingData && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Numri:</span> #{trackingData.order_number}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Statusi:</span>{' '}
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusConfig(trackingData.status).color}`}>
                      {getStatusConfig(trackingData.status).label}
                    </span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Krijuar:</span> {formatDate(trackingData.created_at)}
                  </p>
                  {trackingData.shipped_at && (
                    <p className="text-sm">
                      <span className="font-medium">Dërguar:</span> {formatDate(trackingData.shipped_at)}
                    </p>
                  )}
                  {trackingData.delivered_at && (
                    <p className="text-sm">
                      <span className="font-medium">Dorëzuar:</span> {formatDate(trackingData.delivered_at)}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4 md:space-y-6 order-1 lg:order-2">
          {/* Customer Info */}
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <h3 className="text-base md:text-lg font-medium text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
              <User className="w-4 h-4 md:w-5 md:h-5" />
              Informacioni i Klientit
            </h3>
            {orderData.customer ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Emri</p>
                  <p className="text-sm text-gray-900">
                    {orderData.customer.first_name} {orderData.customer.last_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-sm text-gray-900 flex items-center gap-1">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {orderData.customer.email}
                  </p>
                </div>
                {orderData.customer.phone_number && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Telefon</p>
                    <p className="text-sm text-gray-900 flex items-center gap-1">
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

          {/* Shipping Address */}
          {orderData.shipping_address && (
            <div className="bg-white rounded-lg shadow p-4 md:p-6">
              <h3 className="text-base md:text-lg font-medium text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                Adresa e Dërgimit
              </h3>
              <div className="space-y-2 text-sm text-gray-900">
                <p>{orderData.shipping_address.street_address}</p>
                <p>
                  {orderData.shipping_address.city}, {orderData.shipping_address.state} {orderData.shipping_address.zip}
                </p>
                <p>{orderData.shipping_address.country}</p>
                {orderData.shipping_address.phone_number && (
                  <p className="flex items-center gap-1">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {orderData.shipping_address.phone_number}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Payment Info */}
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <h3 className="text-base md:text-lg font-medium text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4 md:w-5 md:h-5" />
              Informacioni i Pagesës
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700">Metoda</p>
                <p className="text-sm text-gray-900 capitalize">
                  {orderData.payment_method}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Statusi</p>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusConfig(orderData.payment_status).color}`}>
                  {getPaymentStatusConfig(orderData.payment_status).label}
                </span>
              </div>
              {orderData.paid_at && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Paguar më</p>
                  <p className="text-sm text-gray-900">
                    {formatDate(orderData.paid_at)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <h3 className="text-base md:text-lg font-medium text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 md:w-5 md:h-5" />
              Historia e Porosisë
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700">Krijuar më</p>
                <p className="text-sm text-gray-900">
                  {formatDate(orderData.created_at)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Përditësuar më</p>
                <p className="text-sm text-gray-900">
                  {formatDate(orderData.updated_at)}
                </p>
              </div>
              {orderData.shipped_at && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Dërguar më</p>
                  <p className="text-sm text-gray-900">
                    {formatDate(orderData.shipped_at)}
                  </p>
                </div>
              )}
              {orderData.delivered_at && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Dorëzuar më</p>
                  <p className="text-sm text-gray-900">
                    {formatDate(orderData.delivered_at)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
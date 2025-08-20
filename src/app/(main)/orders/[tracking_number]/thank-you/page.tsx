'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Routes } from '@/config/routes';
import Image from 'next/image';

interface OrderData {
  id: number;
  order_number: string;
  tracking_code: string;
  customer: {
    first_name: string;
    last_name: string;
    email: string;
  };
  items: Array<{
    id: number;
    product: {
      id: number;
      name: string;
      brand: string;
      price: string;
      image?: string;
    };
    quantity: number;
    price: string;
    total_price: string;
  }>;
  subtotal: string;
  shipping_cost: string;
  total_price: string;
  loyalty_applied: number;
  payment_method: string;
  shipping_address: {
    street_address: string;
    city: string;
    state?: string;
    zip: string;
    country: string;
    phone_number?: string;
  };
  billing_address?: {
    street_address: string;
    city: string;
    state?: string;
    zip: string;
    country: string;
    phone_number?: string;
  };
  created_at: string;
  status: string;
}

export default function OrderThankYouPage({ params }: { params: Promise<{ tracking_number: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get order data from sessionStorage (passed from checkout)
    const storedOrderData = sessionStorage.getItem('lastOrder');
    if (storedOrderData) {
      try {
        const parsedData = JSON.parse(storedOrderData);
        // Verify the tracking code matches
        if (parsedData.tracking_code === resolvedParams.tracking_number) {
          setOrderData(parsedData);
          // Clear the stored order data after successfully loading it
          // This prevents issues with future checkout attempts
          sessionStorage.removeItem('lastOrder');
        }
      } catch (error) {
        console.error('Error parsing order data:', error);
      }
    }
    setIsLoading(false);
  }, [resolvedParams.tracking_number]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Porosia nuk u gjet</h2>
          <Link href={Routes.home} className="text-blue-600 hover:text-blue-700 underline">
            Kthehu në faqen kryesore
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sq-AL', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getStatusStep = (status: string) => {
    const steps = ['Placed', 'Processing', 'At local facility', 'Out for delivery', 'Completed'];
    const statusMap: { [key: string]: number } = {
      'pending': 0,
      'placed': 0,
      'processing': 1,
      'at_facility': 2,
      'out_for_delivery': 3,
      'completed': 4,
      'delivered': 4
    };
    return statusMap[status.toLowerCase()] || 0;
  };

  const currentStep = getStatusStep(orderData.status);

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <div className="container mx-auto px-4 py-6">
        {/* Back to home link */}
        <Link 
          href={Routes.home} 
          className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          <span>Kthehu në faqen kryesore</span>
        </Link>

        {/* Order Header Card */}
        <div className="bg-[#F5E6D3] rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium">Porosia</h2>
              <p className="text-2xl font-bold">{orderData.order_number}</p>
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-600">Statusi</span>
              <div className="bg-white px-3 py-1 rounded-full inline-block ml-2">
                <span className="text-blue-600 font-medium">Vendosur</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div className="absolute left-0 right-0 top-5 h-0.5 bg-gray-200">
              <div 
                className="h-full bg-blue-600 transition-all duration-500"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>
            
            {/* Steps */}
            {[
              { step: 1, label: 'Vendosur' },
              { step: 2, label: 'Në procesim' },
              { step: 3, label: 'Në qendrën lokale' },
              { step: 4, label: 'Në dërgesë' },
              { step: 5, label: 'Përfunduar' }
            ].map((item, index) => (
              <div key={item.step} className="relative z-10 flex flex-col items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= currentStep 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {item.step}
                </div>
                <span className="text-xs mt-2 text-center hidden sm:block">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Order Details */}
          <div className="space-y-6">
            {/* Total Amount */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-bold text-lg mb-4">Shuma totale</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nëntotali ({orderData.items.length} produkt{orderData.items.length !== 1 ? 'e' : ''}):</span>
                  <span className="font-medium">{orderData.subtotal} Lekë</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tarifa e dërgesës:</span>
                  <span className="font-medium">{orderData.shipping_cost} Lekë</span>
                </div>
                {orderData.loyalty_applied > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Zbritje:</span>
                    <span className="font-medium text-green-600">-{orderData.loyalty_applied} Lekë</span>
                  </div>
                )}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-gray-800 font-medium">Totali:</span>
                    <span className="font-bold text-lg">{orderData.total_price} Lekë</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-bold text-lg mb-4">Detajet e porosisë</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600">Kodi i ndjekjes:</span>
                  <span className="ml-2 font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {orderData.tracking_code}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Emri:</span>
                  <span className="ml-2 font-medium">
                    {orderData.customer.first_name} {orderData.customer.last_name}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Metoda e pagesës:</span>
                  <span className="ml-2 font-medium">
                    {orderData.payment_method === 'cash' ? 'Para në dorëzim' : orderData.payment_method}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Artikuj total:</span>
                  <span className="ml-2 font-medium">{orderData.items.length} artikuj</span>
                </div>
               
                <div>
                  <span className="text-gray-600">Adresa e dërgesës:</span>
                  <p className="ml-2 font-medium">
                    {orderData.shipping_address.street_address}, 
                    {orderData.shipping_address.city}, 
                    {orderData.shipping_address.country} {orderData.shipping_address.zip}
                  </p>
                  {orderData.shipping_address.phone_number && (
                    <p className="ml-2 font-medium">
                      Tel: {orderData.shipping_address.phone_number}
                    </p>
                  )}
                </div>
                {orderData.billing_address && (
                  <div>
                    <span className="text-gray-600">Adresa e faturimit:</span>
                    <p className="ml-2 font-medium">
                      {orderData.billing_address.street_address}, 
                      {orderData.billing_address.city}, 
                      {orderData.billing_address.country} {orderData.billing_address.zip}
                    </p>
                    {orderData.billing_address.phone_number && (
                      <p className="ml-2 font-medium">
                        Tel: {orderData.billing_address.phone_number}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Products List */}
        <div className="mt-6 space-y-4">
          {orderData.items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg p-6 flex items-start gap-4">
              <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0">
                {item.product.image ? (
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg">{item.product.name}</h4>
                <p className="text-gray-600 text-sm">{item.product.brand}</p>
                <div className="mt-2 flex items-center gap-4">
                  <span className="text-blue-600 font-bold text-lg">{item.price} Lekë</span>
                  <span className="text-gray-500">Sasia: {item.quantity}</span>
                </div>
              </div>
              <div className="text-right">
                <Link 
                  href={Routes.product(item.product.id)} 
                  className="inline-block px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Shiko produktin
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
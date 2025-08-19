import { useCart } from '@/store/quick-cart/cart.context';
import { useRouter } from 'next/navigation';
import { Routes } from '@/config/routes';
import Link from 'next/link';
import { useState } from 'react';
import { useAtom } from 'jotai';
import { shippingAddressAtom } from '@/store/checkout';

interface Props {
  onContinue?: () => void;
  onPlaceOrder?: () => void;
  showContinueButton?: boolean;
  showPaymentMethod?: boolean;
  showPlaceOrder?: boolean;
  orderCalculation?: {
    total: number;
    subtotal: number;
    shipping_cost: number;
    loyalty_applied?: number;
  } | null;
  usePoints?: boolean;
  userPoints?: number;
}

const CheckoutSummary: React.FC<Props> = ({ 
  onContinue, 
  onPlaceOrder,
  showContinueButton = false,
  showPaymentMethod = false,
  showPlaceOrder = false,
  orderCalculation,
  usePoints = false,
  userPoints = 0
}) => {
  const { items, total } = useCart();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
  const [shippingAddress] = useAtom(shippingAddressAtom);

  const formatPrice = (amount: number) => new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  // Use calculated values from API or fallback to defaults
  const subtotal = orderCalculation?.subtotal || total;
  const shipping = orderCalculation?.shipping_cost || 0;
  const finalTotal = orderCalculation?.total || total;

  const handleContinue = () => {
    if (onContinue) {
      onContinue();
    }
  };

  const handlePlaceOrder = () => {
    if (onPlaceOrder) {
      onPlaceOrder();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4 font-grandstander">Përmbledhja e porosisë</h2>
        
        {/* Items list */}
        <div className="space-y-3 mb-6">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-gray-600">
                {item.name} x ({item.quantity})
              </span>
              <span className="font-medium">
                {formatPrice(item.price * item.quantity)} Lekë
              </span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Nëntotali ({items.length} produkte)</span>
            <span className="font-medium">{formatPrice(subtotal)} Lekë</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Dërgesa</span>
            <span className="font-medium">
              {orderCalculation && shippingAddress 
                ? `${formatPrice(shipping)} Lekë`
                : 'Llogaritet pasi të shtoni adresën'
              }
            </span>
          </div>
          
          {/* Loyalty Points Discount */}
          {usePoints && orderCalculation?.loyalty_applied && orderCalculation.loyalty_applied > 0 && (
            <div className="flex justify-between text-green-600 pb-4">
              <span>Përdorimi i pikëve të besnikërisë</span>
              <span className="font-medium">-{formatPrice(orderCalculation.loyalty_applied)} Lekë</span>
            </div>
          )}
        </div>

        {/* Payment Method Section - Only on confirmation page */}
       
          <div className="mt-6 p-4 bg-orange-50 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Metoda e pagesës</h3>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="cash_on_delivery"
                checked={paymentMethod === 'cash_on_delivery'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-3 text-sm font-medium text-dark">Pagesë në dorëzim</span>
            </label>
          </div>
        

        {/* Final Total */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold font-grandstander">Totali</span>
            <span className="text-lg font-bold text-blue-600">
              {formatPrice(finalTotal)} Lekë
            </span>
          </div>
        </div>

        {/* Address Warning */}
        {!shippingAddress && showPlaceOrder && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Kujdes:</strong> Ju lutem shtoni adresën e dërgesës para se të bëni porosinë
            </p>
          </div>
        )}

        {/* Action Buttons */}
        {showContinueButton && (
          <button
            onClick={handleContinue}
            className="w-full mt-6 bg-orange-400 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-500 transition-colors"
          >
            Vazhdo
          </button>
        )}

        {showPlaceOrder && shippingAddress && (
          <button
            onClick={handlePlaceOrder}
            className="w-full mt-6 bg-orange-400 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-500 transition-colors"
          >
            Bëj porosinë
          </button>
        )}

        {/* Back to cart link - only on initial checkout */}
        {showContinueButton && (
          <Link 
            href={Routes.cart}
            className="flex items-center justify-center text-sm text-gray-600 hover:text-gray-800 mt-4"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kthehu tek shporta
          </Link>
        )}
      </div>
    </div>
  );
};

export default CheckoutSummary;
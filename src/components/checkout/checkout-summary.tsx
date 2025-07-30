import { useCart } from '@/store/quick-cart/cart.context';
import { useRouter } from 'next/navigation';
import { Routes } from '@/config/routes';
import Link from 'next/link';
import { useState } from 'react';

interface Props {
  onContinue?: () => void;
  onPlaceOrder?: () => void;
  showContinueButton?: boolean;
  showPaymentMethod?: boolean;
  showPlaceOrder?: boolean;
}

const CheckoutSummary: React.FC<Props> = ({ 
  onContinue, 
  onPlaceOrder,
  showContinueButton = false,
  showPaymentMethod = false,
  showPlaceOrder = false
}) => {
  const { items, total } = useCart();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');

  const formatPrice = (amount: number) => new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  // Calculate shipping (example - you can make this dynamic)
  const shipping = 500; // Example shipping cost
  const finalTotal = total + shipping;

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
        <h2 className="text-lg font-semibold mb-4">Përmbledhja e porosisë</h2>
        
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
          {showPaymentMethod ? (
            <>
              {/* For confirmation page */}
              <div className="flex justify-between">
                <span className="text-gray-600">Nëntotali ({items.length} produkte)</span>
                <span className="font-medium">{formatPrice(total)} Lekë</span>
              </div>
              <div className="flex justify-between pb-4">
                <span className="text-gray-600">Dërgesa</span>
                <span className="font-medium">{formatPrice(shipping)} Lekë</span>
              </div>
            </>
          ) : (
            <>
              {/* For initial checkout page */}
              <div className="flex justify-between pb-4 border-b">
                <span className="text-gray-600">Dërgesa</span>
                <span className="text-gray-600 text-right">Llogaritet pasi të shtoni adresën</span>
              </div>
            </>
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
            {showPaymentMethod ? (
              <>
                <span className="text-lg font-bold">Totali</span>
                <span className="text-lg font-bold text-blue-600">
                  {formatPrice(finalTotal)} Lekë
                </span>
              </>
            ) : (
              <>
                <span className="text-lg font-semibold">Nëntotali</span>
                <span className="text-lg font-semibold text-blue-600">
                  {formatPrice(total)} Lekë
                </span>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {showContinueButton && (
          <button
            onClick={handleContinue}
            className="w-full mt-6 bg-orange-400 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-500 transition-colors"
          >
            Vazhdo
          </button>
        )}

        {showPlaceOrder && (
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
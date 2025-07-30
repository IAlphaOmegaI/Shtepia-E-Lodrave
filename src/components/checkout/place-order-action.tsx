import { useCart } from '@/store/quick-cart/cart.context';
import { useAtom } from 'jotai';
import {
  billingAddressAtom,
  shippingAddressAtom,
  paymentGatewayAtom,
  customerContactAtom,
  verifiedResponseAtom,
  payableAmountAtom,
} from '@/store/checkout';
import { useRouter } from 'next/navigation';

export const PlaceOrderAction: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const [billing_address] = useAtom(billingAddressAtom);
  const [shipping_address] = useAtom(shippingAddressAtom);
  const [payment_gateway] = useAtom(paymentGatewayAtom);
  const [customer_contact] = useAtom(customerContactAtom);
  const [verifiedResponse] = useAtom(verifiedResponseAtom);
  const [payable_amount] = useAtom(payableAmountAtom);

  const loading = false; // TODO: Implement order creation loading state

  const handlePlaceOrder = async () => {
    try {
      // TODO: Implement order creation API call
      console.log('Creating order...', {
        billing_address,
        shipping_address,
        payment_gateway,
        customer_contact,
        items,
        payable_amount,
      });
      
      // Mock success - redirect to order success page
      // clearCart();
      // router.push('/orders/success');
    } catch (error) {
      console.error('Order creation failed:', error);
    }
  };

  const isDisabled = !billing_address || !shipping_address || !customer_contact || items.length === 0;

  return (
    <button
      onClick={handlePlaceOrder}
      disabled={loading || isDisabled}
      className={`mt-5 w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed ${className || ''}`}
    >
      {loading ? 'Processing...' : children}
    </button>
  );
};
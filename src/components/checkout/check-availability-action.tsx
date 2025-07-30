import { useAtom } from 'jotai';
import { billingAddressAtom, shippingAddressAtom } from '@/store/checkout';
import { useCart } from '@/store/quick-cart/cart.context';

export const CheckAvailabilityAction: React.FC<{
  className?: string;
  children?: React.ReactNode;
}> = (props) => {
  const [billing_address] = useAtom(billingAddressAtom);
  const [shipping_address] = useAtom(shippingAddressAtom);
  const { items, total, isEmpty } = useCart();

  const loading = false; // TODO: Implement verify order hook

  function handleVerifyCheckout() {
    // TODO: Implement checkout verification
    console.log('Verifying checkout...', {
      amount: total,
      products: items,
      billing_address,
      shipping_address,
    });
  }

  return (
    <>
      <button
        className={`mt-5 w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed ${props.className || ''}`}
        onClick={handleVerifyCheckout}
        disabled={isEmpty || loading}
      >
        {loading ? 'Loading...' : props.children}
      </button>
    </>
  );
};
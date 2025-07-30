import { useCart } from '@/store/quick-cart/cart.context';
import { useAtom } from 'jotai';
import {
  couponAtom,
  discountAtom,
  payableAmountAtom,
  verifiedResponseAtom,
  walletAtom,
} from '@/store/checkout';
import ItemCard from '@/components/checkout/item/item-card';
import { ItemInfoRow } from '@/components/checkout/item/item-info-row';
import PaymentGrid from '@/components/checkout/payment/payment-grid';
import { PlaceOrderAction } from '@/components/checkout/place-order-action';
import Coupon from '@/components/checkout/coupon';
import Wallet from '@/components/checkout/wallet/wallet';

interface Props {
  className?: string;
}

const VerifiedItemList: React.FC<Props> = ({ className }) => {
  const { items, isEmpty: isEmptyCart } = useCart();
  const [verifiedResponse] = useAtom(verifiedResponseAtom);
  const [coupon, setCoupon] = useAtom(couponAtom);
  const [discount] = useAtom(discountAtom);
  const [payableAmount] = useAtom(payableAmountAtom);
  const [use_wallet] = useAtom(walletAtom);

  const available_items = items?.filter(
    (item) => !verifiedResponse?.unavailable_products?.includes(item.id)
  );

  const unavailable_items = items?.filter((item) =>
    verifiedResponse?.unavailable_products?.includes(item.id)
  );

  // Calculate totals
  const base_amount = available_items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax_amount = verifiedResponse?.total_tax ?? 0;
  const shipping_amount = verifiedResponse?.shipping_charge ?? 0;
  
  // Calculate discount
  let calculateDiscount = 0;
  if (coupon && discount) {
    if (coupon.type === 'percentage') {
      calculateDiscount = (base_amount * Number(discount)) / 100;
    } else if (coupon.type === 'free_shipping') {
      calculateDiscount = shipping_amount;
    } else {
      calculateDiscount = Number(discount);
    }
  }

  const total_amount = base_amount + tax_amount + shipping_amount - calculateDiscount;
  const wallet_amount = use_wallet ? (verifiedResponse?.wallet_amount ?? 0) : 0;
  const final_amount = total_amount - wallet_amount;

  // Format prices
  const formatPrice = (amount: number) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);

  return (
    <div className={className}>
      <div className="mb-4 flex flex-col items-center">
        <span className="text-base font-bold text-heading">Your Order</span>
      </div>
      
      <div className="flex flex-col py-3 border-b border-gray-200">
        {isEmptyCart ? (
          <div className="flex h-full flex-col items-center justify-center mb-4">
            <h4 className="mt-6 text-base font-semibold">No products</h4>
          </div>
        ) : (
          <>
            {available_items?.map((item) => (
              <ItemCard item={item} key={item.id} />
            ))}
            {unavailable_items?.length > 0 && (
              <div className="pt-2">
                <p className="text-sm font-semibold text-red-500 mb-2">
                  Unavailable Products
                </p>
                {unavailable_items.map((item) => (
                  <ItemCard item={item} key={item.id} notAvailable />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-4 space-y-2">
        <ItemInfoRow title="Sub Total" value={formatPrice(base_amount)} />
        <ItemInfoRow title="Tax" value={formatPrice(tax_amount)} />
        <ItemInfoRow title="Shipping" value={formatPrice(shipping_amount)} />
        {calculateDiscount > 0 && (
          <div className="flex justify-between">
            <p className="text-sm text-body">
              Discount{' '}
              <span
                className="text-xs cursor-pointer text-red-500"
                onClick={() => setCoupon(null)}
              >
                (Remove)
              </span>
            </p>
            <span className="text-sm text-body">
              -{formatPrice(calculateDiscount)}
            </span>
          </div>
        )}
        {wallet_amount > 0 && (
          <ItemInfoRow
            title="Wallet"
            value={`-${formatPrice(wallet_amount)}`}
          />
        )}
        <div className="flex justify-between border-t border-gray-200 pt-3">
          <p className="text-base font-semibold text-heading">Total</p>
          <span className="text-base font-semibold text-heading">
            {formatPrice(final_amount)}
          </span>
        </div>
      </div>

      <Coupon />
      <Wallet />
      <PaymentGrid className="mt-5" />
      <PlaceOrderAction>Place Order</PlaceOrderAction>
    </div>
  );
};

export default VerifiedItemList;
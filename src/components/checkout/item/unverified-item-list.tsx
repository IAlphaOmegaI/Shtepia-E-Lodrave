import { useCart } from '@/store/quick-cart/cart.context';
import ItemCard from './item-card';
import { ItemInfoRow } from './item-info-row';
import { CheckAvailabilityAction } from '@/components/checkout/check-availability-action';

const UnverifiedItemList = ({ hideTitle = false }: { hideTitle?: boolean }) => {
  const { items, total, isEmpty } = useCart();
  
  // Format price
  const subtotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(total);
  
  return (
    <div className="w-full">
      {!hideTitle && (
        <div className="mb-4 flex flex-col items-center space-x-4 rtl:space-x-reverse">
          <span className="text-base font-bold text-heading">
            Your Order
          </span>
        </div>
      )}
      <div className="flex flex-col border-b border-gray-200 py-3">
        {isEmpty ? (
          <div className="mb-4 flex h-full flex-col items-center justify-center">
            <svg width={140} height={176} viewBox="0 0 140 176" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M65.5 33.5L74.5 24.5L79.5 29.5L74.5 34.5L65.5 33.5Z" fill="#EFEFEF"/>
              <path d="M60.5 38.5L65.5 33.5L74.5 34.5L69.5 39.5L60.5 38.5Z" fill="#DCDCDC"/>
            </svg>
            <h4 className="mt-6 text-base font-semibold">
              No products
            </h4>
          </div>
        ) : (
          items?.map((item) => <ItemCard item={item} key={item.id} />)
        )}
      </div>
      <div className="mt-4 space-y-2">
        <ItemInfoRow title="Sub Total" value={subtotal} />
        <ItemInfoRow
          title="Tax"
          value="Calculated at checkout"
        />
        <ItemInfoRow
          title="Estimated Shipping"
          value="Calculated at checkout"
        />
      </div>
      <CheckAvailabilityAction>
        Check Availability
      </CheckAvailabilityAction>
    </div>
  );
};
export default UnverifiedItemList;
import { useAtom } from 'jotai';
import { paymentGatewayAtom, PaymentGateway } from '@/store/checkout';

interface Props {
  className?: string;
}

const PaymentGrid: React.FC<Props> = ({ className }) => {
  const [gateway, setGateway] = useAtom(paymentGatewayAtom);

  const paymentMethods = [
    {
      id: PaymentGateway.COD,
      name: 'Cash on Delivery',
      description: 'Pay when you receive your order'
    },
    {
      id: PaymentGateway.STRIPE,
      name: 'Credit/Debit Card',
      description: 'Pay securely with your card'
    },
    {
      id: PaymentGateway.PAYPAL,
      name: 'PayPal',
      description: 'Pay with your PayPal account'
    }
  ];

  return (
    <div className={className}>
      <h3 className="text-sm font-semibold mb-3">Payment Method</h3>
      <div className="space-y-2">
        {paymentMethods.map((method) => (
          <label
            key={method.id}
            className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
          >
            <input
              type="radio"
              name="payment"
              value={method.id}
              checked={gateway === method.id}
              onChange={() => setGateway(method.id)}
              className="mt-1 mr-3"
            />
            <div className="flex-1">
              <div className="font-medium text-sm">{method.name}</div>
              <div className="text-xs text-gray-600">{method.description}</div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default PaymentGrid;
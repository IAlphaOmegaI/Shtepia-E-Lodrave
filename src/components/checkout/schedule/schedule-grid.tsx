import { useAtom } from 'jotai';
import { deliveryTimeAtom } from '@/store/checkout';

interface Props {
  className?: string;
  label: string;
  count: number;
}

const scheduleOptions = [
  {
    id: '1',
    title: 'Express Delivery',
    description: '1-2 business days',
  },
  {
    id: '2',
    title: 'Standard Delivery',
    description: '3-5 business days',
  },
  {
    id: '3',
    title: 'Economy Delivery',
    description: '5-7 business days',
  },
];

const ScheduleGrid: React.FC<Props> = ({ className, label, count }) => {
  const [deliveryTime, setDeliveryTime] = useAtom(deliveryTimeAtom);

  return (
    <div className={`bg-white p-5 shadow-sm rounded-lg ${className || ''}`}>
      <div className="flex items-center mb-4">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold mr-3">
          {count}
        </span>
        <h3 className="text-lg font-semibold">{label}</h3>
      </div>

      <div className="space-y-3">
        {scheduleOptions.map((option) => (
          <label
            key={option.id}
            className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
          >
            <input
              type="radio"
              name="delivery-schedule"
              checked={deliveryTime?.id === option.id}
              onChange={() => setDeliveryTime(option)}
              className="mt-1 mr-3"
            />
            <div className="flex-1">
              <div className="font-medium text-sm">{option.title}</div>
              <div className="text-xs text-gray-600">{option.description}</div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ScheduleGrid;
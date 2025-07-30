import { useAtom } from 'jotai';
import { guestNameAtom } from '@/store/checkout';

interface Props {
  count: number;
  className?: string;
  label: string;
}

const GuestName: React.FC<Props> = ({ count, className, label }) => {
  const [guestName, setGuestName] = useAtom(guestNameAtom);

  return (
    <div className={`bg-white p-5 shadow-sm rounded-lg ${className || ''}`}>
      <div className="flex items-center mb-4">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold mr-3">
          {count}
        </span>
        <h3 className="text-lg font-semibold">{label}</h3>
      </div>
      <input
        type="text"
        value={guestName || ''}
        onChange={(e) => setGuestName(e.target.value)}
        placeholder="Enter your full name"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default GuestName;
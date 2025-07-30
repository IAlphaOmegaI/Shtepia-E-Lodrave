import { useAtom } from 'jotai';
import { orderNoteAtom } from '@/store/checkout';

interface Props {
  count: number;
  label: string;
  className?: string;
}

const OrderNote: React.FC<Props> = ({ count, label, className }) => {
  const [note, setNote] = useAtom(orderNoteAtom);

  return (
    <div className={`bg-white rounded-lg shadow-sm ${className || ''}`}>
      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-red-600 font-grandstander mb-4">{label}</h3>

        <div className="relative">
          <textarea
            value={note || ''}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Shkruani shënime për dërgesën ose preferencat"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none min-h-[120px]"
            rows={4}
            maxLength={100}
          />
          <div className="absolute bottom-2 right-2 text-xs text-gray-500">
            {note?.length || 0} / 100
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderNote;
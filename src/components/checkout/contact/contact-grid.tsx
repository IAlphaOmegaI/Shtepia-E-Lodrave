import { useState } from 'react';
import { useAtom } from 'jotai';
import { customerContactAtom } from '@/store/checkout';

interface Props {
  className?: string;
  contact?: string;
  label: string;
  count: number;
}

const ContactGrid: React.FC<Props> = ({ className, contact, label, count }) => {
  const [customerContact, setCustomerContact] = useAtom(customerContactAtom);
  const [isEditing, setIsEditing] = useState(!contact);
  const [tempContact, setTempContact] = useState(contact || customerContact || '');

  const handleSave = () => {
    setCustomerContact(tempContact);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempContact(customerContact || contact || '');
    setIsEditing(false);
  };

  return (
    <div className={`bg-white p-5 shadow-sm rounded-lg ${className || ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold mr-3">
            {count}
          </span>
          <h3 className="text-lg font-semibold">{label}</h3>
        </div>
        {!isEditing && customerContact && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <input
            type="tel"
            value={tempContact}
            onChange={(e) => setTempContact(e.target.value)}
            placeholder="Enter your phone number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="text-gray-700">
          {customerContact || contact || 'No contact number added'}
        </div>
      )}
    </div>
  );
};

export default ContactGrid;
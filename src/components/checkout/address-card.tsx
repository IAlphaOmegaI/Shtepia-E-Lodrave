interface Address {
  id: string;
  type: string;
  title: string;
  country: string;
  city: string;
  state: string;
  zip: string;
  street_address: string;
  contact_number?: string;
}

interface Props {
  address: Address;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const AddressCard: React.FC<Props> = ({ 
  address, 
  isSelected, 
  onSelect, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div 
      className={`bg-white border ${
        isSelected ? 'border-blue-500' : 'border-gray-300'
      } rounded-lg p-4 cursor-pointer transition-all`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <input
            type="radio"
            checked={isSelected}
            onChange={onSelect}
            className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">Adresa e përdoruesit</h4>
            <p className="text-sm text-gray-600 mt-1">
              {address.state}, {address.city}
            </p>
            <p className="text-sm text-gray-600">
              {address.zip || 'Kodi postar'}
            </p>
            {address.contact_number && (
              <p className="text-sm text-gray-600 mt-2">
                Numri i kontaktit: {address.contact_number}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4 ml-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-sm text-gray-600 hover:text-red-600 transition-colors"
          >
            Fshi
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            Ndrysho
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressCard;
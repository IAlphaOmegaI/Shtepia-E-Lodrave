import { useState } from 'react';
import { useAtom } from 'jotai';
import { PrimitiveAtom } from 'jotai';
import AddressModal from './address-modal';
import AddressCard from './address-card';
import { PlusIcon } from '@/components/icons/plus-icon';

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
  userId: string;
  className?: string;
  label: string;
  count: number;
  addresses: Address[];
  atom: PrimitiveAtom<Address | null>;
  type: string;
}

const AddressGrid: React.FC<Props> = ({
  className,
  label,
  count,
  addresses: initialAddresses,
  atom,
  type,
}) => {
  const [selectedAddress, setSelectedAddress] = useAtom(atom);
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses || []);

  const handleSelectAddress = (address: Address) => {
    setSelectedAddress(address);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setShowModal(true);
  };

  const handleDelete = (addressId: string) => {
    // Remove from local state
    setAddresses(prev => prev.filter(addr => addr.id !== addressId));
    // If the deleted address was selected, clear selection
    if (selectedAddress?.id === addressId) {
      setSelectedAddress(null);
    }
  };

  const handleSaveAddress = (formData: any) => {
    if (editingAddress) {
      // Update existing address
      const updatedAddress = {
        ...editingAddress,
        ...formData,
        country: 'Albania',
        state: formData.city, // Use city as state for Albania
      };
      setAddresses(prev => prev.map(addr => addr.id === editingAddress.id ? updatedAddress : addr));
      setSelectedAddress(updatedAddress);
    } else {
      // Add new address
      const newAddress: Address = {
        ...formData,
        id: Date.now().toString(),
        type: type,
        title: "User's address",
        country: 'Albania',
        state: formData.city, // Use city as state for Albania
      };
      setAddresses(prev => [...prev, newAddress]);
      setSelectedAddress(newAddress);
    }
    setShowModal(false);
    setEditingAddress(null);
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm ${className || ''}`}>
      {/* Title inside white card */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-red-600 font-grandstander mb-4">{label}</h3>

        {/* Content */}
        <div className="space-y-3">
          {addresses && addresses.length > 0 && addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              isSelected={selectedAddress?.id === address.id}
              onSelect={() => handleSelectAddress(address)}
              onEdit={() => handleEdit(address)}
              onDelete={() => handleDelete(address.id)}
            />
          ))}
          
          <button
            onClick={() => setShowModal(true)}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Shto një adresë</span>
          </button>
        </div>
      </div>

      <AddressModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingAddress(null);
        }}
        onSave={handleSaveAddress}
        type={type as 'billing' | 'shipping'}
        initialData={editingAddress ? {
          street_address: editingAddress.street_address,
          city: editingAddress.city,
          zip: editingAddress.zip,
          contact_number: editingAddress.contact_number || '',
        } : undefined}
      />
    </div>
  );
};

export default AddressGrid;
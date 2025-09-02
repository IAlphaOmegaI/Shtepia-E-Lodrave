import { useState, useEffect } from 'react';
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
  phone_number?: string;  // Backend returns this field
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
  const [guestAddresses, setGuestAddresses] = useState<Address[]>([]);
  const [isGuest, setIsGuest] = useState(false);
  
  // Update addresses when initialAddresses prop changes (only for authenticated users)
  useEffect(() => {
    // Check if this is a guest user (no initial addresses and empty array)
    const isGuestUser = !initialAddresses || (Array.isArray(initialAddresses) && initialAddresses.length === 0);
    setIsGuest(isGuestUser);
    
    if (!isGuestUser) {
      // Only update addresses for authenticated users
      setAddresses(initialAddresses || []);
    } else {
      // For guest users, use guestAddresses
      setAddresses(guestAddresses);
    }
  }, [initialAddresses, guestAddresses]);

  const handleSelectAddress = (address: Address) => {
    // Normalize phone field - backend returns phone_number but we need contact_number
    const normalizedAddress = {
      ...address,
      contact_number: address.contact_number || address.phone_number
    };
    setSelectedAddress(normalizedAddress);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setShowModal(true);
  };

  const handleDelete = (addressId: string) => {
    if (isGuest) {
      // For guest users, update guestAddresses
      setGuestAddresses(prev => prev.filter(addr => addr.id !== addressId));
    } else {
      // For authenticated users, update addresses directly
      setAddresses(prev => prev.filter(addr => addr.id !== addressId));
    }
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
      
      if (isGuest) {
        setGuestAddresses(prev => prev.map(addr => addr.id === editingAddress.id ? updatedAddress : addr));
      } else {
        setAddresses(prev => prev.map(addr => addr.id === editingAddress.id ? updatedAddress : addr));
      }
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
      
      if (isGuest) {
        setGuestAddresses(prev => [...prev, newAddress]);
      } else {
        setAddresses(prev => [...prev, newAddress]);
      }
      setSelectedAddress(newAddress);
    }
    setShowModal(false);
    setEditingAddress(null);
  };

  console.log('AddressGrid rendering with addresses:', addresses); // Debug log
  
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
          contact_number: editingAddress.contact_number || editingAddress.phone_number || '',
        } : undefined}
      />
    </div>
  );
};

export default AddressGrid;
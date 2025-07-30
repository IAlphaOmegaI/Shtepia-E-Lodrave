import { useState, useEffect } from 'react';
import { CloseIcon } from '@/components/icons/close-icon';

interface AddressFormData {
  street_address: string;
  city: string;
  zip: string;
  contact_number: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: AddressFormData) => void;
  type: 'billing' | 'shipping';
  initialData?: AddressFormData;
}

const AddressModal: React.FC<Props> = ({ isOpen, onClose, onSave, type, initialData }) => {
  const [formData, setFormData] = useState<AddressFormData>({
    street_address: '',
    city: '',
    zip: '',
    contact_number: '',
  });

  const [errors, setErrors] = useState<Partial<AddressFormData>>({});

  // Update form data when modal opens with initial data (for editing)
  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        street_address: initialData.street_address || '',
        city: initialData.city || '',
        zip: initialData.zip || '',
        contact_number: initialData.contact_number || '',
      });
    } else if (isOpen && !initialData) {
      // Reset form when opening for new address
      setFormData({
        street_address: '',
        city: '',
        zip: '',
        contact_number: '',
      });
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (field: keyof AddressFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const validate = () => {
    const newErrors: Partial<AddressFormData> = {};
    
    if (!formData.street_address.trim()) {
      newErrors.street_address = 'Adresa është e detyrueshme';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'Qyteti është i detyrueshëm';
    }
    if (!formData.zip.trim()) {
      newErrors.zip = 'Kodi postar është i detyrueshëm';
    }
    if (!formData.contact_number.trim()) {
      newErrors.contact_number = 'Numri i kontaktit është i detyrueshëm';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        ...formData,
        street_address: formData.street_address.trim(),
        city: formData.city.trim(),
        zip: formData.zip.trim(),
        contact_number: formData.contact_number.trim(),
      });
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-red-600 font-grandstander">
              {initialData ? 'Ndrysho adresën' : 'Shto adresë të re'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="text-red-500">*</span> Adresa
              </label>
              <input
                type="text"
                value={formData.street_address}
                onChange={(e) => handleChange('street_address', e.target.value)}
                placeholder="Shkruani adresën tuaj"
                className={`w-full px-3 py-2 border ${
                  errors.street_address ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.street_address && (
                <p className="text-sm text-red-500 mt-1">{errors.street_address}</p>
              )}
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="text-red-500">*</span> Qyteti
              </label>
              <select
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                className={`w-full px-3 py-2 border ${
                  errors.city ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">Zgjidhni një opsion</option>
                <option value="Tirana">Tirana</option>
                <option value="Durrës">Durrës</option>
                <option value="Shkodër">Shkodër</option>
                <option value="Elbasan">Elbasan</option>
                <option value="Vlorë">Vlorë</option>
                <option value="Korçë">Korçë</option>
                <option value="Fier">Fier</option>
                <option value="Berat">Berat</option>
                <option value="Lushnjë">Lushnjë</option>
                <option value="Kavajë">Kavajë</option>
                <option value="Gjirokastër">Gjirokastër</option>
                <option value="Sarandë">Sarandë</option>
                <option value="Laç">Laç</option>
                <option value="Kukës">Kukës</option>
                <option value="Patos">Patos</option>
                <option value="Lezhë">Lezhë</option>
                <option value="Peshkopi">Peshkopi</option>
                <option value="Kuçovë">Kuçovë</option>
                <option value="Krujë">Krujë</option>
                <option value="Burrel">Burrel</option>
                <option value="Cërrik">Cërrik</option>
                <option value="Bilisht">Bilisht</option>
                <option value="Librazhd">Librazhd</option>
                <option value="Rrëshen">Rrëshen</option>
                <option value="Ballsh">Ballsh</option>
                <option value="Mamurras">Mamurras</option>
                <option value="Bajram Curri">Bajram Curri</option>
                <option value="Ersekë">Ersekë</option>
                <option value="Peqin">Peqin</option>
                <option value="Divjakë">Divjakë</option>
                <option value="Selenicë">Selenicë</option>
                <option value="Rrogozhinë">Rrogozhinë</option>
                <option value="Shijak">Shijak</option>
                <option value="Libohovë">Libohovë</option>
                <option value="Tepelenë">Tepelenë</option>
                <option value="Gramsh">Gramsh</option>
                <option value="Bulqizë">Bulqizë</option>
                <option value="Përmet">Përmet</option>
                <option value="Poliçan">Poliçan</option>
                <option value="Fushë-Krujë">Fushë-Krujë</option>
                <option value="Kamëz">Kamëz</option>
                <option value="Ura Vajgurore">Ura Vajgurore</option>
                <option value="Himara">Himara</option>
                <option value="Vau i Dejës">Vau i Dejës</option>
                <option value="Delvinë">Delvinë</option>
                <option value="Roskovec">Roskovec</option>
                <option value="Vorë">Vorë</option>
                <option value="Koplik">Koplik</option>
                <option value="Çorovodë">Çorovodë</option>
                <option value="Orikum">Orikum</option>
                <option value="Maliq">Maliq</option>
                <option value="Krastë">Krastë</option>
                <option value="Bërxullë">Bërxullë</option>
                <option value="Milot">Milot</option>
                <option value="Memaliaj">Memaliaj</option>
                <option value="Prrenjas">Prrenjas</option>
                <option value="Rrethina">Rrethina</option>
                <option value="Rubik">Rubik</option>
                <option value="Suhë">Suhë</option>
                <option value="Zharëz">Zharëz</option>
                <option value="Balldreni">Balldreni</option>
                <option value="Ksamil">Ksamil</option>
                <option value="Fierzë">Fierzë</option>
                <option value="Klos">Klos</option>
                <option value="Kelcyrë">Kelcyrë</option>
                <option value="Pukë">Pukë</option>
                <option value="Selenicë e Re">Selenicë e Re</option>
                <option value="Cerrikë">Cerrikë</option>
                <option value="Zvërnec">Zvërnec</option>
                <option value="Velipojë">Velipojë</option>
                <option value="Konispol">Konispol</option>
                <option value="Tirana e Re">Tirana e Re</option>
                <option value="Xarë">Xarë</option>
                <option value="Lazarat">Lazarat</option>
                <option value="Synej">Synej</option>
              </select>
              {errors.city && (
                <p className="text-sm text-red-500 mt-1">{errors.city}</p>
              )}
            </div>

            {/* ZIP Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kodi postar
              </label>
              <input
                type="text"
                value={formData.zip}
                onChange={(e) => handleChange('zip', e.target.value)}
                placeholder="Shkruani kodin postar"
                className={`w-full px-3 py-2 border ${
                  errors.zip ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.zip && (
                <p className="text-sm text-red-500 mt-1">{errors.zip}</p>
              )}
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="text-red-500">*</span> Numri i kontaktit
              </label>
              <input
                type="tel"
                value={formData.contact_number}
                onChange={(e) => handleChange('contact_number', e.target.value)}
                placeholder="Shkruani numrin tuaj të kontaktit"
                className={`w-full px-3 py-2 border ${
                  errors.contact_number ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.contact_number && (
                <p className="text-sm text-red-500 mt-1">{errors.contact_number}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Shto adresën
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddressModal;
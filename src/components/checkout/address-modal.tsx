import { useState, useEffect } from 'react';
import { CloseIcon } from '@/components/icons/close-icon';
import { parsePhoneNumber, isValidPhoneNumber, AsYouType, isPossiblePhoneNumber } from 'libphonenumber-js';

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
  const [phoneValidation, setPhoneValidation] = useState<{
    isValid: boolean;
    isPossible: boolean;
    error: string;
  }>({ isValid: true, isPossible: true, error: '' });

  // Update form data when modal opens with initial data (for editing)
  useEffect(() => {
    if (isOpen && initialData) {
      // Extract phone number without country code for display
      let phoneForDisplay = initialData.contact_number || '';
      
      // Remove +355 prefix if present
      if (phoneForDisplay.startsWith('+355')) {
        phoneForDisplay = phoneForDisplay.substring(4);
      } else if (phoneForDisplay.startsWith('355')) {
        phoneForDisplay = phoneForDisplay.substring(3);
      }
      
      // Remove any non-digit characters
      phoneForDisplay = phoneForDisplay.replace(/\D/g, '');
      
      // Format it using the library
      if (phoneForDisplay) {
        const formatter = new AsYouType('AL');
        const formatted = formatter.input('+355' + phoneForDisplay);
        phoneForDisplay = formatted.replace('+355 ', '').replace('+355', '');
      }
      
      setFormData({
        street_address: initialData.street_address || '',
        city: initialData.city || '',
        zip: initialData.zip || '',
        contact_number: phoneForDisplay,
      });
      
      // Validate the existing phone number
      if (phoneForDisplay) {
        const digitsOnly = phoneForDisplay.replace(/\D/g, '');
        const fullNumber = '+355' + digitsOnly;
        const valid = isValidPhoneNumber(fullNumber, 'AL');
        setPhoneValidation({
          isValid: valid,
          isPossible: true,
          error: valid ? '' : 'Numri nuk është i vlefshëm'
        });
      }
    } else if (isOpen && !initialData) {
      // Reset form when opening for new address
      setFormData({
        street_address: '',
        city: '',
        zip: '',
        contact_number: '',
      });
      setPhoneValidation({ isValid: true, isPossible: true, error: '' });
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (field: keyof AddressFormData, value: string) => {
    if (field === 'contact_number') {
      // Remove any non-digit characters
      const digitsOnly = value.replace(/\D/g, '');
      
      // Limit to 9 digits (Albanian mobile numbers are 9 digits after country code)
      const limitedDigits = digitsOnly.slice(0, 9);
      
      // Format using libphonenumber-js
      const formatter = new AsYouType('AL');
      
      // Add +355 prefix if not empty
      let formattedValue = '';
      if (limitedDigits) {
        formattedValue = formatter.input('+355' + limitedDigits);
        // Remove the +355 prefix for display since we show it separately
        formattedValue = formattedValue.replace('+355 ', '').replace('+355', '');
      }
      
      setFormData({ ...formData, [field]: formattedValue });
      
      // Real-time validation
      if (limitedDigits.length > 0) {
        const fullNumber = '+355' + limitedDigits;
        
        // Check if it's at least possible
        const possible = isPossiblePhoneNumber(fullNumber, 'AL');
        
        // Check if it's valid
        const valid = isValidPhoneNumber(fullNumber, 'AL');
        
        // Validate the starting digits for Albanian numbers
        const validStarts = ['4', '6']; // Albanian numbers start with 4 (landline) or 6 (mobile)
        const hasValidStart = validStarts.some(start => limitedDigits.startsWith(start));
        
        let error = '';
        if (!hasValidStart && limitedDigits.length >= 1) {
          error = 'Numri duhet të fillojë me 4 ose 6';
        } else if (limitedDigits.length >= 8 && !valid) {
          error = 'Numri nuk është i vlefshëm';
        } else if (limitedDigits.length < 8) {
          error = `${8 - limitedDigits.length} shifra të tjera nevojiten`;
        }
        
        setPhoneValidation({
          isValid: valid,
          isPossible: possible && hasValidStart,
          error: error
        });
      } else {
        setPhoneValidation({ isValid: true, isPossible: true, error: '' });
      }
    } else {
      setFormData({ ...formData, [field]: value });
    }
    
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
    } else {
      // Get just the digits
      const digitsOnly = formData.contact_number.replace(/\D/g, '');
      
      // Albanian phone numbers should be 9 digits (without country code)
      if (digitsOnly.length < 8) {
        newErrors.contact_number = 'Numri duhet të ketë të paktën 8 shifra';
      } else {
        // Add +355 prefix for validation
        const fullNumber = '+355' + digitsOnly;
        
        // Check if it's a valid Albanian phone number
        if (!isValidPhoneNumber(fullNumber, 'AL')) {
          newErrors.contact_number = 'Numri duhet të fillojë me 6X ose 4X';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Get just the digits and add +355 prefix
      const digitsOnly = formData.contact_number.replace(/\D/g, '');
      const phoneNumber = '+355' + digitsOnly;
      
      onSave({
        ...formData,
        street_address: formData.street_address.trim(),
        city: formData.city.trim(),
        zip: formData.zip.trim(),
        contact_number: phoneNumber,
      });
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-red-600 font-grandstander">
              {initialData ? "Ndrysho adresën" : "Shto adresë të re"}
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
                onChange={(e) => handleChange("street_address", e.target.value)}
                placeholder="Shkruani adresën tuaj"
                className={`w-full px-3 py-2 border ${
                  errors.street_address ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.street_address && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.street_address}
                </p>
              )}
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="text-red-500">*</span> Qyteti
              </label>
              <select
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
                className={`w-full px-3 py-2 border ${
                  errors.city ? "border-red-500" : "border-gray-300"
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
                <span className="text-red-500">*</span> Kodi postar
              </label>
              <input
                type="text"
                value={formData.zip}
                onChange={(e) => handleChange("zip", e.target.value)}
                placeholder="Shkruani kodin postar"
                className={`w-full px-3 py-2 border ${
                  errors.zip ? "border-red-500" : "border-gray-300"
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
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  +355
                </span>
                <input
                  type="tel"
                  value={formData.contact_number}
                  onChange={(e) =>
                    handleChange("contact_number", e.target.value)
                  }
                  placeholder="6X XXX XXXX"
                  className={`w-full pl-14 pr-3 py-2 border ${
                    errors.contact_number ||
                    (phoneValidation.error && formData.contact_number)
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 ${
                    phoneValidation.error && formData.contact_number
                      ? "focus:ring-red-500"
                      : "focus:ring-blue-500"
                  }`}
                />
                {/* Validation indicator */}
                {formData.contact_number && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                    {phoneValidation.isValid ? (
                      <svg
                        className="h-5 w-5 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : phoneValidation.error ? (
                      <svg
                        className="h-5 w-5 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : null}
                  </span>
                )}
              </div>
              {/* Dynamic help text */}
              {!phoneValidation.error && !formData.contact_number && (
                <p className="text-xs text-gray-500 mt-1">
                  Shembull: 69 123 4567 ose 44 123 456
                </p>
              )}
              {/* Real-time error message */}
              {phoneValidation.error && formData.contact_number && (
                <p className="text-sm text-red-500 mt-1">
                  {phoneValidation.error}
                </p>
              )}
              {/* Form validation error */}
              {errors.contact_number && !formData.contact_number && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.contact_number}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                !formData.street_address ||
                !formData.city ||
                !formData.zip ||
                !formData.contact_number ||
                (Boolean(formData.contact_number) && phoneValidation.error !== "")
              }
              className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                !formData.street_address ||
                !formData.city ||
                !formData.zip ||
                !formData.contact_number ||
                (Boolean(formData.contact_number) && phoneValidation.error !== "")
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {initialData ? "Ndrysho adresën" : "Shto adresën"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddressModal;
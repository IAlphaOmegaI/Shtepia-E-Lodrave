'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import Image from 'next/image';
import { parsePhoneNumber, isValidPhoneNumber, AsYouType, isPossiblePhoneNumber } from 'libphonenumber-js';
import AddressModal from '@/components/checkout/address-modal';
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { useToast } from '@/contexts/toast-context';
import dynamic from 'next/dynamic';

// Dynamically import PasswordStrengthBar to avoid SSR issues
const PasswordStrengthBar = dynamic(
  () => import('react-password-strength-bar'),
  { ssr: false }
);

interface ProfileFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  date_of_birth: string;
}

interface Address {
  id?: string;
  street_address: string;
  city: string;
  zip: string;
  contact_number: string;
}

interface PasswordChangeData {
  old_password: string;
  new_password: string;
}

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  
  const { data: userData } = useQuery({
    queryKey: ['user', 'me'],
    queryFn: () => api.auth.me(),
  });

  const [formData, setFormData] = useState({
    first_name: userData?.first_name || '',
    last_name: userData?.last_name || '',
    email: userData?.email || '',
    phone_number: userData?.phone_number || '',
    date_of_birth: userData?.date_of_birth || '',
  });

  const [phoneValidation, setPhoneValidation] = useState<{
    isValid: boolean;
    isPossible: boolean;
    error: string;
  }>({ isValid: true, isPossible: true, error: '' });

  useEffect(() => {
    if (userData) {
      // Set addresses
      if (userData.addresses) {
        setAddresses(userData.addresses);
      }
      
      // Extract phone number without country code for display
      let phoneForDisplay = userData.phone_number || '';
      
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
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        email: userData.email || '',
        phone_number: phoneForDisplay,
        date_of_birth: userData.date_of_birth || '',
      });
    }
  }, [userData]);

  const updateProfileMutation = useMutation({
    mutationFn: (data: ProfileFormData & { addresses?: Address[] }) => api.auth.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
      setSuccessMessage('Profili u përditësua me sukses!');
      setIsEditMode(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    },
    onError: () => {
      setErrorMessage('Ndodhi një gabim gjatë përditësimit të profilit');
      setTimeout(() => setErrorMessage(''), 3000);
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: PasswordChangeData) => api.auth.changePassword(data),
    onSuccess: () => {
      setSuccessMessage('Fjalëkalimi u ndryshua me sukses!');
      setShowPasswordForm(false);
      setPasswordData({
        old_password: '',
        new_password: '',
        confirm_password: '',
      });
      setPasswordError('');
      setPasswordStrength(0);
      setTimeout(() => setSuccessMessage(''), 3000);
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      setPasswordError(error.response?.data?.message || 'Ndodhi një gabim gjatë ndryshimit të fjalëkalimit');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate phone if provided
    if (formData.phone_number) {
      const digitsOnly = formData.phone_number.replace(/\D/g, '');
      if (digitsOnly.length < 8) {
        setErrorMessage('Numri i telefonit duhet të ketë të paktën 8 shifra');
        setTimeout(() => setErrorMessage(''), 3000);
        return;
      }
      
      const fullNumber = '+355' + digitsOnly;
      if (!isValidPhoneNumber(fullNumber, 'AL')) {
        setErrorMessage('Numri i telefonit nuk është i vlefshëm');
        setTimeout(() => setErrorMessage(''), 3000);
        return;
      }
    }
    
    // Prepare data to send
    const dataToSend: any = { ...formData };
    
    // Add +355 prefix to phone before sending
    if (dataToSend.phone_number) {
      const digitsOnly = dataToSend.phone_number.replace(/\D/g, '');
      dataToSend.phone_number = '+355' + digitsOnly;
    }
    
    // Format date to YYYY-MM-DD if it exists
    if (dataToSend.date_of_birth) {
      // The input type="date" already returns YYYY-MM-DD format
      // But let's ensure it's correct
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(dataToSend.date_of_birth)) {
        // Try to parse and reformat the date
        const date = new Date(dataToSend.date_of_birth);
        if (!isNaN(date.getTime())) {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          dataToSend.date_of_birth = `${year}-${month}-${day}`;
        } else {
          // If date is invalid, remove it from the payload
          delete dataToSend.date_of_birth;
        }
      }
    } else {
      // If date is empty, remove it from the payload
      delete dataToSend.date_of_birth;
    }
    
    // Include addresses in the update
    dataToSend.addresses = addresses;
    
    updateProfileMutation.mutate(dataToSend);
  };

  const handleAddAddress = (newAddress: Address) => {
    const addressWithId = {
      ...newAddress,
      id: Date.now().toString() // Generate a temporary ID
    };
    const updatedAddresses = [...addresses, addressWithId];
    setAddresses(updatedAddresses);
    setIsAddressModalOpen(false);
    
    // Auto-save addresses
    const dataToSend: any = {
      first_name: userData?.first_name || '',
      last_name: userData?.last_name || '',
      email: userData?.email || '',
      phone_number: userData?.phone_number || '',
      date_of_birth: userData?.date_of_birth || '',
      addresses: updatedAddresses
    };
    updateProfileMutation.mutate(dataToSend);
    showToast('Adresa u shtua dhe u ruajt', 'success');
  };

  const handleEditAddress = (updatedAddress: Address) => {
    const updatedAddresses = addresses.map(addr => 
      addr.id === editingAddress?.id ? { ...updatedAddress, id: addr.id } : addr
    );
    setAddresses(updatedAddresses);
    setEditingAddress(null);
    setIsAddressModalOpen(false);
    
    // Auto-save addresses
    const dataToSend: any = {
      first_name: userData?.first_name || '',
      last_name: userData?.last_name || '',
      email: userData?.email || '',
      phone_number: userData?.phone_number || '',
      date_of_birth: userData?.date_of_birth || '',
      addresses: updatedAddresses
    };
    updateProfileMutation.mutate(dataToSend);
    showToast('Adresa u përditësua dhe u ruajt', 'success');
  };

  const handleDeleteAddress = (addressId: string) => {
    if (confirm('Jeni të sigurt që doni të fshini këtë adresë?')) {
      const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
      setAddresses(updatedAddresses);
      
      // Auto-save addresses
      const dataToSend: any = {
        first_name: userData?.first_name || '',
        last_name: userData?.last_name || '',
        email: userData?.email || '',
        phone_number: userData?.phone_number || '',
        date_of_birth: userData?.date_of_birth || '',
        addresses: updatedAddresses
      };
      updateProfileMutation.mutate(dataToSend);
      showToast('Adresa u fshin dhe ndryshimet u ruajtën', 'success');
    }
  };

  const openAddressModal = (address?: Address) => {
    if (address) {
      setEditingAddress(address);
    } else {
      setEditingAddress(null);
    }
    setIsAddressModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phone_number') {
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
      
      setFormData({ ...formData, [name]: formattedValue });
      
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
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
    setPasswordError('');
    
    // Reset password strength when new password is cleared
    if (e.target.name === 'new_password' && e.target.value === '') {
      setPasswordStrength(0);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordError('Fjalëkalimet e reja nuk përputhen');
      return;
    }
    
    if (passwordData.new_password.length < 8) {
      setPasswordError('Fjalëkalimi i ri duhet të ketë të paktën 8 karaktere');
      return;
    }
    
    // Check for common passwords
    const commonPasswords = ['password', '12345678', 'qwerty', 'abc123', 'password123', '123456789'];
    if (commonPasswords.includes(passwordData.new_password.toLowerCase())) {
      setPasswordError('Ky fjalëkalim është shumë i zakonshëm. Ju lutemi zgjidhni një fjalëkalim më të fortë.');
      return;
    }
    
    changePasswordMutation.mutate({
      old_password: passwordData.old_password,
      new_password: passwordData.new_password,
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]}-${String(date.getDate()).padStart(2, '0')}-${date.getFullYear()}`;
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    // Reset form data to original values
    // Extract phone number without country code for display
    let phoneForDisplay = userData?.phone_number || '';
    
    if (phoneForDisplay.startsWith('+355')) {
      phoneForDisplay = phoneForDisplay.substring(4);
    } else if (phoneForDisplay.startsWith('355')) {
      phoneForDisplay = phoneForDisplay.substring(3);
    }
    
    phoneForDisplay = phoneForDisplay.replace(/\D/g, '');
    
    if (phoneForDisplay) {
      const formatter = new AsYouType('AL');
      const formatted = formatter.input('+355' + phoneForDisplay);
      phoneForDisplay = formatted.replace('+355 ', '').replace('+355', '');
    }
    
    setFormData({
      first_name: userData?.first_name || '',
      last_name: userData?.last_name || '',
      email: userData?.email || '',
      phone_number: phoneForDisplay,
      date_of_birth: userData?.date_of_birth || '',
    });
  };

  return (
    <div className="max-w-4xl bg-white  shadow-sm p-10 rounded-2xl">
      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 font-albertsans">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 font-albertsans">
          {errorMessage}
        </div>
      )}

      {/* Two Column Layout */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-12">
        {/* Left Column - Avatar */}
        <div className="flex-shrink-0 mx-auto md:mx-0">
          <div className="relative">
            <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full bg-[#FEC949] flex items-center justify-center overflow-hidden">
              {userData?.avatar ? (
                <Image
                  src={userData.avatar}
                  alt={userData.first_name || 'User'}
                  width={160}
                  height={160}
                  className="object-cover"
                />
              ) : (
                <Image
                  src="/avatar.svg"
                  alt="User avatar"
                  width={160}
                  height={160}
                  className="object-cover"
                />
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Content */}
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#D32F2F] font-grandstander mb-4 md:mb-6 lg:mb-8 text-center md:text-left">Profili im</h1>

          {/* Profile Content */}
          <form onSubmit={handleSubmit}>
            {/* Account Information */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-600 font-albertsans">Informacioni i llogarisë</h2>
                {!isEditMode && (
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 border-red-600 bg-white flex items-center justify-center hover:bg-red-50 transition-colors"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                )}
              </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-gray-600 mb-2 font-albertsans text-sm sm:text-base">
                {isEditMode && <span className="text-red-500">* </span>}
                Email
              </label>
              {isEditMode ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-albertsans text-sm sm:text-base"
                  required
                />
              ) : (
                <p className="text-base sm:text-lg font-medium font-albertsans">{userData?.email || 'user@gmail.com'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="mb-10">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-600 mb-4 md:mb-6 font-albertsans">Informacioni personal</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-gray-600 mb-2 font-albertsans text-sm sm:text-base">
                {isEditMode && <span className="text-red-500">* </span>}
                Emri
              </label>
              {isEditMode ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    placeholder="Emri"
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-albertsans text-sm sm:text-base"
                    required
                  />
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    placeholder="Mbiemri"
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-albertsans text-sm sm:text-base"
                    required
                  />
                </div>
              ) : (
                <p className="text-base sm:text-lg font-medium font-albertsans">
                  {userData?.first_name || userData?.last_name 
                    ? `${userData.first_name} ${userData.last_name}` 
                    : 'Emri i përdoruesit'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-600 mb-2 font-albertsans text-sm sm:text-base">Telefoni</label>
              {isEditMode ? (
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    +355
                  </span>
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    placeholder="6X XXX XXXX"
                    className={`w-full pl-14 pr-10 py-2 sm:py-3 border ${
                      phoneValidation.error && formData.phone_number
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 ${
                      phoneValidation.error && formData.phone_number
                        ? "focus:ring-red-500"
                        : "focus:ring-blue-500"
                    } font-albertsans text-sm sm:text-base`}
                  />
                  {/* Validation indicator */}
                  {formData.phone_number && (
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
              ) : (
                <p className="text-base sm:text-lg font-medium font-albertsans">
                  {userData?.phone_number || 'Nuk është vendosur'}
                </p>
              )}
              {/* Real-time error message */}
              {isEditMode && phoneValidation.error && formData.phone_number && (
                <p className="text-sm text-red-500 mt-1">
                  {phoneValidation.error}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-600 mb-2 font-albertsans text-sm sm:text-base">Data e lindjes</label>
              {isEditMode ? (
                <div className="relative">
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-albertsans text-sm sm:text-base"
                  />
                  <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              ) : (
                <p className="text-base sm:text-lg font-medium font-albertsans">
                  {userData?.date_of_birth ? formatDate(userData.date_of_birth) : 'Nuk është vendosur'}
                </p>
              )}
            </div>
          </div>
        </div>

            {/* Save Button */}
            {isEditMode && (
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6">
                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="bg-blue-600 text-white px-8 sm:px-12 py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors font-albertsans font-medium disabled:opacity-50 text-sm sm:text-base"
                >
                  {updateProfileMutation.isPending ? 'Duke ruajtur...' : 'Ruaj'}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="border border-gray-300 text-gray-700 px-8 sm:px-12 py-2.5 sm:py-3 rounded-lg hover:bg-gray-50 transition-colors font-albertsans font-medium text-sm sm:text-base"
                >
                  Anulo
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Addresses Section */}
      <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg sm:text-xl font-grandstander font-bold">Adresat e mia</h3>
          <button
            onClick={() => openAddressModal()}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-albertsans font-medium text-sm"
          >
            <PlusIcon className="w-4 h-4" />
            Shto adresë
          </button>
        </div>
        
        {addresses.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-600 font-albertsans mb-4">Nuk keni asnjë adresë të ruajtur</p>
            <button
              onClick={() => openAddressModal()}
              className="text-red-600 hover:text-red-700 font-albertsans font-medium"
            >
              Shtoni adresën tuaj të parë
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <div key={address.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-albertsans font-semibold">Adresa</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openAddressModal(address)}
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                      title="Ndrysho"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(address.id!)}
                      className="text-gray-600 hover:text-red-600 transition-colors"
                      title="Fshi"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 font-albertsans">
                  {address.street_address}<br />
                  {address.city}, {address.zip}<br />
                  Tel: {address.contact_number}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Address Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => {
          setIsAddressModalOpen(false);
          setEditingAddress(null);
        }}
        onSave={editingAddress ? handleEditAddress : handleAddAddress}
        type="shipping"
        initialData={editingAddress || undefined}
      />

      {/* Password Change Section */}
      <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t">
        <h3 className="text-base sm:text-lg font-grandstander font-bold mb-3 sm:mb-4">Ndrysho fjalëkalimin</h3>
        
        {!showPasswordForm ? (
          <button 
            onClick={() => setShowPasswordForm(true)}
            className="text-red-600 hover:text-red-700 font-albertsans font-medium text-sm sm:text-base"
          >
            Kliko këtu për të ndryshuar fjalëkalimin
          </button>
        ) : (
          <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
            {passwordError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg font-albertsans text-sm">
                {passwordError}
              </div>
            )}
            
            <div>
              <label htmlFor="old_password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 font-albertsans">
                Fjalëkalimi aktual
              </label>
              <input
                type="password"
                id="old_password"
                name="old_password"
                value={passwordData.old_password}
                onChange={handlePasswordChange}
                required
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent font-albertsans text-sm sm:text-base"
              />
            </div>
            
            <div>
              <label htmlFor="new_password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 font-albertsans">
                Fjalëkalimi i ri
              </label>
              <input
                type="password"
                id="new_password"
                name="new_password"
                value={passwordData.new_password}
                onChange={handlePasswordChange}
                required
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent font-albertsans text-sm sm:text-base"
              />
              {passwordData.new_password && (
                <>
                  <PasswordStrengthBar 
                    password={passwordData.new_password}
                    minLength={8}
                    scoreWords={['shumë i dobët', 'i dobët', 'i pranueshëm', 'i mirë', 'i fortë']}
                    shortScoreWord="shumë i shkurtër"
                    onChangeScore={(score: number) => setPasswordStrength(score)}
                  />
                  {passwordStrength < 2 && (
                    <p className="text-xs text-amber-600 mt-1 font-albertsans">
                      Fjalëkalimi duhet të jetë të paktën "i pranueshëm" për të vazhduar
                    </p>
                  )}
                </>
              )}
            </div>
            
            <div>
              <label htmlFor="confirm_password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 font-albertsans">
                Konfirmo fjalëkalimin e ri
              </label>
              <input
                type="password"
                id="confirm_password"
                name="confirm_password"
                value={passwordData.confirm_password}
                onChange={handlePasswordChange}
                required
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent font-albertsans text-sm sm:text-base"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
              <button
                type="submit"
                disabled={
                  changePasswordMutation.isPending || 
                  !passwordData.old_password || 
                  !passwordData.new_password || 
                  !passwordData.confirm_password ||
                  (!!passwordData.new_password && passwordStrength < 2)
                }
                className="bg-red-600 text-white px-6 py-2.5 sm:py-3 rounded-lg hover:bg-red-700 transition-colors font-albertsans font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                title={
                  !passwordData.old_password || !passwordData.new_password || !passwordData.confirm_password 
                    ? 'Ju lutemi plotësoni të gjitha fushat' 
                    : (!!passwordData.new_password && passwordStrength < 2) 
                      ? 'Fjalëkalimi duhet të jetë të paktën "i pranueshëm"' 
                      : ''
                }
              >
                {changePasswordMutation.isPending ? 'Duke ndryshuar...' : 'Ndrysho fjalëkalimin'}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setShowPasswordForm(false);
                  setPasswordData({
                    old_password: '',
                    new_password: '',
                    confirm_password: '',
                  });
                  setPasswordError('');
                  setPasswordStrength(0);
                }}
                className="border border-gray-300 text-gray-700 px-6 py-2.5 sm:py-3 rounded-lg hover:bg-gray-50 transition-colors font-albertsans font-medium text-sm sm:text-base"
              >
                Anulo
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
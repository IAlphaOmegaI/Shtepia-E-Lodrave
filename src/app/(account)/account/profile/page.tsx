'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import Image from 'next/image';

interface ProfileFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  birth_date: string;
}

interface PasswordChangeData {
  current_password: string;
  new_password: string;
}

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [passwordError, setPasswordError] = useState('');
  
  const { data: userData } = useQuery({
    queryKey: ['user', 'me'],
    queryFn: () => api.auth.me(),
  });

  const [formData, setFormData] = useState({
    first_name: userData?.first_name || '',
    last_name: userData?.last_name || '',
    email: userData?.email || '',
    phone: userData?.phone || '',
    birth_date: userData?.birth_date || '',
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        birth_date: userData.birth_date || '',
      });
    }
  }, [userData]);

  const updateProfileMutation = useMutation({
    mutationFn: (data: ProfileFormData) => api.auth.updateProfile(data),
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
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
      setPasswordError('');
      setTimeout(() => setSuccessMessage(''), 3000);
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      setPasswordError(error.response?.data?.message || 'Ndodhi një gabim gjatë ndryshimit të fjalëkalimit');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
    setPasswordError('');
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
    
    changePasswordMutation.mutate({
      current_password: passwordData.current_password,
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
    setFormData({
      first_name: userData?.first_name || '',
      last_name: userData?.last_name || '',
      email: userData?.email || '',
      phone: userData?.phone || '',
      birth_date: userData?.birth_date || '',
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
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#D32F2F] font-grandstander mb-4 md:mb-6 lg:mb-8 text-center md:text-left">My profile</h1>

          {/* Profile Content */}
          <form onSubmit={handleSubmit}>
            {/* Account Information */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-600 font-albertsans">Account information</h2>
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
          <h2 className="text-lg sm:text-xl font-semibold text-gray-600 mb-4 md:mb-6 font-albertsans">Personal information</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-gray-600 mb-2 font-albertsans text-sm sm:text-base">
                {isEditMode && <span className="text-red-500">* </span>}
                Name
              </label>
              {isEditMode ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    placeholder="First name"
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-albertsans text-sm sm:text-base"
                    required
                  />
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    placeholder="Last name"
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-albertsans text-sm sm:text-base"
                    required
                  />
                </div>
              ) : (
                <p className="text-base sm:text-lg font-medium font-albertsans">
                  {userData?.first_name || userData?.last_name 
                    ? `${userData.first_name} ${userData.last_name}` 
                    : 'User name goes here'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-600 mb-2 font-albertsans text-sm sm:text-base">Phone</label>
              {isEditMode ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+355 123456789"
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-albertsans text-sm sm:text-base"
                />
              ) : (
                <p className="text-base sm:text-lg font-medium font-albertsans">
                  {userData?.phone || '+355 123456789'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-600 mb-2 font-albertsans text-sm sm:text-base">Date of birth</label>
              {isEditMode ? (
                <div className="relative">
                  <input
                    type="date"
                    name="birth_date"
                    value={formData.birth_date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-albertsans text-sm sm:text-base"
                  />
                  <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              ) : (
                <p className="text-base sm:text-lg font-medium font-albertsans">
                  {userData?.birth_date ? formatDate(userData.birth_date) : 'May-02-1990'}
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
                  {updateProfileMutation.isPending ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="border border-gray-300 text-gray-700 px-8 sm:px-12 py-2.5 sm:py-3 rounded-lg hover:bg-gray-50 transition-colors font-albertsans font-medium text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

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
              <label htmlFor="current_password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 font-albertsans">
                Fjalëkalimi aktual
              </label>
              <input
                type="password"
                id="current_password"
                name="current_password"
                value={passwordData.current_password}
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
                disabled={changePasswordMutation.isPending}
                className="bg-red-600 text-white px-6 py-2.5 sm:py-3 rounded-lg hover:bg-red-700 transition-colors font-albertsans font-medium disabled:opacity-50 text-sm sm:text-base"
              >
                {changePasswordMutation.isPending ? 'Duke ndryshuar...' : 'Ndrysho fjalëkalimin'}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setShowPasswordForm(false);
                  setPasswordData({
                    current_password: '',
                    new_password: '',
                    confirm_password: '',
                  });
                  setPasswordError('');
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
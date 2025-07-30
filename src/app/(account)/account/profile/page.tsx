'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import Image from 'next/image';
import { CameraIcon } from '@/components/icons/camera';

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
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
    mutationFn: (data: any) => api.auth.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
      setSuccessMessage('Profili u përditësua me sukses!');
      setTimeout(() => setSuccessMessage(''), 3000);
    },
    onError: () => {
      setErrorMessage('Ndodhi një gabim gjatë përditësimit të profilit');
      setTimeout(() => setErrorMessage(''), 3000);
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Handle image upload
      const formData = new FormData();
      formData.append('avatar', file);
      // Upload logic here
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-grandstander font-bold">Profili im</h2>
      </div>
      
      <div className="p-8">
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
        
        {/* Avatar Section */}
        <div className="flex items-center gap-6 mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {userData?.avatar ? (
                <Image
                  src={userData.avatar}
                  alt={userData.first_name || 'User'}
                  width={96}
                  height={96}
                  className="object-cover"
                />
              ) : (
                <span className="text-3xl font-grandstander font-bold text-gray-600">
                  {userData?.first_name?.[0]?.toUpperCase() || 'U'}
                </span>
              )}
            </div>
            <label className="absolute bottom-0 right-0 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-700 transition-colors">
              <CameraIcon className="w-4 h-4 text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
          
          <div>
            <h3 className="text-xl font-grandstander font-bold">
              {userData?.first_name} {userData?.last_name}
            </h3>
            <p className="text-gray-600 font-albertsans">{userData?.email}</p>
          </div>
        </div>
        
        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1 font-albertsans">
                Emri
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent font-albertsans"
                placeholder="Emri juaj"
              />
            </div>
            
            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1 font-albertsans">
                Mbiemri
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent font-albertsans"
                placeholder="Mbiemri juaj"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 font-albertsans">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent font-albertsans"
              placeholder="email@example.com"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1 font-albertsans">
              Numri i telefonit
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent font-albertsans"
              placeholder="+355 6X XXX XXXX"
            />
          </div>
          
          <div>
            <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700 mb-1 font-albertsans">
              Data e lindjes
            </label>
            <input
              type="date"
              id="birth_date"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent font-albertsans"
            />
          </div>
          
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-albertsans font-medium disabled:opacity-50"
            >
              {updateProfileMutation.isPending ? 'Duke ruajtur...' : 'Ruaj ndryshimet'}
            </button>
            
            <button
              type="button"
              onClick={() => {
                setFormData({
                  first_name: userData?.first_name || '',
                  last_name: userData?.last_name || '',
                  email: userData?.email || '',
                  phone: userData?.phone || '',
                  birth_date: userData?.birth_date || '',
                });
              }}
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-albertsans font-medium"
            >
              Anulo
            </button>
          </div>
        </form>
        
        {/* Password Change Section */}
        <div className="mt-12 pt-8 border-t">
          <h3 className="text-lg font-grandstander font-bold mb-4">Ndrysho fjalëkalimin</h3>
          <button className="text-red-600 hover:text-red-700 font-albertsans font-medium">
            Kliko këtu për të ndryshuar fjalëkalimin
          </button>
        </div>
      </div>
    </div>
  );
}
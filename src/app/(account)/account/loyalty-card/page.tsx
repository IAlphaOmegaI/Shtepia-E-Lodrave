'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function LoyaltyCardPage() {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  
  const { data: userData } = useQuery({
    queryKey: ['user', 'me'],
    queryFn: () => api.auth.me(),
  });

  useEffect(() => {
    if (userData) {
      // Generate QR code with user ID
      QRCode.toDataURL(`LOYALTY:${userData.id}`, {
        width: 200,
        margin: 0,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      }).then(setQrCodeUrl);
    }
  }, [userData]);

  const loyaltyPoints = userData?.loyalty_points || 1240;

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-2xl font-grandstander font-bold mb-8">Karta e besnikërisë</h2>
      
      {/* Loyalty Card */}
      <div className="max-w-md mx-auto">
        <div 
          className="relative rounded-2xl overflow-hidden shadow-xl"
          style={{
            background: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
            aspectRatio: '1.586', // Credit card aspect ratio
          }}
        >
          {/* Card Content */}
          <div className="absolute inset-0 p-8 flex flex-col justify-between">
            {/* Top Section */}
            <div>
              <Image
                src="/assets/logo-white.png"
                alt="Shtëpia e Lodrave"
                width={120}
                height={40}
                className="mb-4"
              />
              <p className="text-white/80 text-sm font-albertsans">Karta e besnikërisë</p>
            </div>
            
            {/* Points Section */}
            <div className="text-center">
              <p className="text-white/80 text-sm font-albertsans mb-2">Pikët tuaja</p>
              <p className="text-white text-5xl font-bold font-grandstander">{loyaltyPoints} pts</p>
            </div>
            
            {/* Bottom Section with QR Code */}
            <div className="flex items-end justify-between">
              <div>
                <p className="text-white/80 text-xs font-albertsans">Anëtar që nga</p>
                <p className="text-white text-sm font-albertsans">
                  {userData?.created_at ? new Date(userData.created_at).getFullYear() : '2024'}
                </p>
              </div>
              
              {qrCodeUrl && (
                <div className="bg-white p-2 rounded-lg">
                  <img src={qrCodeUrl} alt="QR Code" className="w-20 h-20" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Instructions */}
      <div className="mt-12 space-y-6">
        <div>
          <h3 className="text-lg font-grandstander font-bold mb-4">Si të përdorni kartën tuaj</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
              <p className="font-albertsans text-gray-700">
                Tregoni kodin QR në dyqan kur bëni blerje për të fituar pikë automatikisht
              </p>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
              <p className="font-albertsans text-gray-700">
                Fitoni 1 pikë për çdo 100 lekë që shpenzoni
              </p>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
              <p className="font-albertsans text-gray-700">
                Përdorni pikët tuaja për zbritje: 100 pikë = 100 lekë zbritje
              </p>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-grandstander font-bold mb-4">Përfitimet e anëtarëve</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-albertsans font-medium mb-1">Ofertat ekskluzive</h4>
              <p className="text-sm text-gray-600 font-albertsans">
                Merrni qasje të hershme në shitje dhe promovime speciale
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-albertsans font-medium mb-1">Dhurata ditëlindjeje</h4>
              <p className="text-sm text-gray-600 font-albertsans">
                Merrni një dhuratë speciale në ditëlindjen tuaj
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-albertsans font-medium mb-1">Transport falas</h4>
              <p className="text-sm text-gray-600 font-albertsans">
                Transport falas për porosi mbi 5,000 lekë
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-albertsans font-medium mb-1">Pikë të dyfishta</h4>
              <p className="text-sm text-gray-600 font-albertsans">
                Fitoni pikë të dyfishta në produktet e zgjedhura
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
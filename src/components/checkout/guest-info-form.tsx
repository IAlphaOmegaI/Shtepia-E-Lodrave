import { useState } from 'react';
import Link from 'next/link';
import { Routes } from '@/config/routes';
import Image from 'next/image';

interface GuestInfo {
  firstName: string;
  lastName: string;
  email: string;
}

interface Props {
  onInfoChange: (info: GuestInfo) => void;
  className?: string;
}

const GuestInfoForm: React.FC<Props> = ({ onInfoChange, className }) => {
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    firstName: '',
    lastName: '',
    email: '',
  });

  const handleChange = (field: keyof GuestInfo, value: string) => {
    const newInfo = { ...guestInfo, [field]: value };
    setGuestInfo(newInfo);
    onInfoChange(newInfo);
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm ${className || ""}`}>
      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-red-600 font-grandstander mb-4">
          Informacionet Personale
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Emri
              </label>
              <input
                type="text"
                value={guestInfo.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Shkruani emrin"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mbiemri
              </label>
              <input
                type="text"
                value={guestInfo.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Shkruani mbiemrin"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adresa e email-it
            </label>
            <input
              type="email"
              value={guestInfo.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Shkruani adresën e email-it"
            />
          </div>

          {/* Loyalty Points Promotion */}
          <div className="mt-6 relative overflow-hidden  border border-gray-200 rounded-lg">
            <div className="relative p-6">
              <div className="flex items-start flex-col text-center justify-center sm:flex-row sm:text-left">
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-dark mb-1 font-grandstander">
                    Pse të mos fitoni pikë besnike?
                  </h4>
                  <p className="text-dark text-opacity-90 font-albertus mb-3 max-w-[400px]">
                    Krijoni një llogari me ne dhe fitoni pikë në çdo blerje që
                    mund t&apos;i përdorni për zbritje!
                  </p>
                  <Link
                    href={Routes.register}
                    className="inline-flex items-center px-4 py-2 bg-red-700 text-white font-semibold text-sm rounded-lg"
                  >
                    Krijo llogari
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </Link>
                </div>
                <div className="relative right-0 top-0 h-full mx-auto">
                  <Image
                    src="/plastic_card_mockup_01.png"
                    alt="Right decoration"
                    width={540}
                    height={271}
                    className="h-full w-auto"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestInfoForm;
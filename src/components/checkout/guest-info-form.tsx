import { useState, useEffect } from 'react';
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
  initialValues?: GuestInfo;
  isReadOnly?: boolean;
  className?: string;
  errors?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  isAuthenticated?: boolean;
  userPoints?: number;
  usePoints?: boolean;
  onUsePointsChange?: (usePoints: boolean) => void;
}

const GuestInfoForm: React.FC<Props> = ({ 
  onInfoChange, 
  initialValues,
  isReadOnly = false,
  className,
  errors = {},
  isAuthenticated = false,
  userPoints = 0,
  usePoints = false,
  onUsePointsChange
}) => {
  const [guestInfo, setGuestInfo] = useState<GuestInfo>(
    initialValues || {
      firstName: '',
      lastName: '',
      email: '',
    }
  );
  const [touched, setTouched] = useState<{
    firstName?: boolean;
    lastName?: boolean;
    email?: boolean;
  }>({});

  useEffect(() => {
    if (initialValues) {
      setGuestInfo(initialValues);
    }
  }, [initialValues]);

  const handleChange = (field: keyof GuestInfo, value: string) => {
    const newInfo = { ...guestInfo, [field]: value };
    setGuestInfo(newInfo);
    setTouched({ ...touched, [field]: true });
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Emri *
              </label>
              <input
                type="text"
                value={guestInfo.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.firstName && !guestInfo.firstName 
                    ? 'border-red-500' 
                    : 'border-gray-300'
                } ${isReadOnly ? 'bg-gray-50' : ''}`}
                placeholder="Shkruani emrin"
                readOnly={isReadOnly}
                required
              />
              {errors.firstName && !guestInfo.firstName && (
                <p className="mt-1 text-xs text-red-500">Emri është i detyrueshëm</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mbiemri *
              </label>
              <input
                type="text"
                value={guestInfo.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.lastName && !guestInfo.lastName 
                    ? 'border-red-500' 
                    : 'border-gray-300'
                } ${isReadOnly ? 'bg-gray-50' : ''}`}
                readOnly={isReadOnly}
                required
                placeholder="Shkruani mbiemrin"
              />
              {errors.lastName && !guestInfo.lastName && (
                <p className="mt-1 text-xs text-red-500">Mbiemri është i detyrueshëm</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adresa e email-it *
            </label>
            <input
              type="email"
              value={guestInfo.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.email 
                  ? 'border-red-500' 
                  : 'border-gray-300'
              } ${isReadOnly ? 'bg-gray-50' : ''}`}
              placeholder="Shkruani adresën e email-it"
              readOnly={isReadOnly}
              required
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Loyalty Points Section */}
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
                  
                  {isAuthenticated ? (
                    userPoints > 0 ? (
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="use-points"
                            checked={usePoints}
                            onChange={(e) => onUsePointsChange?.(e.target.checked)}
                            className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
                          />
                          <label htmlFor="use-points" className="text-sm font-medium text-gray-700">
                            Përdor {userPoints.toFixed(0)} pikë për këtë porosi
                          </label>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600 font-albertsans">
                        Ju nuk keni pikë të disponueshme
                      </p>
                    )
                  ) : (
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
                  )}
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
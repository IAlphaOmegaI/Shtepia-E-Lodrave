'use client';

import OrderNote from '@/components/checkout/order-note';
import { shippingAddressAtom } from '@/store/checkout';
import { useAtom } from 'jotai';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useUser } from '@/hooks/use-user';
import GuestInfoForm from '@/components/checkout/guest-info-form';
import CheckoutSummary from '@/components/checkout/checkout-summary';

const AddressGrid = dynamic(
  () => import('@/components/checkout/address-grid'),
  { ssr: false },
);

export default function CheckoutContent() {
  const { user, isAuthenticated } = useUser();
  const [guestInfo, setGuestInfo] = useState({ firstName: '', lastName: '', email: '' });
  const [currentStep, setCurrentStep] = useState('shipping'); // 'shipping' or 'confirmation'
  const [shippingAddress] = useAtom(shippingAddressAtom);

  const userAddresses = user?.address || [];

  const handleContinue = () => {
    // Validate that shipping address is selected
    if (shippingAddress) {
      setCurrentStep('confirmation');
    } else {
      alert('Ju lutem zgjidhni një adresë dërgese');
    }
  };

  const handlePlaceOrder = () => {
    // Handle order placement
    console.log('Placing order...');
  };

  if (currentStep === 'confirmation') {
    return (
      <div className="bg-[#FFF8F0] min-h-screen px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-red-600 mb-6">Konfirmo informacionin e dërgesës</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Confirmation */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address Confirmation */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Adresa e dërgesës</h3>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                  {shippingAddress && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <input
                          type="radio"
                          checked={true}
                          readOnly
                          className="mt-1 w-4 h-4 text-blue-600"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">Adresa e përdoruesit</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {shippingAddress.street_address}
                          </p>
                          <p className="text-sm text-gray-600">
                            {shippingAddress.city}, {shippingAddress.country}
                          </p>
                          <p className="text-sm text-gray-600">
                            {shippingAddress.zip}
                          </p>
                          {shippingAddress.contact_number && (
                            <p className="text-sm text-gray-600 mt-2">
                              Numri i kontaktit: {shippingAddress.contact_number}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary with Payment */}
            <div className="lg:sticky lg:top-4">
              <CheckoutSummary 
                showPaymentMethod={true}
                showPlaceOrder={true}
                onPlaceOrder={handlePlaceOrder}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFF8F0] min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-red-600 mb-6">Informacioni i dërgesës</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Guest Information - if not authenticated */}
            {!isAuthenticated && (
              <GuestInfoForm
                onInfoChange={setGuestInfo}
                className=""
              />
            )}

            {/* Shipping Address */}
            <AddressGrid
              userId={user?.id || 'guest'}
              className=""
              label="Zgjidhni adresën e dërgesës"
              count={isAuthenticated ? 1 : 2}
              addresses={userAddresses?.filter(
                (item: any) => item?.type === 'shipping',
              )}
              atom={shippingAddressAtom}
              type="shipping"
            />

            {/* Order Note */}
            <OrderNote 
              count={isAuthenticated ? 2 : 3} 
              label="Shënim për porosinë" 
              className=""
            />
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:sticky lg:top-4">
            <CheckoutSummary 
              onContinue={handleContinue}
              showContinueButton={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
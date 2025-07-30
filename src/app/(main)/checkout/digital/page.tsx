'use client';

import { billingAddressAtom } from '@/store/checkout';
import dynamic from 'next/dynamic';
import OrderNote from '@/components/checkout/order-note';

const AddressGrid = dynamic(
  () => import('@/components/checkout/address-grid'),
  { ssr: false }
);
const ContactGrid = dynamic(
  () => import('@/components/checkout/contact/contact-grid')
);
const RightSideView = dynamic(
  () => import('@/components/checkout/right-side-view'),
  { ssr: false }
);

export default function DigitalCheckoutPage() {
  // Mock user data - replace with actual user data
  const mockUser = {
    id: '1',
    profile: {
      contact: '+1234567890'
    },
    address: [
      {
        id: '1',
        type: 'billing',
        title: 'Home',
        country: 'USA',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        street_address: '123 Main St'
      }
    ]
  };

  return (
    <>
      <div className="bg-gray-100 px-4 py-8 lg:py-10 lg:px-8 xl:py-14 xl:px-16 2xl:px-20">
        <div className="m-auto flex w-full max-w-5xl flex-col items-center rtl:space-x-reverse lg:flex-row lg:items-start lg:space-x-8">
          <div className="w-full space-y-6 lg:max-w-2xl">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Note:</span> This is a digital product checkout. No shipping address is required.
              </p>
            </div>
            
            <ContactGrid
              className="bg-white p-5 shadow-sm md:p-8"
              contact={mockUser.profile?.contact}
              label="Contact Number"
              count={1}
            />

            <AddressGrid
              userId={mockUser.id!}
              className="bg-white p-5 shadow-sm md:p-8"
              label="Billing Address"
              count={2}
              addresses={mockUser.address?.filter(
                (item: any) => item?.type === 'billing',
              )}
              atom={billingAddressAtom}
              type="billing"
            />
            
            <OrderNote count={3} label="Order Note" />
          </div>
          <div className="mb-10 w-full sm:mb-12 lg:mb-0 lg:w-96 bg-white p-5 shadow-sm">
            <RightSideView />
          </div>
        </div>
      </div>
    </>
  );
}
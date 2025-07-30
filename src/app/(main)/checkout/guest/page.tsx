'use client';

import {
  billingAddressAtom,
  clearCheckoutAtom,
  shippingAddressAtom,
} from '@/store/checkout';
import dynamic from 'next/dynamic';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import GuestName from '@/components/checkout/guest-name';
import OrderNote from '@/components/checkout/order-note';

const ScheduleGrid = dynamic(
  () => import('@/components/checkout/schedule/schedule-grid')
);
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

export default function GuestCheckoutPage() {
  const [, resetCheckout] = useAtom(clearCheckoutAtom);
  const [billingAddress] = useAtom(billingAddressAtom);
  const [shippingAddress] = useAtom(shippingAddressAtom);

  useEffect(() => {
    resetCheckout();
  }, [resetCheckout]);

  return (
    <>
      <div className="bg-gray-100 px-4 py-8 lg:py-10 lg:px-8 xl:py-14 xl:px-16 2xl:px-20">
        <div className="m-auto flex w-full max-w-5xl flex-col items-center rtl:space-x-reverse lg:flex-row lg:items-start lg:space-x-8">
          <div className="w-full space-y-6 lg:max-w-2xl">
            <GuestName
              className="bg-white p-5 shadow-sm md:p-8"
              count={1}
              label="Guest Information"
            />
            <ContactGrid
              className="bg-white p-5 shadow-sm md:p-8"
              label="Contact Number"
              count={2}
            />
            <AddressGrid
              userId="guest"
              className="bg-white p-5 shadow-sm md:p-8"
              label="Billing Address"
              count={3}
              addresses={billingAddress ? [billingAddress] : []}
              atom={billingAddressAtom}
              type="billing"
            />
            <AddressGrid
              userId="guest"
              className="bg-white p-5 shadow-sm md:p-8"
              label="Shipping Address"
              count={4}
              addresses={shippingAddress ? [shippingAddress] : []}
              atom={shippingAddressAtom}
              type="shipping"
            />
            <ScheduleGrid
              className="bg-white p-5 shadow-sm md:p-8"
              label="Delivery Schedule"
              count={5}
            />
            <OrderNote count={6} label="Order Note" />
          </div>
          <div className="mb-10 w-full sm:mb-12 lg:mb-0 lg:w-96 bg-white p-5 shadow-sm">
            <RightSideView />
          </div>
        </div>
      </div>
    </>
  );
}
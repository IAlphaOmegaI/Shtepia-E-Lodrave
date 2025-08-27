import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { SetStateAction } from 'react';

interface Address {
  id: string;
  type: string;
  title: string;
  country: string;
  city: string;
  state: string;
  zip: string;
  street_address: string;
  contact_number?: string;
  phone_number?: string;
}

interface DeliveryTime {
  id: string;
  title: string;
  description: string;
}

interface VerifiedResponse {
  total_tax: number;
  shipping_charge: number;
  unavailable_products: any[];
  wallet_amount: number;
  wallet_currency: number;
}

interface Coupon {
  id: string;
  code: string;
  amount: number;
  type: string;
}

export enum PaymentGateway {
  COD = 'cash_on_delivery',
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
}

interface CheckoutState {
  billing_address: Address | null;
  shipping_address: Address | null;
  payment_gateway: PaymentGateway;
  payment_sub_gateway: string;
  delivery_time: DeliveryTime | null;
  customer_contact: string;
  customer_name: string | null;
  verified_response: VerifiedResponse | null;
  coupon: Coupon | null;
  payable_amount: number;
  use_wallet: boolean;
  note?: string;
  [key: string]: unknown;
}

export const defaultCheckout: CheckoutState = {
  billing_address: null,
  shipping_address: null,
  delivery_time: null,
  payment_gateway: PaymentGateway.COD,
  payment_sub_gateway: '',
  customer_contact: '',
  customer_name: '',
  verified_response: null,
  coupon: null,
  note: '',
  payable_amount: 0,
  use_wallet: false,
};

// Original atom - keeping localStorage for other checkout data but not addresses
export const checkoutAtom = atomWithStorage('checkout', defaultCheckout);
export const clearCheckoutAtom = atom(null, (_get, set, _data) => {
  return set(checkoutAtom, defaultCheckout);
});

// Billing address - no localStorage persistence
export const billingAddressAtom = atom<Address | null>(null);

// Shipping address - no localStorage persistence
export const shippingAddressAtom = atom<Address | null>(null);

// Order note - no localStorage persistence
export const orderNoteAtom = atom<string>('');

export const deliveryTimeAtom = atom(
  (get) => get(checkoutAtom).delivery_time,
  (get, set, data: DeliveryTime) => {
    const prev = get(checkoutAtom);
    return set(checkoutAtom, { ...prev, delivery_time: data });
  }
);
export const paymentGatewayAtom = atom(
  (get) => get(checkoutAtom).payment_gateway,
  (get, set, data: PaymentGateway) => {
    const prev = get(checkoutAtom);
    return set(checkoutAtom, { ...prev, payment_gateway: data });
  }
);

export const paymentSubGatewayAtom = atom(
  (get) => get(checkoutAtom).payment_sub_gateway,
  (get, set, data: string) => {
    const prev = get(checkoutAtom);
    return set(checkoutAtom, { ...prev, payment_sub_gateway: data });
  }
);

export const verifiedTokenAtom = atom(
  (get) => get(checkoutAtom).token,
  (get, set, data: string) => {
    const prev = get(checkoutAtom);
    return set(checkoutAtom, { ...prev, token: data });
  }
);
export const customerContactAtom = atom(
  (get) => get(checkoutAtom).customer_contact,
  (get, set, data: string) => {
    const prev = get(checkoutAtom);
    return set(checkoutAtom, { ...prev, customer_contact: data });
  }
);
export const guestNameAtom = atom(
  (get) => get(checkoutAtom).customer_name,
  (get, set, data: string) => {
    const prev = get(checkoutAtom);
    return set(checkoutAtom, { ...prev, customer_name: data });
  }
);
export const verifiedResponseAtom = atom(
  (get) => get(checkoutAtom).verified_response,
  (get, set, data: VerifiedResponse | null) => {
    const prev = get(checkoutAtom);
    return set(checkoutAtom, { ...prev, verified_response: data });
  }
);
export const couponAtom = atom(
  (get) => get(checkoutAtom).coupon,
  (get, set, data: Coupon | null) => {
    const prev = get(checkoutAtom);
    return set(checkoutAtom, { ...prev, coupon: data });
  }
);
export const discountAtom = atom((get) => get(checkoutAtom).coupon?.amount);

export const walletAtom = atom(
  (get) => get(checkoutAtom).use_wallet,
  (get, set) => {
    const prev = get(checkoutAtom);
    return set(checkoutAtom, { ...prev, use_wallet: !prev.use_wallet });
  }
);
export const payableAmountAtom = atom(
  (get) => get(checkoutAtom).payable_amount,
  (get, set, data: number) => {
    const prev = get(checkoutAtom);
    return set(checkoutAtom, { ...prev, payable_amount: data });
  }
);
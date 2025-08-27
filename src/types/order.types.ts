import { Product } from './product.types';
import { User } from './auth.types';

export interface OrderItem {
  id?: number;
  product_id: number;
  product?: Product;
  quantity: number;
  price?: string;
  image?: string;
  total?: string;
  variant_id?: number;
  // variant_options?: any;
}

export interface OrderAddress {
  id?: number;
  full_name: string;
  phone: string;
  email?: string;
  country: string;
  city: string;
  state?: string;
  zip_code?: string;
  street_address: string;
  building?: string;
  apartment?: string;
  note?: string;
}

export interface Order {
  id: number;
  tracking_number: string;
  tracking_code?: string;
  customer_id?: number;
  customer?: User;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  shop_id: number;
 
  status: OrderStatus;
  amount: string;
  sales_tax?: string;
  paid_total?: string;
  total: string;
  shipping_fee?: string;
  payment_id?: string;
  payment_gateway?: PaymentGateway;
  coupon_id?: number;
  discount?: string;
  delivery_fee?: string;
  delivery_time?: string;
  billing_address?: OrderAddress;
  shipping_address?: OrderAddress;
  language?: string;
  translated_languages?: string[];
  note?: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export type OrderStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'cancelled'
  | 'refunded'
  | 'failed'
  | 'on-hold'
  | 'out-for-delivery';

export type PaymentGateway = 
  | 'stripe'
  | 'paypal'
  | 'razorpay'
  | 'mollie'
  | 'paystack'
  | 'cash_on_delivery'
  | 'bank_transfer';

export interface CreateOrderData {
  items: OrderItem[];
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  billing_address?: OrderAddress;
  shipping_address?: OrderAddress;
  same_as_billing?: boolean;
  payment_method?: PaymentGateway;
  payment_id?: string;
  coupon_code?: string;
  note?: string;
  delivery_time?: string;
}

export interface OrderListResponse {
  data: Order[];
  paginatorInfo?: {
    total: number;
    current_page: number;
    last_page: number;
    count: number;
    per_page: number;
  };
}

export interface OrderFilters {
  status?: OrderStatus;
  customer_id?: number;
  shop_id?: number;
  tracking_number?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
  page?: number;
  order_by?: string;
}

export interface OrderTrackingResponse {
  order: Order;
  tracking_details?: {
    status: string;
    message: string;
    timestamp: string;
  }[];
}
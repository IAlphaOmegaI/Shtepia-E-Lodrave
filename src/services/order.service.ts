import { api } from './api';
import type { 
  Order, 
  OrderItem, 
  CreateOrderData, 
  OrderListResponse,
  OrderFilters,
  OrderStatus 
} from '@/types';

export class OrderService {
  /**
   * Get all orders (requires authentication)
   */
  static async getAll(): Promise<Order[]> {
    try {
      const response = await api.orders.getAll();
      return response.data || [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  }

  /**
   * Create a new order
   */
  static async create(orderData: CreateOrderData): Promise<Order> {
    try {
      const response = await api.orders.create(orderData);
      return response;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error; // Re-throw for proper error handling in UI
    }
  }

  /**
   * Get order by ID
   */
  static async getById(orderId: string | number) {
    try {
      const response = await api.orders.getAll();
      const orders = response.data || [];
      return orders.find((order: any) => order.id === Number(orderId)) || null;
    } catch (error) {
      console.error(`Error fetching order ${orderId}:`, error);
      return null;
    }
  }

  /**
   * Get order by tracking number
   */
  static async getByTrackingNumber(trackingNumber: string) {
    try {
      // Assuming there's an endpoint for tracking
      const response = await api.orders.getAll();
      const orders = response.data || [];
      return orders.find((order: any) => order.tracking_number === trackingNumber) || null;
    } catch (error) {
      console.error(`Error fetching order with tracking ${trackingNumber}:`, error);
      return null;
    }
  }

  /**
   * Get user's order history
   */
  static async getUserOrders(userId?: string | number) {
    try {
      const response = await api.orders.getAll();
      const orders = response.data || [];
      // If userId provided, filter by user
      if (userId) {
        return orders.filter((order: any) => order.user_id === Number(userId));
      }
      return orders;
    } catch (error) {
      console.error('Error fetching user orders:', error);
      return [];
    }
  }

  /**
   * Cancel an order
   */
  static async cancel(orderId: string | number) {
    try {
      // Implement when endpoint is available
      console.log(`Canceling order ${orderId}`);
      return { success: true, message: 'Order cancelled' };
    } catch (error) {
      console.error(`Error canceling order ${orderId}:`, error);
      throw error;
    }
  }

  /**
   * Calculate order total from items
   */
  static calculateTotal(items: OrderItem[]): number {
    return items.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
  }

  /**
   * Validate order data before submission
   */
  static validateOrderData(orderData: CreateOrderData): string[] {
    const errors: string[] = [];

    if (!orderData.items || orderData.items.length === 0) {
      errors.push('Order must contain at least one item');
    }

    if (!orderData.customer_email && !orderData.customer_phone) {
      errors.push('Either email or phone number is required');
    }

    return errors;
  }
}
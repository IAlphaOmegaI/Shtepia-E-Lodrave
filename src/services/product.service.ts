import { api } from './api';
import { NEW_COLLECTIONS_CATEGORY_ID } from '@/lib/constants';
import type { Product, ProductListResponse, ProductFilters } from '@/types';

export class ProductService {
  /**
   * Get all products with optional filters
   */
  static async getAll(params?: ProductFilters): Promise<Product[]> {
    try {
      const response = await api.products.getAll(params);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  /**
   * Get products with a specific limit
   */
  static async getProducts(limit: number = 10) {
    return this.getAll({ limit });
  }

  /**
   * Get product by ID
   */
  static async getById(id: string | number) {
    try {
      const response = await api.products.getById(id);
      console.log("XHANI")
      console.log(response);
      return response;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      return null;
    }
  }

  /**
   * Get products by category
   */
  static async getByCategory(categoryId: number, limit?: number) {
    try {
      const response = await api.products.getByCategory(categoryId, limit);
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching products for category ${categoryId}:`, error);
      return [];
    }
  }

  /**
   * Get new collection products
   */
  static async getNewCollections(limit: number = 20) {
    // return this.getByCategory(NEW_COLLECTIONS_CATEGORY_ID, limit);
     try {
      const response = await api.products.getByCategorySlug("koleksioni-ri", limit);
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching products for category koleksioni-ri`, error);
      return [];
    }
  }

  /**
   * Search products
   */
  static async search(query: string, params?: any) {
    try {
      const response = await api.products.getAll({ 
        search: query,
        ...params 
      });
      return response.data || [];
    } catch (error) {
      console.error(`Error searching products for "${query}":`, error);
      return [];
    }
  }

  /**
   * Search products for autocomplete
   * Returns limited results for search dropdown
   */
  static async searchProducts(query: string, limit: number = 8) {
    try {
      const response = await api.products.search(query, { limit });
      const products = response.data || [];
      return Array.isArray(products) ? products : [];
    } catch (error) {
      console.error(`Error searching products for "${query}":`, error);
      return [];
    }
  }

  /**
   * Get featured products
   */
  static async getFeatured(limit: number = 10) {
    try {
      const response = await api.products.getAll({ 
        featured: true,
        limit 
      });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
  }

  /**
   * Get best selling products
   */
  static async getBestSelling(limit: number = 10) {
    try {
      const response = await api.products.getAll({ 
        order_by: '-sold_quantity',
        limit 
      });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching best selling products:', error);
      return [];
    }
  }
}
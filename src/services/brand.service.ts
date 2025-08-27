import { api } from './api';
import type { Brand, BrandFilters } from '@/types';

export class BrandService {
  /**
   * Get all brands
   */
  static async getAll(filters?: BrandFilters): Promise<Brand[]> {
    try {
      const response = await api.brands.getAll();
      let brands = response || [];
      
      // Apply client-side filtering if needed
      if (filters) {
        if (filters.is_parent !== undefined) {
          brands = brands.filter(brand => brand.is_parent === filters.is_parent);
        }
        if (filters.is_child !== undefined) {
          brands = brands.filter(brand => brand.is_child === filters.is_child);
        }
        if (filters.parent_id !== undefined) {
          brands = brands.filter(brand => brand.parent === filters.parent_id);
        }
        if (filters.limit) {
          brands = brands.slice(0, filters.limit);
        }
      }
      
      return brands;
    } catch (error) {
      console.error('Error fetching brands:', error);
      return [];
    }
  }

  /**
   * Get brand by ID
   */
  static async getById(id: string | number): Promise<Brand | null> {
    try {
      const response = await api.brands.getById(id);
      return response;
    } catch (error) {
      console.error(`Error fetching brand ${id}:`, error);
      return null;
    }
  }

  /**
   * Get brand by slug
   */
  static async getBySlug(slug: string): Promise<Brand | null> {
    try {
      const response = await api.brands.getBySlug(slug);
      return response;
    } catch (error) {
      console.error(`Error fetching brand by slug ${slug}:`, error);
      return null;
    }
  }

  /**
   * Get parent brands only
   */
  static async getParentBrands(): Promise<Brand[]> {
    return this.getAll({ is_parent: true });
  }

  /**
   * Get child brands only
   */
  static async getChildBrands(): Promise<Brand[]> {
    return this.getAll({ is_child: true });
  }

  /**
   * Get featured brands (limit to specific number)
   */
  static async getFeaturedBrands(limit: number = 10): Promise<Brand[]> {
    return this.getAll({ limit });
  }

  /**
   * Get brands with logos
   */
  static async getBrandsWithLogos(): Promise<Brand[]> {
    try {
      const brands = await this.getAll();
      return brands.filter(brand => brand.logo && brand.logo !== null);
    } catch (error) {
      console.error('Error fetching brands with logos:', error);
      return [];
    }
  }
}
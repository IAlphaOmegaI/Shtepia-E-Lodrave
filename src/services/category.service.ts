import { api } from './api';
import type { Category, CategoryListResponse } from '@/types';

export class CategoryService {
  /**
   * Get all categories
   */
  static async getAll(): Promise<Category[]> {
    try {
      const response = await api.categories.getAll();
      return response.data || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  /**
   * Get category by ID
   */
  static async getById(id: string | number) {
    try {
      const response = await api.categories.getAll();
      const categories = response.data || [];
      return categories.find((cat: Category) => cat.id === Number(id)) || null;
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      return null;
    }
  }

  /**
   * Get category by slug
   */
  static async getBySlug(slug: string) {
    try {
      const response = await api.categories.getAll();
      const categories = response.data || [];
      return categories.find((cat: Category) => cat.slug === slug) || null;
    } catch (error) {
      console.error(`Error fetching category ${slug}:`, error);
      return null;
    }
  }

  /**
   * Get parent categories (top-level categories)
   */
  static async getParentCategories() {
    try {
      const response = await api.categories.getAll({ is_main: true });
      const categories = response.data || response || [];
      // Filter for parent categories (those with no parent field or parent is null)
      return categories.filter((cat: any) => !cat.parent || cat.parent === null);
    } catch (error) {
      console.error('Error fetching parent categories:', error);
      return [];
    }
  }

  /**
   * Get subcategories of a parent category
   */
  static async getSubcategories(parentId: number) {
    try {
      const response = await api.categories.getAll();
      const categories = response.data || response || [];
      return categories.filter((cat: any) => cat.parent === parentId);
    } catch (error) {
      console.error(`Error fetching subcategories for parent ${parentId}:`, error);
      return [];
    }
  }

  /**
   * Get featured categories
   */
  static async getFeatured(limit?: number) {
    try {
      const response = await api.categories.getAll();
      const categories = response.data || [];
      // Assuming featured categories have a featured flag
      const featured = categories.filter((cat: any) => cat.featured);
      return limit ? featured.slice(0, limit) : featured;
    } catch (error) {
      console.error('Error fetching featured categories:', error);
      return [];
    }
  }

  /**
   * Get featured categories from the API directly
   */
  static async getFeaturedCategories(): Promise<Category[]> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/?is_featured=true`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch featured categories');
      }
      
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Error fetching featured categories:', error);
      return [];
    }
  }
}
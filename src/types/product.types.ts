import { Category } from './category.types';
import { Brand } from './brand.types';

export interface ProductShop {
  id: number;
  name: string;
  average_shop_rating: number;
}

export interface ProductDiscount {
  id: number;
  type: 'percentage' | 'fixed';
  value: string;
}

export interface ProductGalleryImage {
  id: number;
  original: string;
  thumbnail: string;
}

export interface Product {
  id: number;
  name: string;
  code: string;
  slug: string;
  description: string;
  price: string;
  sale_price?: string | null;
  min_price: string;
  max_price: string;
  discount?: ProductDiscount | null;
  image: string;
  gallery: ProductGalleryImage[];
  shop: ProductShop;
  categories: Category[];
  brand: Brand;
  tags: any[]; // TODO: Define tag type when needed
  age_range: number;
  gender: 'male' | 'female' | 'unisex';
  size?: string | null;
  loyalty_points: number;
  quantity: number;
  availability: 'available' | 'out_of_stock' | 'limited';
  stickers: any[]; // TODO: Define sticker type when needed
  language: string;
  translated_languages: string[];
  product_type: 'simple' | 'variable';
  unit?: string | null;
  sku: string;
  sold_quantity: number;
  in_flash_sale: boolean;
  visibility: 'visibility_public' | 'visibility_private' | 'visibility_hidden';
  status: 'publish' | 'draft' | 'pending';
  in_stock: boolean;
  height?: number | null;
  width?: number | null;
  length?: number | null;
  variations: any[]; // TODO: Define variation type when needed
  variation_options: any[];
  related_products: any[]; // Can be Product[] when needed
  created_at: string;
  updated_at: string;
  average_rating: number;
  total_reviews: number;
  ratings: any[]; // TODO: Define rating type when needed
  average_product_rating: number;
}

// Response types
export interface ProductListResponse {
  data: Product[];
  paginatorInfo?: {
    total: number;
    current_page: number;
    last_page: number;
    count: number;
    per_page: number;
  };
}

// Filter types for API requests
export interface ProductFilters {
  category_id?: number;
  brand_id?: number;
  brand?: number;
  min_price?: number;
  max_price?: number;
  search?: string;
  limit?: number;
  page?: number;
  order_by?: string;
  featured?: boolean;
  in_flash_sale?: boolean;
  gender?: 'male' | 'female' | 'unisex';
  age_range?: number;
}

// Simplified product type for popular products
export interface PopularProduct {
  id: number;
  name: string;
  code: string;
  slug: string;
  description: string;
  shop: ProductShop;
  brand: Brand;
  price: string;
  sale_price?: string | null;
  quantity: number;
  availability: 'available' | 'out_of_stock' | 'limited';
  status: 'publish' | 'draft' | 'pending';
  in_stock: boolean;
  image?: any;
  created_at: string;
}

// Popular products response type
export interface PopularProductCategory {
  category: Category;
  products: PopularProduct[];
}

export interface PopularProductsResponse {
  popular_products: PopularProductCategory[];
}
import apiClient from '@/lib/api-client';
import type { 
  Product, 
  ProductListResponse,
  PopularProductsResponse, 
  Category, 
  CategoryListResponse,
  Brand,
  BrandListResponse,
  Blog,
  BlogListResponse,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  CreateOrderData,
  Order,
  OrderListResponse
} from '@/types';

// API service functions
export const api = {
  // Products
  products: {
    getAll: async (params?: any) => {
      const { data } = await apiClient.get('/products/', { params });
      return data;
    },
    getById: async (id: string | number) => {
      const { data } = await apiClient.get(`/products/${id}/`);
      return data;
    },
    getByCategory: async (categoryId: number, limit?: number) => {
      const { data } = await apiClient.get("/products/", {
        params: {
          categories: categoryId,
          limit: limit || 20,
        },
      });
      return data;
    },
    getByCategorySlug: async (slug: string, params?: any): Promise<ProductListResponse> => {
      const { data } = await apiClient.get('/products/', {
        params: {
          categories__slug: slug,
          ...params,
        },
      });
      return data;
    },
    getPopular: async (): Promise<PopularProductsResponse> => {
      const { data } = await apiClient.get('/popular-products/');
      return data;
    },
    search: async (query: string, params?: any) => {
      const { data } = await apiClient.get('/products/', {
        params: {
          search: query,
          ...params,
        },
      });
      return data;
    },
  },

  // Categories
  categories: {
    getAll: async () => {
      const { data } = await apiClient.get('/categories/');
      return data;
    },
  },

  // Brands
  brands: {
    getAll: async (): Promise<Brand[]> => {
      const { data } = await apiClient.get('/brands/');
      return data;
    },
    getById: async (id: string | number): Promise<Brand | null> => {
      const { data } = await apiClient.get(`/brands/${id}/`);
      return data;
    },
  },

  // Auth
  auth: {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
      const { data } = await apiClient.post('/login/', credentials);
      return data;
    },
    register: async (userData: RegisterData): Promise<AuthResponse> => {
      const { data } = await apiClient.post('/register/', userData);
      return data;
    },
    me: async () => {
      const { data } = await apiClient.get('/me/');
      return data;
    },

    updateProfile: async (userData: any) => {
      const { data } = await apiClient.patch('/me/', userData);
      return data;
    },

    changePassword: async (passwordData: { current_password: string; new_password: string }) => {
      const { data } = await apiClient.post('/change-password/', passwordData);
      return data;
    },

  },
  

  // Orders
  orders: {
    list: async () => {
      const { data } = await apiClient.get('/orders/');
      return data;
    },
    getAll: async (): Promise<OrderListResponse> => {
      const { data } = await apiClient.get('/orders/');
      return data;
    },
    create: async (orderData: CreateOrderData): Promise<Order> => {
      const { data } = await apiClient.post('/orders/create/', orderData);
      return data;
    },
    calculateOrder: async (orderData: any) => {
      const { data } = await apiClient.post('/calculate-order/', orderData);
      return data;
    },
  },

  // Blogs
  blogs: {
    getAll: async (params?: any): Promise<Blog[]> => {
      const { data } = await apiClient.get('/blogs/', { params });
      return data;
    },
    getBySlug: async (slug: string): Promise<Blog> => {
      const { data } = await apiClient.get(`/blogs/${slug}/`);
      return data;
    },
  },

  // Filters
  filters: {
    getByCategory: async (categorySlug: string) => {
      const { data } = await apiClient.get(`/all_filters/${categorySlug}/`);
      return data;
    },
    getOffers: async () => {
      const { data } = await apiClient.get(`/all_filters/oferta/`);
      return data;
    },
    getAll: async () => {
      const { data } = await apiClient.get(`/all_filters/all/`);
      return data;
    },
  },
};
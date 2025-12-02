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
    // Admin products management with full query params support
    getForAdmin: async (params?: {
      search?: string;
      ordering?: string;
      page?: number;
      limit?: number;
      categories?: string | number;
      min_price?: number;
      max_price?: number;
      in_stock?: boolean;
      is_featured?: boolean;
    }) => {
      const { data } = await apiClient.get('/dashboard/products/', { params });
      return data;
    },
    create: async (productData: any) => {
      const { data } = await apiClient.post('/dashboard/products/', productData);
      return data;
    },
    update: async (id: string | number, productData: any) => {
      const { data } = await apiClient.patch(`/dashboard/products/${id}/`, productData);
      return data;
    },
    delete: async (id: string | number) => {
      const { data } = await apiClient.delete(`/dashboard/products/${id}/`);
      return data;
    },
    updateStock: async (id: string | number, quantity: number) => {
      const { data } = await apiClient.patch(`/dashboard/products/${id}/`, { quantity });
      return data;
    },
    // Dashboard specific product methods
    getByIdForAdmin: async (id: string | number) => {
      const { data } = await apiClient.get(`/dashboard/products/${id}/`);
      return data;
    },
    uploadImage: async (id: string | number, formData: FormData) => {
      const { data } = await apiClient.patch(`/dashboard/products/${id}/image/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    },
    removeImages: async (id: string | number, imageIds: number[]) => {
      const { data } = await apiClient.delete(`/dashboard/products/${id}/remove-images/`, {
        data: { image_ids: imageIds },
      });
      return data;
    },
  },

  // Categories
  categories: {
    getAll: async (params?: any) => {
      const { data } = await apiClient.get('/categories/', { params });
      return data;
    },
    // Admin categories management with full query params support
    getForAdmin: async (params?: {
      search?: string;
      ordering?: string;
      page?: number;
      page_size?: number;
    }) => {
      const { data } = await apiClient.get('/dashboard/all-categories/', { params });
      return data;
    },
    create: async (categoryData: any) => {
      const { data } = await apiClient.post('/dashboard/all-categories/', categoryData);
      return data;
    },
    update: async (id: number | string, categoryData: any) => {
      const { data } = await apiClient.patch(`/dashboard/all-categories/${id}/`, categoryData);
      return data;
    },
    delete: async (id: number | string) => {
      const { data } = await apiClient.delete(`/dashboard/all-categories/${id}/`);
      return data;
    },
    getById: async (id: number | string) => {
      const { data } = await apiClient.get(`/categories/${id}/`);
      return data;
    },
    // Dashboard specific category methods
    getByIdForAdmin: async (id: number | string) => {
      const { data } = await apiClient.get(`/dashboard/all-categories/${id}/`);
      return data;
    },
    uploadImage: async (id: number | string, formData: FormData) => {
      const { data } = await apiClient.patch(`/dashboard/all-categories/${id}/image/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    },
  },

  // Brands
  brands: {
    getAll: async (): Promise<Brand[]> => {
      const { data } = await apiClient.get('/brands/');
      console.log('Fetched brands:', data.find(brand=>brand.slug==="akedo"));
      return data;
    },
    getById: async (id: string | number): Promise<Brand | null> => {
      const { data } = await apiClient.get(`/brands/${id}/`);
      return data;
    },
    getBySlug: async (slug: string): Promise<Brand | null> => {
      const { data } = await apiClient.get(`/brands/${slug}/`);
      return data;
    },
    // Admin brands management
    getForAdmin: async (params?: {
      search?: string;
      ordering?: string;
      page?: number;
      limit?: number;
    }) => {
      const { data } = await apiClient.get('/dashboard/brands/', { params });
      return data;
    },
    getByIdForAdmin: async (id: string | number) => {
      const { data } = await apiClient.get(`/dashboard/brands/${id}/`);
      return data;
    },
    create: async (brandData: any) => {
      const { data } = await apiClient.post('/dashboard/brands/', brandData);
      return data;
    },
    update: async (id: string | number, brandData: any) => {
      const { data } = await apiClient.put(`/dashboard/brands/${id}/`, brandData);
      return data;
    },
    partialUpdate: async (id: string | number, brandData: any) => {
      const { data } = await apiClient.patch(`/dashboard/brands/${id}/`, brandData);
      return data;
    },
    delete: async (id: string | number) => {
      const { data } = await apiClient.delete(`/dashboard/brands/${id}/`);
      return data;
    },
    uploadLogo: async (id: string | number, formData: FormData) => {
      const { data } = await apiClient.patch(`/dashboard/brands/${id}/logo/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
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

    changePassword: async (passwordData: { old_password: string; new_password: string }) => {
      const { data } = await apiClient.post('/password/change/', passwordData);
      return data;
    },

  },
  

  // Orders
  orders: {
    list: async (params?: { page?: number; limit?: number; status?: string; payment_status?: string }) => {
      const { data } = await apiClient.get('/orders/', { params });
      return data;
    },
    getAll: async (): Promise<OrderListResponse> => {
      const { data } = await apiClient.get('/orders/');
      return data;
    },
    getById: async (id: string | number) => {
      const { data } = await apiClient.get(`/orders/${id}/`);
      return data;
    },
    update: async (id: string | number, orderData: any) => {
      const { data } = await apiClient.patch(`/orders/${id}/update/`, orderData);
      return data;
    },
    trackByCode: async (trackingCode: string) => {
      const { data } = await apiClient.get(`/orders/track/${trackingCode}/`);
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

  // Customers
  customers: {
    getAll: async (params?: {
      page?: number;
      limit?: number;
      search?: string;
      ordering?: string;
    }) => {
      const { data } = await apiClient.get('/dashboard/customers/', { params });
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

  // Analytics
  analytics: {
    getDashboard: async () => {
      const { data } = await apiClient.get('/analytics/');
      return data;
    },
  },
};
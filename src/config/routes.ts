import { NEW_COLLECTIONS_CATEGORY_ID } from '@/lib/constants';

/**
 * Helper function to build query strings from an object of parameters
 * Filters out undefined values and properly encodes the values
 * @example buildQueryString({ category_id: 16, page: 2 }) => "?category_id=16&page=2"
 */
const buildQueryString = (params: Record<string, string | number | boolean | undefined>) => {
  const filteredParams = Object.entries(params)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`);
  
  return filteredParams.length > 0 ? `?${filteredParams.join('&')}` : '';
};

export const Routes = {
  home: '/',
  search: '/search',
  products: '/products',
  product: (id: string | number) => `/products/${id}`,
  productsWithFilters: (filters?: { 
    categories?: number; 
    brand_id?: number; 
    min_price?: number; 
    max_price?: number;
    search?: string;
    page?: number;
  }) => `/products${buildQueryString(filters || {})}`,
  categories: '/categories',
  category: (slug: string) => `/category/${slug}`,
  shops: '/shops',
  shop: (slug: string) => `/shops/${slug}`,
  cart: '/cart',
  checkout: '/checkout',
  orders: '/orders',
  order: (tracking_number: string) => `/orders/${tracking_number}`,
  orderThankYou: (tracking_number: string) => `/orders/${tracking_number}/thank-you`,
  orderReceived: '/order-received',
  profile: '/profile',
  changePassword: '/change-password',
  forgotPassword: '/forgot-password',
  login: '/login',
  logout: '/logout',
  register: '/register',
  terms: '/terms',
  privacy: '/privacy',
  contactUs: '/contact-us',
  help: '/help',
  faq: '/faq',
  aboutUs: '/about-us',
  authors: '/authors',
  author: (slug: string) => `/authors/${slug}`,
  manufacturers: '/manufacturers',
  manufacturer: (slug: string) => `/manufacturers/${slug}`,
  coupons: '/coupons',
  offers: '/offers',
  questions: '/questions',
  refunds: '/refunds',
  reports: '/reports',
  downloads: '/downloads',
  conversation: '/conversation',
  message: '/message',
  wish: '/wish',
  wishlists: '/wishlists',
  notifications: '/notifications',
  favorites: '/favorites',
  becomeSeller: '/shops/create',
  createShop: '/shops/create',
  flashSales: '/flash-sales',
  flashSale: (slug: string) => `/flash-sales/${slug}`,
  blogs: '/blogs',
  blog: (slug: string) => `/blogs/${slug}`,
  checkoutDigital: '/checkout/digital',
};

/**
 * Common filtered routes for convenience
 * These helpers generate product routes with specific query parameters
 * 
 * @example
 * FilteredRoutes.newCollections() => "/products?categories=16"
 * FilteredRoutes.productsByCategory(5) => "/products?categories=5"
 * FilteredRoutes.productsByBrand(3) => "/products?brand_id=3"
 * FilteredRoutes.searchProducts("toys") => "/products?search=toys"
 */
export const FilteredRoutes = {
  newCollections: () => Routes.productsWithFilters({ categories: NEW_COLLECTIONS_CATEGORY_ID }),
  productsByCategory: (categoryId: number) => Routes.productsWithFilters({ categories: categoryId }),
  productsByBrand: (brandId: number) => Routes.productsWithFilters({ brand_id: brandId }),
  productsByPriceRange: (minPrice: number, maxPrice: number) => 
    Routes.productsWithFilters({ min_price: minPrice, max_price: maxPrice }),
  searchProducts: (query: string) => Routes.productsWithFilters({ search: query }),
};
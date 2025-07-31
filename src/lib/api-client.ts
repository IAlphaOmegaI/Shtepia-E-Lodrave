import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://63.178.242.103/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent multiple refresh requests
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request interceptor for auth token
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      if (typeof window !== 'undefined') {
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (refreshToken) {
          try {
            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL || 'http://63.178.242.103/api'}/token/refresh/`,
              { refresh: refreshToken }
            );

            const { access, refresh } = response.data;
            
            // Update tokens in localStorage
            localStorage.setItem('token', access);
            if (refresh) {
              localStorage.setItem('refresh_token', refresh);
            }
            
            // Update default header
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${access}`;
            originalRequest.headers.Authorization = `Bearer ${access}`;
            
            processQueue(null, access);
            
            return apiClient(originalRequest);
          } catch (refreshError) {
            processQueue(refreshError, null);
            
            // Clear all auth data on refresh failure
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            localStorage.removeItem('isAuthorized');
            
            // Redirect to login page if not already there
            const currentPath = window.location.pathname;
            if (!currentPath.includes('/login')) {
              window.location.href = '/login';
            }
            
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        } else {
          // No refresh token available
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('isAuthorized');
          
          // Redirect to login page if not already there
          const currentPath = window.location.pathname;
          if (!currentPath.includes('/login')) {
            window.location.href = '/login';
          }
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
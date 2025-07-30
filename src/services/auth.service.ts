import { api } from './api';
import type { 
  User, 
  LoginCredentials, 
  RegisterData, 
  AuthResponse,
  RefreshTokenRequest,
  RefreshTokenResponse 
} from '@/types';

export class AuthService {
  private static TOKEN_KEY = 'token';
  private static REFRESH_TOKEN_KEY = 'refresh_token';
  private static USER_KEY = 'user';

  /**
   * Login user
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.auth.login(credentials);
      
      // Store tokens and user data
      if (response.access_token || response.access || response.token) {
        this.setToken(response.access_token || response.access || response.token);
      }
      if (response.refresh_token || response.refresh) {
        this.setRefreshToken(response.refresh_token || response.refresh);
      }
      if (response.user) {
        this.setUser(response.user);
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Register new user
   */
  static async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.auth.register(userData);
      
      // Auto-login after registration if tokens are returned
      if (response.access_token || response.access || response.token) {
        this.setToken(response.access_token || response.access || response.token);
      }
      if (response.refresh_token || response.refresh) {
        this.setRefreshToken(response.refresh_token || response.refresh);
      }
      if (response.user) {
        this.setUser(response.user);
      }
      
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  static logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
  }

  /**
   * Get current auth token
   */
  static getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  /**
   * Set auth token
   */
  static setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  /**
   * Get refresh token
   */
  static getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }
    return null;
  }

  /**
   * Set refresh token
   */
  static setRefreshToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
    }
  }

  /**
   * Get current user
   */
  static getUser(): User | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem(this.USER_KEY);
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    }
    return null;
  }

  /**
   * Set current user
   */
  static setUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Check if user has specific role
   */
  static hasRole(role: string): boolean {
    const user = this.getUser();
    return user?.role === role;
  }

  /**
   * Refresh authentication token
   */
  static async refreshToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return null;
    }

    try {
      // Implement when refresh endpoint is available
      // const response = await api.auth.refresh({ refresh: refreshToken });
      // this.setToken(response.access);
      // return response.access;
      return null;
    } catch (error) {
      console.error('Token refresh error:', error);
      this.logout();
      return null;
    }
  }
}
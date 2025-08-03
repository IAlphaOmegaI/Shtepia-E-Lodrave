export interface User {
  id: number;
  email: string;
  name?: string;
  phone?: string;
  role?: 'admin' | 'user' | 'vendor';
  created_at?: string;
  updated_at?: string;
  email_verified_at?: string | null;
  avatar?: string | null;
  status?: 'active' | 'inactive' | 'banned';
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  password_confirm?: string;
  name?: string;
  phone?: string;
  accept_terms?: boolean;
}

export interface AuthResponse {
  access?: string;
  refresh?: string;
  token?: string;
  access_token?: string;
  refresh_token?: string;
  user?: User;
  expires_in?: number;
  token_type?: string;
}

export interface RefreshTokenRequest {
  refresh: string;
}

export interface RefreshTokenResponse {
  access: string;
  refresh?: string;
  expires_in?: number;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  email: string;
  password: string;
  password_confirm: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  new_password_confirm: string;
}
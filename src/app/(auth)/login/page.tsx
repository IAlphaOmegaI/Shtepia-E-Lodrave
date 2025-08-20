'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthService } from '@/services';
import { Routes } from '@/config/routes';
import { useAuthStore } from '@/store/use-auth';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { authorize } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await AuthService.login(formData);
      
      if (response.user) {
        authorize();
        // Redirect based on user role
        if (response.user.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push(Routes.home);
        }
      }
    } catch (err: any) {
      // Check for specific error messages from the API
      let errorMessage = 'Email-i ose fjalëkalimi është i gabuar';
      
      if (err.response?.data?.error) {
        const apiError = err.response.data.error.toLowerCase();
        if (apiError.includes('invalid credentials') || apiError.includes('invalid')) {
          errorMessage = 'Email-i ose fjalëkalimi është i gabuar. Ju lutemi kontrolloni të dhënat tuaja.';
        } else if (apiError.includes('not found')) {
          errorMessage = 'Ky përdorues nuk ekziston.';
        } else if (apiError.includes('blocked') || apiError.includes('disabled')) {
          errorMessage = 'Llogaria juaj është bllokuar. Ju lutemi kontaktoni mbështetjen.';
        }
      } else if (err.response?.status === 401) {
        errorMessage = 'Email-i ose fjalëkalimi është i gabuar. Ju lutemi provoni përsëri.';
      } else if (err.response?.status === 400) {
        errorMessage = 'Të dhënat e dërguara nuk janë të sakta. Ju lutemi kontrolloni fushat.';
      } else if (err.response?.status >= 500) {
        errorMessage = 'Ndodhi një gabim në server. Ju lutemi provoni më vonë.';
      } else if (err.message && !err.message.includes('status code')) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm max-w-md w-full">
      {/* Title */}
      <h1 className="text-3xl font-bold text-red-600 text-center mb-2">
        Ju lutem kyquni
      </h1>
      
     

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm font-albertsans">
          {error}
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Emaili
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Emaili"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Fjalëkalimi
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Fjalëkalimi juaj"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
         
          <Link
            href={Routes.forgotPassword}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Keni harruar fjalëkalimin?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Kyqu...' : 'Kyqu'}
        </button>
      </form>

      {/* Sign up link */}
      <p className="text-center text-sm text-gray-600 mt-6">
        Nuk keni një llogari?{' '}
        <Link href={Routes.register} className="text-orange-500 hover:text-orange-600 font-medium">
          Antarsohuni
        </Link>
      </p>
    </div>
  );
}
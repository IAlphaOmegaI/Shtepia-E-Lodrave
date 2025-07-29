'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { AuthService } from '@/services';
import { Routes } from '@/config/routes';
import { useAuthStore } from '@/store/use-auth';

export default function LoginPage() {
  const router = useRouter();
  const { authorize } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await AuthService.login(formData);
      
      if (response.user) {
        authorize();
        router.push(Routes.home);
      }
    } catch (err: any) {
      setError(err.message || 'Email ose fjalëkalimi është gabim');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg">
      {/* Logo */}
      <div className="text-center mb-8">
        <Link href={Routes.home}>
          <Image
            src="/assets/logo.png"
            alt="Shtëpia e Lodrave"
            width={120}
            height={60}
            className="mx-auto"
          />
        </Link>
        <h1 className="text-2xl font-bold mt-4 font-grandstander text-gray-900">
          Mirë se vini përsëri!
        </h1>
        <p className="text-gray-600 mt-2 font-albertsans">
          Hyni në llogarinë tuaj për të vazhduar
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm font-albertsans">
          {error}
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 font-albertsans">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-albertsans"
            placeholder="email@example.com"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 font-albertsans">
            Fjalëkalimi
          </label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-albertsans"
            placeholder="••••••••"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 font-albertsans">
              Më mbaj mend
            </label>
          </div>

          <Link
            href={Routes.forgotPassword}
            className="text-sm text-blue-600 hover:text-blue-500 font-albertsans"
          >
            Keni harruar fjalëkalimin?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1A66EA] text-white py-3 px-4 rounded-lg hover:bg-[#1557C7] transition-colors font-semibold font-albertsans disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Duke hyrë...' : 'Hyr'}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500 font-albertsans">Ose</span>
        </div>
      </div>

      {/* Sign up link */}
      <p className="text-center text-gray-600 font-albertsans">
        Nuk keni llogari?{' '}
        <Link
          href={Routes.register}
          className="text-blue-600 hover:text-blue-500 font-semibold"
        >
          Regjistrohuni tani
        </Link>
      </p>
    </div>
  );
}
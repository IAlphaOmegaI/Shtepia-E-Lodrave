'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Routes } from '@/config/routes';
import { ArrowPrev } from '@/components/icons';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // In a real app, this would call an API endpoint
      // For now, we'll simulate a successful request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Diçka shkoi keq. Ju lutemi provoni përsëri');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
        <div className="mb-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 font-grandstander mb-4">
          Email u dërgua!
        </h2>
        
        <p className="text-gray-600 font-albertsans mb-8">
          Kontrolloni emailin tuaj për instruksionet e rivendosjes së fjalëkalimit.
          Nëse nuk e shihni emailin, kontrolloni dosjen spam.
        </p>
        
        <Link
          href={Routes.login}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-500 font-semibold font-albertsans"
        >
          <ArrowPrev className="w-4 h-4" />
          Kthehu te hyrja
        </Link>
      </div>
    );
  }

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
          Rivendosni fjalëkalimin
        </h1>
        <p className="text-gray-600 mt-2 font-albertsans">
          Vendosni emailin tuaj dhe do t&apos;ju dërgojmë një link për rivendosje
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm font-albertsans">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 font-albertsans">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-albertsans"
            placeholder="email@example.com"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1A66EA] text-white py-3 px-4 rounded-lg hover:bg-[#1557C7] transition-colors font-semibold font-albertsans disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Duke dërguar...' : 'Dërgo linkun e rivendosjes'}
        </button>
      </form>

      {/* Back to login */}
      <div className="mt-8 text-center">
        <Link
          href={Routes.login}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-albertsans"
        >
          <ArrowPrev className="w-4 h-4" />
          Kthehu te hyrja
        </Link>
      </div>
    </div>
  );
}
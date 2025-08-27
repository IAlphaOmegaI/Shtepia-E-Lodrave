'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthService } from '@/services';
import { Routes } from '@/config/routes';
import { useAuthStore } from '@/store/use-auth';
import dynamic from 'next/dynamic';

// Dynamically import PasswordStrengthBar to avoid SSR issues
const PasswordStrengthBar = dynamic(
  () => import('react-password-strength-bar'),
  { ssr: false }
);

export default function RegisterPage() {
  const router = useRouter();
  const { authorize } = useAuthStore();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const [touched, setTouched] = useState({
    first_name: false,
    last_name: false,
    email: false,
    password: false,
    confirmPassword: false,
    terms: false,
  });

  // Validation helper functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateName = (name: string) => {
    return name.trim().length >= 2;
  };

  const getFieldError = (fieldName: string) => {
    if (!touched[fieldName as keyof typeof touched]) return '';
    
    switch (fieldName) {
      case 'first_name':
        return !formData.first_name.trim() ? 'Emri është i detyrueshëm' : 
               !validateName(formData.first_name) ? 'Emri duhet të ketë të paktën 2 karaktere' : '';
      case 'last_name':
        return !formData.last_name.trim() ? 'Mbiemri është i detyrueshëm' : 
               !validateName(formData.last_name) ? 'Mbiemri duhet të ketë të paktën 2 karaktere' : '';
      case 'email':
        return !formData.email.trim() ? 'Email është i detyrueshëm' : 
               !validateEmail(formData.email) ? 'Email nuk është i vlefshëm' : '';
      case 'password':
        return !formData.password ? 'Fjalëkalimi është i detyrueshëm' : 
               formData.password.length < 8 ? 'Fjalëkalimi duhet të ketë të paktën 8 karaktere' :
               passwordStrength < 2 && formData.password ? 'Fjalëkalimi është shumë i dobët' : '';
      case 'confirmPassword':
        return !formData.confirmPassword ? 'Konfirmimi i fjalëkalimit është i detyrueshëm' : 
               formData.password !== formData.confirmPassword ? 'Fjalëkalimet nuk përputhen' : '';
      case 'terms':
        return !termsAccepted ? 'Duhet të pranoni kushtet e përdorimit' : '';
      default:
        return '';
    }
  };

  const isFormValid = () => {
    return (
      validateName(formData.first_name) &&
      validateName(formData.last_name) &&
      validateEmail(formData.email) &&
      formData.password.length >= 8 &&
      passwordStrength >= 2 &&
      formData.password === formData.confirmPassword &&
      termsAccepted
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Mark all fields as touched
    setTouched({
      first_name: true,
      last_name: true,
      email: true,
      password: true,
      confirmPassword: true,
      terms: true,
    });

    // Validate all fields
    if (!formData.first_name.trim()) {
      setError('Emri është i detyrueshëm');
      return;
    }

    if (!validateName(formData.first_name)) {
      setError('Emri duhet të ketë të paktën 2 karaktere');
      return;
    }

    if (!formData.last_name.trim()) {
      setError('Mbiemri është i detyrueshëm');
      return;
    }

    if (!validateName(formData.last_name)) {
      setError('Mbiemri duhet të ketë të paktën 2 karaktere');
      return;
    }

    if (!formData.email.trim()) {
      setError('Email është i detyrueshëm');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Email nuk është i vlefshëm');
      return;
    }

    if (!formData.password) {
      setError('Fjalëkalimi është i detyrueshëm');
      return;
    }

    // Validate password length
    if (formData.password.length < 8) {
      setError('Fjalëkalimi duhet të jetë të paktën 8 karaktere');
      return;
    }

    // Validate password strength
    if (passwordStrength < 2) {
      setError('Fjalëkalimi është shumë i dobët. Ju lutemi zgjidhni një fjalëkalim më të fortë');
      return;
    }

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Fjalëkalimet nuk përputhen');
      return;
    }

    // Validate terms acceptance
    if (!termsAccepted) {
      setError('Duhet të pranoni kushtet e përdorimit dhe politikën e privatësisë');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      const response = await AuthService.register(registerData);
      
      // If registration successful (we get user data back), redirect to login
      if (response?.id || response?.email) {
        // Show success message (you could use a toast here)
        router.push(`${Routes.login}?registered=true&email=${encodeURIComponent(formData.email)}`);
      }
    } catch (err: any) {
      // Handle API error response
      if (err.response?.data) {
        let errorMessage = '';
        
        // Check if the error is an array (Django REST framework format)
        if (Array.isArray(err.response.data)) {
          errorMessage = err.response.data[0];
        } 
        // Check if the error has a detail field
        else if (err.response.data.detail) {
          errorMessage = err.response.data.detail;
        }
        // Check if the error has a message field
        else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        }
        // Check if the error has field-specific errors
        else if (err.response.data.email) {
          errorMessage = err.response.data.email[0] || err.response.data.email;
        }
        // Fallback to stringifying the error if it's an object
        else if (typeof err.response.data === 'object') {
          const firstError = Object.values(err.response.data)[0];
          if (Array.isArray(firstError)) {
            errorMessage = firstError[0];
          } else {
            errorMessage = String(firstError);
          }
        }
        // Use the data directly if it's a string
        else {
          errorMessage = String(err.response.data);
        }
        
        // Translate common error messages to Albanian
        if (errorMessage === 'A user with this email already exists.') {
          errorMessage = 'Një përdorues me këtë email ekziston tashmë.';
        }
        
        setError(errorMessage);
      } else {
        setError(err.message || 'Diçka shkoi keq. Ju lutemi provoni përsëri');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg">
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold font-grandstander text-[#D32F2F] mb-2">
          Bëhu pjesë e kësaj familjeje
        </h1>
        <p className="text-gray-600 font-albertsans">
          Bëhuni pjesë e kësaj familjeje dhe shijoni shportën personalizuar dhe ofertat ekskluzive.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm font-albertsans">
          {error}
        </div>
      )}

      {/* Register Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1 font-albertsans">
              <span className="text-red-500">* </span>
              Emri
            </label>
            <input
              type="text"
              id="first_name"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              onBlur={() => setTouched({ ...touched, first_name: true })}
              className={`w-full px-4 py-3 border ${
                getFieldError('first_name') ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-albertsans`}
              placeholder="Emri"
              required
            />
            {getFieldError('first_name') && (
              <p className="text-xs text-red-500 mt-1">{getFieldError('first_name')}</p>
            )}
          </div>

          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1 font-albertsans">
              <span className="text-red-500">* </span>
              Mbiemri
            </label>
            <input
              type="text"
              id="last_name"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              onBlur={() => setTouched({ ...touched, last_name: true })}
              className={`w-full px-4 py-3 border ${
                getFieldError('last_name') ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-albertsans`}
              placeholder="Mbiemri"
              required
            />
            {getFieldError('last_name') && (
              <p className="text-xs text-red-500 mt-1">{getFieldError('last_name')}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 font-albertsans">
            <span className="text-red-500">* </span>
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            onBlur={() => setTouched({ ...touched, email: true })}
            className={`w-full px-4 py-3 border ${
              getFieldError('email') ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-albertsans`}
            placeholder="email@example.com"
            required
          />
          {getFieldError('email') && (
            <p className="text-xs text-red-500 mt-1">{getFieldError('email')}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 font-albertsans">
            <span className="text-red-500">* </span>
            Fjalëkalimi
          </label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
              // Reset password strength when password is cleared
              if (e.target.value === '') {
                setPasswordStrength(0);
              }
            }}
            onBlur={() => setTouched({ ...touched, password: true })}
            className={`w-full px-4 py-3 border ${
              getFieldError('password') ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-albertsans`}
            placeholder="Të paktën 8 karaktere"
            required
          />
          {formData.password && (
            <>
              <PasswordStrengthBar 
                password={formData.password}
                minLength={8}
                scoreWords={['shumë i dobët', 'i dobët', 'i pranueshëm', 'i mirë', 'i fortë']}
                shortScoreWord="shumë i shkurtër"
                onChangeScore={(score: number) => setPasswordStrength(score)}
              />
              {passwordStrength < 2 && (
                <p className="text-xs text-amber-600 mt-1 font-albertsans">
                  Fjalëkalimi duhet të jetë të paktën "i pranueshëm" për të vazhduar
                </p>
              )}
            </>
          )}
          {getFieldError('password') && !formData.password && (
            <p className="text-xs text-red-500 mt-1">{getFieldError('password')}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1 font-albertsans">
            <span className="text-red-500">* </span>
            Konfirmo Fjalëkalimin
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            onBlur={() => setTouched({ ...touched, confirmPassword: true })}
            className={`w-full px-4 py-3 border ${
              getFieldError('confirmPassword') ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-albertsans`}
            placeholder="Shkruani përsëri fjalëkalimin"
            required
          />
          {getFieldError('confirmPassword') && (
            <p className="text-xs text-red-500 mt-1">{getFieldError('confirmPassword')}</p>
          )}
        </div>

        <div>
          <div className="flex items-start">
            <input
              id="agree-terms"
              name="agree-terms"
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              onBlur={() => setTouched({ ...touched, terms: true })}
              className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5 ${
                getFieldError('terms') ? 'border-red-500' : ''
              }`}
              required
            />
            <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-700 font-albertsans">
              <span className="text-red-500">* </span>
              Pranoj{' '}
              <Link href={Routes.terms} className="text-blue-600 hover:text-blue-500">
                Kushtet e Përdorimit
              </Link>{' '}
              dhe{' '}
              <Link href={Routes.privacy} className="text-blue-600 hover:text-blue-500">
                Politikën e Privatësisë
              </Link>
            </label>
          </div>
          {getFieldError('terms') && (
            <p className="text-xs text-red-500 mt-1 ml-6">{getFieldError('terms')}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !isFormValid()}
          className="w-full bg-[#1A66EA] text-white py-3 px-4 rounded-lg hover:bg-[#1557C7] transition-colors font-semibold font-albertsans disabled:opacity-50 disabled:cursor-not-allowed"
          title={
            !isFormValid() 
              ? 'Ju lutemi plotësoni të gjitha fushat e detyrueshme në mënyrë të saktë' 
              : ''
          }
        >
          {loading ? 'Duke u regjistruar...' : 'Antarsohuni'}
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

      {/* Sign in link */}
      <p className="text-center text-gray-600 font-albertsans">
        Keni një llogari?{' '}
        <Link
          href={Routes.login}
          className="text-blue-600 hover:text-blue-500 font-semibold"
        >
          Hyni tani
        </Link>
      </p>
    </div>
  );
}
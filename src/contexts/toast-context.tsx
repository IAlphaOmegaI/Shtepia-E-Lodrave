'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import Alert from '@/components/ui/alert';

interface Toast {
  id: string;
  message: string;
  variant: 'info' | 'warning' | 'error' | 'success';
}

interface ToastContextType {
  showToast: (message: string, variant?: 'info' | 'warning' | 'error' | 'success') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, variant: 'info' | 'warning' | 'error' | 'success' = 'success') => {
    const id = Date.now().toString();
    const newToast: Toast = { id, message, variant };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 space-y-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="animate-slide-in-bottom"
          >
            <div className={`
              min-w-[350px] max-w-[400px] p-4 rounded-lg shadow-xl
              backdrop-blur-sm border transition-all duration-300
              ${toast.variant === 'success' ? 'bg-green-50/95 border-green-200 text-green-800' : ''}
              ${toast.variant === 'error' ? 'bg-red-50/95 border-red-200 text-red-800' : ''}
              ${toast.variant === 'warning' ? 'bg-yellow-50/95 border-yellow-200 text-yellow-800' : ''}
              ${toast.variant === 'info' ? 'bg-blue-50/95 border-blue-200 text-blue-800' : ''}
            `}>
              <div className="flex items-center gap-3">
                {/* Icon based on variant */}
                <div className="flex-shrink-0">
                  {toast.variant === 'success' && (
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {toast.variant === 'error' && (
                    <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {toast.variant === 'warning' && (
                    <svg className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  )}
                  {toast.variant === 'info' && (
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                
                {/* Message */}
                <div className="flex-1">
                  <p className="font-medium font-albertsans text-[15px]">{toast.message}</p>
                </div>
                
                {/* Close button */}
                <button
                  onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                  className="flex-shrink-0 ml-2 hover:opacity-70 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
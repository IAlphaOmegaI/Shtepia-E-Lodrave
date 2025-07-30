import { useState } from 'react';
import { useAtom } from 'jotai';
import { couponAtom } from '@/store/checkout';

const Coupon = () => {
  const [code, setCode] = useState('');
  const [coupon, setCoupon] = useAtom(couponAtom);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleApplyCoupon = async () => {
    if (!code.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      // TODO: Implement coupon verification API call
      // For now, mock a coupon
      setCoupon({
        id: '1',
        code: code,
        amount: 10,
        type: 'fixed'
      });
    } catch (err) {
      setError('Invalid coupon code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5">
      <h3 className="text-sm font-semibold mb-2">Coupon Code</h3>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter coupon code"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={!!coupon}
        />
        <button
          onClick={handleApplyCoupon}
          disabled={loading || !code.trim() || !!coupon}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? 'Applying...' : 'Apply'}
        </button>
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      {coupon && (
        <p className="text-sm text-green-600 mt-1">
          Coupon applied successfully!
        </p>
      )}
    </div>
  );
};

export default Coupon;
import { useAtom } from 'jotai';
import { walletAtom, verifiedResponseAtom } from '@/store/checkout';

const Wallet = () => {
  const [use_wallet, toggleWallet] = useAtom(walletAtom);
  const [verifiedResponse] = useAtom(verifiedResponseAtom);
  
  const wallet_amount = verifiedResponse?.wallet_amount ?? 0;
  
  if (wallet_amount <= 0) return null;

  const formatPrice = (amount: number) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);

  return (
    <div className="mt-5 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Use Wallet</h3>
          <p className="text-xs text-gray-600 mt-1">
            Available balance: {formatPrice(wallet_amount)}
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={use_wallet}
            onChange={() => toggleWallet()}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
    </div>
  );
};

export default Wallet;
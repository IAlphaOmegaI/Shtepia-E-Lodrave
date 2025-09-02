'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import CartCheckBagIcon from '@/components/icons/cart-check-bag';
import EmptyCartIcon from '@/components/icons/empty-cart';
import { CloseIcon } from '@/components/icons/close-icon';
import CartItem from '@/components/cart/cart-item';
import { fadeInOut } from '@/lib/motion/fade-in-out';
import { Routes } from '@/config/routes';
import usePrice from '@/lib/use-price';
import { useCart } from '@/store/quick-cart/cart.context';
import { formatString } from '@/lib/format-string';
import { useAtom } from 'jotai';
import { drawerAtom } from '@/store/drawer-atom';

const CartSidebarView = () => {
  const { items, totalUniqueItems, total } = useCart();
  const [_, closeSidebar] = useAtom(drawerAtom);
  const router = useRouter();
  
  function handleCheckout() {
    router.push(Routes.checkout);
    closeSidebar({ display: false, view: '' });
  }

  const { price: totalPrice } = usePrice({
    amount: total,
  });
  
  return (
    <section className="relative flex h-full flex-col bg-white">
      <header className="flex w-full items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-baseline space-x-2">
          <h2 className="text-xl font-grandstander font-bold text-[#F11602]">
            Shporta
          </h2>
          <span className="text-sm text-gray-500 font-albertsans">
            ({totalUniqueItems} produkt)
          </span>
        </div>
        <button
          onClick={() => closeSidebar({ display: false, view: '' })}
          className="flex h-8 w-8 items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
        >
          <span className="sr-only">Close</span>
          <CloseIcon className="h-5 w-5" />
        </button>
      </header>
      {/* End of cart header */}

      <div className="flex-1 overflow-y-auto px-6 py-4">
        {items.length > 0 ? (
          <div className="space-y-4">
            {items?.map((item) => <CartItem item={item} key={item.id} />)}
          </div>
        ) : (
          <motion.div
            layout
            initial="from"
            animate="to"
            exit="from"
            variants={fadeInOut(0.25)}
            className="flex h-full flex-col items-center justify-center"
          >
            <EmptyCartIcon width={140} height={176} className="text-[#F44535]"/>
            <h4 className="mt-6 text-base font-semibold text-[#F44535]">
               Nuk keni produkt në shportë
            </h4>
          </motion.div>
        )}
      </div>
      {/* End of cart items */}

      <footer className="border-t border-gray-200 bg-gray-50 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-medium text-gray-900 font-albertsans">Totali i porosisë</span>
          <span className="text-lg font-bold text-blue-600 font-albertsans">{totalPrice}</span>
        </div>
        <button
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-colors font-albertsans"
          onClick={handleCheckout}
          disabled={items.length === 0}
        >
          Bëje Porosinë
        </button>
      </footer>
      {/* End of footer */}
    </section>
  );
};

export default CartSidebarView;
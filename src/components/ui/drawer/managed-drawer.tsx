'use client';

import { drawerAtom } from '@/store/drawer-atom';
import { useAtom } from 'jotai';
import dynamic from 'next/dynamic';
import Drawer from './drawer';

const CartSidebarView = dynamic(
  () => import('@/components/cart/cart-sidebar-view'),
);

// TODO: Add other drawer views as needed
// const MobileMainMenu = dynamic(
//   () => import('@/components/layouts/mobile-menu/mobile-main-menu'),
// );

export default function ManagedDrawer() {
  const [{ display, view, data }, setDrawerState] = useAtom(drawerAtom);
  
  return (
    <Drawer
      open={display}
      onClose={() => setDrawerState({ display: false, view: '' })}
      variant={
        [
          'FILTER_VIEW',
          'MAIN_MENU_VIEW',
          'FILTER_LAYOUT_TWO_VIEW',
          'SEARCH_FILTER',
        ].includes(view)
          ? 'left'
          : 'right'
      }
    >
      {view === 'cart' && <CartSidebarView />}
      {view === 'MAIN_MENU_VIEW' && (
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Mobile Menu</h2>
          <p>Mobile menu content coming soon...</p>
        </div>
      )}
    </Drawer>
  );
}
'use client';

import { drawerAtom } from '@/store/drawer-atom';
import { useAtom } from 'jotai';
import dynamic from 'next/dynamic';
import Drawer from './drawer';

const CartSidebarView = dynamic(
  () => import('@/components/cart/cart-sidebar-view'),
);

const MobileMainMenu = dynamic(
  () => import('@/components/layouts/mobile-menu/mobile-main-menu'),
);

export default function ManagedDrawer() {
  const [{ display, view, data }, setDrawerState] = useAtom(drawerAtom);
  
  return (
    <Drawer
      open={display}
      onClose={() => setDrawerState({ display: false, view: '' })}
      className="z-50 bg-white"
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
      {view === 'MAIN_MENU_VIEW' && <MobileMainMenu />}
    </Drawer>
  );
}
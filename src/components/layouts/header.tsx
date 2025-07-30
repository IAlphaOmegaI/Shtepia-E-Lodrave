'use client';

import LocationBasedShopForm from '@/components/form/location-based-shop-form';
import { CloseIcon } from '@/components/icons/close';
import { MapPin, MapPinNew } from '@/components/icons/map-pin';
import { SearchIcon } from '@/components/icons/search';
import DynamicMenu from '@/components/layouts/menu/dynamic-menu';
import Alert from '@/components/ui/alert';
import Button from '@/components/ui/button';
import CountdownTimer from '@/components/ui/countdown-timer';
import Logo from '@/components/ui/logo';
import { Routes } from '@/config/routes';
import { useSettings } from '@/framework/settings';
import { useHeaderSearch } from '@/layouts/headers/header-search-atom';
import {
  RESPONSIVE_WIDTH,
  checkIsMaintenanceModeComing,
  checkIsMaintenanceModeStart,
  checkIsScrollingStart,
  checkIsShopMaintenanceModeComing,
  checkIsShopMaintenanceModeStart,
  isMultiLangEnable,
} from '@/lib/constants';
import { useActiveScroll } from '@/lib/use-active-scroll';
import { useIsHomePage } from '@/lib/use-is-homepage';
import { authorizationAtom } from '@/store/authorization-atom';
import { displayMobileHeaderSearchAtom } from '@/store/display-mobile-header-search-atom';
import { drawerAtom } from '@/store/drawer-atom';
import cn from 'classnames';
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import React, { useCallback, useMemo, useState, useRef, useEffect } from 'react';
import { useWindowSize } from 'react-use';
import { useShop } from '@/framework/shop';
import { usePathname } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import { useShopMaintenanceEvent } from '@/framework/shop';
import { ShoppingCartIcon } from '../icons/shopping-cart';
import { FavoriteIcon } from '../icons/favorite';
import { LoginUserIcon } from '../icons/user-login';
import { TruckDeliveryIcon } from '../icons/truck-delivery';
import { useCart } from '@/store/quick-cart/cart.context';
import { useWishlist } from '../../framework/rest/wishlist';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services';
import Image from 'next/image';

const Search = dynamic(() => import('@/components/ui/search/search'));
const AuthorizedMenu = dynamic(() => import('./menu/authorized-menu'), {
  ssr: false,
});

const Header = ({ layout }: { layout?: string }) => {
  const { show, hideHeaderSearch } = useHeaderSearch();
  const pathname = usePathname();
  const slug = pathname.split('/').pop();
  
  const { data: shopData, isLoading } = useShop({
    slug: slug as string,
    enabled: Boolean(slug),
  });
  const { totalUniqueItems } = useCart();
  const { total } = useWishlist();

  const { createShopMaintenanceEventRequest } = useShopMaintenanceEvent();
  const [_, setDrawerView] = useAtom(drawerAtom);
  const [displayMobileHeaderSearch, setDisplayMobileHeaderSearch] = useAtom(
    displayMobileHeaderSearchAtom,
  );
  const [isAuthorize] = useAtom(authorizationAtom);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  
  // Set isClient to true after mount to avoid hydration errors
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Get user data from localStorage on mount and when auth changes
  useEffect(() => {
    if (!isClient) return;
    
    const getUserData = () => {
      if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          try {
            return JSON.parse(userStr);
          } catch (e) {
            return null;
          }
        }
      }
      return null;
    };
    
    setUserData(getUserData());
  }, [isAuthorize, isClient]);
  const isHomePage = useIsHomePage();
  const siteHeaderRef = React.useRef(null);
  useActiveScroll(siteHeaderRef);
  const isFlattenHeader = useMemo(
    () => !show && isHomePage && layout !== 'modern',
    [show, isHomePage, layout],
  );

  const handleSidebar = useCallback((view: string) => {
    return setDrawerView({ display: true, view });
  }, []);
  const closeLocation = () => setOpenDropdown(false);
  const { settings } = useSettings();
  const [underMaintenanceIsComing] = useAtom(checkIsMaintenanceModeComing);
  const [shopUnderMaintenanceIsComing] = useAtom(
    checkIsShopMaintenanceModeComing,
  );
  const [__, setUnderMaintenanceStart] = useAtom(checkIsMaintenanceModeStart);
  const [___, setShopUnderMaintenanceStart] = useAtom(
    checkIsShopMaintenanceModeStart,
  );
  const [isScrolling] = useAtom(checkIsScrollingStart);
  const { width } = useWindowSize();
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <>
      <header
        id="site-header"
        ref={siteHeaderRef}
        className={twMerge(
          cn(
            'site-header-with-search top-0 z-50 w-full transition-all lg:fixed',
            {
              '': isFlattenHeader,
              'sticky lg:sticky': isHomePage,
              'sticky border-b border-border-200 shadow-sm': !isHomePage,
              'lg:h-auto': shopUnderMaintenanceIsComing,
            },
          ),
        )}
      >
        {width >= RESPONSIVE_WIDTH &&
        underMaintenanceIsComing &&
        !isScrolling &&
        !shopUnderMaintenanceIsComing ? (
          <Alert
            message={`Site Maintenance Mode`}
            variant="info"
            className="sticky top-0 left-0 z-50"
            childClassName="flex justify-center font-bold items-center w-full gap-4"
          >
            <CountdownTimer
              date={new Date(settings?.maintenance?.start as string)}
              className="text-blue-600 [&>p]:bg-blue-200 [&>p]:p-2 [&>p]:text-xs [&>p]:text-blue-600"
              onComplete={() => setUnderMaintenanceStart(true)}
            />
          </Alert>
        ) : (
          ''
        )}
        {width >= RESPONSIVE_WIDTH &&
        !underMaintenanceIsComing &&
        !isScrolling &&
        shopUnderMaintenanceIsComing &&
        !isLoading &&
        shopData ? (
          <Alert
            message={`${shopData?.name} Maintenance Mode`}
            variant="info"
            className="sticky top-0 left-0 z-50"
            childClassName="flex justify-center items-center font-bold w-full gap-4"
          >
            <CountdownTimer
              date={
                new Date(shopData?.settings?.shopMaintenance?.start as string)
              }
              className="text-blue-600 [&>p]:bg-blue-200 [&>p]:p-2 [&>p]:text-xs [&>p]:text-blue-600"
              onComplete={() => {
                setShopUnderMaintenanceStart(true);
                createShopMaintenanceEventRequest({
                  shop_id: shopData?.id,
                  isMaintenance: true,
                  isShopUnderMaintenance: Boolean(
                    shopData?.settings?.isShopUnderMaintenance,
                  ),
                });
              }}
            />
          </Alert>
        ) : (
          ''
        )}
        <div
          className={cn(
            'fixed inset-0 -z-10 h-[100vh] w-full bg-black/50',
            openDropdown === true ? '' : 'hidden',
          )}
          onClick={closeLocation}
        ></div>

        <div
          className={cn(
            'flex w-full transform-gpu items-center justify-between px-5 transition-transform duration-300 lg:h-22 lg:px-6 2xl:px-8',
          )}
          style={{
            backgroundColor: '#F44535',
          }}
        >
          <motion.button
            onClick={() => handleSidebar('MAIN_MENU_VIEW')}
            className="group hidden h-full w-6 shrink-0 items-center justify-center focus:text-accent focus:outline-0 ltr:mr-6 rtl:ml-6 lg:flex xl:hidden"
          >
            <span className="sr-only">Burger Menu</span>
            <div className="flex w-full flex-col space-y-1.5">
              <span className="h-0.5 w-1/2 rounded bg-gray-600 transition-all group-hover:w-full" />
              <span className="h-0.5 w-full rounded bg-gray-600 transition-all group-hover:w-3/4" />
              <span className="h-0.5 w-3/4 rounded bg-gray-600 transition-all group-hover:w-full" />
            </div>
          </motion.button>
          <div className="flex w-full grow-0 basis-auto flex-wrap items-center ltr:mr-auto rtl:ml-auto lg:flex-nowrap">
            <Logo
              className={cn(
                'flex flex-1 justify-center py-3',
                !isMultiLangEnable ? 'mx-auto lg:mx-0' : 'ltr:ml-0 rtl:mr-0 ',
              )}
            />
            <div className="hidden cursor-pointer flex flex-1 ltr:ml-10 ltr:mr-auto rtl:mr-10 rtl:ml-auto lg:flex items-center gap-1 text-white xl:flex">
              <MapPinNew />
              <span className="hover:underline">Dyqanet tona</span>
            </div>
          </div>
          <div className="flex w-full grow-0 basis-auto flex-wrap items-center ltr:mr-auto rtl:ml-auto lg:flex-nowrap ">
            <Search
              variant="flat"
              label="search"
              placeholder="Search..."
            />
          </div>

          {isHomePage ? (
            <>
              {(displayMobileHeaderSearch && show) ||
              (displayMobileHeaderSearch && layout === 'modern') ? (
                <div className="absolute top-0 z-20 flex h-full w-full items-center justify-center space-x-4 border-b-accent-300 bg-light px-5 py-1.5 backdrop-blur ltr:left-0 rtl:right-0 rtl:space-x-reverse lg:border lg:bg-opacity-30">
                  <Search
                    label="Search"
                    variant="minimal"
                    className="lg:max-w-3xl"
                    inputClassName="lg:border-accent-400"
                  />
                  <Button
                    variant="custom"
                    onClick={() =>
                      setDisplayMobileHeaderSearch((prev) => !prev)
                    }
                    className="hidden border border-accent-400 bg-gray-100 !px-4 text-accent lg:inline-flex"
                  >
                    <CloseIcon className="h-5 w-5" />
                  </Button>
                </div>
              ) : null}
            </>
          ) : null}
          <div className="hidden lg:flex w-full grow-0 basis-auto flex-wrap items-center ltr:mr-auto rtl:ml-auto lg:flex-nowrap">
            {settings?.useGoogleMap && (
              <div
                className={cn(
                  'relative flex justify-center lg:w-auto lg:border-none',
                  isFlattenHeader || (isHomePage && 'flex'),
                )}
              >
                <Button
                  variant="custom"
                  className="!flex h-[38px] w-[38px] max-w-full items-center gap-2 rounded-full border border-border-200 bg-light !p-1 text-sm !font-normal focus:!shadow-none focus:!ring-0 md:text-base"
                  onClick={() => setOpenDropdown(!openDropdown)}
                >
                  <span className="flex shrink-0 grow-0 basis-auto items-center gap-1 text-base text-gray-700">
                    <MapPin className="h-5 w-5 " />
                  </span>
                </Button>
                <LocationBasedShopForm
                  className={cn(
                    'fixed inset-x-0 top-[60px] mx-auto bg-white lg:top-[82px]',
                    openDropdown === true ? '' : 'hidden',
                  )}
                  closeLocation={closeLocation}
                />
              </div>
            )}

            <div className="flex items-center w-full justify-around space-x-6 text-white">
              {/* Transporti */}
              <div className="flex items-center space-x-1 cursor-pointer hover:opacity-80">
                <TruckDeliveryIcon height={22}></TruckDeliveryIcon>
                <span className="text-sm">Transporti</span>
              </div>

              {/* User */}
              <div className="flex items-center text-white">
                <div className="relative" ref={dropdownRef}>
                  {isClient && isAuthorize ? (
                    <>
                      <motion.button
                        whileTap={{ scale: 0.88 }}
                        onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                        className="flex h-full items-center justify-center p-2 focus:outline-0"
                      >
                        <Image 
                          src="/avatar.svg" 
                          alt="User avatar" 
                          width={32} 
                          height={32}
                          className="rounded-full"
                        />
                      </motion.button>
                      {userDropdownOpen && (
                        <div className="absolute right-0 top-full mt-3 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden z-[100]">
                          {/* Arrow pointing up */}
                          <div className="absolute -top-2 right-8 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-white"></div>
                          {/* User info section */}
                          <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center space-x-4">
                              <Image 
                                src="/avatar.svg" 
                                alt="User avatar" 
                                width={60} 
                                height={60}
                                className="rounded-full"
                              />
                              <div className="flex-1">
                                <p className="text-md font-medium text-blue-600 break-all">
                                  {userData?.email || 'Useremail@gmail.com'}
                                </p>
                                <Link
                                  href="/profile"
                                  className="text-base text-gray-700 hover:text-gray-900 flex items-center mt-1 group"
                                  onClick={() => setUserDropdownOpen(false)}
                                >
                                  <span>Profili Im</span>
                                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </Link>
                              </div>
                            </div>
                          </div>
                          
                          {/* Menu items */}
                          <div className="py-2">
                            <Link
                              href="/my-loyalty-card"
                              className="block px-6 py-4 text-lg text-gray-900 hover:bg-gray-50 transition-colors"
                              onClick={() => setUserDropdownOpen(false)}
                            >
                              My loyalty card
                            </Link>
                          </div>
                          
                          {/* Logout */}
                          <div className="border-t border-gray-100">
                            <button
                              onClick={() => {
                                AuthService.logout();
                                setUserDropdownOpen(false);
                                router.push('/');
                                window.location.reload();
                              }}
                              className="block w-full text-left px-6 py-4 text-lg text-gray-900 hover:bg-gray-50 transition-colors"
                            >
                              Logout
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <motion.button
                      whileTap={{ scale: 0.88 }}
                      onClick={() => router.push('/login')}
                      className="flex h-full items-center justify-center p-2 focus:text-[#F44535] focus:outline-0"
                    >
                      <LoginUserIcon height={22} />
                    </motion.button>
                  )}
                </div>
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={() => window.location.href = '/favorites'}
                  className="product-cart relative flex h-full items-center justify-center pl-0 p-2 focus:text-[#000] focus:outline-0"
                >
                  <FavoriteIcon height={22} />
                  <span className={`absolute top-0 mt-0.5 rounded-full bg-[#FEC949] !text-[#000] py-1 px-1.5 text-10px font-semibold leading-none text-light ltr:right-0 ltr:-mr-0.5 rtl:left-0 rtl:-ml-0.5 ${total > 0 ? '' : 'hidden'}`}>
                    {total}
                  </span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={() => handleSidebar('cart')}
                  className="product-cart relative flex h-full items-center justify-center pl-0 p-2 focus:text-[#000] focus:outline-0"
                >
                  <span className="sr-only">Cart</span>
                  <ShoppingCartIcon height={22}></ShoppingCartIcon>
                  <span className={`absolute top-0 mt-0.5 rounded-full bg-[#FEC949] !text-[#000] py-1 px-1.5 text-10px font-semibold leading-none text-light ltr:right-0 ltr:-mr-0.5 rtl:left-0 rtl:-ml-0.5 ${totalUniqueItems > 0 ? '' : 'hidden'}`}>
                    {totalUniqueItems}
                  </span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
        <div className="relative z--1">
          <ul className="hidden items-center space-x-7 rtl:space-x-reverse md:flex 2xl:space-x-10 md:justify-evenly bg-[#fff] relative">
            <DynamicMenu />
          </ul>
        </div>
      </header>
    </>
  );
};

export default Header;
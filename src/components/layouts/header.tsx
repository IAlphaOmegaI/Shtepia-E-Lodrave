'use client';

import LocationBasedShopForm from '@/components/form/location-based-shop-form';
import { CloseIcon } from '@/components/icons/close';
import { MapPin, MapPinNew } from '@/components/icons/map-pin';
import { SearchIcon } from '@/components/icons/search';
import { Search as SearchLucide, Heart, ShoppingCart } from 'lucide-react';
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
            "site-header-with-search top-0 z-50 w-full transition-all lg:fixed",
            {
              "": isFlattenHeader,
              "sticky lg:sticky": isHomePage,
              "sticky border-b border-border-200 shadow-sm": !isHomePage,
              "lg:h-auto": shopUnderMaintenanceIsComing,
            }
          )
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
          ""
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
                    shopData?.settings?.isShopUnderMaintenance
                  ),
                });
              }}
            />
          </Alert>
        ) : (
          ""
        )}
        <div
          className={cn(
            "fixed inset-0 -z-10 h-[100vh] w-full bg-black/50",
            openDropdown === true ? "" : "hidden"
          )}
          onClick={closeLocation}
        ></div>

        <div
          className={cn(
            "flex w-full transform-gpu items-center justify-between px-3 sm:px-5 py-2 sm:py-0 transition-transform duration-300 h-16 sm:h-18 lg:h-22 lg:px-6 2xl:px-8"
          )}
          style={{
            backgroundColor: "#F44535",
          }}
        >
          {/* Desktop Layout */}
          <div className="hidden md:grid md:grid-cols-3 w-full items-center">
            {/* Left Section - Logo & Stores Link */}
            <div className="flex items-center">
              <Logo
                className={cn(
                  "flex justify-start py-2 sm:py-3",
                  !isMultiLangEnable ? "" : "ltr:ml-0 rtl:mr-0"
                )}
              />
              <Link
                href="/stores"
                className="hidden lg:flex items-center gap-1 text-white ltr:ml-6 rtl:mr-6 whitespace-nowrap"
              >
                <MapPinNew className="w-4 h-4" />
                <span className="hover:underline font-bold text-sm">Dyqanet tona</span>
              </Link>
            </div>
            
            {/* Center Section - Search */}
            <div className="flex justify-center items-center px-4">
              <div className="w-full max-w-lg">
                <Search variant="flat" label="search" placeholder="Search..." />
              </div>
            </div>
            
            {/* Right Section - User Actions */}
            <div className="flex items-center justify-end space-x-3 text-white">
                <div className="relative" ref={dropdownRef}>
                  {isClient && isAuthorize ? (
                    <>
                      <motion.button
                        whileTap={{ scale: 0.88 }}
                        onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                        className="flex items-center justify-center p-2 focus:outline-0"
                      >
                        <Image
                          src="/avatar.svg"
                          alt="User avatar"
                          width={28}
                          height={28}
                          className="rounded-full"
                        />
                      </motion.button>
                      {userDropdownOpen && (
                        <div className="absolute right-0 top-full mt-3 w-72 bg-white rounded-2xl shadow-2xl overflow-hidden z-[100]">
                          <div className="absolute -top-2 right-8 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-white"></div>
                          <div className="p-4 border-b border-gray-100">
                            <div className="flex items-center space-x-3">
                              <Image
                                src="/avatar.svg"
                                alt="User avatar"
                                width={50}
                                height={50}
                                className="rounded-full"
                              />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-blue-600 break-all">
                                  {userData?.email || "Useremail@gmail.com"}
                                </p>
                                <Link
                                  href="/account/profile"
                                  className="text-sm text-gray-700 hover:text-gray-900 flex items-center mt-1 group"
                                  onClick={() => setUserDropdownOpen(false)}
                                >
                                  <span>Profili Im</span>
                                  <svg className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </Link>
                              </div>
                            </div>
                          </div>
                          <div className="py-1">
                            <Link
                              href="/account/loyalty-card"
                              className="block px-4 py-3 text-sm text-gray-900 hover:bg-gray-50 transition-colors"
                              onClick={() => setUserDropdownOpen(false)}
                            >
                              Karta ime besnikërisë 
                            </Link>
                            <Link
                              href="/account/orders"
                              className="block px-4 py-3 text-sm text-gray-900 hover:bg-gray-50 transition-colors"
                              onClick={() => setUserDropdownOpen(false)}
                            >
                              Porositë
                            </Link>
                          </div>
                          <div className="border-t border-gray-100">
                            <button
                              onClick={() => {
                                AuthService.logout();
                                setUserDropdownOpen(false);
                                router.push("/");
                                window.location.reload();
                              }}
                              className="block w-full text-left px-4 py-3 text-sm text-gray-900 hover:bg-gray-50 transition-colors"
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
                      onClick={() => router.push("/login")}
                      className="flex items-center justify-center p-2 focus:text-[#F44535] focus:outline-0"
                    >
                      <LoginUserIcon height={20} />
                    </motion.button>
                  )}
                </div>
                
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={() => (window.location.href = "/favorites")}
                  className="relative flex items-center justify-center p-2 focus:text-[#000] focus:outline-0"
                >
                  <FavoriteIcon height={20} />
                  <span
                    className={`absolute -top-1 -right-1 rounded-full bg-[#FEC949] !text-[#000] py-0.5 px-1.5 text-xs font-semibold leading-none ${
                      total > 0 ? "" : "hidden"
                    }`}
                  >
                    {total}
                  </span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={() => handleSidebar("cart")}
                  className="relative flex items-center justify-center p-2 focus:text-[#000] focus:outline-0"
                >
                  <ShoppingCartIcon height={20} />
                  <span
                    className={`absolute -top-1 -right-1 rounded-full bg-[#FEC949] !text-[#000] py-0.5 px-1.5 text-xs font-semibold leading-none ${
                      totalUniqueItems > 0 ? "" : "hidden"
                    }`}
                  >
                    {totalUniqueItems}
                  </span>
                </motion.button>
            </div>
          </div>
          
          {/* Mobile Layout */}
          <div className="flex md:hidden w-full items-center justify-between">
            {/* Left - Menu Button */}
            <motion.button
              onClick={() => handleSidebar("MAIN_MENU_VIEW")}
              className="group flex h-full w-6 shrink-0 items-center justify-center focus:text-accent focus:outline-0"
            >
              <span className="sr-only">Burger Menu</span>
              <div className="flex w-full flex-col space-y-1">
                <span className="h-0.5 w-1/2 rounded bg-white transition-all group-hover:w-full" />
                <span className="h-0.5 w-full rounded bg-white transition-all group-hover:w-3/4" />
                <span className="h-0.5 w-3/4 rounded bg-white transition-all group-hover:w-full" />
              </div>
            </motion.button>
            
            {/* Center - Logo */}
            <div className="flex-1 flex justify-center">
              <Logo className="py-2" />
            </div>
            
            {/* Right - User Icon */}
            <div className="relative" ref={dropdownRef}>
              {isClient && isAuthorize ? (
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center justify-center p-2 focus:outline-0"
                >
                  <Image
                    src="/avatar.svg"
                    alt="User avatar"
                    width={28}
                    height={28}
                    className="rounded-full"
                  />
                </motion.button>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={() => router.push("/login")}
                  className="flex items-center justify-center p-2 focus:outline-0"
                >
                  <LoginUserIcon height={20} className="text-white" />
                </motion.button>
              )}
              
              {/* Mobile User Dropdown */}
              {userDropdownOpen && isClient && isAuthorize && (
                <div className="absolute right-0 top-full mt-3 w-64 bg-white rounded-2xl shadow-2xl overflow-hidden z-[100]">
                  <div className="absolute -top-2 right-8 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-white"></div>
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <Image
                        src="/avatar.svg"
                        alt="User avatar"
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-600 break-all">
                          {userData?.email || "Useremail@gmail.com"}
                        </p>
                        <Link
                          href="/account/profile"
                          className="text-xs text-gray-700 hover:text-gray-900 flex items-center mt-1 group"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <span>Profili Im</span>
                          <svg className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/account/loyalty-card"
                      className="block px-4 py-3 text-sm text-gray-900 hover:bg-gray-50 transition-colors"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      My loyalty card
                    </Link>
                    <Link
                      href="/account/orders"
                      className="block px-4 py-3 text-sm text-gray-900 hover:bg-gray-50 transition-colors"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      My Orders
                    </Link>
                  </div>
                  <div className="border-t border-gray-100">
                    <button
                      onClick={() => {
                        AuthService.logout();
                        setUserDropdownOpen(false);
                        router.push("/");
                        window.location.reload();
                      }}
                      className="block w-full text-left px-4 py-3 text-sm text-gray-900 hover:bg-gray-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
        {/* Mobile Search Overlay */}
        {displayMobileHeaderSearch && (
          <div className="lg:hidden absolute top-0 left-0 right-0 bg-[#F44535] z-30 p-4">
            <div className="flex items-center space-x-3">
              <div className="flex-1">
                <Search variant="flat" label="search" placeholder="Search..." />
              </div>
              <Button
                variant="custom"
                onClick={() => setDisplayMobileHeaderSearch(false)}
                className="bg-white/20 text-white p-2 rounded-full hover:bg-white/30"
              >
                <CloseIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        
        <div className="relative z--1">
          <ul className="hidden items-center space-x-7 rtl:space-x-reverse md:flex 2xl:space-x-10 md:justify-evenly bg-[#fff] relative">
            <DynamicMenu />
          </ul>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50">
        <div className="grid grid-cols-3 h-20 safe-area-pb">
          {/* Search */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setDisplayMobileHeaderSearch(true)}
            className="flex flex-col items-center justify-center space-y-2 py-3 px-4 hover:bg-gray-50 active:bg-gray-100 transition-all duration-200"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <SearchLucide className="w-5 h-5 text-gray-700" />
              </div>
            </div>
            <span className="text-xs text-gray-700 font-medium">Search</span>
          </motion.button>

          {/* Favorites */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => (window.location.href = "/favorites")}
            className="relative flex flex-col items-center justify-center space-y-2 py-3 px-4 hover:bg-gray-50 active:bg-gray-100 transition-all duration-200"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Heart className="w-5 h-5 text-gray-700" />
              </div>
              {total > 0 && (
                <span className="absolute -top-1 -right-1 rounded-full bg-[#F44535] text-white py-1 px-2 text-xs font-bold leading-none min-w-[20px] h-5 flex items-center justify-center shadow-md">
                  {total}
                </span>
              )}
            </div>
            <span className="text-xs text-gray-700 font-medium">Wishlist</span>
          </motion.button>

          {/* Cart */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSidebar("cart")}
            className="relative flex flex-col items-center justify-center space-y-2 py-3 px-4 hover:bg-gray-50 active:bg-gray-100 transition-all duration-200"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-gray-700" />
              </div>
              {totalUniqueItems > 0 && (
                <span className="absolute -top-1 -right-1 rounded-full bg-[#F44535] text-white py-1 px-2 text-xs font-bold leading-none min-w-[20px] h-5 flex items-center justify-center shadow-md">
                  {totalUniqueItems}
                </span>
              )}
            </div>
            <span className="text-xs text-gray-700 font-medium">Cart</span>
          </motion.button>
        </div>
      </div>
    </>
  );
};

export default Header;
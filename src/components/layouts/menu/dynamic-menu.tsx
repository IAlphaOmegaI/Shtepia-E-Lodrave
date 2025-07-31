'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import cn from 'classnames';
import { ArrowDownIcon } from '@/components/icons/arrow-down';
import { CategoryService, BrandService } from '@/services';
import type { Category, Brand } from '@/types';

// Age groups - these might come from API or config
const ageGroups = [
  { id: 1, name: '0 - 1 years', slug: '0-1-years' },
  { id: 2, name: '1 - 3 years', slug: '1-3-years' },
  { id: 3, name: '4 - 8 years', slug: '4-8-years' },
  { id: 4, name: '8+ years', slug: '8-plus-years' },
];

const DynamicMenu: React.FC = () => {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories and brands on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesData, brandsData] = await Promise.all([
          CategoryService.getParentCategories(),
          BrandService.getAll()
        ]);
        setCategories(categoriesData);
        setBrands(brandsData);
      } catch (error) {
        console.error('Error fetching menu data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleMenu = (key: string) => {
    setOpenMenu(openMenu === key ? null : key);
  };

  const handleMouseEnter = (key: string) => {
    setOpenMenu(key);
  };

  const handleMouseLeave = () => {
    setOpenMenu(null);
  };

  if (loading) {
    return null;
  }

  return (
    <>
      {categories.map((category) => {
        const menuKey = `${category.slug}${category.id}`;
        const isOpen = openMenu === menuKey;
        const hasChildren = category.children && category.children.length > 0;

        return (
          <li
            key={menuKey}
            className={cn(
              'menuItem relative mx-3 cursor-pointer py-3 xl:mx-4',
              {
                'has-mega-menu': hasChildren,
              }
            )}
            onMouseEnter={() => handleMouseEnter(menuKey)}
            onMouseLeave={handleMouseLeave}
          >
            {hasChildren ? (
              <>
                <div
                  className="flex items-center gap-2 hover:text-accent cursor-pointer"
                  onClick={() => toggleMenu(menuKey)}
                >
                  <span
                    className={cn(
                      'text-[#F11602] relative inline-flex items-center py-2 text-[18px] font-semibold leading-[24px] not-italic capitalize',
                      {
                        'underline underline-offset-4': isOpen,
                      }
                    )}
                  >
                    {category.name}
                  </span>
                  <ArrowDownIcon
                    className={cn(
                      'mt-1 transition-transform duration-300 text-[#F11602]',
                      {
                        'rotate-180': isOpen,
                      }
                    )}
                  />
                </div>

                {/* Dropdown Menu */}
                {isOpen && (
                  <div className="fixed left-0 right-0 top-[149px] z-50 h-[calc(100vh-150px)] bg-white py-[24px] px-[100px] overflow-auto shadow-xl">
                    <div className="mx-auto max-w-7xl">
                      <div className="grid grid-cols-4 gap-x-20">
                        {/* Categories Column */}
                        <div className="pr-8 border-r border-[#E8E8E8]">
                          <h3 className="text-[#F44535] font-semibold mb-4">Kategoritë</h3>
                          <ul className="space-y-2">
                            {category.children.slice(0, 6).map((child) => (
                              <li key={child.id}>
                                <Link
                                  href={`/categories/${child.slug}`}
                                  className="block text-[18px] font-normal not-italic leading-[24px] text-[#252323] hover:text-accent transition capitalize mb-4"
                                >
                                  {child.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Brands Column */}
                        <div className="px-8 border-r border-[#E8E8E8]">
                          <h3 className="text-[#F44535] font-semibold mb-4">Brand</h3>
                          <ul className="space-y-2">
                            {brands.slice(0, 6).map((brand) => (
                              <li key={brand.id}>
                                <Link 
                                  href={`/brands/${brand.slug}`} 
                                  className="block text-[18px] font-normal not-italic leading-[24px] text-[#252323] hover:text-accent transition capitalize mb-4"
                                >
                                  {brand.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* LEGO Column - Show specific brand categories if available */}
                        <div className="px-8 border-r border-[#E8E8E8]">
                          <h3 className="text-[#F44535] font-semibold mb-4">LEGO</h3>
                          <ul className="space-y-2">
                            {(() => {
                              const legoBrand = brands.find(b => b.slug === 'lego' || b.name.toLowerCase() === 'lego');
                              if (legoBrand && legoBrand.children && legoBrand.children.length > 0) {
                                return legoBrand.children.map((child) => (
                                  <li key={child.id}>
                                    <Link
                                      href={`/brands/${child.slug}`}
                                      className="block text-[18px] font-normal not-italic leading-[24px] text-[#252323] hover:text-accent transition capitalize mb-4"
                                    >
                                      {child.name}
                                    </Link>
                                  </li>
                                ));
                              } else {
                                // Fallback to showing some predefined LEGO categories
                                return (
                                  <>
                                    <li><Link href="/brands/lego-city" className="block text-[18px] font-normal not-italic leading-[24px] text-[#252323] hover:text-accent transition capitalize mb-4">City</Link></li>
                                    <li><Link href="/brands/lego-duplo" className="block text-[18px] font-normal not-italic leading-[24px] text-[#252323] hover:text-accent transition capitalize mb-4">Duplo</Link></li>
                                    <li><Link href="/brands/lego-friends" className="block text-[18px] font-normal not-italic leading-[24px] text-[#252323] hover:text-accent transition capitalize mb-4">Friends</Link></li>
                                    <li><Link href="/brands/lego-ninjago" className="block text-[18px] font-normal not-italic leading-[24px] text-[#252323] hover:text-accent transition capitalize mb-4">Ninjago</Link></li>
                                  </>
                                );
                              }
                            })()}
                          </ul>
                        </div>

                        {/* Age Column */}
                        <div className="pl-8">
                          <h3 className="text-[#F44535] font-semibold mb-4">Age</h3>
                          <ul className="space-y-2">
                            {ageGroups.map((age) => (
                              <li key={age.id}>
                                <Link
                                  href={`/age/${age.slug}`}
                                  className="block text-[18px] font-normal not-italic leading-[24px] text-[#252323] hover:text-accent transition capitalize mb-4"
                                >
                                  {age.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Link
                href={`/categories/${category.slug}`}
                className="text-[#F11602] relative inline-flex items-center py-2 text-[18px] font-semibold leading-[24px] not-italic capitalize hover:text-accent"
              >
                {category.name}
              </Link>
            )}
          </li>
        );
      })}
    </>
  );
};

export default DynamicMenu;
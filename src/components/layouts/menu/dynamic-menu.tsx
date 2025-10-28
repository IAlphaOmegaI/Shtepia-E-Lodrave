'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import cn from 'classnames';
import { ArrowDownIcon } from '@/components/icons/arrow-down';
import { CategoryService, BrandService } from '@/services';
import { api } from '@/services/api';
import type { Category, Brand } from '@/types';

type CategoryFilters = {
  categories: { id: number; name: string; slug?: string }[];
  brands: { id: number; name: string; slug?: string }[];
  ages: { id: number; label: string }[];
};

const DynamicMenu: React.FC = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allBrands, setAllBrands] = useState<Brand[]>([]);
  const [categoryFilters, setCategoryFilters] = useState<Record<string, CategoryFilters>>({});
  const [loading, setLoading] = useState(true);

  // Fetch categories and all brands on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesData, brandsData] = await Promise.all([
          CategoryService.getParentCategories(),
          BrandService.getAll()
        ]);
        setCategories(categoriesData);
        setAllBrands(brandsData);
      } catch (error) {
        console.error('Error fetching menu data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle scroll lock when menu is open
  useEffect(() => {
    if (openMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [openMenu]);

  // Handle clicks outside of menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const isMenuClick = target.closest('.menuItem') || target.closest('.mega-menu-dropdown');

      if (openMenu && !isMenuClick) {
        setOpenMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenu]);

  const toggleMenu = (key: string, categorySlug: string) => {
    const newOpenMenu = openMenu === key ? null : key;
    setOpenMenu(newOpenMenu);
    if (newOpenMenu) {
      fetchCategoryFilters(categorySlug);
    }
  };

  // Fetch category-specific filters when menu is opened
  const fetchCategoryFilters = async (categorySlug: string) => {
    // If we already have the filters for this category, don't fetch again
    if (categoryFilters[categorySlug]) return;

    try {
      const response = await api.filters.getByCategory(categorySlug);
      if (response && response[categorySlug]) {
        setCategoryFilters(prev => ({
          ...prev,
          [categorySlug]: response[categorySlug]
        }));
      }
    } catch (error) {
      console.error(`Error fetching filters for ${categorySlug}:`, error);
    }
  };

  const handleMouseEnter = (key: string, categorySlug: string) => {
    setOpenMenu(key);
    // Fetch filters for this category
    fetchCategoryFilters(categorySlug);
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

        // Get filtered data for this category
        const filters = categoryFilters[category.slug] || { categories: [], brands: [], ages: [] };
        const filteredCategories = filters.categories || [];
        const filteredBrands = filters.brands || [];

        return (
          <li
            key={menuKey}
            className={cn(
              'menuItem relative mx-3 cursor-pointer py-3 xl:mx-4',
              {
                'has-mega-menu': hasChildren,
              }
            )}
            onMouseEnter={() => handleMouseEnter(menuKey, category.slug)}
            onMouseLeave={handleMouseLeave}
          >
            {hasChildren ? (
              <>
                <div
                  className="flex items-center gap-2 hover:text-[#ff6b5c] cursor-pointer transition-colors"
                  onClick={() => toggleMenu(menuKey, category.slug)}
                >
                  <span
                    className={cn(
                      'text-[#F11602] relative inline-flex items-center py-2 text-[18px] font-semibold leading-[24px] not-italic capitalize hover:text-[#ff6b5c] transition-colors',
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
                  <div className="mega-menu-dropdown fixed left-0 right-0 top-[149px] z-30 h-[calc(100vh-150px)] bg-white py-[24px] px-[100px] overflow-auto shadow-xl">
                    <div className="mx-auto max-w-7xl">
                      <div className="grid grid-cols-3 gap-x-20">
                        {/* Categories Column - Show filtered subcategories */}
                        <div className="pr-8 border-r border-[#E8E8E8]">
                          <h3 className="text-[#F44535] font-semibold mb-4">Kategoritë</h3>
                          <ul className="space-y-2">
                            {filteredCategories.length > 0 ? (
                              filteredCategories.slice(0, 6).map((child) => (
                                <li key={child.id}>
                                  <Link
                                    href={`/category/${child.slug || child.name.toLowerCase()}`}
                                    onClick={() => setOpenMenu(null)}
                                    className="block text-[18px] font-normal not-italic leading-[24px] text-[#252323] hover:text-[#4a4a4a] transition-colors capitalize mb-4"
                                  >
                                    {child.name}
                                  </Link>
                                </li>
                              ))
                            ) : category.children && category.children.length > 0 ? (
                              // Fallback to parent category children if filters not loaded yet
                              category.children.slice(0, 6).map((child) => (
                                <li key={child.id}>
                                  <Link
                                    href={`/category/${child.slug}`}
                                    onClick={() => setOpenMenu(null)}
                                    className="block text-[18px] font-normal not-italic leading-[24px] text-[#252323] hover:text-[#4a4a4a] transition-colors capitalize mb-4"
                                  >
                                    {child.name}
                                  </Link>
                                </li>
                              ))
                            ) : null}
                          </ul>
                        </div>

                        {/* Brands Column - Show filtered brands */}
                        <div className="px-8 border-r border-[#E8E8E8]">
                          <h3 className="text-[#F44535] font-semibold mb-4">Brand</h3>
                          <ul className="space-y-2">
                            {filteredBrands.length > 0 ? (
                              filteredBrands.slice(0, 6).map((brand) => (
                                <li key={brand.id}>
                                  <Link
                                    href={`/brands/${brand.slug || brand.name.toLowerCase()}`}
                                    onClick={() => setOpenMenu(null)}
                                    className="block text-[18px] font-normal not-italic leading-[24px] text-[#252323] hover:text-[#4a4a4a] transition-colors capitalize mb-4"
                                  >
                                    {brand.name}
                                  </Link>
                                </li>
                              ))
                            ) : (
                              <li className="text-[16px] text-gray-400 italic">Loading brands...</li>
                            )}
                          </ul>
                        </div>

                        {/* Third Column - Show LEGO categories if available */}
                        {(() => {
                          // Find LEGO brand in all brands (with children)
                          const legoBrand = allBrands.find(b => b.slug === 'lego' || b.name.toLowerCase() === 'lego');

                          if (legoBrand && legoBrand.children && legoBrand.children.length > 0) {
                            return (
                              <div className="pl-8">
                                <h3 className="text-[#F44535] font-semibold mb-4">LEGO</h3>
                                <ul className="space-y-2">
                                  {legoBrand.children.map((child) => (
                                    <li key={child.id}>
                                      <Link
                                        href={`/brands/${child.slug}`}
                                        onClick={() => setOpenMenu(null)}
                                        className="block text-[18px] font-normal not-italic leading-[24px] text-[#252323] hover:text-[#4a4a4a] transition-colors capitalize mb-4"
                                      >
                                        {child.name}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            );
                          }
                          return null; // Don't show LEGO column if no LEGO brand exists
                        })()}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Link
                href={`/category/${category.slug}`}
                className="text-[#F11602] relative inline-flex items-center py-2 text-[18px] font-semibold leading-[24px] not-italic capitalize hover:text-[#ff6b5c] transition-colors"
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
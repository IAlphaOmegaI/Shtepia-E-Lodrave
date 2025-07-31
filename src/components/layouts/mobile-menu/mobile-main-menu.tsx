'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAtom } from 'jotai';
import { drawerAtom } from '@/store/drawer-atom';
import { ArrowDownIcon } from '@/components/icons/arrow-down';
import { ChevronRight, X } from 'lucide-react';
import cn from 'classnames';
import { CategoryService, BrandService } from '@/services';
import type { Category, Brand } from '@/types';

// Age groups - these might come from API or config
const ageGroups = [
  { id: 1, name: '0 - 1 Years', slug: '0-1-years' },
  { id: 2, name: '1 - 3 Years', slug: '1-3-years' },
  { id: 3, name: '4 - 8 Years', slug: '4-8-years' },
  { id: 4, name: '8+ Years', slug: '8-plus-years' },
];

const MobileMainMenu: React.FC = () => {
  const [_, setDrawerState] = useAtom(drawerAtom);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [subMenuView, setSubMenuView] = useState<'main' | 'category' | 'brand' | 'lego' | 'age'>('main');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
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

  const closeDrawer = () => {
    setDrawerState({ display: false, view: '' });
  };

  const handleCategoryClick = (category: any) => {
    if (category.children && category.children.length > 0) {
      setSelectedCategory(category);
      setSubMenuView('category');
    } else {
      closeDrawer();
    }
  };

  const renderMainMenu = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-5 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 ">Menu</h2>
        <button
          onClick={closeDrawer}
          className="p-2 -mr-2 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <ul className="py-4">
            {categories.map((category) => (
              <li key={category.id} className="border-b border-gray-100 last:border-0">
                {category.children && category.children.length > 0 ? (
                  <button
                    onClick={() => handleCategoryClick(category)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50"
                  >
                    <span className="text-base font-medium text-gray-900">{category.name}</span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                ) : (
                  <Link
                    href={`/categories/${category.slug}`}
                    onClick={closeDrawer}
                    className="block px-5 py-4 text-base font-medium text-gray-900 hover:bg-gray-50"
                  >
                    {category.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );

  const renderCategoryMenu = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center p-5 border-b border-gray-200">
        <button
          onClick={() => setSubMenuView('main')}
          className="p-2 -ml-2 mr-2 text-gray-500 hover:text-gray-700"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-lg font-semibold text-gray-900">{selectedCategory?.name}</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="py-4">
          {/* Categories Section */}
          <div className="px-5 pb-4">
            <h3 className="text-sm font-semibold text-[#F44535] mb-3">Kategoritë</h3>
            <ul className="space-y-2">
              {selectedCategory?.children.map((child: any) => (
                <li key={child.id}>
                  <Link
                    href={`/categories/${child.slug}`}
                    onClick={closeDrawer}
                    className="block py-2 text-base text-gray-700 hover:text-[#F44535]"
                  >
                    {child.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Brands Section */}
          {brands.length > 0 && (
            <div className="px-5 py-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-[#F44535] mb-3">Brands</h3>
              <ul className="space-y-2">
                {brands.slice(0, 10).map((brand) => (
                  <li key={brand.id}>
                    <Link 
                      href={`/brands/${brand.slug}`} 
                      onClick={closeDrawer} 
                      className="block py-2 text-base text-gray-700 hover:text-[#F44535]"
                    >
                      {brand.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Age Section */}
          <div className="px-5 py-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-[#F44535] mb-3">Age</h3>
            <ul className="space-y-2">
              {ageGroups.map((age) => (
                <li key={age.id}>
                  <Link
                    href={`/age/${age.slug}`}
                    onClick={closeDrawer}
                    className="block py-2 text-base text-gray-700 hover:text-[#F44535]"
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
  );

  return (
    <>
      {subMenuView === 'main' && renderMainMenu()}
      {subMenuView === 'category' && renderCategoryMenu()}
    </>
  );
};

export default MobileMainMenu;
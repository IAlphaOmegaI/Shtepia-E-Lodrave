'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import cn from 'classnames';
import { ArrowDownIcon } from '@/components/icons/arrow-down';

// Mock categories data based on the Figma design
const mockCategories = [
  {
    id: 1,
    name: 'Lodra',
    slug: 'lodra',
    is_parent: true,
    parent: null,
    children: [
      { id: 11, name: 'Creative & Building Toys', slug: 'creative-building-toys' },
      { id: 12, name: 'Dolls & Accessories', slug: 'dolls-accessories' },
      { id: 13, name: 'Action Figures', slug: 'action-figures' },
      { id: 14, name: 'Educational Toys', slug: 'educational-toys' },
      { id: 15, name: 'Musical Toys', slug: 'musical-toys' },
      { id: 16, name: 'Outdoor Toys', slug: 'outdoor-toys' },
    ],
  },
  {
    id: 2,
    name: 'Veshje',
    slug: 'veshje',
    is_parent: true,
    parent: null,
    children: [
      { id: 21, name: 'Baby Clothes', slug: 'baby-clothes' },
      { id: 22, name: 'Kids Clothes', slug: 'kids-clothes' },
      { id: 23, name: 'Shoes', slug: 'shoes' },
      { id: 24, name: 'Accessories', slug: 'accessories' },
    ],
  },
  {
    id: 3,
    name: 'Karroca Bebesh',
    slug: 'karroca-bebesh',
    is_parent: true,
    parent: null,
    children: [
      { id: 31, name: 'Strollers', slug: 'strollers' },
      { id: 32, name: 'Car Seats', slug: 'car-seats' },
      { id: 33, name: 'Baby Carriers', slug: 'baby-carriers' },
      { id: 34, name: 'Travel Systems', slug: 'travel-systems' },
    ],
  },
  {
    id: 4,
    name: 'Brandet',
    slug: 'brandet',
    is_parent: true,
    parent: null,
    children: [
      { id: 41, name: 'Barbie', slug: 'barbie' },
      { id: 42, name: 'Hot Wheels', slug: 'hot-wheels' },
      { id: 43, name: 'Fisher-Price', slug: 'fisher-price' },
      { id: 44, name: 'LEGO', slug: 'lego', 
        subItems: [
          { id: 441, name: 'City', slug: 'lego-city' },
          { id: 442, name: 'Duplo', slug: 'lego-duplo' },
          { id: 443, name: 'Friends', slug: 'lego-friends' },
          { id: 444, name: 'Ninjago', slug: 'lego-ninjago' },
          { id: 445, name: 'Movie', slug: 'lego-movie' },
          { id: 446, name: 'Super Heroes', slug: 'lego-super-heroes' },
          { id: 447, name: 'Architecture', slug: 'lego-architecture' },
          { id: 448, name: 'Technic', slug: 'lego-technic' },
          { id: 449, name: 'Botanical Collection', slug: 'lego-botanical' },
          { id: 450, name: 'Star Wars', slug: 'lego-star-wars' },
          { id: 451, name: 'Speed Champions', slug: 'lego-speed-champions' },
          { id: 452, name: 'Harry Potter', slug: 'lego-harry-potter' },
        ]
      },
    ],
  },
  {
    id: 5,
    name: 'Oferta',
    slug: 'oferta',
    is_parent: true,
    parent: null,
    children: [],
  },
  {
    id: 6,
    name: 'Outlet',
    slug: 'outlet',
    is_parent: true,
    parent: null,
    children: [],
  },
];

// Mock age groups
const ageGroups = [
  { id: 1, name: '0 - 1 years', slug: '0-1-years' },
  { id: 2, name: '1 - 3 years', slug: '1-3-years' },
  { id: 3, name: '4 - 8 years', slug: '4-8-years' },
  { id: 4, name: '8+ years', slug: '8-plus-years' },
];

const DynamicMenu: React.FC = () => {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (key: string) => {
    setOpenMenu(openMenu === key ? null : key);
  };

  const handleMouseEnter = (key: string) => {
    setOpenMenu(key);
  };

  const handleMouseLeave = () => {
    setOpenMenu(null);
  };

  return (
    <>
      {mockCategories.map((category) => {
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
                            <li><Link href="/brands/barbie" className="block text-[18px] font-normal not-italic leading-[24px] text-[#252323] hover:text-accent transition capitalize mb-4">Barbie</Link></li>
                            <li><Link href="/brands/hot-wheels" className="block text-[18px] font-normal not-italic leading-[24px] text-[#252323] hover:text-accent transition capitalize mb-4">Hot Wheels</Link></li>
                            <li><Link href="/brands/fisher-price" className="block text-[18px] font-normal not-italic leading-[24px] text-[#252323] hover:text-accent transition capitalize mb-4">Fisher-Price</Link></li>
                          </ul>
                        </div>

                        {/* LEGO Column */}
                        <div className="px-8 border-r border-[#E8E8E8]">
                          <h3 className="text-[#F44535] font-semibold mb-4">LEGO</h3>
                          <ul className="space-y-2">
                            {category.slug === 'brandet' ? (
                              mockCategories[3].children[3].subItems?.map((item) => (
                                <li key={item.id}>
                                  <Link
                                    href={`/brands/${item.slug}`}
                                    className="block text-[18px] font-normal not-italic leading-[24px] text-[#252323] hover:text-accent transition capitalize mb-4"
                                  >
                                    {item.name}
                                  </Link>
                                </li>
                              ))
                            ) : (
                              <>
                                <li><Link href="/brands/lego-city" className="block text-[18px] font-normal not-italic leading-[24px] text-[#252323] hover:text-accent transition capitalize mb-4">City</Link></li>
                                <li><Link href="/brands/lego-duplo" className="block text-[18px] font-normal not-italic leading-[24px] text-[#252323] hover:text-accent transition capitalize mb-4">Duplo</Link></li>
                                <li><Link href="/brands/lego-friends" className="block text-[18px] font-normal not-italic leading-[24px] text-[#252323] hover:text-accent transition capitalize mb-4">Friends</Link></li>
                                <li><Link href="/brands/lego-ninjago" className="block text-[18px] font-normal not-italic leading-[24px] text-[#252323] hover:text-accent transition capitalize mb-4">Ninjago</Link></li>
                              </>
                            )}
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
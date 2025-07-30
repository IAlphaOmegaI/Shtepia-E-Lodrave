import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import { CategoryService } from '@/services';
import { Routes } from '@/config/routes';
import type { Category } from '@/types';

const stripesSVG = (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 413 184"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="absolute inset-0 w-full h-full z-0"
    style={{ pointerEvents: 'none' }}
  >
    <g opacity="0.4">
      <path d="M413 4.34899L390.402 26.9566L367.302 3.80985L344.346 26.8128L317.587 0L290.327 27.28L263.317 0.215644L237.276 26.3096L211.163 0.143772L184.404 26.9925L158.758 1.32985L132.573 27.5676L105.528 0.503187L78.9485 27.1363L52.5845 0.718844L26.2564 27.1003L0 0.790716V9.95596L26.2564 36.3015L52.5845 9.92001L78.9485 36.3374L105.528 9.66841L132.573 36.7687L158.758 10.4951L184.404 36.1937L211.163 9.34493L237.276 35.4748L263.317 9.41682L290.327 36.4812L317.587 9.16523L344.346 36.014L367.302 13.011L390.402 36.1577L413 13.5142V4.34899Z" fill="#4885EE" />
      <path d="M413 41.1178L390.402 63.7613L367.302 40.6146L344.346 63.6175L317.587 36.7688L290.327 64.0848L263.317 37.0204L237.276 63.1143L211.163 36.9485L184.404 63.7973L158.758 38.1346L132.573 64.3723L105.528 37.3079L78.9485 63.941L52.5845 37.5236L26.2564 63.9051L0 37.5955V46.7607L26.2564 73.1062L52.5845 46.7248L78.9485 73.1062L105.528 46.4732L132.573 73.5735L158.758 47.2998L184.404 72.9984L211.163 46.1497L237.276 72.2796L263.317 46.1856L290.327 73.286L317.587 45.97L344.346 72.8187L367.302 49.8158L390.402 72.9265L413 50.319V41.1178Z" fill="#4885EE" />
      <path d="M413 77.9225L390.402 100.566L367.302 77.4193L344.346 100.422L317.587 73.5735L290.327 100.889L263.317 73.8251L237.276 99.8831L211.163 73.7532L184.404 100.602L158.758 74.9033L132.573 101.177L105.528 74.0767L78.9485 100.746L52.5845 74.3283L26.2564 100.71L0 74.3642V83.5654L26.2564 109.875L52.5845 83.4935L78.9485 109.911L105.528 83.2778L132.573 110.378L158.758 84.1045L184.404 109.767L211.163 82.9544L237.276 109.084L263.317 82.9903L290.327 110.055L317.587 82.7746L344.346 109.623L367.302 86.5845L390.402 109.731L413 87.1236V77.9225Z" fill="#4885EE" />
      <path d="M413 114.727L390.402 137.335L367.302 114.224L344.346 137.227L317.587 110.378L290.327 137.694L263.317 110.594L237.276 136.688L211.163 110.558L184.404 137.407L158.758 111.708L132.573 137.982L105.528 110.881L78.9485 137.514L52.5845 111.133L26.2564 137.514L0 111.169V120.37L26.2564 146.68L52.5845 120.298L78.9485 146.716L105.528 120.083L132.573 147.147L158.758 120.909L184.404 146.572L211.163 119.723L237.276 145.889L263.317 119.795L290.327 146.859L317.587 119.579L344.346 146.392L367.302 123.389L390.402 146.536L413 123.892V114.727Z" fill="#4885EE" />
      <path d="M413 151.496L390.402 174.104L367.302 150.957L344.346 173.996L317.587 147.147L290.327 174.427L263.317 147.363L237.276 173.457L211.163 147.327L184.404 174.139L158.758 148.477L132.573 174.75L105.528 147.65L78.9485 174.283L52.5845 147.866L26.2564 174.247L0 147.938V157.139L26.2564 183.448L52.5845 157.067L78.9485 183.484L105.528 156.851L132.573 183.916L158.758 157.678L184.404 183.341L211.163 156.492L237.276 182.658L263.317 156.564L290.327 183.628L317.587 156.312L344.346 183.161L367.302 160.158L390.402 183.305L413 160.661V151.496Z" fill="#4885EE" />
    </g>
  </svg>
);


const cardBgColors = [
  '#1A66EA', // 1st
  '#36AB67', // 2nd
  '#F387AB', // 3rd
  '#F5B971', // 4th (orange/yellow)
  '#7B61FF', // 5th (purple)
  '#FFB4A2', // 6th (peach)
];

const FeaturedCategories = async () => {
  // Fetch featured categories from API
  const categories = await CategoryService.getFeaturedCategories();
  
  // If no categories, return null
  if (!categories || categories.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-[#FFF8EC] py-40">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
          {categories.slice(0, 6).map((cat, idx) => (
            <div
              key={cat.id}
              style={{
                backgroundColor: cardBgColors[idx % cardBgColors.length],
              }}
              className="relative flex items-center rounded-2xl shadow-lg w-full h-[200px] overflow-hidden"
            >
              <Link
                href={Routes.category(cat.slug)}
                className="absolute inset-0 z-20"
              />
              {/* SVG background stripes */}
              <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
                {stripesSVG}
              </div>
              {/* Category image */}
              <Image
                src={cat.featured_image || "/featured_category.png"}
                alt={cat.name}
                width={230}
                height={230}
                className="absolute w-[230px] h-[230px] object-contain left-0 bottom-0 top-[-30px] z-10"
              />
              {/* Category name */}
              <div className="flex-1 flex items-center justify-end h-full z-10 pr-10 ">
                <span className="text-white text-3xl font-bold  px-4 py-2 rounded-xl font-grandstander font-extrabol max-w-[170px] capitalize">
                  {cat.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedCategories;
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FacebookIcon } from '@/components/icons/social/facebook';
import { InstagramIcon } from '@/components/icons/social/instagram';
import { MapPin } from '@/components/icons/map-pin';
import { PhoneIcon } from '@/components/icons/phone';

export default function Footer() {
  return (
    <footer className="relative mt-auto">
      {/* Cloud SVG Background */}
      <div className="relative inset-x-0 bottom-0 w-full h-[141px] overflow-hidden">
        <Image
          src="/cloud_footer.svg"
          alt=""
          width={1440}
          height={141}
          className="w-full h-full object-cover object-bottom"
          priority
        />
      </div>
      
      {/* Footer Content */}
      <div className="relative z-10 bg-[#F44535] px-8 pt-16 pb-8 lg:pb-8 pb-24">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-white">
            {/* Logo and Description */}
            <div className="space-y-4">
              <div className="w-[180px]">
                <Image
                  src="/assets/logo.png"
                  alt="Shtëpia e Lodrave"
                  width={180}
                  height={60}
                  className="w-full h-auto"
                />
              </div>
              <p className="text-sm leading-relaxed">
                Lorem ipsu mnnmdsfknksdjnnxmcxvxcnvnskjndkjsn
                kdnjsjndjsndknsdkjnskdnj
              </p>
            </div>
            
            {/* Brands Column 1 */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Brands</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:underline transition-all">
                    Brand
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline transition-all">
                    Brand
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Brands Column 2 */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Brands</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:underline transition-all">
                    Brand
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline transition-all">
                    Brand
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Contact Info */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Na Kontaktoni</h3>
              <ul className="space-y-3">
                <li>
                  <a href="tel:+35569206465" className="flex items-center gap-2 hover:underline">
                    <PhoneIcon className="w-4 h-4" />
                    <span>+355 69 2066 465</span>
                  </a>
                </li>
                <li>
                  <Link href="/our-stores" className="flex items-center gap-2 hover:underline">
                    <MapPin className="w-4 h-4" />
                    <span>Our stores</span>
                  </Link>
                </li>
              </ul>
              
              {/* Social Links */}
              <div className="mt-6">
                <h4 className="text-lg font-medium mb-3">Follow us</h4>
                <div className="flex gap-3">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center   transition-all"
                    aria-label="Facebook"
                  >
                    <FacebookIcon className="w-5 h-5" />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10flex items-center justify-center  transition-all"
                    aria-label="Instagram"
                  >
                    <InstagramIcon className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
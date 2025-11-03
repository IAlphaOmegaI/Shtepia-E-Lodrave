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
      <div className="relative z-10 bg-[#F44535] px-8 pt-16 pb-24 lg:pb-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-white">
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
              <p className="text-md leading-relaxed">
                Nga lodrat edukative deri tek surprizat më argëtuese, Shtepia e Lodrave është vendi ku fëmijët zbulojnë botën e fantazisë. Loja fillon këtu!
              </p>
            </div>

            {/* INFO Column */}
            <div>
              <h3 className="text-xl font-semibold mb-4">INFO</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/rreth-nesh"
                    className="hover:underline transition-all"
                  >
                    Rreth nesh
                  </Link>
                </li>
                <li>
                  <Link
                    // href="/impressum"
                    href="https://shtepiaelodrave.al/impressum"
                    className="hover:underline transition-all"
                  >
                    Impressum
                  </Link>
                </li>
              </ul>
            </div>

            {/* NDIHMË Column */}
            <div>
              <h3 className="text-xl font-semibold mb-4">NDIHMË</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/si-te-blini"
                    className="hover:underline transition-all"
                  >
                    Si të blini
                  </Link>
                </li>
                <li>
                  <Link
                    // href="/help"
                    href="https://shtepiaelodrave.al/faq"
                    className="hover:underline transition-all"
                  >
                    Pyetje të shpeshta
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:underline transition-all"
                  >
                    Kontakt
                  </Link>
                </li>
              </ul>
            </div>

            {/* LIGJORE Column */}
            <div>
              <h3 className="text-xl font-semibold mb-4">LIGJORE</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/terms"
                    className="hover:underline transition-all"
                  >
                    Termat e përdorimit
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:underline transition-all"
                  >
                    Politikat e privatësisë
                  </Link>
                </li>
                <li>
                  <Link
                    // href="/cookies"
                    href="https://shtepiaelodrave.al/cookies"
                    className="hover:underline transition-all"
                  >
                    Përdorimi i cookies
                  </Link>
                </li>
                <li>
                  <Link
                    // href="/customer-refund-policies"
                    href="https://shtepiaelodrave.al/return-policy"
                    className="hover:underline transition-all"
                  >
                    Politikat e kthimit
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
                  <Link href="/stores" className="flex items-center gap-2 hover:underline">
                    <MapPin className="w-4 h-4" />
                    <span>Dyqanet tona</span>
                  </Link>
                </li>
              </ul>

              {/* Social Links */}
              <div className="mt-6">
                <h4 className="text-lg font-medium mb-3">Follow us</h4>
                <div className="flex gap-3">
                  <a
                    href="https://www.facebook.com/profile.php?id=100057516696717"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center   transition-all"
                    aria-label="Facebook"
                  >
                    <FacebookIcon className="w-5 h-5" />
                  </a>
                  <a
                    href="https://www.instagram.com/shtepia_e_lodrave/?hl=en"
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
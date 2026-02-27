import Image from "next/image";
import NewProducts1Image from "../../../public/home/new-products-1.png";
import NewProducts2Image from "../../../public/home/new-products-2.png";
import NewProducts1MobileImage from "../../../public/home/new-products-1-mobile.png";
import NewProducts2MobileImage from "../../../public/home/new-products-2-mobile.png";
import NewProductsCloud from "../../../public/home/new-products-cloud.png";
import LegoImage from "../../../public/home/lego.svg";
import BarbieImage from "../../../public/home/barbie.svg";
import CoolClubImage from "../../../public/home/cool-club.svg";
import HasbroImage from "../../../public/home/hasbro.svg";
import PlayDogImage from "../../../public/home/play-doh.svg";
import NerfImage from "../../../public/home/nerf.svg";
import Link from "next/link";

export const NewProducts = () => {
  return (
    <div className="">
          <div className="bg-[hsl(217,84%,95%)] md:pb-12 flex flex-col gap-6 md:gap-8 relative overflow-hidden pb-10 sm:pb-20">
        {/* Mobile: decorative confetti in top corners */}
        <Image
          src={NewProducts1MobileImage}
          alt=""
          aria-hidden
          className="sm:hidden absolute w-[80px] -top-1 pointer-events-none"
        />
        <Image
          src={NewProducts2MobileImage}
          alt=""
          aria-hidden
          className="sm:hidden absolute -top-1 right-0 w-[80px] pointer-events-none"
        />

        {/* Header: centered on mobile, three-column on sm+ */}
        <div className="flex justify-center sm:justify-between overflow-hidden pt-8 sm:pt-16 lg:pt-0">
          <Image
            src={NewProducts1Image}
            alt=""
            aria-hidden
            className="hidden sm:block max-w-[400px] max-h-[200px] shrink-0"
          />
          <div className="self-center flex flex-col items-center mx-0 sm:mx-4">
            <h1
              className="text-white text-center font-grandstander grow text-[32px] xs:text-[36px] sm:text-[40px] md:text-[50px] font-black leading-tight sm:leading-[60px] max-w-[90vw] sm:max-w-none"
              style={{
                WebkitTextStrokeWidth: '2.5px',
                WebkitTextStrokeColor: 'blue',
              }}
            >
              Produktet e reja
            </h1>
          </div>
          <Image
            src={NewProducts2Image}
            alt=""
            aria-hidden
            className="hidden sm:block max-w-[400px] max-h-[200px] shrink-0"
          />
        </div>
        <div className="px-3 sm:px-4">
        <div className="max-w-[720px] mx-auto grid grid-cols-3 grid-rows-2 md:grid-cols-4 md:grid-rows-2 md:max-h-[388px] gap-2 sm:gap-3">
          <Link href="/brands/lego" className="flex aspect-square md:col-span-2 md:aspect-auto overflow-hidden rounded-xl">
            <Image src={LegoImage} alt="Lego" className="size-full object-cover rounded-xl" />
          </Link>
          <Link href="/brands/cool-club" className="flex aspect-square md:aspect-auto overflow-hidden rounded-xl">
            <Image src={CoolClubImage} alt="Cool Club" className="size-full object-cover rounded-xl" />
          </Link>
          <Link href="/brands/ner" className="flex aspect-square md:aspect-auto overflow-hidden rounded-xl">
            <Image src={NerfImage} alt="Transformers" className="size-full object-cover rounded-xl" />
          </Link>
          <Link href="/brands/hasbro" className="flex aspect-square md:aspect-auto overflow-hidden rounded-xl">
            <Image src={HasbroImage} alt="Hot Wheels" className="size-full object-cover rounded-xl" />
          </Link>
          <Link href="/brands/brb" className="flex aspect-square md:aspect-auto overflow-hidden rounded-xl">
            <Image src={BarbieImage} alt="Monopoly" className="size-full object-cover rounded-xl" />
          </Link>
          <Link href="/brands/pd" className="flex aspect-square md:col-span-2 md:aspect-auto overflow-hidden rounded-xl">
            <Image src={PlayDogImage} alt="Barbie" className="size-full object-cover rounded-xl" />
          </Link>
        </div>
        </div>
      </div>
      {/* <Image
        src={NewProductsCloud}
        alt="New Products 2"
        className="w-full min-h-20"
      /> */}
    </div>
  );
}
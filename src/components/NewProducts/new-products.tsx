import Image from "next/image";
import NewProducts1Image from "../../../public/home/new-products-1.png";
import NewProducts2Image from "../../../public/home/new-products-2.png";
import NewProductsCloud from "../../../public/home/new-products-cloud.png";
import LegoImage from "../../../public/home/lego.png";
import BarbieImage from "../../../public/home/barbie.png";
import MonopolyImage from "../../../public/home/monopoly.png";
import TransformersImage from "../../../public/home/transformers.png";
import CartersImage from "../../../public/home/carters.png";
import HotWheelsImage from "../../../public/home/hotwheels.png";
import Link from "next/link";

export const NewProducts = () => {
  return (
    <div className="">
      <div className="flex justify-center sm:justify-between items-end overflow-hidden bg-[hsl(217,84%,95%)] pt-16 sm:pt-0 px-2 sm:px-0">
        <Image
          src={NewProducts1Image}
          alt="New Products 1"
          className="hidden sm:block max-w-[450px] shrink-0"
        />
        <h1
          className="text-white text-center pb-10 sm:pb-0 font-grandstander mx-2 sm:mx-4 grow text-[40px] md:text-[50px] font-black leading-tight sm:leading-[60px]"
          style={{
            WebkitTextStrokeWidth: "3px",
            WebkitTextStrokeColor: "blue",
          }}
        >
          Produkte të reja
        </h1>
        <Image
          src={NewProducts2Image}
          alt="New Products 2"
          className="hidden sm:block max-w-[450px] shrink-0"
        />
      </div>
      <div className="bg-[hsl(217,84%,95%)] pt-4 sm:pt-8 px-3 sm:px-4">
        <div className="max-w-[720px] mx-auto md:max-h-[388px] grid grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-2 sm:gap-3">
          <Link href="/brands/lego" className="flex col-span-2 aspect-[2/1] md:aspect-auto overflow-hidden rounded-xl">
            <Image src={LegoImage} alt="Lego" className="size-full object-cover rounded-xl" />
          </Link>
          <Link href="/brands/carters" className="flex aspect-square md:aspect-auto overflow-hidden rounded-xl">
            <Image src={CartersImage} alt="Carters" className="size-full object-cover rounded-xl" />
          </Link>
          <Link href="/brands/dexy" className="flex aspect-square md:aspect-auto overflow-hidden rounded-xl">
            <Image src={TransformersImage} alt="Transformers" className="size-full object-cover rounded-xl" />
          </Link>
          <Link href="/brands/hotwheels" className="flex aspect-square md:aspect-auto overflow-hidden rounded-xl">
            <Image src={HotWheelsImage} alt="Hot Wheels" className="size-full object-cover rounded-xl" />
          </Link>
          <Link href="/brands/games" className="flex aspect-square md:aspect-auto overflow-hidden rounded-xl">
            <Image src={MonopolyImage} alt="Monopoly" className="size-full object-cover rounded-xl" />
          </Link>
          <Link href="/brands/brb" className="flex col-span-2 aspect-[2/1] md:aspect-auto overflow-hidden rounded-xl">
            <Image src={BarbieImage} alt="Barbie" className="size-full object-cover rounded-xl" />
          </Link>
        </div>
      </div>
      <Image
        src={NewProductsCloud}
        alt="New Products 2"
        className="w-full min-h-20"
      />
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/store/quick-cart/cart.context";
import { useWishlist } from "@/framework/rest/wishlist";
import { Product } from "@/types/product.types";
import { ArrowDownIcon } from "@/components/icons";
import { HeartIcon } from "@/components/icons/heart";
import Counter from "@/components/ui/counter";
import Button from "@/components/ui/button";
import { useToast } from "@/contexts/toast-context";

import { ShoppingCartIcon, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, FreeMode, Keyboard } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/free-mode";

interface ProductDetailsProps {
  product: Product;
}

// Helper function to get full image URL
const getImageUrl = (path: string) => {
  if (!path) return '/placeholder.jpg';
  
  // If path already has http/https, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // For relative paths starting with /, prepend the API base URL
  if (path.startsWith('/')) {
    return `https://api.shtepialodrave.com${path}`;
  }
  
  // For paths without leading slash, add it
  return `https://api.shtepialodrave.com/${path}`;
};

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);
  const [isSpecsOpen, setIsSpecsOpen] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  // Combine main image with gallery images
  const productImages = [];
  
  // Add main image first
  if (product.image) {
    productImages.push({
      id: 'main',
      original: getImageUrl(product.image),
      thumbnail: getImageUrl(product.image)
    });
  }
  
  // Add gallery images
  if (product.gallery && product.gallery.length > 0) {
    product.gallery.forEach(img => {
      productImages.push({
        id: img.id,
        original: getImageUrl(img.original),
        thumbnail: getImageUrl(img.thumbnail)
      });
    });
  }

  const images = productImages;
  const hasImages = images.length > 0;

  // Calculate prices and discount
  const originalPrice = parseFloat(product.price || "0");
  const salePrice = product.sale_price
    ? parseFloat(product.sale_price)
    : originalPrice;

  const handleAddToCart = () => {
    const priceValue = product.sale_price
      ? parseFloat(product.sale_price)
      : parseFloat(product.price);
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      image: getImageUrl(product.image),
      price: priceValue,
      quantity: quantity,
    });
    
    // Show success toast
    showToast(`${product.name} u shtua në shportë!`, 'success');
  };

  const handleToggleWishlist = () => {
    const isInList = isInWishlist(product.id);
    
    if (isInList) {
      removeFromWishlist(product.id);
      showToast(`${product.name} u hoq nga lista e dëshirave!`, 'info');
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: salePrice,
        image: getImageUrl(product.image),
        slug: product.slug,
        brand: product.brand,
      });
      showToast(`${product.name} u shtua në listën e dëshirave!`, 'success');
    }
  };
  const hasDiscount = salePrice < originalPrice;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
    : 0;

  // Handle Escape key to close lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLightboxOpen) {
        setIsLightboxOpen(false);
      }
    };

    if (isLightboxOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLightboxOpen]);


  return (
    <>
      <style jsx global>{`
        .swiper-slide-thumb-active .swiper-thumb-item {
          border-color: #1a66ea !important;
        }

        .swiper-button-prev,
        .swiper-button-next {
          color: #f11602 !important;
          background: white;
          width: 48px !important;
          height: 48px !important;
          border-radius: 50%;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .swiper-button-prev:hover,
        .swiper-button-next:hover {
          color: #d11402 !important;
        }

        .swiper-button-prev:after,
        .swiper-button-next:after {
          font-size: 20px !important;
          font-weight: bold;
        }
      `}</style>
      <div className="max-w-7xl mx-auto bg-white rounded-lg p-6">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left side - Image Gallery */}
          <div className="flex-1">
            {/* Mobile Layout */}
            <div className="block lg:hidden">
              {/* Main image - Full width on mobile */}
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-50 border border-gray-200 mb-4">
                {hasImages ? (
                  <>
                    <Image
                      src={images[selectedImage].original}
                      alt={product.name}
                      fill
                      className="object-contain p-4 sm:p-8"
                    />
                    <button
                      onClick={() => {
                        setLightboxIndex(selectedImage);
                        setIsLightboxOpen(true);
                      }}
                      className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M15 3h4a2 2 0 0 1 2 2v4M9 21H5a2 2 0 0 1-2-2v-4M21 9v6M3 15V9M15 21h4a2 2 0 0 0 2-2v-4M9 3H5a2 2 0 0 0-2 2v4" />
                      </svg>
                    </button>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg
                      className="w-20 h-20"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Thumbnails - Horizontal scroll on mobile - Only show if there are images */}
              {hasImages && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {/* Show first 4 images as thumbnails */}
                  {images
                    .slice(0, Math.min(4, images.length))
                    .map((image, index) => (
                      <button
                        key={image.id}
                        onClick={() => setSelectedImage(index)}
                        className={`relative w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                          selectedImage === index
                            ? "border-[#1A66EA]"
                            : "border-gray-200"
                        }`}
                      >
                        <Image
                          src={image.thumbnail}
                          alt={`${product.name} ${index + 1}`}
                          fill
                          className="object-contain p-2"
                        />
                      </button>
                    ))}
                  {/* Show +X button if there are more than 4 images */}
                  {images.length > 4 && (
                    <button
                      onClick={() => {
                        setLightboxIndex(4);
                        setIsLightboxOpen(true);
                      }}
                      className={`relative w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                        selectedImage >= 4
                          ? "border-[#1A66EA]"
                          : "border-gray-200"
                      } bg-gray-100 flex items-center justify-center hover:bg-gray-200`}
                    >
                      <span className="text-xl sm:text-2xl font-bold text-gray-600">
                        +{images.length - 4}
                      </span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:flex gap-4">
              {/* Thumbnail column - Only show if there are images */}
              {hasImages && (
                <div className="flex flex-col gap-3">
                  {/* Show first 4 images as thumbnails */}
                  {images
                    .slice(0, Math.min(4, images.length))
                    .map((image, index) => (
                      <button
                        key={image.id}
                        onClick={() => setSelectedImage(index)}
                        className={`relative w-[110px] h-[110px] rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === index
                            ? "border-[#1A66EA]"
                            : "border-gray-200"
                        }`}
                      >
                        <Image
                          src={image.thumbnail}
                          alt={`${product.name} ${index + 1}`}
                          fill
                          className="object-contain p-2"
                        />
                      </button>
                    ))}
                  {/* Show +X button if there are more than 4 images */}
                  {images.length > 4 && (
                    <button
                      onClick={() => {
                        setLightboxIndex(4);
                        setIsLightboxOpen(true);
                      }}
                      className={`relative w-[110px] h-[110px] rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage >= 4
                          ? "border-[#1A66EA]"
                          : "border-gray-200"
                      } bg-gray-100 flex items-center justify-center hover:bg-gray-200`}
                    >
                      <span className="text-2xl font-bold text-gray-600">
                        +{images.length - 4}
                      </span>
                    </button>
                  )}
                </div>
              )}

              {/* Main image */}
              <div className="flex-1">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-50 border border-gray-200">
                  {hasImages ? (
                    <>
                      <Image
                        src={images[selectedImage].original}
                        alt={product.name}
                        fill
                        className="object-contain p-8"
                      />
                      <button
                        onClick={() => {
                          setLightboxIndex(selectedImage);
                          setIsLightboxOpen(true);
                        }}
                        className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M15 3h4a2 2 0 0 1 2 2v4M9 21H5a2 2 0 0 1-2-2v-4M21 9v6M3 15V9M15 21h4a2 2 0 0 0 2-2v-4M9 3H5a2 2 0 0 0-2 2v4" />
                        </svg>
                      </button>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg
                        className="w-20 h-20"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Product Info */}
          <div className="border border-gray-200 rounded-lg w-full lg:max-w-[462px] lg:flex-shrink-0 h-fit">
            <div className="p-6 pb-0">
              {product.categories && product.categories.length > 0 && (
                <Link
                  href={`/category/${product.categories[0].slug}`}
                  className="text-[#777] text-sm font-medium mb-2 hover:text-[#1A66EA] underline transition-colors inline-block capitalize"
                >
                  {product.categories[0].name}
                </Link>
              )}

              <h1 className="text-[32px] font-bold text-[#252323] mb-6 font-albertsans">
                {product.name}
              </h1>

              <div className="mb-8 text-center sm:text-left">
                {hasDiscount && (
                  <div className="text-[#C1C1C1] line-through text-[20px] font-normal font-albertsans mb-1">
                    {originalPrice.toFixed(0)} Lekë
                  </div>
                )}
                <div className="flex items-center sm:flex-row flex-col gap-4">
                  <span className="text-[36px] font-bold text-[#1A66EA] font-albertsans">
                    {salePrice.toFixed(0)} Lekë
                  </span>
                  {hasDiscount && (
                    <span className="bg-[#D1E0FB] text-[#1A66EA] px-5 py-2 rounded-[40px] text-[18px] font-semibold font-albertsans">
                      {discountPercentage}% OFF
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center border border-[#E5E5E5] rounded-[8px] bg-[#F8F8F8]">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-4 py-3 hover:bg-gray-200 transition-colors text-[24px] font-medium text-[#666]"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-6 font-medium text-[20px] text-[#252323] font-albertsans min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity((q) => Math.min(q + 1, product.quantity))
                    }
                    className="px-4 py-3 hover:bg-gray-200 transition-colors text-[24px] font-medium text-[#666]"
                    disabled={quantity >= product.quantity}
                  >
                    +
                  </button>
                </div>

                {/* <span className="text-[#777] text-[16px] font-albertsans">
                  ({product.quantity} copë në dispozicion)
                </span> */}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-center ">
                <button
                  onClick={handleAddToCart}
                 
                  className="cursor-pointer flex-1 bg-[#FEBC1B] hover:bg-[#FEB000] text-[#252323] font-semibold py-4 px-8 rounded-[8px] transition-colors flex items-center justify-center gap-3 text-[18px] font-albertsans h-[56px]"
                >
                  <ShoppingCartIcon className="w-5 h-5 text-[#252323]" />
                  Shtoje në shportë
                </button>

                <button
                  onClick={handleToggleWishlist}
                  className={`p-3 border-2 rounded-[50px] transition-all w-[56px] h-[56px] flex items-center justify-center ${
                    isInWishlist(product.id)
                      ? "bg-[#F11602] border-[#F11602] hover:bg-red-600"
                      : "border-[#F11602] hover:bg-red-50"
                  }`}
                >
                  <HeartIcon
                    className={`w-7 h-7 transition-colors ${
                      isInWishlist(product.id) ? "text-white" : "text-[#F11602]"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-gray-100  p-4 space-y-3 px-7 mt-10">
              <div className="flex items-center gap-3 ">
                <svg
                  className="w-5 h-5 text-[#666]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                  />
                </svg>
                <span className="text-[15px] text-[#555] font-albertsans font-medium">
                  Dërgohet në të gjithë Shqipërinë
                </span>
              </div>
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-[#666]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-[15px] text-[#555] font-albertsan font-medium">
                  Dorëzimi i parashikuar: 3-5 ditë pune
                </span>
              </div>
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-[#666]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                  />
                </svg>
                <span className="text-[15px] text-[#555] font-albertsans font-medium">
                  Kostoja e transportit llogaritet në arkë
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* About this item section */}
        <div className="mt-12">
          <h2 className="text-[24px] font-bold text-[#252323] mb-6 font-albertsans">
            Informacione shtesë
          </h2>

          {/* Description */}
          {product.description && (
            <div className="border-t border-gray-200">
              <button
                className="w-full py-4 flex items-center justify-between text-left"
                onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
              >
                <span className="font-semibold text-[#252323] text-[18px] font-albertsans">
                  Përshkrimi
                </span>
                <ArrowDownIcon
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    isDescriptionOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isDescriptionOpen && (
                <div className="pb-6 text-gray-600 space-y-4">
                  <p>{product.description}</p>
                </div>
              )}
            </div>
          )}

          {/* Specifications */}
          <div className="border-t border-gray-200">
            <button
              className="w-full py-4 flex items-center justify-between text-left"
              onClick={() => setIsSpecsOpen(!isSpecsOpen)}
            >
              <span className="font-semibold text-[#252323] text-[18px] font-albertsans">
                Detajet Teknike
              </span>
              <ArrowDownIcon
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  isSpecsOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isSpecsOpen && (
              <div className="pb-6 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                {product.brand?.name && (
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-[#777] text-[14px] font-albertsans">
                      Marka:
                    </span>
                    <span className="text-[#252323] text-[14px] font-albertsans">
                      {product.brand.name}
                    </span>
                  </div>
                )}

                {product.height && (
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-[#777] text-[14px] font-albertsans">
                      Lartësia:
                    </span>
                    <span className="text-[#252323] text-[14px] font-albertsans">
                      {product.height} cm
                    </span>
                  </div>
                )}

                {product.categories && product.categories.length > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-[#777] text-[14px] font-albertsans">
                      Linja:
                    </span>
                    <span className="text-[#252323] text-[14px] font-albertsans">
                      {product.categories[0].name}
                    </span>
                  </div>
                )}

                {product.width && (
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-[#777] text-[14px] font-albertsans">
                      Gjerësia:
                    </span>
                    <span className="text-[#252323] text-[14px] font-albertsans">
                      {product.width} cm
                    </span>
                  </div>
                )}

                {product.code && (
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-[#777] text-[14px] font-albertsans">
                      Modeli:
                    </span>
                    <span className="text-[#252323] text-[14px] font-albertsans">
                      {product.code}
                    </span>
                  </div>
                )}

                {product.length && (
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-[#777] text-[14px] font-albertsans">
                      Gjatësia:
                    </span>
                    <span className="text-[#252323] text-[14px] font-albertsans">
                      {product.length} cm
                    </span>
                  </div>
                )}

                {product.age_range && (
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-[#777] text-[14px] font-albertsans">
                      Mosha minimale e rekomanduar:
                    </span>
                    <span className="text-[#252323] text-[14px] font-albertsans">
                      {product.age_range} vjeç
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Lightbox Gallery */}
        {isLightboxOpen && hasImages && (
          <div className="fixed inset-0 z-50 bg-black/50">
            {/* Fullscreen wrapper with padding */}
            <div className="relative w-full h-full bg-white">
              {/* Close button */}
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-6 right-6 z-50 p-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <X className="w-8 h-8" />
              </button>

              <div className="flex flex-col h-full p-8">
                {/* Main Swiper */}
                <div className="flex-1 relative">
                  <Swiper
                    modules={[Navigation, Thumbs, Keyboard]}
                    navigation={true}
                    keyboard={{
                      enabled: true,
                      onlyInViewport: false,
                    }}
                    thumbs={{
                      swiper:
                        thumbsSwiper && !thumbsSwiper.destroyed
                          ? thumbsSwiper
                          : null,
                    }}
                    initialSlide={lightboxIndex}
                    className="h-full"
                  >
                    {images.map((image, index) => (
                      <SwiperSlide key={image.id}>
                        <div className="relative w-full h-full flex items-center justify-center">
                          <Image
                            src={image.original}
                            alt={`${product.name} ${index + 1}`}
                            fill
                            className="object-contain"
                            sizes="100vw"
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                {/* Thumbnails Swiper at Bottom */}
                <div className="h-[118px] mt-4">
                  <Swiper
                    onSwiper={setThumbsSwiper}
                    modules={[FreeMode, Thumbs]}
                    spaceBetween={10}
                    slidesPerView="auto"
                    freeMode={true}
                    watchSlidesProgress={true}
                    initialSlide={lightboxIndex}
                    className="h-full px-4"
                  >
                    {images.map((image, index) => (
                      <SwiperSlide
                        key={image.id}
                        className="!w-[118px] !h-[118px] cursor-pointer"
                      >
                        <div className="swiper-thumb-item relative w-[118px] h-[118px] rounded-md overflow-hidden border-2 border-gray-300 transition-all">
                          <Image
                            src={image.thumbnail}
                            alt={`${product.name} thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="118px"
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

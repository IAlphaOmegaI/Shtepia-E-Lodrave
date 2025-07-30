import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDetailsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto bg-white rounded-lg p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left side - Image Gallery Skeleton */}
        <div className="flex gap-4">
          {/* Thumbnail column */}
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="w-[110px] h-[110px] rounded-lg" />
            ))}
          </div>

          {/* Main image */}
          <div className="flex-1">
            <Skeleton className="aspect-square rounded-lg" />
          </div>
        </div>

        {/* Right side - Product Info Skeleton */}
        <div className="flex flex-col">
          <Skeleton className="h-5 w-20 mb-2" />
          <Skeleton className="h-8 w-3/4 mb-4" />
          
          {/* Price */}
          <Skeleton className="h-6 w-24 mb-2" />
          <div className="flex items-center gap-3 mb-6">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-8 w-20 rounded-full" />
          </div>

          {/* Quantity and buttons */}
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-5 w-28" />
          </div>

          <div className="flex gap-4 mb-8">
            <Skeleton className="h-[52px] flex-1" />
            <Skeleton className="h-[52px] w-[52px]" />
          </div>

          {/* Shipping info */}
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <Skeleton className="h-4 w-48" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About section skeleton */}
      <div className="mt-12">
        <Skeleton className="h-8 w-40 mb-6" />
        
        {/* Description */}
        <div className="border-t border-gray-200">
          <div className="py-4">
            <Skeleton className="h-6 w-32" />
          </div>
        </div>

        {/* Specifications */}
        <div className="border-t border-gray-200">
          <div className="py-4">
            <Skeleton className="h-6 w-36" />
          </div>
        </div>
      </div>
    </div>
  );
}
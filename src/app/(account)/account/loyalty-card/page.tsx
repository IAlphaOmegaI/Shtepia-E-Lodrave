'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import Image from 'next/image';
import { format } from 'date-fns';
import { sq } from 'date-fns/locale';

interface LoyaltyPoint {
  from_order: string;
  points: number;
  used: boolean;
  expiry: string;
  created_at: string;
  is_expired: boolean;
}

interface UserData {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  user_points: number;
  loyalty_points: LoyaltyPoint[];
}

export default function LoyaltyCardPage() {
  const { data: userData, isLoading } = useQuery<UserData>({
    queryKey: ['user', 'me'],
    queryFn: () => api.auth.me(),
  });

  const points = userData?.user_points || 0;
  const loyaltyPoints = userData?.loyalty_points || [];
  const hasPoints = points > 0;

  // Sort loyalty points by date (newest first)
  const sortedLoyaltyPoints = [...loyaltyPoints].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Count total orders
  const totalOrders = loyaltyPoints.length;

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-48 bg-gray-200 rounded-lg"></div>
          <div className="h-32 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Original Loyalty Card Design */}
      <div className="min-h-[400px] md:min-h-[600px] bg-[#FEC949] rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Left illustration */}
          <Image
            src="/pageHeader_Illustration_Left.svg"
            alt=""
            width={400}
            height={400}
            className="absolute top-0 left-0 w-32 sm:w-48 md:w-64 lg:w-80 xl:w-96 h-auto"
          />

          {/* Right illustration */}
          <Image
            src="/pageHeader_Illustration_Right.svg"
            alt=""
            width={400}
            height={400}
            className="absolute top-0 right-0 w-32 sm:w-48 md:w-64 lg:w-80 xl:w-96 h-auto"
          />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[64px] font-bold text-[#F11602] text-center mb-6 sm:mb-8 md:mb-12 lg:mb-16 font-grandstander font-extrabold"
            style={{
              letterSpacing: "-3px",
              WebkitTextStroke: "2px #fff",
            }}
          >
            Karta e besnikërisë
          </h1>
          {/* Card */}
          <div className="bg-[#F11602] rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 pb-12 sm:pb-16 md:pb-20 shadow-2xl max-w-5xl mx-auto relative">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8 mx-auto max-w-xl">
              {/* Gift icon with progress */}
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 flex-shrink-0">
                <Image
                  src="/cart_progress.svg"
                  alt=""
                  width={225}
                  height={225}
                  className="w-full h-full"
                />
              </div>

              {/* Points display */}
              <div className="text-center md:text-left">
                <div 
                  className="text-[#FEC949] text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold font-grandstander mb-2" 
                  style={{
                    fontWeight: "900 !important",
                    letterSpacing: "-3px",
                    WebkitTextStroke: "2px #fff",
                  }}
                >
                  {points.toFixed(0)} pts
                </div>
                <p className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-albertsans max-w-xs sm:max-w-sm md:max-w-md mx-auto md:mx-0">
                  {hasPoints
                    ? "760 pikë deri në shpërblimin tjetër"
                    : "Porosit më shumë për të fituar më shumë pikë"}
                </p>
              </div>
            </div>

            {/* Bottom decorative clouds */}
            <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
              <Image
                src="/clouds_cart.svg"
                alt=""
                width={900}
                height={43}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Orders Section */}
      <div className="bg-white rounded-lg shadow-sm mt-6 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-grandstander font-bold text-red-600">Porositë</h2>
          <span className="text-gray-600 font-albertsans">{totalOrders} porosi</span>
        </div>

        {sortedLoyaltyPoints.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Ende nuk keni fituar pikë besnikërie
          </div>
        ) : (
          <div className="space-y-4">
            {sortedLoyaltyPoints.map((point, index) => {
              const orderNumber = point.from_order.replace('order_', '');
              const orderDate = new Date(point.created_at);
              const expiryDate = new Date(point.expiry);
              
              return (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <div className="grid grid-cols-4 gap-4 items-center">
                    <div>
                      <div className="text-sm text-gray-600 font-albertsans">Porosia</div>
                      <div className="font-albertsans font-semibold">{orderNumber}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-600 font-albertsans">Data e porosisë</div>
                      <div className="font-albertsans">
                        {format(orderDate, 'MMM d yyyy', { locale: sq })}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-600 font-albertsans">Çmimi total</div>
                      <div className="font-albertsans font-semibold">
                        {/* Calculate approximate price from points (assuming 1% cashback) */}
                        {(point.points * 100).toFixed(0)} Lekë
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`inline-flex items-center px-4 py-2 rounded-full font-albertsans font-medium ${
                        point.used 
                          ? 'bg-gray-100 text-gray-500'  // Already spent/used points
                          : point.is_expired 
                            ? 'bg-red-100 text-red-600'   // Expired, can't use anymore
                            : 'bg-green-100 text-green-700' // Available to use
                      }`}>
                        {`+${point.points.toFixed(0)} pts`}
                      </div>
                      
                      <div className="text-xs text-gray-500 mt-1">
                        {point.used 
                          ? 'Pikët u përdorën'  // Points were spent
                          : point.is_expired
                            ? `Skadoi më ${format(expiryDate, 'MMM d', { locale: sq })}`
                            : 'Disponueshme për përdorim'  // Available to be used
                        }
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
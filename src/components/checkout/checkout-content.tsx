'use client';

import OrderNote from '@/components/checkout/order-note';
import { shippingAddressAtom, orderNoteAtom } from '@/store/checkout';
import { useAtom } from 'jotai';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useUser } from '@/hooks/use-user';
import GuestInfoForm from '@/components/checkout/guest-info-form';
import CheckoutSummary from '@/components/checkout/checkout-summary';
import { OrderService } from '@/services/order.service';
import { useCart } from '@/store/quick-cart/cart.context';
import { useRouter } from 'next/navigation';

const AddressGrid = dynamic(
  () => import('@/components/checkout/address-grid'),
  { ssr: false },
);

export default function CheckoutContent() {
  const router = useRouter();
  const { user, isAuthenticated } = useUser();
  const { items, clearCart } = useCart();
  const [guestInfo, setGuestInfo] = useState({ firstName: '', lastName: '', email: '' });
  const [shippingAddress, setShippingAddress] = useAtom(shippingAddressAtom);
  const [orderNote, setOrderNote] = useAtom(orderNoteAtom);
  const [userData, setUserData] = useState<any>(null);
  const [orderCalculation, setOrderCalculation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [usePoints, setUsePoints] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    address?: string;
  }>({});

  // Use cached user data from React Query
  useEffect(() => {
    if (user && isAuthenticated) {
      console.log('User data from hook:', user); // Debug log
      setUserData(user);
      
      // Auto-fill guest info from user data
      setGuestInfo({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || ''
      });
    }
  }, [user, isAuthenticated]);

  // Calculate order when shipping address, items, or points usage changes
  useEffect(() => {
    const calculateOrder = async () => {
      // Only calculate if we have a valid shipping address with required fields
      if (shippingAddress && 
          shippingAddress.street_address && 
          shippingAddress.city && 
          items.length > 0) {
        try {
          const orderData = {
            items: items.map(item => ({
              product_id: Number(item.id),
              quantity: item.quantity
            })),
            shipping_info: {
              city: shippingAddress!.city || '',
              country: shippingAddress!.country || 'Albania',
              zip_code: shippingAddress!.zip || '',
              contact_phone: shippingAddress!.contact_number || shippingAddress!.phone_number || '',
              address: shippingAddress!.street_address || ''
            },
            use_points: usePoints && isAuthenticated,
            user_id: userData?.id || null
          };
          
          const calculation = await OrderService.calculateOrder(orderData);
          setOrderCalculation(calculation);
        } catch (error) {
          console.error('Error calculating order:', error);
          setOrderCalculation(null);
        }
      } else {
        // Clear calculation if address is incomplete
        setOrderCalculation(null);
      }
    };

    // Initial calculation
    calculateOrder();

    // Set up interval for auto-recalculation every 10 seconds
    const intervalId = setInterval(() => {
      calculateOrder();
    }, 10000);

    // Cleanup interval on unmount or when dependencies change
    return () => clearInterval(intervalId);
  }, [shippingAddress, items, userData, usePoints, isAuthenticated]);

  const userAddresses = userData?.addresses || [];
  console.log('User addresses for AddressGrid:', userAddresses); // Debug log

  const handlePlaceOrder = async () => {
    // Reset errors
    setFormErrors({});
    
    // Validate required fields
    const errors: any = {};
    
    if (!shippingAddress) {
      errors.address = 'Adresa është e detyrueshme';
    }
    
    if (!guestInfo.firstName) {
      errors.firstName = 'Emri është i detyrueshëm';
    }
    
    if (!guestInfo.lastName) {
      errors.lastName = 'Mbiemri është i detyrueshëm';
    }
    
    if (!guestInfo.email) {
      errors.email = 'Email-i është i detyrueshëm';
    } else {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(guestInfo.email)) {
        errors.email = 'Formati i email-it nuk është i saktë';
      }
    }
    
    if (items.length === 0) {
      alert('Shporta është bosh');
      return;
    }
    
    // If there are errors, set them and return
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      setIsLoading(true);
      
      const orderData = {
        items: items.map(item => ({
          product_id: Number(item.id),
          quantity: item.quantity
        })),
        shipping_info: {
          city: shippingAddress!.city || '',
          country: shippingAddress!.country || 'Albania',
          zip_code: shippingAddress!.zip || '',
          contact_phone: shippingAddress!.contact_number || shippingAddress!.phone_number || '',
          address: shippingAddress!.street_address || ''
        },
        payment_method: 'cash',
        shipping_notes: '',
        order_notes: orderNote || '',
        use_points: usePoints && isAuthenticated,
        first_name: guestInfo.firstName,
        last_name: guestInfo.lastName,
        email: guestInfo.email
      };
      
      const response = await OrderService.createOrder(orderData);
      
      if (response) {
        // Clear cart after successful order
        clearCart();
        
        // Store order data in sessionStorage for the thank you page
        sessionStorage.setItem('lastOrder', JSON.stringify(response));
        
        // Log the order response for debugging
        console.log('Order created successfully:', response);
        
        // Redirect to thank you page with tracking code
        if (response.tracking_code) {
          router.push(`/orders/${response.tracking_code}/thank-you`);
        } else if (response.id) {
          // Fallback to order ID if no tracking code
          router.push(`/orders/${response.id}/thank-you`);
        } else {
          alert('Porosia u krijua me sukses!');
        }
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Ndodhi një gabim gjatë krijimit të porosisë. Ju lutem provoni përsëri.');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state only for initial user data fetch
  if (isAuthenticated && !user && !isLoading) {
    return (
      <div className="bg-[#FFF8F0] min-h-screen px-4 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Duke ngarkuar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFF8F0] min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-red-600 mb-6 font-grandstander">Informacioni i dërgesës</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Guest Information - show for all users */}
            <GuestInfoForm
              onInfoChange={(info) => {
                setGuestInfo(info);
                // Clear errors as user types
                setFormErrors({
                  ...formErrors,
                  firstName: info.firstName ? undefined : formErrors.firstName,
                  lastName: info.lastName ? undefined : formErrors.lastName,
                  email: info.email ? undefined : formErrors.email,
                });
              }}
              initialValues={guestInfo}
              isReadOnly={isAuthenticated}
              errors={formErrors}
              isAuthenticated={isAuthenticated}
              userPoints={userData?.user_points || 0}
              usePoints={usePoints}
              onUsePointsChange={setUsePoints}
              className=""
            />

            {/* Shipping Address */}
            <div>
              <AddressGrid
                userId={user?.id || 'guest'}
                className=""
                label="Zgjidhni adresën e dërgesës"
                count={isAuthenticated ? 1 : 2}
                addresses={isAuthenticated && userAddresses ? userAddresses : []}
                atom={shippingAddressAtom}
                type="shipping"
              />
              {formErrors.address && (
                <p className="mt-2 text-sm text-red-500 px-6">{formErrors.address}</p>
              )}
            </div>

            {/* Order Note */}
            <OrderNote 
              count={isAuthenticated ? 2 : 3} 
              label="Shënim për porosinë" 
              className=""
            />
          </div>

          {/* Right Column - Order Summary with Place Order */}
          <div className="lg:sticky lg:top-4">
            <CheckoutSummary 
              showPaymentMethod={true}
              showPlaceOrder={true}
              onPlaceOrder={handlePlaceOrder}
              orderCalculation={orderCalculation}
              usePoints={usePoints}
              userPoints={userData?.user_points || 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
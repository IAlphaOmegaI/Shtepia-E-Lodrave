import type { Metadata } from "next";
import "./globals.css";
import "@/styles/globals.scss";
import QueryProvider from "@/providers/query-provider";
import { CartProvider } from "@/store/quick-cart/cart.context";
import { WishlistProvider } from "@/framework/rest/wishlist";
import { SettingsProvider } from "@/framework/settings";
import { Provider as JotaiProvider } from "jotai";
import ManagedDrawer from "@/components/ui/drawer/managed-drawer";
import CartCounterButton from "@/components/cart/cart-counter-button";
import { ToastProvider } from "@/contexts/toast-context";
import { AuthProvider } from "@/providers/auth-provider";

export const metadata: Metadata = {
  title: "Shtëpia e Lodrave",
  description: "E-commerce platform for toys and games",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased"
      >
        <JotaiProvider>
          <QueryProvider>
            <SettingsProvider>
              <AuthProvider>
                <CartProvider>
                  <ToastProvider>
                    <WishlistProvider>
                      {children}
                      <ManagedDrawer />
                      <CartCounterButton />
                    </WishlistProvider>
                  </ToastProvider>
                </CartProvider>
              </AuthProvider>
            </SettingsProvider>
          </QueryProvider>
        </JotaiProvider>
      </body>
    </html>
  );
}

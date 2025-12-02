import type { Metadata } from "next";
import "./globals.css";
import "@/styles/globals.scss";
import QueryProvider from "@/providers/query-provider";
import { CartProvider } from "@/store/quick-cart/cart.context";
import { WishlistProvider } from "@/framework/rest/wishlist";
import { SettingsProvider } from "@/framework/settings";
import { Provider as JotaiProvider } from "jotai";
import ManagedDrawer from "@/components/ui/drawer/managed-drawer";
// import ConditionalCartButton from "@/components/cart/conditional-cart-button";
import { ToastProvider } from "@/contexts/toast-context";
import { AuthProvider } from "@/providers/auth-provider";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || "http://63.178.242.103"),
  title: {
    default: "Shtëpia e Lodrave - Lodra dhe Lojëra Online",
    template: "%s | Shtëpia e Lodrave",
  },
  description:
    "Shtëpia e Lodrave - Zgjedhja më e madhe e lodrave dhe lojërave online në Shqipëri. Blini lodra edukative, LEGO, kukulla, makina dhe shumë më tepër me çmime konkurruese dhe dorëzim të shpejtë.",
  keywords: [
    "lodra",
    "lojëra",
    "lodra online",
    "shtepia e lodrave",
    "lodra për fëmijë",
    "LEGO",
    "kukulla",
    "makina lodrash",
    "lodra edukative",
    "lojëra për fëmijë",
    "blerje lodrash online",
    "lodra shqipëri",
    "toy store",
    "toys albania",
  ],
  authors: [{ name: "Shtëpia e Lodrave" }],
  creator: "Shtëpia e Lodrave",
  publisher: "Shtëpia e Lodrave",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "sq_AL",
    url: "/",
    siteName: "Shtëpia e Lodrave",
    title: "Shtëpia e Lodrave - Lodra dhe Lojëra Online",
    description:
      "Zgjedhja më e madhe e lodrave dhe lojërave online në Shqipëri. Blini lodra edukative, LEGO, kukulla dhe shumë më tepër.",
    images: [
      {
        url: "/assets/logo.png",
        width: 1200,
        height: 630,
        alt: "Shtëpia e Lodrave - Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shtëpia e Lodrave - Lodra dhe Lojëra Online",
    description:
      "Zgjedhja më e madhe e lodrave dhe lojërave online në Shqipëri.",
    images: ["/assets/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sq">
      <body className="antialiased">
        <JotaiProvider>
          <QueryProvider>
            <SettingsProvider>
              <AuthProvider>
                <CartProvider>
                  <ToastProvider>
                    <WishlistProvider>
                      {children}
                      <ManagedDrawer />
                      {/* <ConditionalCartButton /> */}
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

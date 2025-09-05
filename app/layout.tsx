import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { AuthProvider } from "@/context/auth-context";
import { Toaster } from "sonner";
import { FavoritesProvider } from "@/context/favorite-context";
import ScrollToTop from "@/components/scroll-to-top";
import CheckoutGuard from "@/components/checkout-guard";

const font = Manrope({ subsets: ["latin", "cyrillic"], });

export const metadata: Metadata = {
  title: "LikeSvet Shop",
  description: "Интернет магазин",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: [
      { rel: "icon", url: "/android-chrome-192x192.png", sizes: "192x192" },
      { rel: "icon", url: "/android-chrome-512x512.png", sizes: "512x512" },
    ],
  },
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="ru" data-scroll-behavior="smooth">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={font.className} >
        <AuthProvider>
          <FavoritesProvider>
            <Navbar />
            <ScrollToTop />
            <CheckoutGuard>
              <main className="pt-[104px]" style={{ paddingTop: `calc(104px + env(safe-area-inset-top))` }}>
                {children}
              </main>
            </CheckoutGuard>
            <Footer />
            <Toaster position="top-left" richColors />
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

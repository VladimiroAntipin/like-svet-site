import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { AuthProvider } from "@/context/auth-context";
import { Toaster } from "sonner";
import { FavoritesProvider } from "@/context/favorite-context";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" data-scroll-behavior="smooth">
      <body className={font.className} >
        <AuthProvider>
          <FavoritesProvider>
            <Navbar />
            <main className="pt-[104px]">
              {children}
            </main>
            <Footer />
            <Toaster position="top-left" richColors />
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

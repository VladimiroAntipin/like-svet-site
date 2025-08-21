import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { AuthProvider } from "@/context/auth-context";

const font = Manrope({ subsets: ["latin", "cyrillic"], });

export const metadata: Metadata = {
  title: "LikeSvet Shop",
  description: "Интернет магазин",
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
          <Navbar />
          <main className="pt-[104px]">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

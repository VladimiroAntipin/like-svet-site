import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

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
        <Navbar />
        <main className="pt-[104px]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

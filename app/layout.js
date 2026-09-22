import { Geist } from "next/font/google";
import { MotionConfig } from "framer-motion";
import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartProvider";
import PageTransition from "@/components/PageTransition";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SPIRIT — Designed for Movement",
    template: "%s — SPIRIT",
  },
  description:
    "SPIRIT is a performance-led activewear brand designed for movement, training and life beyond it.",
  openGraph: {
    type: "website",
    siteName: "SPIRIT",
    title: "SPIRIT — Designed for Movement",
    description:
      "SPIRIT is a performance-led activewear brand designed for movement, training and life beyond it.",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={geistSans.variable}>
      <body>
        {/*
          * Animations are decorative here, so every motion
          * component honours the operating system's
          * reduced-motion preference.
          */}
        <MotionConfig reducedMotion="user">
          <CartProvider>
            <Navbar />

            <PageTransition>{children}</PageTransition>

            <Footer />
          </CartProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
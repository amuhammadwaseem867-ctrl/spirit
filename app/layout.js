import { Archivo, Geist, Geist_Mono } from "next/font/google";
import { MotionConfig } from "framer-motion";
import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartProvider";
import PageTransition from "@/components/PageTransition";
import SmoothScroll from "@/components/system/SmoothScroll";
import Cursor from "@/components/system/Cursor";
import Preloader from "@/components/system/Preloader";
import GLRoot from "@/components/three/GLRoot";

/*
 * Archivo carries the display type. Its width axis lets the same
 * family run expanded for headlines and condensed for kinetic
 * accents. Geist sets body copy; Geist Mono sets the technical
 * labels.
 */
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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

export const viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
};

/*
 * Runs before first paint: returning visitors in this session and
 * reduced-motion visitors skip the preloader without a flash.
 */
const INTRO_SCRIPT = `(function(){try{var d=document.documentElement;if(sessionStorage.getItem("spirit-intro")||window.matchMedia("(prefers-reduced-motion: reduce)").matches){d.setAttribute("data-intro","skip")}}catch(e){}})()`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-intro="play"
      suppressHydrationWarning
      className={`${archivo.variable} ${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
      </head>
      <body>
        <a href="#content" className="skip-link">
          Skip to content
        </a>

        <MotionConfig reducedMotion="user">
          <CartProvider>
            <SmoothScroll />
            <GLRoot />
            <Preloader />

            <div className="site">
              <Navbar />

              <PageTransition>
                <div id="content">{children}</div>
              </PageTransition>

              <Footer />
            </div>

            <Cursor />
          </CartProvider>
        </MotionConfig>
      </body>
    </html>
  );
}

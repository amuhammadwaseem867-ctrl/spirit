import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
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
 * Satoshi (Indian Type Foundry, via Fontshare, ITF Free Font
 * License) sets headlines and body copy. The static Regular and
 * Medium files are used instead of the variable font: their glyph
 * contours are merged, so outlined headlines (text-stroke) draw
 * clean letters without overlap lines. Geist Mono sets the small
 * technical labels.
 */
const satoshi = localFont({
  src: [
    { path: "./fonts/Satoshi-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Satoshi-Medium.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-satoshi",
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
      className={`${satoshi.variable} ${geistMono.variable}`}
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

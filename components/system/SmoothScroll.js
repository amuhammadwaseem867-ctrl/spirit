"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

import { addTick, TICK } from "@/lib/ticker";
import { listenPointer } from "@/lib/pointer";

/**
 * Inertial smooth scrolling.
 *
 * Lenis is driven by the shared ticker so the WebGL views render
 * against the scroll position of the same frame. It is skipped
 * entirely when the visitor prefers reduced motion, leaving native
 * scrolling untouched.
 */
export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    listenPointer();

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduce) return undefined;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      anchors: true,
      autoRaf: false,
      prevent: (node) =>
        Boolean(node.closest?.("[data-lenis-prevent]")),
    });

    window.__lenis = lenis;
    document.documentElement.classList.add("lenis-on");

    const removeTick = addTick((time) => lenis.raf(time), TICK.SCROLL);

    return () => {
      removeTick();
      lenis.destroy();
      window.__lenis = undefined;
      document.documentElement.classList.remove("lenis-on");
    };
  }, []);

  /*
   * Each route starts at the top. The page transition covers the
   * jump, so it is applied immediately rather than animated.
   */
  useEffect(() => {
    if (window.location.hash) return;

    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true, force: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}

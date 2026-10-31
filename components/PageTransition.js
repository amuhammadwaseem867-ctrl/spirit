"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import Logo from "./Logo";

import styles from "./PageTransition.module.css";

const COVER_MS = 720;
const REVEAL_MS = 1100;
const SAFETY_MS = 5000;
const COLUMNS = 6;

const ROUTE_NAMES = [
  ["/shop", "Shop"],
  ["/women", "Women"],
  ["/men", "Men"],
  ["/collections", "Collections"],
  ["/story", "Story"],
  ["/product", "Product"],
];

function routeName(pathname) {
  if (pathname === "/") return "Home";

  const match = ROUTE_NAMES.find(([prefix]) => pathname.startsWith(prefix));
  return match ? match[1] : "SPIRIT";
}

/**
 * Curtain transition between routes.
 *
 * A capture-phase click listener on window runs before Next's <Link>
 * handler; it cancels the click (Link respects defaultPrevented),
 * drops the curtain, then navigates. When the new pathname commits,
 * the curtain lifts. Modified clicks, new tabs, downloads, external
 * links, same-page links and reduced-motion visitors are untouched.
 */
export default function PageTransition({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState("idle");
  const [label, setLabel] = useState("");
  const timers = useRef([]);
  const phaseRef = useRef("idle");

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    const onClick = (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        reduce.matches ||
        phaseRef.current === "cover"
      ) {
        return;
      }

      const anchor = event.target.closest?.("a[href]");

      if (
        !anchor ||
        (anchor.target && anchor.target !== "_self") ||
        anchor.hasAttribute("download") ||
        anchor.hasAttribute("data-no-transition")
      ) {
        return;
      }

      const url = new URL(anchor.href, window.location.href);

      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;

      event.preventDefault();

      const destination = `${url.pathname}${url.search}${url.hash}`;

      clearTimers();
      router.prefetch(destination);
      setLabel(routeName(url.pathname));
      setPhase("cover");

      timers.current.push(
        window.setTimeout(() => router.push(destination), COVER_MS),
        window.setTimeout(() => setPhase("reveal"), SAFETY_MS)
      );
    };

    window.addEventListener("click", onClick, true);

    return () => {
      window.removeEventListener("click", onClick, true);
      clearTimers();
    };
  }, [router]);

  /* the new route has committed: lift the curtain */
  useEffect(() => {
    if (phaseRef.current !== "cover") return undefined;

    clearTimers();

    const reveal = window.setTimeout(() => setPhase("reveal"), 60);
    const idle = window.setTimeout(() => setPhase("idle"), 60 + REVEAL_MS);

    timers.current.push(reveal, idle);

    return undefined;
  }, [pathname]);

  return (
    <>
      {children}

      <div className={styles.curtain} data-phase={phase} aria-hidden="true">
        {Array.from({ length: COLUMNS }, (_, index) => (
          <span key={index} className={styles.column} style={{ "--i": index }} />
        ))}

        <div className={styles.center}>
          <Logo variant="mark" className={styles.mark} />
          <span className={`display ${styles.label}`}>{label}</span>
        </div>
      </div>
    </>
  );
}

"use client";

import { useSyncExternalStore } from "react";

/*
 * Reduced-motion preference that is safe to use during hydration.
 * The server snapshot is always `false`, so the first client render
 * matches the server HTML; React then re-renders with the real
 * preference. (framer-motion's useReducedMotion reads the media query
 * immediately, which causes an attribute mismatch on hydration.)
 */
const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

export default function useReducedMotionSafe() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false
  );
}

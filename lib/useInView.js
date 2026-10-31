"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Minimal IntersectionObserver hook.
 *
 * Returns [ref, inView]. With `once` the observer disconnects after
 * the first intersection, which suits entrance animations.
 */
export default function useInView({
  threshold = 0.2,
  rootMargin = "0px",
  once = true,
} = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node || typeof IntersectionObserver === "undefined") {
      const id = window.setTimeout(() => setInView(true), 0);
      return () => window.clearTimeout(id);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return [ref, inView];
}

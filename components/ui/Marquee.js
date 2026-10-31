"use client";

import { useEffect, useRef } from "react";

import { addTick, TICK } from "@/lib/ticker";

import styles from "./Marquee.module.css";

/**
 * Infinite marquee that reacts to scroll velocity.
 *
 * The base drift is slow; scrolling speeds it up and reverses it
 * with the scroll direction, so the band feels physically coupled
 * to the page. Purely decorative: hidden from assistive technology,
 * and static under reduced motion.
 */
export default function Marquee({
  items,
  speed = 40,
  className = "",
  separator = "—",
}) {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    let offset = 0;
    let direction = 1;
    let last = performance.now();
    let visible = false;

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });

    observer.observe(track);

    const remove = addTick((now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (!visible) return;

      const velocity = window.__lenis?.velocity ?? 0;

      if (Math.abs(velocity) > 0.5) direction = Math.sign(velocity);

      const boost = Math.min(Math.abs(velocity) * 6, 900);
      const width = track.scrollWidth / 2;

      offset -= (speed + boost) * direction * dt;

      if (offset <= -width) offset += width;
      if (offset > 0) offset -= width;

      track.style.transform = `translate3d(${offset}px, 0, 0)`;
    }, TICK.CURSOR);

    return () => {
      remove();
      observer.disconnect();
    };
  }, [speed]);

  const sequence = items.flatMap((item, index) => [
    <span key={`i-${index}`} className={styles.item}>
      {item}
    </span>,
    <span key={`s-${index}`} className={styles.sep}>
      {separator}
    </span>,
  ]);

  return (
    <div className={`${styles.marquee} ${className}`} aria-hidden="true">
      <div ref={trackRef} className={styles.track}>
        <div className={styles.group}>{sequence}</div>
        <div className={styles.group}>{sequence}</div>
      </div>
    </div>
  );
}

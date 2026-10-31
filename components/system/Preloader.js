"use client";

import { useEffect, useRef, useState } from "react";

import { MARK_PATHS, MARK_VIEWBOX } from "@/lib/logo";
import { markIntroDone } from "@/lib/intro";

import styles from "./Preloader.module.css";

const STORAGE_KEY = "spirit-intro";
const MIN_DURATION = 1700;
const MAX_WAIT = 3600;

/**
 * First-visit preloader.
 *
 * The monogram draws itself while a counter runs to 100, then the
 * curtain splits and the hero takes over. It only plays once per
 * session; an inline script in the layout marks repeat visits (and
 * reduced-motion visitors) with html[data-intro="skip"] before the
 * first paint, so they never see it.
 */
export default function Preloader() {
  const [phase, setPhase] = useState("loading");
  const countRef = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    const root = document.documentElement;

    if (root.dataset.intro === "skip") {
      markIntroDone();
      const id = window.setTimeout(() => setPhase("gone"), 0);
      return () => window.clearTimeout(id);
    }

    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Storage can be unavailable (private mode); the intro still works.
    }

    const start = performance.now();
    let loaded = document.readyState === "complete";
    let frame = 0;
    let finished = false;

    const onLoad = () => {
      loaded = true;
    };

    window.addEventListener("load", onLoad);

    const tick = (now) => {
      const elapsed = now - start;
      const timeProgress = Math.min(1, elapsed / MIN_DURATION);
      const ready = loaded || elapsed > MAX_WAIT;
      const target = ready ? timeProgress : Math.min(timeProgress, 0.86);
      const eased = 1 - Math.pow(1 - target, 3);

      if (countRef.current) {
        countRef.current.textContent = String(Math.round(eased * 100)).padStart(3, "0");
      }

      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${eased})`;
      }

      if (ready && timeProgress >= 1 && !finished) {
        finished = true;
        setPhase("exit");
        markIntroDone();
        window.setTimeout(() => setPhase("gone"), 1300);
        return;
      }

      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div className={styles.preloader} data-phase={phase} aria-hidden="true">
      <div className={`${styles.panel} ${styles.panelTop}`} />
      <div className={`${styles.panel} ${styles.panelBottom}`} />

      <div className={styles.content}>
        <svg className={styles.mark} viewBox={MARK_VIEWBOX}>
          {MARK_PATHS.map((d) => (
            <path key={d.slice(0, 16)} d={d} pathLength="1" />
          ))}
        </svg>

        <div className={styles.row}>
          <span>SPIRIT</span>
          <span ref={countRef} className={styles.count}>
            000
          </span>
        </div>

        <span className={styles.bar}>
          <span ref={barRef} className={styles.barFill} />
        </span>

        <span className={styles.tagline}>DESIGNED FOR MOVEMENT — SS/2026</span>
      </div>
    </div>
  );
}

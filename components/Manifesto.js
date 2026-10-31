"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import Marquee from "@/components/ui/Marquee";
import ScrubText from "@/components/ui/ScrubText";
import Reveal from "@/components/ui/Reveal";

import styles from "./Manifesto.module.css";

/*
 * Each word swings up from the floor (rotateX) and drifts sideways
 * as it crosses the viewport. Transforms are scroll-scrubbed, so the
 * motion always matches the reader's pace.
 */
function Word({ children, progress, from, to, drift, outline = false }) {
  const rotateX = useTransform(progress, [from, to], [78, 0]);
  const y = useTransform(progress, [from, to], ["32%", "0%"]);
  const x = useTransform(progress, [0, 1], [`${-drift}vw`, `${drift}vw`]);
  const opacity = useTransform(progress, [from, from + 0.08], [0, 1]);

  return (
    <motion.span
      className={`display ${styles.word} ${outline ? styles.outline : ""}`}
      style={{ rotateX, y, x, opacity }}
    >
      {children}
    </motion.span>
  );
}

export default function Manifesto() {
  const wordsRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: wordsRef,
    offset: ["start end", "end start"],
  });

  return (
    <section id="manifesto" className={`${styles.manifesto} surface-ink`}>
      <div className="wrap">
        <div className="meta">
          <span>01</span>
          <span>MANIFESTO</span>
          <span>SPIRIT / 2026</span>
        </div>

        <div className={styles.intro}>
          <span className={`eyebrow ${styles.eyebrow}`}>The idea</span>
          <ScrubText
            className={styles.statement}
            text="Movement is not a moment. It is a way of being — the first step, the hundredth rep, the walk home. SPIRIT is built for all of it."
          />
        </div>
      </div>

      <div ref={wordsRef} className={styles.words} aria-label="Move with intent">
        <div className={styles.stage} aria-hidden="true">
          <Word progress={scrollYProgress} from={0.05} to={0.32} drift={3}>
            MOVE
          </Word>
          <Word progress={scrollYProgress} from={0.12} to={0.4} drift={-5} outline>
            WITH
          </Word>
          <Word progress={scrollYProgress} from={0.2} to={0.48} drift={4}>
            INTENT.
          </Word>
        </div>
      </div>

      <Reveal className={`wrap ${styles.bottom}`}>
        <p className={`reveal ${styles.copy}`}>
          SPIRIT exists at the intersection of performance, design and
          everyday movement. From Lahore, for wherever you move next.
        </p>

        <div className={`reveal ${styles.facts}`} style={{ "--rd": "120ms" }}>
          <div>
            <span className="mono">Origin</span>
            <strong>Lahore / PK</strong>
          </div>
          <div>
            <span className="mono">System</span>
            <strong>4 Collections</strong>
          </div>
          <div>
            <span className="mono">Principle</span>
            <strong>Nothing extra</strong>
          </div>
        </div>
      </Reveal>

      <Marquee
        className={`display-condensed ${styles.marquee}`}
        items={["PERFORMANCE", "TRAINING", "RECOVERY", "EVERYDAY", "MOVEMENT"]}
        speed={36}
        separator="✕"
      />
    </section>
  );
}

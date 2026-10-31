"use client";

import { useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowDown } from "lucide-react";

import GLView from "@/components/three/GLView";
import KineticText from "@/components/ui/KineticText";
import Logo from "@/components/Logo";
import useReducedMotionSafe from "@/lib/useReducedMotionSafe";

import styles from "./PageHero.module.css";

const MonogramScene = dynamic(() => import("@/components/three/MonogramScene"), {
  ssr: false,
});

/**
 * Shared hero for inner pages.
 *
 * visual="monogram" renders the chrome 3D monogram; visual="image"
 * renders a tall campaign frame that tilts up into place. Either
 * way the title is a kinetic headline and the copy sits on a
 * technical meta grid.
 */
export default function PageHero({
  index = "01",
  label,
  title,
  outline = [],
  intro,
  aside,
  visual = "monogram",
  image,
  imageAlt = "",
  children,
}) {
  const sectionRef = useRef(null);
  const progress = useRef(0);
  const reduce = useReducedMotionSafe();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    progress.current = value;
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const imageRotate = useTransform(scrollYProgress, [0, 1], [0, 8]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  /* longest line sets the size, so long titles never overflow */
  const chars = Math.max(...title.map((line) => line.length));

  return (
    <section
      ref={sectionRef}
      className={`${styles.hero} ${visual === "monogram" ? "surface-clear" : "surface-ink"}`}
    >
      <div className={styles.visual} data-visual={visual}>
        {visual === "monogram" ? (
          <GLView
            label="The SPIRIT monogram in polished chrome"
            scene={(onReady) => (
              <MonogramScene progress={progress} trackRef={sectionRef} scale={0.9} onReady={onReady} />
            )}
            fallback={
              <div className={styles.markFallback}>
                <Logo variant="mark" />
              </div>
            }
          />
        ) : (
          <motion.div
            className={styles.frame}
            style={reduce ? undefined : { y: imageY, rotateX: imageRotate }}
            initial={{ clipPath: "inset(100% 0% 0% 0%)", scale: 1.08 }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)", scale: 1 }}
            transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1], delay: 0.15 }}
          >
            <Image src={image} alt={imageAlt} fill loading="eager" fetchPriority="high" sizes="(max-width: 900px) 92vw, 42vw" className={styles.image} />
          </motion.div>
        )}
      </div>

      <div className={`wrap ${styles.inner}`}>
        <div className="meta">
          <span>{index}</span>
          <span>SPIRIT / {label}</span>
          <span>SS—2026</span>
        </div>

        <motion.div
          className={styles.titleWrap}
          style={reduce ? { "--chars": chars } : { y: titleY, "--chars": chars }}
        >
          <KineticText
            as="h1"
            lines={title}
            outline={outline}
            trigger="mount"
            delay={150}
            className={`display ${styles.title}`}
          />
        </motion.div>

        <div className={styles.bottom}>
          {intro && <p className={styles.intro}>{intro}</p>}
          {aside && <span className={styles.aside}>{aside}</span>}
          {children}
          <span className={styles.cue} aria-hidden="true">
            <ArrowDown size={14} strokeWidth={1.5} /> Scroll
          </span>
        </div>
      </div>
    </section>
  );
}

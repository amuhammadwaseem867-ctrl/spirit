"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Pause,
  Play,
} from "lucide-react";

import GLView from "@/components/three/GLView";
import KineticText from "@/components/ui/KineticText";
import { heroFrames } from "@/lib/media";
import { sceneState } from "@/lib/gl";
import { onIntroDone } from "@/lib/intro";
import useReducedMotionSafe from "@/lib/useReducedMotionSafe";

import styles from "./Hero.module.css";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
});

const AUTOPLAY = 6500;

export default function Hero() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const reduce = useReducedMotionSafe();

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [intro, setIntro] = useState(false);
  const [inView, setInView] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  const frame = heroFrames[index];
  const total = heroFrames.length;

  /* ---------- intro (waits for the preloader) ---------- */
  useEffect(() => {
    return onIntroDone(() => {
      sceneState.hero.intro = 1;
      setIntro(true);
    });
  }, []);

  /* ---------- share the stage with the 3D scene ---------- */
  useEffect(() => {
    sceneState.hero.el = stageRef.current;
    sceneState.hero.index = 0;

    return () => {
      sceneState.hero.el = null;
      sceneState.hero.intro = 0;
      sceneState.hero.scroll = 0;
    };
  }, []);

  useEffect(() => {
    sceneState.hero.index = index;
  }, [index]);

  /* ---------- visibility: pause work when offscreen ---------- */
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        sceneState.hero.visible = entry.isIntersecting;
        setInView(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      sceneState.hero.visible = false;
    };
  }, []);

  /* ---------- autoplay (never under reduced motion) ---------- */
  const autoplay = playing && intro && inView && !scrolled && !reduce;

  useEffect(() => {
    if (!autoplay) return undefined;

    const timer = window.setTimeout(() => {
      setIndex((current) => (current + 1) % total);
    }, AUTOPLAY);

    return () => window.clearTimeout(timer);
  }, [autoplay, index, total]);

  const go = useCallback(
    (next) => setIndex(((next % total) + total) % total),
    [total]
  );

  const handleKeyDown = (event) => {
    if (event.target.closest("input, textarea")) return;

    if (event.key === "ArrowRight") go(index + 1);
    if (event.key === "ArrowLeft") go(index - 1);
  };

  /* ---------- scroll choreography ---------- */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    sceneState.hero.scroll = value;

    /* hold the current frame while the camera move plays */
    const away = value > 0.06;
    if (away !== scrolled) setScrolled(away);
  });

  const lineA = useTransform(scrollYProgress, [0, 0.7], ["0vw", "-22vw"]);
  const lineB = useTransform(scrollYProgress, [0, 0.7], ["0vw", "22vw"]);
  const fade = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const titleFade = useTransform(scrollYProgress, [0.12, 0.5], [1, 0]);
  const late = useTransform(scrollYProgress, [0.62, 0.92], [0, 1]);
  const lateY = useTransform(scrollYProgress, [0.62, 0.98], ["8vh", "0vh"]);

  return (
    <section
      ref={sectionRef}
      className={`${styles.hero} surface-clear`}
      aria-roledescription="carousel"
      aria-label="SPIRIT campaign"
      onKeyDown={handleKeyDown}
      data-intro={intro ? "true" : "false"}
    >
      <h1 className="sr-only">
        SPIRIT — performance activewear designed for movement
      </h1>

      <div ref={stageRef} className={styles.stage}>
        <GLView
          className={styles.gl}
          label={frame.media.alt}
          scene={(onReady) => (
            <HeroScene frames={heroFrames} onReady={onReady} />
          )}
          fallback={
            <div className={styles.fallback}>
              <Image
                src={frame.media.src}
                alt=""
                fill
                loading="eager"
                fetchPriority="high"
                sizes="(max-width: 900px) 100vw, 40vw"
                className={styles.fallbackImage}
              />
            </div>
          }
        />

        {/* --------- copy --------- */}
        <div className={`${styles.inner} wrap`}>
          <motion.div className={styles.top} style={reduce ? undefined : { opacity: fade }}>
            <span className={styles.topIndex}>
              <span className="signal-dot" aria-hidden="true" />
              <span>
                {frame.id} — {String(total).padStart(2, "0")}
              </span>
            </span>
            <span className={styles.topCenter}>SPIRIT / SS—2026</span>
            <span className={styles.topRight}>{frame.eyebrow}</span>
          </motion.div>

          <div className={styles.headline} aria-hidden="true">
            <motion.div style={reduce ? undefined : { x: lineA, opacity: titleFade }}>
              <KineticText
                key={`${frame.id}-a`}
                as="p"
                lines={[frame.lines[0]]}
                trigger="mount"
                play={intro}
                fitChars={Math.max(...frame.lines.map((line) => line.length))}
                className={`display ${styles.title}`}
                delay={intro ? 120 : 0}
              />
            </motion.div>
            <motion.div style={reduce ? undefined : { x: lineB, opacity: titleFade }}>
              <KineticText
                key={`${frame.id}-b`}
                as="p"
                lines={[frame.lines[1]]}
                trigger="mount"
                play={intro}
                fitChars={Math.max(...frame.lines.map((line) => line.length))}
                className={`display ${styles.title} ${styles.titleIndent}`}
                delay={intro ? 260 : 0}
              />
            </motion.div>
          </div>

          <motion.div className={styles.bottom} style={reduce ? undefined : { opacity: fade }}>
            <div className={styles.copy}>
              <p key={frame.id} className={styles.caption}>
                {frame.caption}
              </p>

              <div className={styles.actions}>
                <Link
                  href="/shop"
                  className="btn btn-solid"
                  data-magnetic="0.25"
                >
                  <span className="btn-label">Shop the system</span>
                  <span className="btn-icon">
                    <ArrowUpRight size={16} strokeWidth={1.5} />
                  </span>
                </Link>

                <Link href="/collections" className="link-line">
                  Collections
                </Link>
              </div>
            </div>

            <div className={styles.controls}>
              <div className={styles.progress} role="group" aria-label="Choose a campaign frame">
                {heroFrames.map((item, i) => (
                  <button
                    key={item.id}
                    type="button"
                    className={styles.track}
                    data-active={i === index ? "true" : "false"}
                    data-done={i < index ? "true" : "false"}
                    data-running={autoplay && i === index ? "true" : "false"}
                    onClick={() => go(i)}
                    aria-label={`Show frame ${i + 1}: ${item.lines.join(" ")}`}
                    aria-current={i === index ? "true" : undefined}
                    style={{ "--dur": `${AUTOPLAY}ms` }}
                  >
                    <span className={styles.trackLabel}>{item.id}</span>
                    <span className={styles.trackBar}>
                      <span className={styles.trackFill} />
                    </span>
                  </button>
                ))}
              </div>

              <div className={styles.buttons}>
                <button
                  type="button"
                  onClick={() => setPlaying((value) => !value)}
                  aria-label={playing ? "Pause slideshow" : "Play slideshow"}
                  aria-pressed={!playing}
                  data-magnetic="0.4"
                >
                  {playing ? (
                    <Pause size={15} strokeWidth={1.5} />
                  ) : (
                    <Play size={15} strokeWidth={1.5} />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => go(index - 1)}
                  aria-label="Previous frame"
                  data-magnetic="0.4"
                >
                  <ArrowLeft size={16} strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={() => go(index + 1)}
                  aria-label="Next frame"
                  data-magnetic="0.4"
                >
                  <ArrowRight size={16} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div className={styles.scrollCue} style={{ opacity: fade }} aria-hidden="true">
            <span className={styles.scrollLine} />
            <ArrowDown size={14} strokeWidth={1.5} />
            <span>Scroll</span>
          </motion.div>

          <div className={styles.side} aria-hidden="true">
            <span>FORM</span>
            <i />
            <span>FUNCTION</span>
            <i />
            <span>MOVEMENT</span>
          </div>
        </div>

        {/* --------- revealed as the panel fills the screen --------- */}
        <motion.div
          className={styles.outro}
          style={{ opacity: late, y: lateY }}
          aria-hidden="true"
        >
          <span className="mono">SPIRIT — DESIGNED FOR MOVEMENT</span>
          <span className={`display ${styles.outroWord}`}>INTENT</span>
        </motion.div>
      </div>
    </section>
  );
}

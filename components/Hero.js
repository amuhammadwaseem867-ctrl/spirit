"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";

import styles from "./Hero.module.css";

const heroSlides = [
  {
    id: "01",
    image: "/images/hero/hero1.jpg",
    eyebrow: "SPIRIT / PERFORMANCE",
    title: "MOVE DIFFERENT.",
    description:
      "Performance-driven essentials designed for movement and beyond.",
  },
  {
    id: "02",
    image: "/images/hero/hero2.jpg",
    eyebrow: "SPIRIT / MOVEMENT",
    title: "BUILT TO MOVE.",
    description:
      "Engineered silhouettes made to move with your body.",
  },
  {
    id: "03",
    image: "/images/hero/hero3.jpg",
    eyebrow: "SPIRIT / FORM",
    title: "FORM IN MOTION.",
    description:
      "Refined performance pieces where form meets function.",
  },
  {
    id: "04",
    image: "/images/hero/hero4.jpg",
    eyebrow: "SPIRIT / ENERGY",
    title: "KEEP MOVING.",
    description:
      "Made for intensity, recovery and everything between.",
  },
];

const AUTOPLAY_DELAY = 5500;

function getSlideAlt(slide) {
  return `SPIRIT campaign — ${slide.eyebrow.replace(
    "SPIRIT / ",
    ""
  )}`;
}

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeSlide = heroSlides[activeIndex];

  const nextSlide = useCallback(() => {
    setActiveIndex(
      (current) => (current + 1) % heroSlides.length
    );
  }, []);

  const previousSlide = useCallback(() => {
    setActiveIndex(
      (current) =>
        (current - 1 + heroSlides.length) %
        heroSlides.length
    );
  }, []);

  const goToSlide = useCallback((index) => {
    setActiveIndex(index);
  }, []);

  /*
   * Automatic transition
   * Runs continuously and does not pause on hover.
   */
  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex(
        (current) => (current + 1) % heroSlides.length
      );
    }, AUTOPLAY_DELAY);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  /*
   * Keyboard controls
   */
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        nextSlide();
      }

      if (event.key === "ArrowLeft") {
        previousSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [nextSlide, previousSlide]);

  return (
    <section
      className={styles.hero}
      aria-label="SPIRIT campaign"
    >
      {/* =========================
          IMAGE STAGE
      ========================= */}

      <div className={styles.imageStage}>
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={activeSlide.id}
            className={styles.slide}
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.9,
              ease: "easeInOut",
            }}
          >
            <motion.div
              className={styles.imageMotion}
              initial={{
                scale: 1.025,
              }}
              animate={{
                scale: 1,
              }}
              transition={{
                duration: AUTOPLAY_DELAY / 1000,
                ease: "linear",
              }}
            >
              <Image
                src={activeSlide.image}
                alt={getSlideAlt(activeSlide)}
                fill
                priority={activeIndex === 0}
                sizes="100vw"
                quality={80}
                className={styles.image}
              />
            </motion.div>

            <div className={styles.imageOverlay} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* =========================
          HERO CONTENT
      ========================= */}

      <div className={styles.heroInner}>
        {/* TOP META */}

        <div className={styles.topMeta}>
          <span>SPIRIT</span>

          <span className={styles.topCenter}>
            PERFORMANCE / 2026
          </span>

          <span>
            {activeSlide.id} / 04
          </span>
        </div>

        {/* MAIN CONTENT */}

        <div className={styles.mainContent}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide.id}
              className={styles.copy}
              initial={{
                opacity: 0,
                y: 24,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -14,
              }}
              transition={{
                duration: 0.65,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div className={styles.eyebrow}>
                <span />
                {activeSlide.eyebrow}
              </div>

              <h1>{activeSlide.title}</h1>

              <p>{activeSlide.description}</p>

              <Link
                href="/shop"
                className={styles.explore}
              >
                <span>EXPLORE COLLECTION</span>

                <span className={styles.exploreIcon}>
                  <ArrowUpRight
                    size={15}
                    strokeWidth={1.25}
                  />
                </span>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* =========================
            BOTTOM BAR
        ========================= */}

        <div className={styles.bottomBar}>
          <div className={styles.scrollHint}>
            <ArrowDown
              size={14}
              strokeWidth={1.1}
            />

            <span>SCROLL TO EXPLORE</span>
          </div>

          <div className={styles.controls}>
            {/* COUNTER */}

            <div className={styles.counter}>
              <span>{activeSlide.id}</span>
              <i>/</i>
              <span>04</span>
            </div>

            {/* PROGRESS */}

            <div className={styles.progress}>
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  className={`${styles.progressButton} ${
                    index === activeIndex
                      ? styles.activeProgress
                      : ""
                  }`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${
                    index + 1
                  }`}
                  aria-current={
                    index === activeIndex
                      ? "true"
                      : undefined
                  }
                >
                  <span className={styles.progressNumber}>
                    {slide.id}
                  </span>

                  <span
                    className={styles.progressTrack}
                  >
                    <span
                      className={styles.progressFill}
                    />
                  </span>
                </button>
              ))}
            </div>

            {/* ARROWS */}

            <div className={styles.arrows}>
              <button
                type="button"
                onClick={previousSlide}
                aria-label="Previous slide"
              >
                <ArrowLeft
                  size={16}
                  strokeWidth={1.15}
                />
              </button>

              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next slide"
              >
                <ArrowRight
                  size={16}
                  strokeWidth={1.15}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          SIDE LABEL
      ========================= */}

      <div className={styles.sideLabel}>
        <span>FORM</span>
        <b>/</b>
        <span>FUNCTION</span>
        <b>/</b>
        <span>MOVEMENT</span>
      </div>
    </section>
  );
}
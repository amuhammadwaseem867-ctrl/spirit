"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";

import StrokeText from "@/components/StrokeText";
import styles from "./Editorial.module.css";

const editorialStories = [
  {
    number: "01",
    category: "CAMPAIGN / 001",
    title: "FORM IN MOTION",
    image: "/images/campaigns/aeroflextee.jpeg",
    href: "/story/form-in-motion",
  },
  {
    number: "02",
    category: "CAMPAIGN / 002",
    title: "THE DAILY ATHLETE",
    image: "/images/campaigns/legging.jpeg",
    href: "/story/the-daily-athlete",
  },
  {
    number: "03",
    category: "CULTURE / 003",
    title: "BUILT FOR THE PACE",
    image: "/images/campaigns/form corp.jpeg",
    href: "/story/built-for-the-pace",
  },
];

export default function Editorial() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    ["-5%", "5%"]
  );

  return (
    <section
      ref={sectionRef}
      className={styles.editorial}
      id="editorial"
    >
      <div className={styles.inner}>

        {/* =========================
            HEADER
        ========================= */}

        <motion.header
          className={styles.header}
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: 0.9,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <div className={styles.meta}>
            <span>06</span>

            <span>
              EDITORIAL / CULTURE
            </span>

            <span>
              SPIRIT / 2026
            </span>
          </div>

          <div className={styles.headerContent}>
            <div className={styles.headerLabel}>
              <span className={styles.labelLine} />

              <span>
                THE SPIRIT EDIT
              </span>
            </div>

            <h2>
              MOVEMENT,
              <br />

              <StrokeText
                color="#101317"
                strokeColor="rgba(16, 19, 23, 0.9)"
                strokeWidth={1}
              >
                BEYOND PERFORMANCE.
              </StrokeText>
            </h2>

            <p>
              Stories, people and perspectives
              surrounding the active life.
            </p>
          </div>
        </motion.header>

        {/* =========================
            FEATURED STORY
        ========================= */}

        <motion.article
          className={styles.featured}
          initial={{
            opacity: 0,
            y: 50,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 1,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <Link
            href={editorialStories[0].href}
            className={styles.featuredLink}
          >
            <div className={styles.featuredImage}>
              <motion.img
                src={editorialStories[0].image}
                alt={editorialStories[0].title}
                style={{
                  y: imageY,
                }}
                loading="lazy"
                decoding="async"
              />

              <div className={styles.featuredOverlay} />

              <div className={styles.featuredTop}>
                <span>
                  {editorialStories[0].category}
                </span>

                <span>
                  {editorialStories[0].number}
                </span>
              </div>

              <div className={styles.featuredBottom}>
                <div>
                  <span
                    className={styles.featuredEyebrow}
                  >
                    SPIRIT / EDITORIAL
                  </span>

                  <h3>
                    {editorialStories[0].title}
                  </h3>
                </div>

                <span
                  className={styles.featuredArrow}
                >
                  <ArrowUpRight
                    size={22}
                    strokeWidth={1.15}
                  />
                </span>
              </div>
            </div>
          </Link>
        </motion.article>

        {/* =========================
            INTRO
        ========================= */}

        <div className={styles.intro}>
          <motion.span
            initial={{
              opacity: 0,
              x: -20,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.7,
            }}
          >
            EDITORIAL / 001
          </motion.span>

          <motion.p
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.4,
            }}
            transition={{
              duration: 0.85,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            Movement is more than performance.
            It is how we travel, work, train,
            recover and exist. SPIRIT explores
            the space between athletic purpose
            and everyday life.
          </motion.p>
        </div>

        {/* =========================
            STORY GRID
        ========================= */}

        <div className={styles.storyGrid}>
          {editorialStories.slice(1).map(
            (story, index) => (
              <motion.article
                key={story.number}
                className={styles.story}
                initial={{
                  opacity: 0,
                  y: 45,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.2,
                }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <Link
                  href={story.href}
                  className={styles.storyLink}
                >
                  <div className={styles.storyImage}>
                    <Image
                      src={story.image}
                      alt={story.title}
                      fill
                      sizes="(max-width: 900px) 92vw, 50vw"
                    />

                    <div className={styles.storyOverlay} />

                    <span
                      className={styles.storyNumber}
                    >
                      {story.number}
                    </span>

                    <span
                      className={styles.storyArrow}
                    >
                      <ArrowUpRight
                        size={18}
                        strokeWidth={1.15}
                      />
                    </span>
                  </div>

                  <div className={styles.storyInfo}>
                    <div>
                      <span>
                        {story.category}
                      </span>

                      <h3>
                        {story.title}
                      </h3>
                    </div>

                    <span className={styles.read}>
                      READ
                    </span>
                  </div>
                </Link>
              </motion.article>
            )
          )}
        </div>

        {/* =========================
            FOOTER
        ========================= */}

        <motion.div
          className={styles.footer}
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.8,
          }}
        >
          <span>
            SPIRIT / EDITORIAL INDEX
          </span>

          <span>
            STORIES / CULTURE / MOVEMENT
          </span>

          <Link href="/story">
            VIEW ALL STORIES

            <ArrowUpRight
              size={14}
              strokeWidth={1.15}
            />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
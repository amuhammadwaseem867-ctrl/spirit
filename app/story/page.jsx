"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowDown } from "lucide-react";

import StrokeText from "@/components/StrokeText";
import styles from "./Story.module.css";

const stories = [
  {
    number: "01",
    category: "MOVEMENT",
    title: "THE BODY IN MOTION.",
    description:
      "Movement is the starting point. Everything SPIRIT creates begins with how the body moves.",
    image: "/images/campaigns/aeroflextee.jpeg",
  },
  {
    number: "02",
    category: "DESIGN",
    title: "FORM FOLLOWS FUNCTION.",
    description:
      "A considered approach to silhouette, proportion and performance — designed without unnecessary detail.",
    image: "/images/campaigns/legging.jpeg",
  },
  {
    number: "03",
    category: "PERFORMANCE",
    title: "BUILT FOR THE EVERYDAY.",
    description:
      "Performance does not stop when training ends. SPIRIT is designed to move through the complete day.",
    image: "/images/campaigns/coreperformance.jpeg",
  },
];

export default function StoryPage() {
  return (
    <main className={styles.story}>
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className={styles.hero}>
        <div className={styles.heroMeta}>
          <span>01</span>
          <span>SPIRIT / STORY</span>
          <span>2026</span>
        </div>

        <div className={styles.heroContent}>
          <motion.div
            className={styles.heroHeading}
            initial={{ opacity: 0, y: 45 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <span className={styles.eyebrow}>
              CULTURE / MOVEMENT / DESIGN
            </span>

            <h1>
              STORIES
              <br />
              IN <StrokeText
                color="#101317"
                strokeColor="rgba(16, 19, 23, 0.9)"
                strokeWidth={1.1}
              >
                MOTION.
              </StrokeText>
            </h1>
          </motion.div>

          <motion.div
            className={styles.heroSide}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.15,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <p>
              A visual journal exploring movement,
              performance, design and the culture
              surrounding an active life.
            </p>

            <span>
              LAHORE / PAKISTAN
              <br />
              SPIRIT / 2026
            </span>
          </motion.div>
        </div>

        <div className={styles.scrollCue}>
          <span>SCROLL TO EXPLORE</span>

          <ArrowDown
            size={15}
            strokeWidth={1}
          />
        </div>
      </section>

      {/* =====================================================
          FEATURED STORY
      ===================================================== */}

      <section className={styles.featured}>
        <div className={styles.sectionMeta}>
          <span>02</span>
          <span>FEATURED STORY</span>
          <span>01 / 03</span>
        </div>

        <Link
          href="/shop"
          className={styles.featuredLink}
        >
          <div className={styles.featuredImage}>
            <motion.img
              src="/images/campaigns/aeroflextee.jpeg"
              alt="SPIRIT movement editorial"
              initial={{
                scale: 1.06,
              }}
              whileInView={{
                scale: 1,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1],
              }}
            />

            <div className={styles.featuredOverlay} />

            <div className={styles.featuredTop}>
              <span>01</span>
              <span>EDITORIAL / MOVEMENT</span>
            </div>

            <div className={styles.featuredAction}>
              <span>EXPLORE STORY</span>

              <span className={styles.actionIcon}>
                <ArrowUpRight
                  size={17}
                  strokeWidth={1.1}
                />
              </span>
            </div>
          </div>

          <div className={styles.featuredInfo}>
            <span className={styles.featuredCategory}>
              MOVEMENT / 2026
            </span>

            <h2>
              THE BODY
              <br />
              <StrokeText
                color="#101317"
                strokeColor="rgba(16, 19, 23, 0.88)"
                strokeWidth={1}
              >
                IN MOTION.
              </StrokeText>
            </h2>

            <p>
              We design around movement — not
              as a trend, but as a constant part
              of everyday life.
            </p>
          </div>
        </Link>
      </section>

      {/* =====================================================
          STORIES
      ===================================================== */}

      <section className={styles.stories}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionMeta}>
            <span>03</span>
            <span>THE JOURNAL</span>
          </div>

          <p>
            Ideas, images and observations from
            the world around SPIRIT.
          </p>
        </div>

        <div className={styles.storyGrid}>
          {stories.slice(1).map((story, index) => (
            <motion.article
              key={story.number}
              className={styles.storyCard}
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
                amount: 0.15,
              }}
              transition={{
                duration: 0.8,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Link
                href="/shop"
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

                  <div className={styles.storyTop}>
                    <span>{story.number}</span>
                    <span>{story.category}</span>
                  </div>

                  <span className={styles.storyArrow}>
                    <ArrowUpRight
                      size={18}
                      strokeWidth={1.1}
                    />
                  </span>
                </div>

                <div className={styles.storyInfo}>
                  <span>{story.category} / 2026</span>

                  <h2>{story.title}</h2>

                  <p>{story.description}</p>

                  <div className={styles.readMore}>
                    <span>READ STORY</span>

                    <ArrowUpRight
                      size={14}
                      strokeWidth={1.1}
                    />
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </section>

      {/* =====================================================
          MANIFESTO
      ===================================================== */}

      <section className={styles.manifesto}>
        <div className={styles.manifestoMeta}>
          <span>04</span>
          <span>SPIRIT / PHILOSOPHY</span>
          <span>MOVE WITH INTENT</span>
        </div>

        <div className={styles.manifestoContent}>
          <motion.h2
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
            MOVE
            <br />
            <StrokeText
              color="#f5f5f2"
              strokeColor="rgba(245, 245, 242, 0.92)"
              strokeWidth={1.1}
            >
              WITH
            </StrokeText>
            <br />
            INTENT.
          </motion.h2>

          <motion.div
            className={styles.manifestoSide}
            initial={{
              opacity: 0,
              y: 25,
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
              duration: 0.8,
              delay: 0.15,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <p>
              SPIRIT exists for people who see
              movement as part of who they are.
              The training. The commute. The
              recovery. Everything between.
            </p>

            <Link
              href="/collections"
              className={styles.manifestoLink}
            >
              <span>EXPLORE COLLECTIONS</span>

              <span className={styles.manifestoIcon}>
                <ArrowUpRight
                  size={16}
                  strokeWidth={1.1}
                />
              </span>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
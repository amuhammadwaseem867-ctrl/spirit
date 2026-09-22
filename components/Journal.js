"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import StrokeText from "@/components/StrokeText";
import styles from "./Journal.module.css";

const journalStories = [
  {
    number: "01",
    category: "MOVEMENT",
    date: "SPIRIT / 2026",
    title: "WHY WE MOVE",
    excerpt:
      "Movement shapes more than performance. It shapes the way we think, work, train and live.",
    image: "/images/campaigns/coreperformance.jpeg",
    href: "/story/why-we-move",
  },
  {
    number: "02",
    category: "DESIGN",
    date: "SPIRIT / 2026",
    title: "FORM FOLLOWS MOTION",
    excerpt:
      "A closer look at the relationship between form, function and the moving body.",
    image: "/images/campaigns/aeroflextee.jpeg",
    href: "/story/form-follows-motion",
  },
  {
    number: "03",
    category: "CULTURE",
    date: "SPIRIT / 2026",
    title: "THE ACTIVE LIFE",
    excerpt:
      "Performance does not end when training does. It continues into everything around it.",
    image: "/images/campaigns/legging.jpeg",
    href: "/story/the-active-life",
  },
];

export default function Journal() {
  return (
    <section className={styles.journal} id="journal">
      <div className={styles.inner}>

        {/* HEADER */}

        <motion.header
          className={styles.header}
          initial={{
            opacity: 0,
            y: 35,
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
            duration: 0.85,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <div className={styles.meta}>
            <span>07</span>

            <span>
              JOURNAL / STORIES
            </span>

            <span>
              SPIRIT / 2026
            </span>
          </div>

          <div className={styles.headerGrid}>
            <div className={styles.headerLabel}>
              <span className={styles.labelLine} />

              <span>
                THE SPIRIT JOURNAL
              </span>
            </div>

            <div className={styles.headerMain}>
              <h2>
                <span className={styles.solidTitle}>
                  IDEAS IN
                </span>

                <br />

                <StrokeText
                  color="#f5f5f2"
                  strokeColor="rgba(245, 245, 242, 0.9)"
                  strokeWidth={1}
                  className={styles.journalStroke}
                >
                  MOTION.
                </StrokeText>
              </h2>

              <p>
                A collection of stories exploring
                movement, design, performance
                and the culture surrounding an
                active life.
              </p>
            </div>
          </div>
        </motion.header>

        {/* FEATURED JOURNAL */}

        <motion.article
          className={styles.featured}
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
            duration: 0.9,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <Link
            href={journalStories[0].href}
            className={styles.featuredLink}
          >
            <div className={styles.featuredImage}>
              <Image
                src={journalStories[0].image}
                alt={journalStories[0].title}
                fill
                sizes="(max-width: 900px) 92vw, 60vw"
              />

              <div className={styles.featuredOverlay} />

              <div className={styles.featuredTop}>
                <span>
                  {journalStories[0].category}
                </span>

                <span>
                  {journalStories[0].number}
                </span>
              </div>

              <div className={styles.featuredBottom}>
                <div>
                  <span
                    className={styles.featuredEyebrow}
                  >
                    FEATURED JOURNAL
                  </span>

                  <h3>
                    {journalStories[0].title}
                  </h3>
                </div>

                <span className={styles.featuredArrow}>
                  <ArrowUpRight
                    size={22}
                    strokeWidth={1.1}
                  />
                </span>
              </div>
            </div>
          </Link>
        </motion.article>

        {/* FEATURED COPY */}

        <div className={styles.featuredCopy}>
          <span>
            {journalStories[0].date}
          </span>

          <p>
            {journalStories[0].excerpt}
          </p>

          <Link href={journalStories[0].href}>
            READ STORY

            <ArrowUpRight
              size={14}
              strokeWidth={1.1}
            />
          </Link>
        </div>

        {/* JOURNAL LIST */}

        <div className={styles.list}>
          {journalStories.slice(1).map(
            (story, index) => (
              <motion.article
                key={story.number}
                className={styles.story}
                initial={{
                  opacity: 0,
                  y: 35,
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
                  duration: 0.75,
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <Link
                  href={story.href}
                  className={styles.storyLink}
                >
                  <div className={styles.storyNumber}>
                    {story.number}
                  </div>

                  <div className={styles.storyImage}>
                    <Image
                      src={story.image}
                      alt={story.title}
                      fill
                      sizes="(max-width: 900px) 92vw, 30vw"
                    />

                    <div
                      className={
                        styles.storyImageOverlay
                      }
                    />
                  </div>

                  <div className={styles.storyContent}>
                    <div className={styles.storyMeta}>
                      <span>
                        {story.category}
                      </span>

                      <span>
                        {story.date}
                      </span>
                    </div>

                    <h3>
                      {story.title}
                    </h3>

                    <p>
                      {story.excerpt}
                    </p>

                    <span className={styles.storyRead}>
                      READ STORY

                      <ArrowUpRight
                        size={14}
                        strokeWidth={1.1}
                      />
                    </span>
                  </div>
                </Link>
              </motion.article>
            )
          )}
        </div>

        {/* FOOTER */}

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
            SPIRIT / JOURNAL INDEX
          </span>

          <span>
            MOVEMENT / DESIGN / CULTURE
          </span>

          <Link href="/story">
            VIEW ALL

            <ArrowUpRight
              size={14}
              strokeWidth={1.1}
            />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
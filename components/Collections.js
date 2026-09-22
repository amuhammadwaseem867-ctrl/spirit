"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import styles from "./Collections.module.css";

const collections = [
  {
    id: "01",
    title: "WOMEN",
    category: "WOMEN / PERFORMANCE",
    description: "Engineered for movement.",
    image: "/images/collections/women.jpeg",
    href: "/women",
    layout: "wide",
  },
  {
    id: "02",
    title: "MEN",
    category: "MEN / PERFORMANCE",
    description: "Built for every move.",
    image: "/images/collections/men.jpeg",
    href: "/men",
    layout: "narrow",
  },
  {
    id: "03",
    title: "TRAINING",
    category: "TRAINING / ACTIVE",
    description: "Made for intensity.",
    image: "/images/collections/training.jpeg",
    href: "/collections/training",
    layout: "narrow",
  },
  {
    id: "04",
    title: "PERFORMANCE",
    category: "PERFORMANCE / TECHNICAL",
    description: "Form meets function.",
    image: "/images/collections/performance.jpeg",
    href: "/collections/performance",
    layout: "wide",
  },
];

const reveal = {
  hidden: {
    opacity: 0,
    y: 45,
  },

  visible: (index) => ({
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.9,
      delay: index * 0.08,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export default function Collections() {
  return (
    <section
      id="collections"
      className={styles.collections}
    >
      <div className={styles.inner}>
        {/* ================================
            SECTION HEADER
        ================================= */}

        <motion.header
          className={styles.header}
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
            amount: 0.25,
          }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <div className={styles.headerMeta}>
            <span>02</span>

            <span>COLLECTIONS</span>

            <span>SPIRIT / 2026</span>
          </div>

          <div className={styles.headingRow}>
            <h2>
              DESIGNED FOR EVERY
              <br />
              STATE OF MOTION.
            </h2>

            <div className={styles.headingInfo}>
              <span className={styles.infoNumber}>
                04
              </span>

              <p>
                Performance essentials shaped by movement,
                refined through design and made for life
                beyond training.
              </p>
            </div>
          </div>
        </motion.header>

        {/* ================================
            COLLECTION GRID
        ================================= */}

        <div className={styles.grid}>
          {collections.map((collection, index) => (
            <motion.article
              key={collection.id}
              className={`${styles.card} ${
                collection.layout === "wide"
                  ? styles.wide
                  : styles.narrow
              }`}
              custom={index}
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.14,
              }}
            >
              <Link
                href={collection.href}
                className={styles.cardLink}
              >
                <div className={styles.imageWrap}>
                  <Image
                    src={collection.image}
                    alt={`SPIRIT ${collection.title} collection`}
                    className={styles.image}
                    fill
                    priority={index < 2}
                    sizes="(max-width: 900px) 92vw, 60vw"
                  />

                  {/* IMAGE GRADIENT */}

                  <div className={styles.imageShade} />

                  {/* TOP INFORMATION */}

                  <div className={styles.topLine}>
                    <span>
                      {collection.category}
                    </span>

                    <span>
                      {collection.id} / 04
                    </span>
                  </div>

                  {/* SIDE INDEX */}

                  <div className={styles.sideIndex}>
                    {collection.id}
                  </div>

                  {/* BOTTOM CONTENT */}

                  <div className={styles.cardContent}>
                    <div className={styles.titleBlock}>
                      <h3>
                        {collection.title}
                      </h3>

                      <p>
                        {collection.description}
                      </p>
                    </div>

                    <span className={styles.explore}>
                      <span>EXPLORE</span>

                      <span className={styles.arrow}>
                        <ArrowUpRight
                          size={16}
                          strokeWidth={1.15}
                        />
                      </span>
                    </span>
                  </div>

                  {/* BOTTOM LINE */}

                  <div className={styles.cardLine}>
                    <span />
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* ================================
            FOOTER META
        ================================= */}

        <motion.div
          className={styles.footerLine}
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
            delay: 0.2,
          }}
        >
          <span>
            SPIRIT / COLLECTIONS
          </span>

          <span>
            FOUR DIRECTIONS
          </span>

          <span>
            MOVE WITH INTENT
          </span>
        </motion.div>
      </div>
    </section>
  );
}
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import styles from "./Collections.module.css";

const collections = [
  {
    number: "01",
    title: "WOMEN",
    category: "WOMEN / COLLECTION",
    description:
      "Essential silhouettes engineered around movement, balance and everyday performance.",
    image: "/images/collections/women.jpeg",
    href: "/women",
  },
  {
    number: "02",
    title: "MEN",
    category: "MEN / COLLECTION",
    description:
      "Clean technical layers built for training, recovery and everything between.",
    image: "/images/collections/men.jpeg",
    href: "/men",
  },
  {
    number: "03",
    title: "TRAINING",
    category: "TRAINING / COLLECTION",
    description:
      "Focused performance pieces made to move with the body through every session.",
    image: "/images/collections/training.jpeg",
    href: "/shop",
  },
  {
    number: "04",
    title: "PERFORMANCE",
    category: "PERFORMANCE / COLLECTION",
    description:
      "Technical essentials where function, form and restraint come together.",
    image: "/images/collections/performance.jpeg",
    href: "/shop",
  },
];

export default function CollectionsPage() {
  return (
    <main className={styles.collections}>
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className={styles.hero}>
        <div className={styles.heroMeta}>
          <span>01</span>
          <span>SPIRIT / COLLECTIONS</span>
          <span>2026</span>
        </div>

        <div className={styles.heroContent}>
          <motion.div
            className={styles.heroHeading}
            initial={{ opacity: 0, y: 45 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.85,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <span className={styles.eyebrow}>
              DESIGNED FOR MOVEMENT
            </span>

            <h1>
              THE
              <br />
              COLLECTIONS.
            </h1>
          </motion.div>

          <motion.div
            className={styles.heroIntro}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.75,
              delay: 0.15,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <p>
              A considered system of activewear
              built around movement, performance
              and everyday life.
            </p>

            <span>
              04 COLLECTIONS
              <br />
              SPIRIT / 2026
            </span>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          COLLECTION GRID
      ===================================================== */}

      <section className={styles.collectionSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionMeta}>
            <span>02</span>
            <span>EXPLORE COLLECTIONS</span>
          </div>

          <p>
            Explore the SPIRIT system through
            distinct categories designed for
            different forms of movement.
          </p>
        </div>

        <div className={styles.grid}>
          {collections.map((collection, index) => (
            <motion.article
              key={collection.number}
              className={`${styles.card} ${
                index === 1
                  ? styles.cardOffset
                  : ""
              }`}
              initial={{
                opacity: 0,
                y: 55,
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
                delay: (index % 2) * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Link
                href={collection.href}
                className={styles.cardLink}
              >
                <div className={styles.imageWrap}>
                  <Image
                    src={collection.image}
                    alt={`${collection.title} collection`}
                    fill
                    priority={index < 2}
                    sizes="(max-width: 900px) 92vw, 55vw"
                  />

                  <div className={styles.imageOverlay} />

                  <div className={styles.cardTop}>
                    <span>
                      {collection.number}
                    </span>

                    <span>
                      {collection.category}
                    </span>
                  </div>

                  <div className={styles.cardAction}>
                    <span>EXPLORE</span>

                    <span className={styles.actionIcon}>
                      <ArrowUpRight
                        size={16}
                        strokeWidth={1.1}
                      />
                    </span>
                  </div>
                </div>

                <div className={styles.cardInfo}>
                  <h2>{collection.title}</h2>

                  <p>
                    {collection.description}
                  </p>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </section>

      {/* =====================================================
          STATEMENT
      ===================================================== */}

      <section className={styles.statement}>
        <div className={styles.statementMeta}>
          <span>03</span>
          <span>THE SPIRIT SYSTEM</span>
        </div>

        <div className={styles.statementContent}>
          <h2>
            ONE BODY.
            <br />
            <span>EVERY MOVEMENT.</span>
          </h2>

          <div className={styles.statementSide}>
            <p>
              From focused training to the
              moments beyond it, SPIRIT is
              designed as one continuous
              wardrobe for movement.
            </p>

            <Link
              href="/shop"
              className={styles.statementLink}
            >
              <span>SHOP ALL</span>

              <span className={styles.statementIcon}>
                <ArrowUpRight
                  size={16}
                  strokeWidth={1.1}
                />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
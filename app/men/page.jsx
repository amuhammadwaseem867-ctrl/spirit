"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";

import StrokeText from "@/components/StrokeText";
import styles from "./Men.module.css";

const products = [
  {
    number: "01",
    category: "MEN / PERFORMANCE",
    title: "CORE PERFORMANCE",
    image: "/images/campaigns/coreperformance.jpeg",
  },
  {
    number: "02",
    category: "MEN / ESSENTIALS",
    title: "AEROFLEX TEE",
    image: "/images/campaigns/aeroflextee.jpeg",
  },
  {
    number: "03",
    category: "MEN / TRAINING",
    title: "FORM CORP",
    image: "/images/campaigns/form corp.jpeg",
  },
];

const principles = [
  {
    number: "01",
    title: "PRECISION",
    text: "Clean construction and considered silhouettes built around unrestricted movement.",
  },
  {
    number: "02",
    title: "FUNCTION",
    text: "Performance-led pieces designed to move naturally through training and everyday life.",
  },
  {
    number: "03",
    title: "RESTRAINT",
    text: "A focused visual language where technical purpose never overwhelms the form.",
  },
];

export default function MenPage() {
  return (
    <main className={styles.men}>
      {/* HERO */}

      <section className={styles.hero}>
        <div className={styles.heroMeta}>
          <span>01</span>
          <span>SPIRIT / MEN</span>
          <span>2026</span>
        </div>

        <div className={styles.heroContent}>
          <motion.div
            className={styles.heroHeading}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <span className={styles.eyebrow}>
              MEN / PERFORMANCE
            </span>

            <h1>
              BUILT
              <br />
              TO MOVE.
            </h1>
          </motion.div>

          <motion.div
            className={styles.heroSide}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.15,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <p>
              Performance-led essentials for
              training, movement and the life
              beyond it.
            </p>

            <span>
              MEN / 2026
              <br />
              LAHORE / PAKISTAN
            </span>
          </motion.div>
        </div>

        <motion.a
          href="#products"
          className={styles.scrollCue}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <span>SCROLL TO EXPLORE</span>

          <ArrowDown
            size={15}
            strokeWidth={1.1}
          />
        </motion.a>
      </section>

      {/* FEATURED CAMPAIGN */}

      <section className={styles.featured}>
        <div className={styles.featuredMeta}>
          <span>02</span>
          <span>MEN / FEATURED</span>
        </div>

        <div className={styles.featuredLayout}>
          <motion.div
            className={styles.featuredImage}
            initial={{ opacity: 0, scale: 1.03 }}
            whileInView={{
              opacity: 1,
              scale: 1,
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
            <Image
              src="/images/campaigns/coreperformance.jpeg"
              alt="SPIRIT men's performance campaign"
              fill
              priority
              sizes="(max-width: 1100px) 92vw, 62vw"
            />

            <span className={styles.imageNumber}>
              02 / 04
            </span>
          </motion.div>

          <motion.div
            className={styles.featuredCopy}
            initial={{ opacity: 0, y: 35 }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.3,
            }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <span className={styles.copyLabel}>
              CORE PERFORMANCE
            </span>

            <h2>
              ENGINEERED
              <br />
              <StrokeText
                color="#101317"
                strokeColor="rgba(16, 19, 23, 0.88)"
                strokeWidth={1.05}
                className={styles.stroke}
              >
                FOR MOTION.
              </StrokeText>
            </h2>

            <p>
              A focused approach to
              men&apos;s
              activewear. Clean lines, technical
              intent and movement-first design.
            </p>

            <Link
              href="/shop"
              className={styles.featuredLink}
            >
              <span>EXPLORE MEN</span>

              <span className={styles.linkIcon}>
                <ArrowUpRight
                  size={16}
                  strokeWidth={1.1}
                />
              </span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* PRODUCTS */}

      <section
        className={styles.products}
        id="products"
      >
        <div className={styles.productsHeader}>
          <div className={styles.sectionMeta}>
            <span>03</span>
            <span>SELECTED PIECES</span>
          </div>

          <p>
            A considered selection from the
            SPIRIT men&apos;s system.
          </p>
        </div>

        <div className={styles.productGrid}>
          {products.map((product, index) => (
            <motion.article
              key={product.number}
              className={`${styles.product} ${
                index === 1
                  ? styles.productOffset
                  : ""
              }`}
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
                amount: 0.15,
              }}
              transition={{
                duration: 0.75,
                delay: index * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Link
                href="/shop"
                className={styles.productLink}
              >
                <div className={styles.productImage}>
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    sizes="(max-width: 760px) 92vw, 55vw"
                  />

                  <div className={styles.imageShade} />

                  <div className={styles.productTop}>
                    <span>{product.number}</span>
                    <span>{product.category}</span>
                  </div>

                  <div className={styles.productView}>
                    <span>VIEW</span>

                    <span className={styles.viewIcon}>
                      <ArrowUpRight
                        size={15}
                        strokeWidth={1.1}
                      />
                    </span>
                  </div>
                </div>

                <div className={styles.productInfo}>
                  <span>{product.category}</span>
                  <h3>{product.title}</h3>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </section>

      {/* PRINCIPLES */}

      <section className={styles.principles}>
        <div className={styles.principlesMeta}>
          <span>04</span>
          <span>DESIGN PRINCIPLES</span>
        </div>

        <div className={styles.principlesHeading}>
          <h2>
            MADE
            <br />
            <span>WITH INTENT.</span>
          </h2>

          <p>
            Every element has a purpose.
            Nothing added without reason.
          </p>
        </div>

        <div className={styles.principleList}>
          {principles.map((principle, index) => (
            <motion.div
              key={principle.number}
              className={styles.principle}
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
                amount: 0.3,
              }}
              transition={{
                duration: 0.65,
                delay: index * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <span className={styles.principleNumber}>
                {principle.number}
              </span>

              <h3>{principle.title}</h3>

              <p>{principle.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CLOSING */}

      <section className={styles.closing}>
        <div className={styles.closingMeta}>
          <span>05</span>
          <span>SPIRIT / MEN</span>
          <span>2026</span>
        </div>

        <div className={styles.closingContent}>
          <h2>
            MOVE
            <br />
            <StrokeText
              color="#f5f5f2"
              strokeColor="rgba(245, 245, 242, 0.92)"
              strokeWidth={1.1}
              className={styles.closingStroke}
            >
              WITH INTENT.
            </StrokeText>
          </h2>

          <Link
            href="/shop"
            className={styles.closingLink}
          >
            <span>EXPLORE COLLECTION</span>

            <span className={styles.closingIcon}>
              <ArrowUpRight
                size={17}
                strokeWidth={1.1}
              />
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}
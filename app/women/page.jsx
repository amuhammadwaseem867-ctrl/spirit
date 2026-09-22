"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";

import StrokeText from "@/components/StrokeText";
import styles from "./Women.module.css";

const products = [
  {
    number: "01",
    category: "WOMEN / PERFORMANCE",
    title: "AEROFLEX TEE",
    image: "/images/campaigns/aeroflextee.jpeg",
  },
  {
    number: "02",
    category: "WOMEN / TRAINING",
    title: "FORM LEGGING",
    image: "/images/campaigns/legging.jpeg",
  },
  {
    number: "03",
    category: "WOMEN / ESSENTIALS",
    title: "CORE PERFORMANCE",
    image: "/images/campaigns/coreperformance.jpeg",
  },
];

const principles = [
  {
    number: "01",
    title: "FLUIDITY",
    text: "Silhouettes designed to follow the body naturally through every range of movement.",
  },
  {
    number: "02",
    title: "PRECISION",
    text: "Considered construction where proportion, comfort and function work as one.",
  },
  {
    number: "03",
    title: "VERSATILITY",
    text: "Performance essentials created to move seamlessly from training into everyday life.",
  },
];

export default function WomenPage() {
  return (
    <main className={styles.women}>
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className={styles.hero}>
        <div className={styles.heroMeta}>
          <span>01</span>
          <span>SPIRIT / WOMEN</span>
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
              WOMEN / PERFORMANCE
            </span>

            <h1>
              MOVE
              <br />
              FREELY.
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
              Refined activewear designed around
              the body, movement and the rhythm
              of everyday life.
            </p>

            <span>
              WOMEN / 2026
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

      {/* =====================================================
          FEATURED
      ===================================================== */}

      <section className={styles.featured}>
        <div className={styles.featuredMeta}>
          <span>02</span>
          <span>WOMEN / FEATURED</span>
        </div>

        <div className={styles.featuredLayout}>
          <motion.div
            className={styles.featuredImage}
            initial={{
              opacity: 0,
              scale: 1.03,
            }}
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
              src="/images/campaigns/legging.jpeg"
              alt="SPIRIT women's performance campaign"
              fill
              priority
              sizes="(max-width: 1100px) 92vw, 62vw"
            />

            <span className={styles.imageNumber}>
              01 / 04
            </span>
          </motion.div>

          <motion.div
            className={styles.featuredCopy}
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
              amount: 0.3,
            }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <span className={styles.copyLabel}>
              FORM / PERFORMANCE
            </span>

            <h2>
              DESIGNED
              <br />
              <StrokeText
                color="#101317"
                strokeColor="rgba(16, 19, 23, 0.88)"
                strokeWidth={1.05}
                className={styles.stroke}
              >
                TO FOLLOW.
              </StrokeText>
            </h2>

            <p>
              Performance-led silhouettes
              shaped around natural movement.
              Refined enough for everyday wear,
              purposeful enough for training.
            </p>

            <Link
              href="/shop"
              className={styles.featuredLink}
            >
              <span>EXPLORE WOMEN</span>

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

      {/* =====================================================
          PRODUCTS
      ===================================================== */}

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
            A focused selection from the
            SPIRIT women&apos;s system.
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

      {/* =====================================================
          PRINCIPLES
      ===================================================== */}

      <section className={styles.principles}>
        <div className={styles.principlesMeta}>
          <span>04</span>
          <span>DESIGN PRINCIPLES</span>
        </div>

        <div className={styles.principlesHeading}>
          <h2>
            FORM
            <br />
            <span>IN MOTION.</span>
          </h2>

          <p>
            Designed around movement.
            Refined around the body.
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

      {/* =====================================================
          CLOSING
      ===================================================== */}

      <section className={styles.closing}>
        <div className={styles.closingMeta}>
          <span>05</span>
          <span>SPIRIT / WOMEN</span>
          <span>2026</span>
        </div>

        <div className={styles.closingContent}>
          <h2>
            FIND
            <br />
            <StrokeText
              color="#f5f5f2"
              strokeColor="rgba(245, 245, 242, 0.92)"
              strokeWidth={1.1}
              className={styles.closingStroke}
            >
              YOUR FLOW.
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
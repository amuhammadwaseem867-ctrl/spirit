"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import styles from "./ProductShowcase.module.css";

const products = [
  {
    id: "01",
    name: "AEROFLEX TEE",
    category: "MEN / TRAINING",
    image: "/images/campaigns/aeroflextee.jpeg",
    href: "/product/aeroflex-tee",
  },
  {
    id: "02",
    name: "FORM LEGGING",
    category: "WOMEN / PERFORMANCE",
    image: "/images/campaigns/legging.jpeg",
    href: "/product/form-legging",
  },
  {
    id: "03",
    name: "CORE PERFORMANCE",
    category: "MEN / PERFORMANCE",
    image: "/images/campaigns/coreperformance.jpeg",
    href: "/product/core-performance",
  },
  {
    id: "04",
    name: "FORM CORP",
    category: "WOMEN / TRAINING",
    image: "/images/campaigns/form corp.jpeg",
    href: "/product/form-corp",
  },
];

export default function ProductShowcase() {
  return (
    <section id="products" className={styles.products}>
      <div className={styles.inner}>
        {/* HEADER */}
        <motion.header
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <div className={styles.meta}>
            <span>03</span>
            <span>PRODUCTS</span>
            <span>SPIRIT / 2026</span>
          </div>

          <div className={styles.heading}>
            <h2>
              THE PIECES
              <br />
              THAT MOVE WITH YOU.
            </h2>

            <div className={styles.headingSide}>
              <p>
                Refined essentials engineered for
                movement, performance and everyday
                life.
              </p>

              <Link href="/shop" className={styles.shopLink}>
                <span>VIEW ALL PRODUCTS</span>

                <span className={styles.shopIcon}>
                  <ArrowUpRight size={15} strokeWidth={1.15} />
                </span>
              </Link>
            </div>
          </div>
        </motion.header>

        {/* FEATURED PRODUCT */}
        <div className={styles.featured}>
          <motion.div
            className={styles.featuredImage}
            initial={{
              opacity: 0,
              scale: 1.025,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            viewport={{
              once: true,
              amount: 0.15,
            }}
            transition={{
              duration: 1.1,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <Link href={products[0].href}>
              <Image
                src={products[0].image}
                alt={products[0].name}
                fill
                sizes="(max-width: 900px) 92vw, 62vw"
              />

              <div className={styles.featuredOverlay} />

              <div className={styles.featuredMeta}>
                <span>
                  FEATURED / {products[0].id}
                </span>

                <span>
                  {products[0].category}
                </span>
              </div>

              <div className={styles.featuredBottom}>
                <div>
                  <span className={styles.featuredLabel}>
                    SPIRIT ESSENTIAL
                  </span>

                  <h3>{products[0].name}</h3>
                </div>

                <span className={styles.featuredArrow}>
                  <ArrowUpRight
                    size={20}
                    strokeWidth={1.1}
                  />
                </span>
              </div>
            </Link>
          </motion.div>

          {/* FEATURED INFO */}
          <motion.div
            className={styles.featuredInfo}
            initial={{
              opacity: 0,
              x: 25,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.8,
              delay: 0.15,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <div className={styles.infoTop}>
              <span>01 / 04</span>

              <span>
                {products[0].category}
              </span>
            </div>

            <div className={styles.infoMain}>
              <span>01 — FEATURED PIECE</span>

              <h3>{products[0].name}</h3>

              <p>
                Lightweight performance construction
                designed for unrestricted movement,
                training and everyday wear.
              </p>
            </div>

            <Link
              href={products[0].href}
              className={styles.discover}
            >
              <span>DISCOVER PRODUCT</span>

              <ArrowRight
                size={17}
                strokeWidth={1.15}
              />
            </Link>
          </motion.div>
        </div>

        {/* PRODUCT RAIL */}
        <div className={styles.productRail}>
          {products.slice(1).map((product, index) => (
            <motion.article
              key={product.id}
              className={styles.product}
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
                amount: 0.15,
              }}
              transition={{
                duration: 0.75,
                delay: index * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Link
                href={product.href}
                className={styles.productLink}
              >
                <div className={styles.productImage}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 900px) 92vw, 30vw"
                  />

                  <span className={styles.productNumber}>
                    {product.id}
                  </span>

                  <span className={styles.productArrow}>
                    <ArrowUpRight
                      size={16}
                      strokeWidth={1.15}
                    />
                  </span>
                </div>

                <div className={styles.productDetails}>
                  <div>
                    <span>{product.category}</span>

                    <h3>{product.name}</h3>
                  </div>

                  <span className={styles.viewProduct}>
                    VIEW
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* FOOTER */}
        <div className={styles.footer}>
          <span>SPIRIT / PRODUCT INDEX</span>

          <span>PERFORMANCE ESSENTIALS</span>

          <Link href="/shop">
            SHOP ALL

            <ArrowUpRight
              size={13}
              strokeWidth={1.15}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
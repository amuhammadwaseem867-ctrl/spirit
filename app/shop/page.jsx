"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
} from "lucide-react";

import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";
import FitFinder from "@/components/FitFinder";
import StrokeText from "@/components/StrokeText";

import styles from "./Shop.module.css";

const products = [
  {
    number: "01",
    name: "CORE PERFORMANCE",
    category: "PERFORMANCE",
    gender: "MEN",
    sizes: ["S", "M", "L", "XL"],
    image: "/images/campaigns/coreperformance.jpeg",
    slug: "core-performance",
  },
  {
    number: "02",
    name: "AEROFLEX TEE",
    category: "ESSENTIALS",
    gender: "MEN",
    sizes: ["XS", "S", "M", "L", "XL"],
    image: "/images/campaigns/aeroflextee.jpeg",
    slug: "aeroflex-tee",
  },
  {
    number: "03",
    name: "FORM LEGGING",
    category: "TRAINING",
    gender: "WOMEN",
    sizes: ["XS", "S", "M", "L"],
    image: "/images/campaigns/legging.jpeg",
    slug: "form-legging",
  },
  {
    number: "04",
    name: "FORM CORP",
    category: "TRAINING",
    gender: "WOMEN",
    sizes: ["XS", "S", "M", "L", "XL"],
    image: "/images/campaigns/form corp.jpeg",
    slug: "form-corp",
  },
];

const collections = [
  {
    number: "01",
    label: "WOMEN",
    href: "/women",
  },
  {
    number: "02",
    label: "MEN",
    href: "/men",
  },
  {
    number: "03",
    label: "COLLECTIONS",
    href: "/collections",
  },
];

const DEFAULT_FILTERS = {
  category: "ALL",
  gender: "ALL",
  size: "ALL",
  sort: "FEATURED",
};

export default function ShopPage() {
  const [filters, setFilters] =
    useState(DEFAULT_FILTERS);

  const [fitFinderOpen, setFitFinderOpen] =
    useState(false);

  /*
   * Support deep links such as /shop?category=TRAINING
   * (used by the Fit Finder recommendations). The state
   * update is deferred out of the effect body to avoid
   * synchronous cascading renders.
   */
  useEffect(() => {
    const category = new URLSearchParams(
      window.location.search
    ).get("category");

    if (
      category === "PERFORMANCE" ||
      category === "TRAINING" ||
      category === "ESSENTIALS"
    ) {
      const id = window.setTimeout(() => {
        setFilters((current) => ({
          ...current,
          category,
        }));
      }, 0);

      return () => window.clearTimeout(id);
    }
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (filters.category !== "ALL") {
      result = result.filter(
        (product) =>
          product.category === filters.category
      );
    }

    if (filters.gender !== "ALL") {
      result = result.filter(
        (product) =>
          product.gender === filters.gender
      );
    }

    if (filters.size !== "ALL") {
      result = result.filter((product) =>
        product.sizes?.includes(filters.size)
      );
    }

    switch (filters.sort) {
      case "NEWEST":
        result.reverse();
        break;

      case "A — Z":
        result.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        break;

      case "Z — A":
        result.sort((a, b) =>
          b.name.localeCompare(a.name)
        );
        break;

      default:
        break;
    }

    return result;
  }, [filters]);

  return (
    <main className={styles.shop}>
      {/* HERO */}

      <section className={styles.hero}>
        <div className={styles.heroMeta}>
          <span>01</span>
          <span>SPIRIT / SHOP</span>
          <span>2026</span>
        </div>

        <div className={styles.heroContent}>
          <motion.div
            className={styles.heroHeading}
            initial={{
              opacity: 0,
              y: 45,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.85,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <span className={styles.eyebrow}>
              DESIGNED FOR MOVEMENT
            </span>

            <h1>
              MOVE
              <br />
              <StrokeText
                color="#101317"
                strokeColor="rgba(16, 19, 23, 0.95)"
                strokeWidth={1.2}
              >
                YOUR WAY.
              </StrokeText>
            </h1>
          </motion.div>

          <motion.div
            className={styles.heroIntro}
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.12,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <p>
              A considered system of activewear
              designed around movement,
              performance and everyday life.
            </p>

            <span>
              LAHORE / PAKISTAN
              <br />
              WORLDWIDE / ONLINE
            </span>

            <button
              type="button"
              className={styles.fitTrigger}
              onClick={() =>
                setFitFinderOpen(true)
              }
            >
              <span>FIND YOUR FIT</span>

              <ArrowUpRight
                size={15}
                strokeWidth={1.1}
              />
            </button>
          </motion.div>
        </div>

        <motion.div
          className={styles.heroScroll}
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.7,
            duration: 0.6,
          }}
        >
          <span>SCROLL TO EXPLORE</span>

          <ArrowDown
            size={16}
            strokeWidth={1}
          />
        </motion.div>
      </section>

      {/* COLLECTION NAVIGATION */}

      <section className={styles.categories}>
        <div className={styles.sectionMeta}>
          <span>02</span>
          <span>EXPLORE</span>
        </div>

        <div className={styles.categoryGrid}>
          {collections.map((collection) => (
            <Link
              key={collection.number}
              href={collection.href}
              className={styles.categoryLink}
            >
              <span>{collection.number}</span>

              <strong>{collection.label}</strong>

              <ArrowUpRight
                size={18}
                strokeWidth={1.1}
              />
            </Link>
          ))}
        </div>
      </section>

      {/* PRODUCT SYSTEM */}

      <section className={styles.productsSection}>
        <div className={styles.productsHeader}>
          <div>
            <div className={styles.sectionMeta}>
              <span>03</span>
              <span>ALL PRODUCTS</span>
            </div>

            <h2>
              THE
              <br />
              SYSTEM.
            </h2>
          </div>

          <p>
            Performance pieces and everyday
            essentials designed to work
            together as one wardrobe.
          </p>
        </div>

        <div className={styles.filterWrap}>
          <ProductFilters
            filters={filters}
            onChange={setFilters}
            resultCount={filteredProducts.length}
          />
        </div>

        {filteredProducts.length > 0 ? (
          <div className={styles.productGrid}>
            {filteredProducts.map(
              (product, index) => (
                <motion.div
                  key={product.slug}
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
                    amount: 0.08,
                  }}
                  transition={{
                    duration: 0.65,
                    delay:
                      (index % 2) * 0.06,
                    ease: [
                      0.16,
                      1,
                      0.3,
                      1,
                    ],
                  }}
                >
                  <ProductCard
                    product={product}
                    index={index}
                    priority={index < 2}
                  />
                </motion.div>
              )
            )}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <span>NO PRODUCTS FOUND</span>

            <p>
              Adjust the selected filters
              to explore the SPIRIT system.
            </p>

            <button
              type="button"
              onClick={() =>
                setFilters(DEFAULT_FILTERS)
              }
            >
              CLEAR FILTERS
              <ArrowUpRight
                size={15}
                strokeWidth={1.1}
              />
            </button>
          </div>
        )}
      </section>

      {/* STATEMENT */}

      <section className={styles.statement}>
        <div className={styles.statementMeta}>
          <span>04</span>
          <span>SPIRIT / PHILOSOPHY</span>
        </div>

        <div className={styles.statementContent}>
          <h2>
            MADE
            <br />
            <StrokeText
              color="#f5f5f2"
              strokeColor="rgba(245, 245, 242, 0.95)"
              strokeWidth={1.2}
            >
              FOR
            </StrokeText>
            <br />
            MOVEMENT.
          </h2>

          <div className={styles.statementSide}>
            <p>
              From focused training to the
              moments beyond it, SPIRIT
              is designed as one continuous
              wardrobe for movement.
            </p>

            <Link
              href="/collections"
              className={styles.statementLink}
            >
              <span>
                EXPLORE COLLECTIONS
              </span>

              <ArrowUpRight
                size={16}
                strokeWidth={1.1}
              />
            </Link>
          </div>
        </div>
      </section>

      {/* CLOSING */}

      <section className={styles.closing}>
        <div className={styles.closingMeta}>
          <span>05</span>
          <span>SPIRIT / 2026</span>
        </div>

        <div className={styles.closingContent}>
          <span className={styles.closingEyebrow}>
            DESIGNED FOR MOVEMENT
          </span>

          <h2>
            FIND
            <br />
            <StrokeText
              color="#101317"
              strokeColor="rgba(16, 19, 23, 0.95)"
              strokeWidth={1.2}
            >
              YOUR SPIRIT.
            </StrokeText>
          </h2>

          <Link
            href="/collections"
            className={styles.closingLink}
          >
            <span>EXPLORE SPIRIT</span>

            <ArrowUpRight
              size={17}
              strokeWidth={1.1}
            />
          </Link>
        </div>
      </section>

      {/* FIT FINDER */}

      <FitFinder
        isOpen={fitFinderOpen}
        onClose={() => setFitFinderOpen(false)}
      />
    </main>
  );
}
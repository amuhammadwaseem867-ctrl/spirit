"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowRight } from "lucide-react";

import styles from "./MegaMenu.module.css";

const menuData = {
  WOMEN: {
    eyebrow: "WOMEN / SPIRIT",
    title: "MOVE FREELY.",
    description:
      "Fluid silhouettes and considered performance pieces designed around the female form.",
    image: "/images/campaigns/legging.jpeg",
    imageLabel: "WOMEN / 01",
    links: [
      {
        label: "NEW ARRIVALS",
        href: "/women",
      },
      {
        label: "TRAINING",
        href: "/shop",
      },
      {
        label: "ESSENTIALS",
        href: "/shop",
      },
      {
        label: "LEGGINGS",
        href: "/women",
      },
      {
        label: "TOPS",
        href: "/women",
      },
    ],
  },

  MEN: {
    eyebrow: "MEN / SPIRIT",
    title: "BUILT TO MOVE.",
    description:
      "Technical layers and refined essentials created for training, recovery and everyday motion.",
    image: "/images/campaigns/coreperformance.jpeg",
    imageLabel: "MEN / 01",
    links: [
      {
        label: "NEW ARRIVALS",
        href: "/men",
      },
      {
        label: "PERFORMANCE",
        href: "/shop",
      },
      {
        label: "TRAINING",
        href: "/shop",
      },
      {
        label: "TEES",
        href: "/men",
      },
      {
        label: "LAYERS",
        href: "/men",
      },
    ],
  },

  COLLECTIONS: {
    eyebrow: "COLLECTIONS / SPIRIT",
    title: "THE SYSTEM.",
    description:
      "A considered wardrobe built around different forms of movement.",
    image: "/images/collections/performance.jpeg",
    imageLabel: "COLLECTIONS / 01",
    links: [
      {
        label: "WOMEN",
        href: "/women",
      },
      {
        label: "MEN",
        href: "/men",
      },
      {
        label: "TRAINING",
        href: "/shop",
      },
      {
        label: "PERFORMANCE",
        href: "/shop",
      },
      {
        label: "VIEW ALL",
        href: "/collections",
      },
    ],
  },
};

export default function MegaMenu({
  active,
  onClose,
}) {
  const data = menuData[active];

  if (!data) return null;

  return (
    <motion.div
      className={styles.menu}
      initial={{
        opacity: 0,
        y: -10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: -10,
      }}
      transition={{
        duration: 0.28,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseLeave={onClose}
    >
      <div className={styles.inner}>
        {/* TOP META */}
        <div className={styles.meta}>
          <span>{data.eyebrow}</span>

          <span>SPIRIT / 2026</span>

          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close menu"
          >
            CLOSE
            <span>×</span>
          </button>
        </div>

        <div className={styles.content}>
          {/* LEFT */}
          <div className={styles.intro}>
            <motion.span
              className={styles.number}
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.04,
                duration: 0.4,
              }}
            >
              0{active === "WOMEN" ? "1" : active === "MEN" ? "2" : "3"}
            </motion.span>

            <motion.h2
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.06,
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {data.title}
            </motion.h2>

            <motion.p
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.1,
                duration: 0.5,
              }}
            >
              {data.description}
            </motion.p>

            <Link
              href={
                active === "WOMEN"
                  ? "/women"
                  : active === "MEN"
                    ? "/men"
                    : "/collections"
              }
              className={styles.explore}
              onClick={onClose}
            >
              <span>EXPLORE {active}</span>

              <span
                className={styles.exploreIcon}
              >
                <ArrowUpRight
                  size={16}
                  strokeWidth={1.1}
                />
              </span>
            </Link>
          </div>

          {/* LINKS */}
          <nav
            className={styles.links}
            aria-label={`${active} navigation`}
          >
            <div className={styles.linksHeader}>
              <span>EXPLORE</span>
              <span>
                {String(data.links.length).padStart(
                  2,
                  "0"
                )}{" "}
                LINKS
              </span>
            </div>

            <div className={styles.linkList}>
              {data.links.map(
                (link, index) => (
                  <motion.div
                    key={link.label}
                    initial={{
                      opacity: 0,
                      x: 15,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      delay:
                        0.06 + index * 0.035,
                      duration: 0.35,
                    }}
                  >
                    <Link
                      href={link.href}
                      className={styles.link}
                      onClick={onClose}
                    >
                      <span
                        className={
                          styles.linkNumber
                        }
                      >
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <span
                        className={
                          styles.linkLabel
                        }
                      >
                        {link.label}
                      </span>

                      <ArrowRight
                        size={15}
                        strokeWidth={1}
                        className={
                          styles.linkArrow
                        }
                      />
                    </Link>
                  </motion.div>
                )
              )}
            </div>
          </nav>

          {/* FEATURED IMAGE */}
          <motion.div
            className={styles.featured}
            initial={{
              opacity: 0,
              scale: 1.03,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.55,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <Link
              href={
                active === "WOMEN"
                  ? "/women"
                  : active === "MEN"
                    ? "/men"
                    : "/collections"
              }
              onClick={onClose}
              className={styles.featuredLink}
            >
              <div
                className={styles.imageWrap}
              >
                <Image
                  src={data.image}
                  alt={`${active} SPIRIT`}
                  fill
                  sizes="330px"
                  className={styles.image}
                />

                <div
                  className={
                    styles.imageOverlay
                  }
                />

                <div
                  className={
                    styles.imageMeta
                  }
                >
                  <span>
                    {data.imageLabel}
                  </span>

                  <ArrowUpRight
                    size={16}
                    strokeWidth={1.1}
                  />
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* BOTTOM */}
        <div className={styles.bottom}>
          <span>
            LAHORE / PAKISTAN
          </span>

          <span>
            DESIGNED FOR MOVEMENT
          </span>

          <span>
            WORLDWIDE / ONLINE
          </span>
        </div>
      </div>
    </motion.div>
  );
}
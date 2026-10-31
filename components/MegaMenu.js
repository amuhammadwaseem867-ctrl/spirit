"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import TiltCard from "@/components/ui/TiltCard";

import styles from "./MegaMenu.module.css";

const menuData = {
  WOMEN: {
    index: "01",
    title: "MOVE FREELY.",
    description:
      "Fluid silhouettes and considered performance pieces designed around the female form.",
    image: "/images/campaigns/legging.jpeg",
    href: "/women",
    links: [
      { label: "New arrivals", href: "/women" },
      { label: "Training", href: "/shop?category=TRAINING" },
      { label: "Essentials", href: "/shop?category=ESSENTIALS" },
      { label: "Leggings", href: "/product/form-legging" },
      { label: "Tops", href: "/product/form-corp" },
    ],
  },
  MEN: {
    index: "02",
    title: "BUILT TO MOVE.",
    description:
      "Technical layers and refined essentials created for training, recovery and everyday motion.",
    image: "/images/campaigns/coreperformance.jpeg",
    href: "/men",
    links: [
      { label: "New arrivals", href: "/men" },
      { label: "Performance", href: "/shop?category=PERFORMANCE" },
      { label: "Training", href: "/shop?category=TRAINING" },
      { label: "Tees", href: "/product/aeroflex-tee" },
      { label: "Layers", href: "/product/core-performance" },
    ],
  },
  COLLECTIONS: {
    index: "03",
    title: "THE SYSTEM.",
    description: "A considered wardrobe built around different forms of movement.",
    image: "/images/collections/performance.jpeg",
    href: "/collections",
    links: [
      { label: "Women", href: "/women" },
      { label: "Men", href: "/men" },
      { label: "Training", href: "/shop?category=TRAINING" },
      { label: "Performance", href: "/shop?category=PERFORMANCE" },
      { label: "View all", href: "/collections" },
    ],
  },
};

const ease = [0.16, 1, 0.3, 1];

export default function MegaMenu({ active, onClose }) {
  const data = menuData[active];

  if (!data) return null;

  return (
    <motion.div
      className={styles.menu}
      style={{ transformPerspective: 1200 }}
      initial={{ opacity: 0, rotateX: -14, y: -12 }}
      animate={{ opacity: 1, rotateX: 0, y: 0 }}
      exit={{ opacity: 0, rotateX: -10, y: -8, transition: { duration: 0.25 } }}
      transition={{ duration: 0.6, ease }}
      onMouseLeave={onClose}
    >
      <div className={styles.inner}>
        <div className={styles.intro}>
          <span className={styles.index}>
            {data.index} — {active}
          </span>
          <motion.h2
            className={`display ${styles.title}`}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.06, ease }}
          >
            {data.title}
          </motion.h2>
          <p>{data.description}</p>
          <Link href={data.href} className="link-line" onClick={onClose}>
            Explore {active.toLowerCase()} <ArrowUpRight size={14} strokeWidth={1.5} />
          </Link>
        </div>

        <nav className={styles.links} aria-label={`${active} navigation`}>
          {data.links.map((link, index) => (
            <motion.div
              key={link.label}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.08 + index * 0.04, ease }}
            >
              <Link href={link.href} className={styles.link} onClick={onClose}>
                <span className={styles.linkIndex}>{String(index + 1).padStart(2, "0")}</span>
                <span className={styles.linkLabel}>{link.label}</span>
                <ArrowUpRight size={16} strokeWidth={1.4} className={styles.linkArrow} />
              </Link>
            </motion.div>
          ))}
        </nav>

        <TiltCard className={styles.feature} max={6}>
          <Link href={data.href} onClick={onClose} className={styles.featureLink} tabIndex={-1} aria-hidden="true">
            <Image src={data.image} alt="" fill sizes="340px" className={styles.featureImage} />
            <span className={styles.featureLabel}>
              {active} / {data.index}
              <ArrowUpRight size={16} strokeWidth={1.5} />
            </span>
          </Link>
        </TiltCard>
      </div>
    </motion.div>
  );
}

"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import KineticText from "@/components/ui/KineticText";

import styles from "./Collections.module.css";

const collections = [
  {
    id: "01",
    title: "WOMEN",
    category: "Women / Performance",
    description: "Fluid silhouettes and second-skin layers engineered around the female form.",
    image: "/images/collections/women.jpeg",
    alt: "Athlete walking across a wide concrete hall in SPIRIT womenswear",
    href: "/women",
  },
  {
    id: "02",
    title: "MEN",
    category: "Men / Performance",
    description: "Technical layers and refined essentials for training, recovery and everyday motion.",
    image: "/images/collections/men.jpeg",
    alt: "Athlete walking through a column of light in SPIRIT menswear",
    href: "/men",
  },
  {
    id: "03",
    title: "TRAINING",
    category: "Training / Active",
    description: "Focused pieces cut to follow every angle of a session — nothing to adjust, nothing to think about.",
    image: "/images/collections/training.jpeg",
    alt: "Athlete in a lateral lunge on a sunlit concrete floor",
    href: "/shop?category=TRAINING",
  },
  {
    id: "04",
    title: "PERFORMANCE",
    category: "Performance / Technical",
    description: "Technical essentials where function, form and restraint come together.",
    image: "/images/collections/performance.jpeg",
    alt: "Athlete in a technical jacket walking through a concrete atrium",
    href: "/shop?category=PERFORMANCE",
  },
];

const SPREAD = 34;

function Card({ item, index, active }) {
  /*
   * Each card sits on a curved rail. Its angle is its distance from
   * the active position, so scrolling swings the whole arc.
   */
  const transform = useTransform(active, (value) => {
    const offset = index - value;
    /* cards already seen swing away faster, clearing the copy column */
    const angle = offset < 0 ? offset * SPREAD * 2.4 : offset * SPREAD;
    return `rotateY(${angle}deg) translateZ(var(--radius))`;
  });

  const shade = useTransform(active, (value) => {
    const offset = index - value;
    return offset < 0
      ? Math.min(1, -offset * 1.3)
      : Math.min(0.78, offset * 0.42);
  });

  return (
    <motion.article className={styles.card} style={{ transform }}>
      <Link
        href={item.href}
        className={styles.cardLink}
        data-cursor="EXPLORE"
        aria-label={`${item.title} collection`}
      >
        <div className={styles.media}>
          <Image
            src={item.image}
            alt={item.alt}
            fill
            sizes="(max-width: 900px) 78vw, 30vw"
            className={styles.image}
          />
          <motion.span className={styles.shade} style={{ opacity: shade }} />
        </div>

        <div className={styles.cardTop}>
          <span>{item.id}</span>
          <span>{item.category}</span>
        </div>

        <div className={styles.cardBottom}>
          <span className={`display ${styles.cardTitle}`}>{item.title}</span>
          <span className={styles.cardIcon}>
            <ArrowUpRight size={18} strokeWidth={1.5} />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}

export default function Collections() {
  const sectionRef = useRef(null);
  const [current, setCurrent] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const active = useTransform(
    scrollYProgress,
    [0.06, 0.94],
    [0, collections.length - 1],
    { clamp: true }
  );

  useMotionValueEvent(active, "change", (value) => {
    const next = Math.round(value);
    if (next !== current) setCurrent(next);
  });

  const bar = useTransform(scrollYProgress, [0.06, 0.94], [0, 1]);
  const item = collections[current];

  return (
    <section
      ref={sectionRef}
      id="collections"
      className={`${styles.collections} surface-bone`}
    >
      <div className={styles.stage}>
        <div className={`wrap ${styles.layout}`}>
          <div className="meta">
            <span>02</span>
            <span>COLLECTIONS</span>
            <span>FOUR DIRECTIONS</span>
          </div>

          <div className={styles.copy}>
            <h2 className={`display ${styles.heading}`}>
              Designed for every state of motion.
            </h2>

            <div className={styles.detail} aria-live="polite">
              <span className={styles.count}>
                <strong>{item.id}</strong> / {String(collections.length).padStart(2, "0")}
              </span>

              <KineticText
                key={item.id}
                as="h3"
                lines={[item.title]}
                trigger="mount"
                className={`display ${styles.title}`}
                stagger={22}
              />

              <p key={`${item.id}-copy`} className={styles.description}>
                {item.description}
              </p>

              <Link href={item.href} className="btn btn-dark" data-magnetic="0.25">
                <span className="btn-label">Explore {item.title.toLowerCase()}</span>
                <span className="btn-icon">
                  <ArrowUpRight size={16} strokeWidth={1.5} />
                </span>
              </Link>
            </div>

            <div className={styles.progress} aria-hidden="true">
              <motion.span style={{ scaleX: bar }} />
            </div>
          </div>
        </div>

        <div className={styles.arc}>
          <div className={styles.ring}>
            {collections.map((collection, index) => (
              <Card
                key={collection.id}
                item={collection}
                index={index}
                active={active}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

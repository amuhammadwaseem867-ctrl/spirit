"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import KineticText from "@/components/ui/KineticText";
import Reveal from "@/components/ui/Reveal";
import RiseImage from "@/components/ui/RiseImage";

import styles from "./Collections.module.css";

const collections = [
  {
    number: "01",
    title: "WOMEN",
    category: "Women / Collection",
    description:
      "Essential silhouettes engineered around movement, balance and everyday performance.",
    image: "/images/collections/women.jpeg",
    alt: "Athlete walking across a wide concrete hall",
    ratio: "16 / 10",
    href: "/women",
  },
  {
    number: "02",
    title: "MEN",
    category: "Men / Collection",
    description:
      "Clean technical layers built for training, recovery and everything between.",
    image: "/images/collections/men.jpeg",
    alt: "Athlete walking through a column of light",
    ratio: "4 / 5",
    href: "/men",
  },
  {
    number: "03",
    title: "TRAINING",
    category: "Training / Collection",
    description:
      "Focused performance pieces made to move with the body through every session.",
    image: "/images/collections/training.jpeg",
    alt: "Athlete in a lateral lunge on a sunlit concrete floor",
    ratio: "16 / 10",
    href: "/shop?category=TRAINING",
  },
  {
    number: "04",
    title: "PERFORMANCE",
    category: "Performance / Collection",
    description:
      "Technical essentials where function, form and restraint come together.",
    image: "/images/collections/performance.jpeg",
    alt: "Athlete in a technical jacket walking through a concrete atrium",
    ratio: "4 / 5",
    href: "/shop?category=PERFORMANCE",
  },
];

export default function CollectionsPage() {
  return (
    <main>
      <PageHero
        index="01"
        label="COLLECTIONS"
        title={["THE", "COLLECTIONS."]}
        outline={[1]}
        intro="A considered system of activewear built around movement, performance and everyday life."
        aside={"04 Collections\nSPIRIT / 2026"}
      />

      <section className={`${styles.list} surface-ink`}>
        <div className="wrap">
          <div className="meta">
            <span>02</span>
            <span>The system</span>
            <span>Four directions</span>
          </div>

          {collections.map((item, index) => (
            <article
              key={item.number}
              className={styles.row}
              data-flip={index % 2 === 1 ? "true" : "false"}
            >
              <Link href={item.href} className={styles.media} data-cursor="EXPLORE" aria-label={`${item.title} collection`}>
                <RiseImage
                  src={item.image}
                  alt={item.alt}
                  ratio={item.ratio}
                  priority={index === 0}
                  sizes="(max-width: 1000px) 92vw, 58vw"
                />
              </Link>

              <Reveal className={styles.copy}>
                <span className={`reveal ${styles.number}`}>
                  {item.number} / 04
                </span>
                <KineticText
                  as="h2"
                  lines={[item.title]}
                  className={`display ${styles.title}`}
                />
                <span className="eyebrow reveal" style={{ "--rd": "80ms" }}>
                  {item.category}
                </span>
                <p className="reveal" style={{ "--rd": "140ms" }}>
                  {item.description}
                </p>
                <Link href={item.href} className="link-line reveal" style={{ "--rd": "200ms" }}>
                  Explore {item.title.toLowerCase()} <ArrowUpRight size={14} strokeWidth={1.5} />
                </Link>
              </Reveal>
            </article>
          ))}
        </div>
      </section>

      <CtaBand
        index="03"
        label="SPIRIT / One system"
        title={["ONE BODY.", "ONE SYSTEM."]}
        copy="From focused training to the moments beyond it, SPIRIT is designed as one continuous wardrobe for movement."
        href="/shop"
        cta="Shop everything"
      />
    </main>
  );
}

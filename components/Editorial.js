"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import KineticText from "@/components/ui/KineticText";
import ScrubText from "@/components/ui/ScrubText";

import styles from "./Editorial.module.css";

const stories = [
  {
    number: "01",
    category: "Campaign / 001",
    title: "FORM IN MOTION",
    image: "/images/campaigns/aeroflextee.jpeg",
    alt: "Athlete standing in a brutalist courtyard",
  },
  {
    number: "02",
    category: "Campaign / 002",
    title: "THE DAILY ATHLETE",
    image: "/images/campaigns/legging.jpeg",
    alt: "Athlete walking along a concrete corridor",
  },
  {
    number: "03",
    category: "Culture / 003",
    title: "BUILT FOR THE PACE",
    image: "/images/campaigns/form corp.jpeg",
    alt: "Athlete striding past concrete and glass",
  },
];

/*
 * The frame starts tipped back (rotateX) and scaled down, then
 * stands up flat as it reaches the middle of the viewport, like a
 * print being lifted off a table toward the reader.
 */
function RiseFrame({ story, featured = false, sizes }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center 0.55"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [featured ? 28 : 22, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [featured ? 0.82 : 0.88, 1]);
  const y = useTransform(scrollYProgress, [0, 1], ["8%", "0%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.25, 1.02]);

  return (
    <div ref={ref} className={styles.riseWrap}>
      <motion.div
        className={`${styles.frame} ${featured ? styles.frameFeatured : ""}`}
        style={{ rotateX, scale, y }}
      >
        <Link
          href="/story"
          className={styles.frameLink}
          data-cursor="READ"
          aria-label={`Read ${story.title}`}
        >
          <motion.div className={styles.frameMedia} style={{ scale: imageScale }}>
            <Image src={story.image} alt={story.alt} fill sizes={sizes} className={styles.image} />
          </motion.div>

          <div className={styles.frameTop}>
            <span>{story.category}</span>
            <span>{story.number}</span>
          </div>

          <div className={styles.frameBottom}>
            <span className={`display ${featured ? styles.featuredTitle : styles.storyTitle}`}>
              {story.title}
            </span>
            <span className={styles.frameIcon}>
              <ArrowUpRight size={18} strokeWidth={1.5} />
            </span>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}

export default function Editorial() {
  return (
    <section id="editorial" className={`${styles.editorial} surface-ink`}>
      <div className="wrap">
        <div className="meta">
          <span>08</span>
          <span>EDITORIAL / CULTURE</span>
          <span>THE SPIRIT EDIT</span>
        </div>

        <div className={styles.header}>
          <KineticText
            as="h2"
            lines={["MOVEMENT,", "BEYOND", "PERFORMANCE."]}
            outline={[1]}
            className={`display ${styles.heading}`}
          />
          <p className={styles.headerCopy}>
            Stories, people and perspectives surrounding the active life.
          </p>
        </div>

        <RiseFrame story={stories[0]} featured sizes="92vw" />

        <div className={styles.intro}>
          <span className="eyebrow">Editorial / 001</span>
          <ScrubText
            className={styles.introText}
            text="Movement is more than performance. It is how we travel, work, train, recover and exist. SPIRIT explores the space between athletic purpose and everyday life."
          />
        </div>

        <div className={styles.grid}>
          {stories.slice(1).map((story) => (
            <RiseFrame key={story.number} story={story} sizes="(max-width: 900px) 92vw, 46vw" />
          ))}
        </div>

        <div className={styles.footer}>
          <span className="mono">Stories / culture / movement</span>
          <Link href="/story" className="link-line">
            View all stories <ArrowUpRight size={14} strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </section>
  );
}

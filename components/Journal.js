"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import KineticText from "@/components/ui/KineticText";
import Reveal from "@/components/ui/Reveal";
import { addTick, TICK } from "@/lib/ticker";
import { pointer } from "@/lib/pointer";

import styles from "./Journal.module.css";

const entries = [
  {
    number: "01",
    category: "Movement",
    title: "Why we move",
    excerpt: "Movement shapes more than performance. It shapes the way we think, work, train and live.",
    image: "/images/campaigns/coreperformance.jpeg",
  },
  {
    number: "02",
    category: "Design",
    title: "Form follows motion",
    excerpt: "A closer look at the relationship between form, function and the moving body.",
    image: "/images/campaigns/aeroflextee.jpeg",
  },
  {
    number: "03",
    category: "Culture",
    title: "The active life",
    excerpt: "Performance does not end when training does. It continues into everything around it.",
    image: "/images/campaigns/legging.jpeg",
  },
];

/**
 * Index-style list. On desktop a floating preview follows the
 * pointer and leans with its velocity; on touch devices each row
 * shows its own thumbnail instead.
 */
export default function Journal() {
  const previewRef = useRef(null);
  const [hovered, setHovered] = useState(-1);

  useEffect(() => {
    const preview = previewRef.current;
    if (!preview) return undefined;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!fine) return undefined;

    const pos = { x: pointer.x, y: pointer.y, lean: 0 };

    return addTick(() => {
      const dx = pointer.x - pos.x;
      const ease = reduce ? 1 : 0.12;

      pos.x += dx * ease;
      pos.y += (pointer.y - pos.y) * ease;
      pos.lean += (Math.max(-14, Math.min(14, dx * 0.12)) - pos.lean) * 0.12;

      preview.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) rotate(${reduce ? 0 : pos.lean}deg)`;
    }, TICK.CURSOR);
  }, []);

  return (
    <section id="journal" className={`${styles.journal} surface-bone`}>
      <div className="wrap">
        <div className="meta">
          <span>09</span>
          <span>JOURNAL / STORIES</span>
          <span>THE SPIRIT JOURNAL</span>
        </div>

        <div className={styles.header}>
          <KineticText
            as="h2"
            lines={["IDEAS IN", "MOTION."]}
            outline={[1]}
            className={`display ${styles.heading}`}
          />
          <p>
            A collection of stories exploring movement, design, performance
            and the culture surrounding an active life.
          </p>
        </div>

        <Reveal as="ol" className={styles.list} threshold={0.1} onPointerLeave={() => setHovered(-1)}>
          {entries.map((entry, index) => (
            <li
              key={entry.number}
              className={`reveal ${styles.row}`}
              style={{ "--rd": `${index * 90}ms` }}
              data-dim={hovered !== -1 && hovered !== index ? "true" : "false"}
              onPointerEnter={() => setHovered(index)}
            >
              <Link href="/story" className={styles.rowLink}>
                <span className={styles.number}>{entry.number}</span>

                <span className={styles.thumb}>
                  <Image src={entry.image} alt="" fill sizes="120px" />
                </span>

                <span className={styles.title}>
                  <span className="display">{entry.title}</span>
                </span>

                <span className={styles.excerpt}>{entry.excerpt}</span>

                <span className={styles.category}>
                  {entry.category}
                  <ArrowUpRight size={16} strokeWidth={1.5} />
                </span>
              </Link>
            </li>
          ))}
        </Reveal>

        <div className={styles.footer}>
          <span className="mono">Movement / design / culture</span>
          <Link href="/story" className="link-line">
            Read the journal <ArrowUpRight size={14} strokeWidth={1.5} />
          </Link>
        </div>
      </div>

      <div
        ref={previewRef}
        className={styles.preview}
        data-visible={hovered !== -1 ? "true" : "false"}
        aria-hidden="true"
      >
        {entries.map((entry, index) => (
          <span
            key={entry.number}
            className={styles.previewFrame}
            data-active={hovered === index ? "true" : "false"}
          >
            <Image src={entry.image} alt="" fill sizes="320px" />
          </span>
        ))}
      </div>
    </section>
  );
}

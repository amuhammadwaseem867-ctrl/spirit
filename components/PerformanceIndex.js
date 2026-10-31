"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, RotateCw } from "lucide-react";

import KineticText from "@/components/ui/KineticText";
import Reveal from "@/components/ui/Reveal";

import styles from "./PerformanceIndex.module.css";

const principles = [
  {
    number: "01",
    title: "MOBILITY",
    description:
      "Construction that follows the body's natural range of movement without unnecessary restriction.",
  },
  {
    number: "02",
    title: "BALANCE",
    description:
      "Considered proportions and placement designed to keep movement feeling natural and controlled.",
  },
  {
    number: "03",
    title: "RESPONSE",
    description:
      "Performance-minded design that stays focused on movement rather than visual distraction.",
  },
  {
    number: "04",
    title: "RESTRAINT",
    description:
      "Every detail has a purpose. Nothing added simply for decoration.",
  },
];

const stages = [
  { number: "01", label: "MOVE", text: "Built around the way the body moves.", level: 0.38 },
  { number: "02", label: "TRAIN", text: "Focused on the demands of training.", level: 0.68 },
  { number: "03", label: "RECOVER", text: "Designed to transition beyond performance.", level: 1 },
];

function Principle({ item, index }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <li
      className={`reveal ${styles.principle}`}
      style={{ "--rd": `${index * 90}ms` }}
    >
      <button
        type="button"
        className={styles.flip}
        data-flipped={flipped ? "true" : "false"}
        onClick={() => setFlipped((value) => !value)}
        aria-pressed={flipped}
        aria-label={`${item.title}: ${item.description}`}
      >
        <span className={styles.face}>
          <span className={styles.faceTop}>
            <span>{item.number}</span>
            <RotateCw size={14} strokeWidth={1.5} aria-hidden="true" />
          </span>
          <span className={`display ${styles.faceTitle}`}>{item.title}</span>
        </span>

        <span className={`${styles.face} ${styles.back}`} aria-hidden="true">
          <span className={styles.faceTop}>
            <span>{item.number} / Principle</span>
          </span>
          <span className={styles.backText}>{item.description}</span>
        </span>
      </button>
    </li>
  );
}

export default function PerformanceIndex() {
  return (
    <section className={`${styles.section} surface-bone`}>
      <div className="wrap">
        <div className="meta">
          <span>05</span>
          <span>PERFORMANCE INDEX</span>
          <span>LAHORE / PAKISTAN</span>
        </div>

        <div className={styles.header}>
          <KineticText
            as="h2"
            lines={["DESIGNED", "AROUND", "MOVEMENT."]}
            outline={[2]}
            className={`display ${styles.heading}`}
          />

          <Reveal className={styles.intro}>
            <span className="eyebrow reveal">How SPIRIT moves</span>
            <p className="reveal" style={{ "--rd": "80ms" }}>
              Performance is not a single specification. It is the
              relationship between body, garment and movement.
            </p>
          </Reveal>
        </div>

        <Reveal as="ul" className={styles.principles} threshold={0.15}>
          {principles.map((item, index) => (
            <Principle key={item.number} item={item} index={index} />
          ))}
        </Reveal>

        <Reveal className={styles.system} threshold={0.25}>
          <div className={styles.systemHeader}>
            <span className="mono">06 — Movement system</span>
            <p>One wardrobe. Different states of movement.</p>
          </div>

          <ol className={styles.stages}>
            {stages.map((stage, index) => (
              <li key={stage.number} className={`reveal ${styles.stage}`} style={{ "--rd": `${index * 120}ms` }}>
                <div className={styles.stageTop}>
                  <span>{stage.number}</span>
                  <span>Stage</span>
                </div>
                <h3 className="display-condensed">{stage.label}</h3>
                <p>{stage.text}</p>
                <span className={styles.meter}>
                  <span style={{ "--level": stage.level, "--rd": `${300 + index * 160}ms` }} />
                </span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>

      <Reveal className={`${styles.closing} surface-ink`}>
        <div className="wrap">
          <div className="meta">
            <span>07</span>
            <span>FUNCTION / SPIRIT</span>
            <span>2026</span>
          </div>

          <div className={styles.closingBody}>
            <KineticText
              as="h3"
              lines={["FUNCTION", "WITHOUT", "DISTRACTION."]}
              outline={[1]}
              className={`display ${styles.closingHeading}`}
            />

            <Link href="/shop?category=PERFORMANCE" className="btn reveal" data-magnetic="0.25">
              <span className="btn-label">Explore performance</span>
              <span className="btn-icon">
                <ArrowUpRight size={16} strokeWidth={1.5} />
              </span>
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

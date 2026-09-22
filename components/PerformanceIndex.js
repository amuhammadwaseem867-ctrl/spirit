"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  MoveUpRight,
} from "lucide-react";

import StrokeText from "./StrokeText";
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
    title: "RESPONSIVENESS",
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
  {
    number: "01",
    label: "MOVE",
    text: "Built around the way the body moves.",
  },
  {
    number: "02",
    label: "TRAIN",
    text: "Focused on the demands of training.",
  },
  {
    number: "03",
    label: "RECOVER",
    text: "Designed to transition beyond performance.",
  },
];

export default function PerformanceIndex() {
  return (
    <section className={styles.section}>
      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.meta}>
          <span>03</span>
          <span>PERFORMANCE INDEX</span>
          <span>SPIRIT / 2026</span>
        </div>

        <div className={styles.headingWrap}>
          <motion.h2
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
            DESIGNED
            <br />
            AROUND
            <br />
            <StrokeText
              color="#101317"
              strokeColor="rgba(16, 19, 23, 0.9)"
              strokeWidth={1.15}
              className={styles.stroke}
            >
              MOVEMENT.
            </StrokeText>
          </motion.h2>

          <motion.div
            className={styles.intro}
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
              duration: 0.7,
              delay: 0.12,
            }}
          >
            <span className={styles.introLabel}>
              HOW SPIRIT MOVES
            </span>

            <p>
              Performance is not a single
              specification. It is the relationship
              between body, garment and movement.
            </p>

            <span className={styles.location}>
              LAHORE / PAKISTAN
            </span>
          </motion.div>
        </div>
      </div>

      {/* PRINCIPLES */}
      <div className={styles.principles}>
        <div className={styles.principlesHeader}>
          <span>04</span>
          <span>DESIGN PRINCIPLES</span>
          <span>THE SPIRIT SYSTEM</span>
        </div>

        <div className={styles.principlesGrid}>
          {principles.map((item, index) => (
            <motion.article
              key={item.number}
              className={styles.principle}
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
                amount: 0.2,
              }}
              transition={{
                duration: 0.65,
                delay: index * 0.07,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div className={styles.principleTop}>
                <span>{item.number}</span>

                <MoveUpRight
                  size={17}
                  strokeWidth={1}
                />
              </div>

              <h3>{item.title}</h3>

              <p>{item.description}</p>

              <div
                className={styles.principleLine}
              />
            </motion.article>
          ))}
        </div>
      </div>

      {/* MOVEMENT SYSTEM */}
      <div className={styles.system}>
        <div className={styles.systemHeader}>
          <div>
            <span>05</span>
            <span>MOVEMENT SYSTEM</span>
          </div>

          <p>
            One wardrobe. Different states of
            movement.
          </p>
        </div>

        <div className={styles.stages}>
          {stages.map((stage, index) => (
            <motion.div
              key={stage.number}
              className={styles.stage}
              initial={{
                opacity: 0,
              }}
              whileInView={{
                opacity: 1,
              }}
              viewport={{
                once: true,
                amount: 0.25,
              }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
              }}
            >
              <div className={styles.stageTop}>
                <span>{stage.number}</span>

                <ArrowUpRight
                  size={16}
                  strokeWidth={1}
                />
              </div>

              <h3>{stage.label}</h3>

              <p>{stage.text}</p>

              <div className={styles.stageProgress}>
                <span
                  style={{
                    width: `${35 + index * 30}%`,
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CLOSING STATEMENT */}
      <motion.div
        className={styles.closing}
        initial={{
          opacity: 0,
        }}
        whileInView={{
          opacity: 1,
        }}
        viewport={{
          once: true,
          amount: 0.25,
        }}
        transition={{
          duration: 0.8,
        }}
      >
        <div className={styles.closingMeta}>
          <span>06</span>
          <span>PERFORMANCE / SPIRIT</span>
        </div>

        <h3>
          FUNCTION
          <br />
          <StrokeText
            color="#f5f5f2"
            strokeColor="rgba(245, 245, 242, 0.95)"
            strokeWidth={1.15}
            className={styles.darkStroke}
          >
            WITHOUT
          </StrokeText>
          <br />
          DISTRACTION.
        </h3>

        <a
          href="/shop"
          className={styles.cta}
        >
          <span>EXPLORE PERFORMANCE</span>

          <span className={styles.ctaIcon}>
            <ArrowUpRight
              size={17}
              strokeWidth={1.1}
            />
          </span>
        </a>
      </motion.div>
    </section>
  );
}
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";

import StrokeText from "@/components/StrokeText";
import styles from "./Performance.module.css";

const performancePoints = [
  {
    number: "01",
    title: "LIGHTNESS",
    value: "01",
    unit: "WEIGHT",
    description:
      "Engineered constructions that reduce unnecessary weight without compromising structure.",
  },
  {
    number: "02",
    title: "FLEX",
    value: "04",
    unit: "WAY STRETCH",
    description:
      "Adaptive fabric movement designed to follow the body through every range of motion.",
  },
  {
    number: "03",
    title: "BREATHABILITY",
    value: "360°",
    unit: "AIRFLOW",
    description:
      "Ventilation-focused construction designed to keep movement feeling controlled and unrestricted.",
  },
];

export default function Performance() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    ["-8%", "8%"]
  );

  const reveal = (delay = 0) => ({
    initial: {
      opacity: 0,
      y: 45,
    },
    whileInView: {
      opacity: 1,
      y: 0,
    },
    viewport: {
      once: true,
      amount: 0.35,
    },
    transition: {
      duration: 0.85,
      delay,
      ease: [0.16, 1, 0.3, 1],
    },
  });

  return (
    <section
      ref={sectionRef}
      className={styles.performance}
      id="performance"
    >
      {/* HEADER */}

      <div className={styles.header}>
        <motion.div
          className={styles.meta}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span>05</span>
          <span>PERFORMANCE / ENGINEERED</span>
          <span>SPIRIT / 2026</span>
        </motion.div>

        <div className={styles.heading}>
          <motion.div
            className={styles.label}
            initial={{
              opacity: 0,
              x: -20,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.7,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <span className={styles.line} />
            <span>DESIGNED AROUND THE BODY</span>
          </motion.div>

          <motion.h2
            initial={{
              opacity: 0,
              y: 80,
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
              duration: 1,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            PERFORMANCE
            <br />

            <StrokeText
              color="#f5f5f2"
              strokeColor="rgba(245, 245, 242, 0.82)"
              strokeWidth={1}
            >
              WITHOUT DISTRACTION.
            </StrokeText>
          </motion.h2>
        </div>
      </div>

      {/* VISUAL */}

      <div className={styles.visualSection}>
        <motion.div
          className={styles.visual}
          initial={{
            opacity: 0,
            scale: 0.985,
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
            duration: 1,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <motion.img
            src="/images/campaigns/coreperformance.jpeg"
            alt="SPIRIT performance campaign"
            style={{
              y: imageY,
            }}
            loading="lazy"
            decoding="async"
          />

          <div className={styles.visualOverlay} />

          <div className={styles.visualTop}>
            <span>SP / 05</span>
            <span>BODY / MOTION / FORM</span>
          </div>

          <div className={styles.visualCenter}>
            <span className={styles.centerNumber}>01</span>

            <div className={styles.crosshair}>
              <span />
              <span />
            </div>

            <span>ENGINEERED FOR MOVEMENT</span>
          </div>

          <div className={styles.visualBottom}>
            <span>SPIRIT PERFORMANCE LAB</span>
            <span>01:42:08</span>
          </div>
        </motion.div>
      </div>

      {/* INTRO */}

      <div className={styles.intro}>
        <motion.p {...reveal(0)}>
          Every SPIRIT piece is considered from the
          inside out — how fabric moves, how the body
          responds and how performance becomes part
          of everyday life.
        </motion.p>

        <motion.span
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.8,
            delay: 0.15,
          }}
        >
          PERFORMANCE / 001
        </motion.span>
      </div>

      {/* PERFORMANCE INDEX */}

      <div className={styles.index}>
        {performancePoints.map((point, index) => (
          <motion.article
            key={point.number}
            className={styles.point}
            initial={{
              opacity: 0,
              y: 50,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.25,
            }}
            transition={{
              duration: 0.8,
              delay: index * 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <div className={styles.pointTop}>
              <span>{point.number}</span>

              <ArrowUpRight
                size={16}
                strokeWidth={1.2}
              />
            </div>

            <div className={styles.pointMain}>
              <h3>{point.title}</h3>

              <div className={styles.metric}>
                <strong>{point.value}</strong>
                <span>{point.unit}</span>
              </div>
            </div>

            <p>{point.description}</p>

            <div className={styles.pointLine} />
          </motion.article>
        ))}
      </div>

      {/* FINAL STATEMENT */}

      <motion.div
        className={styles.statement}
        initial={{
          opacity: 0,
          y: 50,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.35,
        }}
        transition={{
          duration: 0.9,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <span className={styles.statementNumber}>
          05 / 05
        </span>

        <div className={styles.statementText}>
          <motion.span
            initial={{
              opacity: 0,
              x: -25,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            DESIGNED TO MOVE.
          </motion.span>

          <motion.div
            className={styles.strokeStatement}
            initial={{
              opacity: 0,
              x: -25,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.9,
              delay: 0.15,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <StrokeText
              color="transparent"
              strokeColor="rgba(245, 245, 242, 0.72)"
              strokeWidth={1}
            >
              BUILT TO DISAPPEAR.
            </StrokeText>
          </motion.div>
        </div>

        <span className={styles.statementYear}>
          SPIRIT / PERFORMANCE
        </span>
      </motion.div>
    </section>
  );
}
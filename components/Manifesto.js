"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

import StrokeText from "@/components/StrokeText";
import styles from "./Manifesto.module.css";

export default function Manifesto() {
  const sectionRef = useRef(null);

  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.3,
  });

  const reveal = (delay = 0) => ({
    initial: {
      opacity: 0,
      y: 45,
    },
    animate: isInView
      ? {
          opacity: 1,
          y: 0,
        }
      : {
          opacity: 0,
          y: 45,
        },
    transition: {
      duration: 0.8,
      delay,
      ease: [0.16, 1, 0.3, 1],
    },
  });

  return (
    <section
      ref={sectionRef}
      id="manifesto"
      className={styles.manifesto}
    >
      <div className={styles.inner}>
        {/* META */}

        <motion.div
          className={styles.meta}
          {...reveal(0)}
        >
          <span>01</span>

          <span>MANIFESTO</span>

          <span>SPIRIT / 2026</span>
        </motion.div>

        {/* STATEMENT */}

        <div className={styles.statement}>
          <motion.p
            className={styles.intro}
            {...reveal(0.08)}
          >
            Movement is not a moment.
            <br />
            It is a way of being.
          </motion.p>

          <div className={styles.mainText}>
            <motion.span {...reveal(0.16)}>
              MOVE
            </motion.span>

            <motion.div
              className={styles.strokeWord}
              {...reveal(0.3)}
            >
              <StrokeText>WITH</StrokeText>
            </motion.div>

            <motion.span {...reveal(0.44)}>
              INTENT.
            </motion.span>
          </div>
        </div>

        {/* BOTTOM INFORMATION */}

        <motion.div
          className={styles.bottom}
          {...reveal(0.56)}
        >
          <p>
            SPIRIT exists at the intersection of
            <br />
            performance, design and everyday movement.
          </p>

          <div className={styles.divider} />

          <span className={styles.location}>
            DESIGNED FOR MOVEMENT
          </span>

          <span className={styles.year}>
            SPIRIT / 2026
          </span>
        </motion.div>
      </div>
    </section>
  );
}
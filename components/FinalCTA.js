"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";

import StrokeText from "@/components/StrokeText";
import styles from "./FinalCTA.module.css";

export default function FinalCTA() {
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

  const lineScale = useTransform(
    scrollYProgress,
    [0.1, 0.5],
    [0, 1]
  );

  return (
    <section
      ref={sectionRef}
      className={styles.cta}
      id="final-cta"
    >
      <div className={styles.imageLayer}>
        <motion.img
          src="/images/campaigns/coreperformance.jpeg"
          alt="SPIRIT performance campaign"
          style={{ y: imageY }}
          loading="lazy"
          decoding="async"
        />

        <div className={styles.imageOverlay} />
        <div className={styles.imageNoise} />
      </div>

      <div className={styles.inner}>

        {/* TOP META */}

        <motion.div
          className={styles.meta}
          initial={{
            opacity: 0,
            y: 20,
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
          }}
        >
          <span>08</span>

          <span>
            SPIRIT / FINAL MOVEMENT
          </span>

          <span>
            2026
          </span>
        </motion.div>

        {/* MAIN */}

        <div className={styles.main}>

          <motion.div
            className={styles.label}
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
              duration: 0.75,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <span className={styles.labelLine} />

            <span>
              KEEP MOVING
            </span>
          </motion.div>

          <motion.h2
            initial={{
              opacity: 0,
              y: 70,
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
              duration: 1,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            FIND
            <br />

            <StrokeText
              color="#f5f5f2"
              strokeColor="rgba(245, 245, 242, 0.95)"
              strokeWidth={1.15}
              className={styles.stroke}
            >
              YOUR SPIRIT.
            </StrokeText>
          </motion.h2>

          <motion.div
            className={styles.bottom}
            initial={{
              opacity: 0,
              y: 30,
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
              duration: 0.8,
              delay: 0.2,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <p>
              Performance for the body.
              <br />
              Design for the life around it.
            </p>

            <Link
              href="/shop"
              className={styles.ctaLink}
            >
              <span>
                EXPLORE SPIRIT
              </span>

              <span className={styles.ctaIcon}>
                <ArrowUpRight
                  size={18}
                  strokeWidth={1.1}
                />
              </span>
            </Link>
          </motion.div>
        </div>

        {/* BOTTOM LINE */}

        <div className={styles.bottomMeta}>
          <motion.span
            style={{
              scaleX: lineScale,
              transformOrigin: "left",
            }}
            className={styles.progressLine}
          />

          <div className={styles.bottomMetaContent}>
            <span>
              DESIGNED FOR MOVEMENT
            </span>

            <span>
              SPIRIT / 2026
            </span>

            <span>
              MOVE WITH INTENT.
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
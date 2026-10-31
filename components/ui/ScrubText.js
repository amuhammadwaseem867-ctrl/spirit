"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import styles from "./ScrubText.module.css";

function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.14, 1]);

  return (
    <motion.span className={styles.word} style={{ opacity }}>
      {children}
    </motion.span>
  );
}

/**
 * Paragraph whose words light up in reading order as it scrolls
 * through the viewport. The full text is always in the DOM and
 * readable by assistive technology; under reduced motion
 * MotionConfig resolves every word to full opacity immediately.
 */
export default function ScrubText({ text, as: Tag = "p", className = "" }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });

  const words = text.split(" ");

  return (
    <Tag ref={ref} className={`${styles.scrub} ${className}`}>
      {words.map((word, index) => {
        const start = index / words.length;
        const end = start + 1 / words.length;

        return (
          <Word
            key={`${word}-${index}`}
            progress={scrollYProgress}
            range={[start, end]}
          >
            {word}
            {index < words.length - 1 ? " " : ""}
          </Word>
        );
      })}
    </Tag>
  );
}

"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

import styles from "./RiseImage.module.css";

/**
 * Image that starts tipped back in 3D and stands up as it reaches
 * the centre of the viewport, with a slower inner parallax.
 * `ratio` is a CSS aspect-ratio string; children render on top.
 */
export default function RiseImage({
  src,
  alt,
  ratio = "4 / 5",
  sizes = "(max-width: 900px) 92vw, 50vw",
  priority = false,
  tilt = 24,
  className = "",
  children,
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center 0.55"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [tilt, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.86, 1]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.24, 1.02]);

  return (
    <div ref={ref} className={`${styles.wrap} ${className}`}>
      <motion.div className={styles.frame} style={{ rotateX, scale, aspectRatio: ratio }}>
        <motion.div className={styles.media} style={{ scale: imageScale }}>
          <Image src={src} alt={alt} fill sizes={sizes} loading={priority ? "eager" : undefined} fetchPriority={priority ? "high" : undefined} className={styles.image} />
        </motion.div>
        {children}
      </motion.div>
    </div>
  );
}

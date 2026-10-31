"use client";

import useTilt from "@/lib/useTilt";

import styles from "./TiltCard.module.css";

/**
 * 3D tilt wrapper with a specular glare.
 *
 * Children can opt into depth with the `depth` helper class from
 * this module's consumers (transform: translateZ(...)), because the
 * card preserves 3D for its subtree.
 */
export default function TiltCard({
  children,
  className = "",
  max = 8,
  glare = true,
  as: Tag = "div",
  ...props
}) {
  const ref = useTilt({ max });

  return (
    <Tag ref={ref} className={`${styles.tilt} ${className}`} {...props}>
      <div className={styles.inner}>
        {children}
        {glare && <span className={styles.glare} aria-hidden="true" />}
      </div>
    </Tag>
  );
}

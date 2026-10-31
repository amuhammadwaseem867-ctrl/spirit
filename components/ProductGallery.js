"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";

import TiltCard from "@/components/ui/TiltCard";

import styles from "./ProductGallery.module.css";

/**
 * Product gallery: a 3D-tilting main frame that crossfades between
 * images, with arrow controls and a thumbnail strip. All frames stay
 * mounted so switching never waits on a network request.
 */
export default function ProductGallery({ images = [], productName = "SPIRIT PRODUCT" }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const valid = images.filter(Boolean);

  if (!valid.length) {
    return (
      <div className={styles.gallery}>
        <div className={styles.empty}>
          <span>No image available</span>
        </div>
      </div>
    );
  }

  const go = (next) => setActiveIndex((next + valid.length) % valid.length);

  return (
    <div className={styles.gallery}>
      <TiltCard className={styles.main} max={5}>
        <div className={styles.frameStack}>
          {valid.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className={styles.frame}
              data-active={index === activeIndex ? "true" : "false"}
              aria-hidden={index !== activeIndex}
            >
              <Image
                src={image}
                alt={`${productName} — image ${index + 1} of ${valid.length}`}
                fill
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : undefined}
                sizes="(max-width: 1000px) 100vw, 58vw"
                className={styles.image}
              />
            </div>
          ))}

          <span className={styles.counter}>
            {String(activeIndex + 1).padStart(2, "0")} / {String(valid.length).padStart(2, "0")}
          </span>

          {valid.length > 1 && (
            <div className={styles.controls}>
              <button type="button" onClick={() => go(activeIndex - 1)} aria-label="Previous product image">
                <ArrowLeft size={17} strokeWidth={1.5} />
              </button>
              <button type="button" onClick={() => go(activeIndex + 1)} aria-label="Next product image">
                <ArrowRight size={17} strokeWidth={1.5} />
              </button>
            </div>
          )}
        </div>
      </TiltCard>

      {valid.length > 1 && (
        <div className={styles.thumbs}>
          {valid.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              className={styles.thumb}
              data-active={index === activeIndex ? "true" : "false"}
              onClick={() => go(index)}
              aria-label={`View product image ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
            >
              <Image src={image} alt="" fill sizes="120px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

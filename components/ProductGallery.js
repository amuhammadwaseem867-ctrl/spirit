"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";

import styles from "./ProductGallery.module.css";

export default function ProductGallery({
  images = [],
  productName = "SPIRIT PRODUCT",
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  const validImages = images.filter(Boolean);

  if (!validImages.length) {
    return (
      <div className={styles.gallery}>
        <div className={styles.empty}>
          <span>NO IMAGE AVAILABLE</span>
        </div>
      </div>
    );
  }

  const currentImage = validImages[activeIndex];

  const previousImage = () => {
    setActiveIndex((current) =>
      current === 0
        ? validImages.length - 1
        : current - 1
    );
  };

  const nextImage = () => {
    setActiveIndex((current) =>
      current === validImages.length - 1
        ? 0
        : current + 1
    );
  };

  return (
    <div className={styles.gallery}>
      <div className={styles.mainArea}>
        <div className={styles.mainImage}>
          <Image
            key={currentImage}
            src={currentImage}
            alt={`${productName} — image ${activeIndex + 1}`}
            fill
            priority={activeIndex === 0}
            sizes="(max-width: 900px) 100vw, 68vw"
            className={styles.image}
          />

          <div className={styles.imageMeta}>
            <span>
              {String(activeIndex + 1).padStart(2, "0")}
            </span>

            <span>
              {String(validImages.length).padStart(2, "0")}
            </span>
          </div>

          {validImages.length > 1 && (
            <div className={styles.controls}>
              <button
                type="button"
                onClick={previousImage}
                aria-label="Previous product image"
              >
                <ArrowLeft
                  size={17}
                  strokeWidth={1.1}
                />
              </button>

              <button
                type="button"
                onClick={nextImage}
                aria-label="Next product image"
              >
                <ArrowRight
                  size={17}
                  strokeWidth={1.1}
                />
              </button>
            </div>
          )}
        </div>
      </div>

      {validImages.length > 1 && (
        <div className={styles.thumbnails}>
          {validImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              className={`${styles.thumbnail} ${
                index === activeIndex
                  ? styles.thumbnailActive
                  : ""
              }`}
              onClick={() => setActiveIndex(index)}
              aria-label={`View product image ${index + 1}`}
              aria-current={
                index === activeIndex
                  ? "true"
                  : undefined
              }
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="110px"
                className={styles.thumbnailImage}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
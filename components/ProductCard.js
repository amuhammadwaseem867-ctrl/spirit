"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import styles from "./ProductCard.module.css";

export default function ProductCard({
  product,
  priority = false,
  index,
}) {
  if (!product) return null;

  const {
    slug,
    name,
    category,
    image,
    secondaryImage,
    number,
    href,
    badge,
  } = product;

  const productHref = href || (slug ? `/product/${slug}` : "/product");

  return (
    <article className={styles.card}>
      <Link
        href={productHref}
        className={styles.link}
        aria-label={`View ${name}`}
      >
        <div className={styles.media}>
          <div className={styles.imageWrap}>
            {image ? (
              <Image
                src={image}
                alt={name || "SPIRIT product"}
                fill
                priority={priority}
                sizes="(max-width: 760px) 100vw, 50vw"
                className={styles.primaryImage}
              />
            ) : (
              <div className={styles.imagePlaceholder} />
            )}

            {secondaryImage && (
              <Image
                src={secondaryImage}
                alt=""
                fill
                sizes="(max-width: 760px) 100vw, 50vw"
                className={styles.secondaryImage}
              />
            )}
          </div>

          <div className={styles.imageOverlay} />

          <div className={styles.topMeta}>
            <span>
              {number ||
                String((index ?? 0) + 1).padStart(2, "0")}
            </span>

            <span>{badge || category}</span>
          </div>

          <div className={styles.bottomMeta}>
            <span className={styles.viewLabel}>
              VIEW PRODUCT
            </span>

            <span className={styles.arrow}>
              <ArrowUpRight
                size={17}
                strokeWidth={1.1}
              />
            </span>
          </div>
        </div>

        <div className={styles.info}>
          <div className={styles.infoMain}>
            {category && (
              <span className={styles.category}>
                {category}
              </span>
            )}

            <h3 className={styles.name}>
              {name}
            </h3>
          </div>

          <span className={styles.index}>
            {number ||
              String((index ?? 0) + 1).padStart(2, "0")}
          </span>
        </div>
      </Link>
    </article>
  );
}
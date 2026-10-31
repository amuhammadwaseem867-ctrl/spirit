"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import TiltCard from "@/components/ui/TiltCard";

import styles from "./ProductCard.module.css";

/**
 * Product tile with 3D tilt, depth-layered labels and a hover swap
 * to the secondary image.
 */
export default function ProductCard({ product, priority = false, index }) {
  if (!product) return null;

  const { slug, name, category, gender, image, images, number, href, badge } = product;

  const primary = image || images?.[0];
  const secondary = product.secondaryImage || images?.[1];
  const productHref = href || (slug ? `/product/${slug}` : "/shop");
  const position = number || String((index ?? 0) + 1).padStart(2, "0");
  const tag = badge || [gender, category].filter(Boolean).join(" / ");

  return (
    <article className={styles.card}>
      <TiltCard className={styles.tilt} max={7}>
        <Link
          href={productHref}
          className={styles.link}
          aria-label={`View ${name}`}
          data-cursor="VIEW"
        >
          <div className={styles.media}>
            {primary ? (
              <Image
                src={primary}
                alt={name || "SPIRIT product"}
                fill
                loading={priority ? "eager" : undefined}
                fetchPriority={priority ? "high" : undefined}
                sizes="(max-width: 760px) 92vw, (max-width: 1200px) 46vw, 31vw"
                className={styles.primary}
              />
            ) : (
              <div className={styles.placeholder} />
            )}

            {secondary && (
              <Image
                src={secondary}
                alt=""
                fill
                sizes="(max-width: 760px) 92vw, (max-width: 1200px) 46vw, 31vw"
                className={styles.secondary}
              />
            )}
          </div>

          <span className={styles.index}>{position}</span>
          <span className={styles.tag}>{tag}</span>

          <span className={styles.arrow} aria-hidden="true">
            <ArrowUpRight size={16} strokeWidth={1.5} />
          </span>
        </Link>
      </TiltCard>

      <div className={styles.info}>
        <h3 className={styles.name}>{name}</h3>
        <span className={styles.view}>View</span>
      </div>
    </article>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import KineticText from "@/components/ui/KineticText";
import Reveal from "@/components/ui/Reveal";
import TiltCard from "@/components/ui/TiltCard";
import { getProductBySlug } from "@/lib/products";

import styles from "./ProductShowcase.module.css";

const featured = getProductBySlug("aeroflex-tee");
const rail = ["form-legging", "core-performance", "form-corp"].map(getProductBySlug);

const label = (product) => `${product.gender} / ${product.category}`;

export default function ProductShowcase() {
  return (
    <section id="products" className={`${styles.products} surface-ink`}>
      <div className="wrap">
        <div className="meta">
          <span>03</span>
          <span>PRODUCTS</span>
          <span>THE SYSTEM</span>
        </div>

        <Reveal className={styles.header}>
          <KineticText
            as="h2"
            lines={["THE PIECES", "THAT MOVE", "WITH YOU."]}
            outline={[1]}
            className={`display ${styles.heading}`}
          />

          <div className={styles.headerSide}>
            <p className="reveal">
              Refined essentials engineered for movement, performance and
              everyday life — designed to work as one wardrobe.
            </p>
            <Link href="/shop" className="link-line reveal" style={{ "--rd": "120ms" }}>
              View all products <ArrowUpRight size={14} strokeWidth={1.5} />
            </Link>
          </div>
        </Reveal>

        {/* ---------- featured ---------- */}
        <div className={styles.featured}>
          <TiltCard className={styles.featuredCard} max={5}>
            <Link
              href={`/product/${featured.slug}`}
              className={styles.featuredLink}
              data-cursor="VIEW"
              aria-label={`View ${featured.name}`}
            >
              <div className={styles.featuredMedia}>
                <Image
                  src={featured.images[0]}
                  alt={`${featured.name} worn in a brutalist courtyard`}
                  fill
                  sizes="(max-width: 900px) 92vw, 60vw"
                  className={styles.featuredImage}
                />
              </div>

              <span className={`display ${styles.featuredNumber}`} aria-hidden="true">
                01
              </span>

              <div className={styles.featuredMeta}>
                <span>Featured piece</span>
                <span>{label(featured)}</span>
              </div>

              <div className={styles.featuredName}>
                <span className="display">{featured.name}</span>
              </div>
            </Link>
          </TiltCard>

          <Reveal className={styles.featuredInfo}>
            <span className="eyebrow reveal">01 — Featured</span>
            <h3 className={`display reveal ${styles.infoName}`} style={{ "--rd": "60ms" }}>
              {featured.name}
            </h3>
            <p className="reveal" style={{ "--rd": "120ms" }}>
              {featured.description}
            </p>

            <dl className={`reveal ${styles.specs}`} style={{ "--rd": "180ms" }}>
              <div>
                <dt>Fit</dt>
                <dd>{featured.fit}</dd>
              </div>
              <div>
                <dt>Sizes</dt>
                <dd className={styles.sizes}>
                  {featured.sizes.map((size) => (
                    <span key={size}>{size}</span>
                  ))}
                </dd>
              </div>
            </dl>

            <Link
              href={`/product/${featured.slug}`}
              className="btn reveal"
              style={{ "--rd": "240ms" }}
              data-magnetic="0.25"
            >
              <span className="btn-label">Discover product</span>
              <span className="btn-icon">
                <ArrowUpRight size={16} strokeWidth={1.5} />
              </span>
            </Link>
          </Reveal>
        </div>

        {/* ---------- rail ---------- */}
        <Reveal className={styles.rail} threshold={0.1}>
          {rail.map((product, index) => (
            <article
              key={product.slug}
              className={`reveal ${styles.product}`}
              style={{ "--rd": `${index * 110}ms` }}
            >
              <TiltCard className={styles.productCard} max={7}>
                <Link
                  href={`/product/${product.slug}`}
                  className={styles.productLink}
                  data-cursor="VIEW"
                  aria-label={`View ${product.name}`}
                >
                  <div className={styles.productMedia}>
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="(max-width: 900px) 92vw, 30vw"
                      className={styles.productImage}
                    />
                    {product.images[1] && (
                      <Image
                        src={product.images[1]}
                        alt=""
                        fill
                        sizes="(max-width: 900px) 92vw, 30vw"
                        className={styles.productAlt}
                      />
                    )}
                  </div>
                  <span className={styles.productIndex}>
                    {String(index + 2).padStart(2, "0")}
                  </span>
                  <span className={styles.productArrow}>
                    <ArrowUpRight size={16} strokeWidth={1.5} />
                  </span>
                </Link>
              </TiltCard>

              <div className={styles.productInfo}>
                <span className="mono">{label(product)}</span>
                <h3>{product.name}</h3>
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

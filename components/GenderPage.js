"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import PageHero from "@/components/PageHero";
import ProductCard from "@/components/ProductCard";
import CtaBand from "@/components/CtaBand";
import KineticText from "@/components/ui/KineticText";
import Reveal from "@/components/ui/Reveal";
import RiseImage from "@/components/ui/RiseImage";
import { products } from "@/lib/products";

import styles from "./GenderPage.module.css";

/**
 * Shared template for the WOMEN and MEN department pages.
 * Products for the department come first; the rest of the system
 * follows as "complete the system".
 */
export default function GenderPage({ config }) {
  const own = products.filter((product) => product.gender === config.gender);
  const rest = products.filter((product) => product.gender !== config.gender);

  return (
    <main className={styles.page}>
      <PageHero
        index="01"
        label={config.gender}
        title={config.heroTitle}
        outline={[1]}
        intro={config.intro}
        aside={`${config.gender} / 2026\nLahore / Pakistan`}
        visual="image"
        image={config.heroImage}
        imageAlt={config.heroAlt}
      />

      {/* featured */}
      <section className={`${styles.featured} surface-ink`}>
        <div className="wrap">
          <div className="meta">
            <span>02</span>
            <span>{config.gender} / Featured</span>
            <span>{config.featuredLabel}</span>
          </div>

          <div className={styles.featuredGrid}>
            <RiseImage
              src={config.featuredImage}
              alt={config.featuredAlt}
              ratio="16 / 11"
              sizes="(max-width: 1000px) 92vw, 60vw"
            />

            <Reveal className={styles.featuredCopy}>
              <span className="eyebrow reveal">{config.featuredLabel}</span>
              <KineticText
                as="h2"
                lines={config.featuredTitle}
                outline={[1]}
                className={`display ${styles.featuredTitle}`}
              />
              <p className="reveal" style={{ "--rd": "120ms" }}>
                {config.featuredCopy}
              </p>
              <Link href={config.shopHref} className="btn reveal" style={{ "--rd": "200ms" }} data-magnetic="0.25">
                <span className="btn-label">Shop {config.gender.toLowerCase()}</span>
                <span className="btn-icon">
                  <ArrowUpRight size={16} strokeWidth={1.5} />
                </span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* products */}
      <section id="products" className={`${styles.products} surface-bone`}>
        <div className="wrap">
          <div className="meta">
            <span>03</span>
            <span>Selected pieces</span>
            <span>{String(own.length).padStart(2, "0")} pieces</span>
          </div>

          <div className={styles.productsHeader}>
            <KineticText
              as="h2"
              lines={["THE", `${config.gender} SYSTEM.`]}
              className={`display ${styles.productsTitle}`}
            />
            <p>A focused selection from the SPIRIT {config.gender.toLowerCase()}&apos;s system.</p>
          </div>

          <Reveal className={styles.grid} threshold={0.08}>
            {own.map((product, index) => (
              <div key={product.slug} className="reveal" style={{ "--rd": `${index * 90}ms` }}>
                <ProductCard product={product} index={index} priority={index < 2} />
              </div>
            ))}
          </Reveal>

          {rest.length > 0 && (
            <>
              <div className={styles.subhead}>
                <span className="mono">Complete the system</span>
              </div>

              <Reveal className={styles.grid} threshold={0.08}>
                {rest.map((product, index) => (
                  <div key={product.slug} className="reveal" style={{ "--rd": `${index * 90}ms` }}>
                    <ProductCard product={product} index={own.length + index} />
                  </div>
                ))}
              </Reveal>
            </>
          )}
        </div>
      </section>

      {/* principles */}
      <section className={`${styles.principles} surface-ink`}>
        <div className="wrap">
          <div className="meta">
            <span>04</span>
            <span>Design principles</span>
            <span>{config.gender}</span>
          </div>

          <div className={styles.principlesHeader}>
            <KineticText
              as="h2"
              lines={config.principlesTitle}
              outline={[1]}
              className={`display ${styles.principlesTitle}`}
            />
            <p>{config.principlesCopy}</p>
          </div>

          <Reveal as="ol" className={styles.principleList} threshold={0.15}>
            {config.principles.map((item, index) => (
              <li key={item.title} className={`reveal ${styles.principle}`} style={{ "--rd": `${index * 100}ms` }}>
                <span className={styles.principleNumber}>{String(index + 1).padStart(2, "0")}</span>
                <h3 className="display">{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <CtaBand
        label={`SPIRIT / ${config.gender}`}
        title={config.closingTitle}
        copy={config.closingCopy}
        href={config.shopHref}
        cta={`Explore ${config.gender.toLowerCase()}`}
      />
    </main>
  );
}

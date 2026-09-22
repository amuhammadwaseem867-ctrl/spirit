import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import ProductGallery from "@/components/ProductGallery";
import ProductInfo from "@/components/ProductInfo";
import WishlistButton from "@/components/WishlistButton";
import ProductCard from "@/components/ProductCard";
import {
  products as allProducts,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/products";

import styles from "../Product.module.css";

export function generateStaticParams() {
  return allProducts.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: "Product" };
  }

  return {
    title: product.name,
    description: product.description,
    alternates: {
      canonical: `/product/${product.slug}`,
    },
    openGraph: {
      type: "website",
      siteName: "SPIRIT",
      title: `${product.name} — SPIRIT`,
      description: product.description,
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = getRelatedProducts(slug);

  return (
    <main className={styles.product}>
      {/* HEADER */}

      <header className={styles.header}>
        <div className={styles.headerMeta}>
          <span>01</span>
          <span>SPIRIT / PRODUCT</span>
          <span>2026</span>
        </div>

        <Link href="/shop" className={styles.backLink}>
          <ArrowLeft size={14} strokeWidth={1.1} />
          <span>BACK TO SHOP</span>
        </Link>
      </header>

      {/* PRODUCT */}

      <section className={styles.productSection}>
        <div className={styles.gallery}>
          <ProductGallery
            images={product.images}
            productName={product.name}
          />
        </div>

        <div className={styles.info}>
          <div className={styles.infoActions}>
            <WishlistButton
              product={product}
              size="medium"
            />
          </div>

          <ProductInfo product={product} />
        </div>
      </section>

      {/* RELATED */}

      <section
        className={styles.related}
        aria-label="Related products"
      >
        <div className={styles.relatedHeader}>
          <span>02</span>
          <span>COMPLETE THE SYSTEM</span>
          <span>SPIRIT / 2026</span>
        </div>

        <div className={styles.relatedGrid}>
          {related.map((item, index) => (
            <ProductCard
              key={item.slug}
              product={{
                ...item,
                number: String(index + 1).padStart(2, "0"),
              }}
            />
          ))}
        </div>
      </section>

      {/* STATEMENT */}

      <section className={styles.statement}>
        <div className={styles.statementMeta}>
          <span>03</span>
          <span>SPIRIT / PRODUCT</span>
          <span>2026</span>
        </div>

        <div className={styles.statementContent}>
          <h2>
            DESIGNED
            <br />
            FOR
            <br />
            MOVEMENT.
          </h2>

          <p>
            Every SPIRIT piece begins with the body
            in motion — considered construction,
            restrained detail and a wardrobe that
            works as one system.
          </p>
        </div>
      </section>
    </main>
  );
}
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import ProductGallery from "@/components/ProductGallery";
import ProductInfo from "@/components/ProductInfo";
import WishlistButton from "@/components/WishlistButton";
import ProductCard from "@/components/ProductCard";
import CtaBand from "@/components/CtaBand";
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
      <section className={`${styles.detail} surface-bone`}>
        <div className="wrap">
          <div className={styles.crumbs}>
            <Link href="/shop" className={styles.back}>
              <ArrowLeft size={14} strokeWidth={1.5} />
              Back to shop
            </Link>
            <span className={styles.trail}>
              Shop / {product.gender} / {product.category}
            </span>
          </div>

          <div className={styles.layout}>
            <div className={styles.gallery}>
              <ProductGallery images={product.images} productName={product.name} />
            </div>

            <div className={styles.info}>
              <div className={styles.infoActions}>
                <WishlistButton product={product} size="medium" />
              </div>
              <ProductInfo product={product} />
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.related} surface-ink`} aria-label="Related products">
        <div className="wrap">
          <div className="meta">
            <span>02</span>
            <span>Complete the system</span>
            <span>SPIRIT / 2026</span>
          </div>

          <h2 className={`display ${styles.relatedTitle}`}>
            Complete
            <br />
            the system.
          </h2>

          <div className={styles.relatedGrid}>
            {related.map((item, index) => (
              <ProductCard key={item.slug} product={item} index={index} />
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        index="03"
        label="SPIRIT / Product"
        title={["DESIGNED", "FOR MOVEMENT."]}
        copy="Every SPIRIT piece begins with the body in motion — considered construction, restrained detail and a wardrobe that works as one system."
        href="/shop"
        cta="Continue shopping"
      />
    </main>
  );
}

"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpRight, X } from "lucide-react";

import PageHero from "@/components/PageHero";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";
import FitFinder from "@/components/FitFinder";
import CtaBand from "@/components/CtaBand";
import KineticText from "@/components/ui/KineticText";
import Reveal from "@/components/ui/Reveal";
import TiltCard from "@/components/ui/TiltCard";
import { products } from "@/lib/products";

import styles from "./Shop.module.css";

const DEFAULT_FILTERS = {
  category: "ALL",
  gender: "ALL",
  size: "ALL",
  sort: "FEATURED",
};

const CATEGORIES = ["PERFORMANCE", "TRAINING", "ESSENTIALS"];
const GENDERS = ["WOMEN", "MEN"];

const destinations = [
  { number: "01", label: "Women", href: "/women", image: "/images/collections/women.jpeg" },
  { number: "02", label: "Men", href: "/men", image: "/images/collections/men.jpeg" },
  { number: "03", label: "Collections", href: "/collections", image: "/images/collections/training.jpeg" },
];

const catalogue = products.map((product, index) => ({
  ...product,
  number: String(index + 1).padStart(2, "0"),
}));

/*
 * Mirrors the URL query (?category, ?gender, ?search) into state.
 * useSearchParams needs a Suspense boundary for static rendering,
 * so it lives in this small child. It re-runs on every change, so
 * links that only change the query also update the grid.
 */
function QuerySync({ onChange }) {
  const params = useSearchParams();
  const key = params.toString();

  useEffect(() => {
    const category = params.get("category");
    const gender = params.get("gender");

    onChange({
      filters: {
        ...DEFAULT_FILTERS,
        category: CATEGORIES.includes(category) ? category : "ALL",
        gender: GENDERS.includes(gender) ? gender : "ALL",
      },
      search: (params.get("search") || "").trim(),
    });
    // `key` captures every query change; params itself is stable per key.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, onChange]);

  return null;
}

export default function ShopPage() {
  const router = useRouter();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [search, setSearch] = useState("");
  const [fitFinderOpen, setFitFinderOpen] = useState(false);

  const [syncQuery] = useState(() => ({ filters, search }) => {
    setFilters(filters);
    setSearch(search);
  });

  const filtered = useMemo(() => {
    let result = [...catalogue];
    const query = search.toLowerCase();

    if (query) {
      result = result.filter((product) =>
        [product.name, product.category, product.gender, product.description]
          .join(" ")
          .toLowerCase()
          .includes(query)
      );
    }

    if (filters.category !== "ALL") {
      result = result.filter((product) => product.category === filters.category);
    }

    if (filters.gender !== "ALL") {
      result = result.filter((product) => product.gender === filters.gender);
    }

    if (filters.size !== "ALL") {
      result = result.filter((product) => product.sizes?.includes(filters.size));
    }

    switch (filters.sort) {
      case "NEWEST":
        result.reverse();
        break;
      case "A — Z":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "Z — A":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return result;
  }, [filters, search]);

  const clearAll = () => {
    setFilters(DEFAULT_FILTERS);
    setSearch("");
    router.replace("/shop", { scroll: false });
  };

  return (
    <main className={styles.shop}>
      <Suspense fallback={null}>
        <QuerySync onChange={syncQuery} />
      </Suspense>

      <PageHero
        index="01"
        label="SHOP"
        title={["MOVE", "YOUR WAY."]}
        outline={[1]}
        intro="A considered system of activewear designed around movement, performance and everyday life."
        aside={"Lahore / Pakistan\nWorldwide / Online"}
      >
        <button
          type="button"
          className="btn"
          onClick={() => setFitFinderOpen(true)}
          data-magnetic="0.25"
        >
          <span className="btn-label">Find your fit</span>
          <span className="btn-icon">
            <ArrowUpRight size={16} strokeWidth={1.5} />
          </span>
        </button>
      </PageHero>

      {/* ---------- destinations ---------- */}
      <section className={`${styles.destinations} surface-ink`}>
        <div className="wrap">
          <div className="meta">
            <span>02</span>
            <span>Explore</span>
            <span>Three directions</span>
          </div>

          <Reveal className={styles.destinationGrid} threshold={0.1}>
            {destinations.map((item, index) => (
              <div key={item.href} className="reveal" style={{ "--rd": `${index * 90}ms` }}>
                <TiltCard className={styles.destination} max={6}>
                  <Link href={item.href} className={styles.destinationLink} data-cursor="ENTER">
                    <Image src={item.image} alt="" fill sizes="(max-width: 900px) 92vw, 31vw" className={styles.destinationImage} />
                    <span className={styles.destinationIndex}>{item.number}</span>
                    <span className={`display ${styles.destinationLabel}`}>{item.label}</span>
                    <span className={styles.destinationArrow}>
                      <ArrowUpRight size={18} strokeWidth={1.5} />
                    </span>
                  </Link>
                </TiltCard>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ---------- product system ---------- */}
      <section id="products" className={`${styles.products} surface-bone`}>
        <div className="wrap">
          <div className="meta">
            <span>03</span>
            <span>All products</span>
            <span>{String(filtered.length).padStart(2, "0")} results</span>
          </div>

          <div className={styles.productsHeader}>
            <KineticText as="h2" lines={["THE", "SYSTEM."]} className={`display ${styles.productsTitle}`} />
            <p>Performance pieces and everyday essentials designed to work together as one wardrobe.</p>
          </div>

          {search && (
            <div className={styles.searchChip} role="status">
              <span>
                Results for <strong>“{search}”</strong>
              </span>
              <button type="button" onClick={clearAll} aria-label="Clear search">
                <X size={14} strokeWidth={1.5} />
              </button>
            </div>
          )}

          <div className={styles.filters}>
            <ProductFilters filters={filters} onChange={setFilters} resultCount={filtered.length} />
          </div>

          {filtered.length > 0 ? (
            <div className={styles.grid}>
              {filtered.map((product, index) => (
                <ProductCard key={product.slug} product={product} index={index} priority={index < 2} />
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              <span className="display">No products found.</span>
              <p>Adjust the filters or clear the search to explore the full SPIRIT system.</p>
              <button type="button" className="btn btn-dark" onClick={clearAll}>
                <span className="btn-label">Clear all</span>
                <span className="btn-icon">
                  <X size={16} strokeWidth={1.5} />
                </span>
              </button>
            </div>
          )}
        </div>
      </section>

      <CtaBand
        index="04"
        label="SPIRIT / Philosophy"
        title={["MADE FOR", "MOVEMENT."]}
        copy="From focused training to the moments beyond it, SPIRIT is designed as one continuous wardrobe for movement."
        href="/collections"
        cta="Explore collections"
      />

      <FitFinder isOpen={fitFinderOpen} onClose={() => setFitFinderOpen(false)} />
    </main>
  );
}

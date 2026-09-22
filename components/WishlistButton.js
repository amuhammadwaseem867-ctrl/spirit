"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

import styles from "./WishlistButton.module.css";

const STORAGE_KEY = "spirit-wishlist";

export default function WishlistButton({
  product,
  size = "medium",
  className = "",
}) {
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  const productId =
    product?.id ||
    product?.slug ||
    product?.name;

  useEffect(() => {
    let stored = null;

    if (productId) {
      try {
        stored = localStorage.getItem(
          STORAGE_KEY
        );
      } catch {
        stored = null;
      }
    }

    let parsed = null;

    if (stored) {
      try {
        parsed = JSON.parse(stored);
      } catch {
        parsed = null;
      }
    }

    const isSaved =
      Array.isArray(parsed) &&
      parsed.some(
        (item) => item.id === productId
      );

    /*
     * Sync the saved state just after mount.
     * State updates are deferred out of the effect
     * body to avoid synchronous cascading renders
     * and to keep server and client output aligned.
     */
    const id = window.setTimeout(() => {
      setMounted(true);

      setSaved(isSaved);
    }, 0);

    return () => window.clearTimeout(id);
  }, [productId]);

  const toggleWishlist = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!productId) return;

    try {
      const stored = localStorage.getItem(
        STORAGE_KEY
      );

      const wishlist = stored
        ? JSON.parse(stored)
        : [];

      const safeWishlist = Array.isArray(
        wishlist
      )
        ? wishlist
        : [];

      const exists = safeWishlist.some(
        (item) =>
          item.id === productId
      );

      let nextWishlist;

      if (exists) {
        nextWishlist = safeWishlist.filter(
          (item) =>
            item.id !== productId
        );
      } else {
        nextWishlist = [
          ...safeWishlist,
          {
            id: productId,
            name: product.name || "",
            slug: product.slug || "",
            image:
              product.image ||
              product.images?.[0] ||
              "",
            category:
              product.category || "",
          },
        ];
      }

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(nextWishlist)
      );

      setSaved(!exists);

      window.dispatchEvent(
        new CustomEvent(
          "spirit:wishlist-change",
          {
            detail: {
              count: nextWishlist.length,
            },
          }
        )
      );
    } catch {
      // Keep UI stable if localStorage is unavailable.
    }
  };

  const label = saved
    ? `Remove ${product?.name || "product"} from wishlist`
    : `Add ${product?.name || "product"} to wishlist`;

  return (
    <button
      type="button"
      className={`${styles.button} ${
        styles[size] || styles.medium
      } ${saved ? styles.saved : ""} ${className}`}
      onClick={toggleWishlist}
      aria-label={label}
      aria-pressed={
        mounted ? saved : false
      }
    >
      <Heart
        size={size === "small" ? 15 : 18}
        strokeWidth={1.1}
        fill={
          saved
            ? "currentColor"
            : "none"
        }
      />

      <span className={styles.ripple} />
    </button>
  );
}
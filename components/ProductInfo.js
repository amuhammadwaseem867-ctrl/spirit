"use client";

import { useState } from "react";
import {
  ChevronDown,
  Minus,
  Plus,
  ArrowUpRight,
} from "lucide-react";

import { useCart } from "./CartProvider";
import styles from "./ProductInfo.module.css";

const DEFAULT_SIZES = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
];

export default function ProductInfo({
  product = {},
}) {
  const {
    name = "SPIRIT PRODUCT",
    category = "PERFORMANCE",
    description = "",
    price,
    currency = "PKR",
    sizes = DEFAULT_SIZES,
    details = [],
    fit = "",
    material = "",
  } = product;

  const { addToCart } = useCart();

  const [selectedSize, setSelectedSize] =
    useState("");
  const [quantity, setQuantity] = useState(1);
  const [openDetail, setOpenDetail] =
    useState(null);

  /*
   * Cart lines and wishlist entries persist only the
   * primary image (single string), while the product
   * itself stores the full gallery (`images` array).
   * Populating it here keeps the bag and wishlist
   * thumbnails working without changing the shape of
   * the canonical product data.
   */
  const primaryImage = product.images?.[0] ?? "";

  const hasPrice =
    price !== undefined &&
    price !== null &&
    price !== "";

  const decreaseQuantity = () => {
    setQuantity((current) =>
      Math.max(1, current - 1)
    );
  };

  const increaseQuantity = () => {
    setQuantity((current) => current + 1);
  };

  const handleAddToBag = () => {
    if (!selectedSize) return;

    addToCart({
      ...product,
      name,
      category,
      image: primaryImage,
      price,
      currency,
      selectedSize,
      quantity,
    });
  };

  const detailItems = [
    ...(fit
      ? [
          {
            title: "FIT",
            content: fit,
          },
        ]
      : []),
    ...(material
      ? [
          {
            title: "MATERIAL",
            content: material,
          },
        ]
      : []),
    ...details,
  ];

  return (
    <div className={styles.info}>
      <div className={styles.header}>
        <div className={styles.category}>
          <span>{category}</span>
          <span>SPIRIT / 2026</span>
        </div>

        <h1 className={styles.title}>
          {name}
        </h1>

        {description && (
          <p className={styles.description}>
            {description}
          </p>
        )}

        {hasPrice && (
          <div className={styles.price}>
            <span>{currency}</span>
            <span>
              {Number(price).toLocaleString()}
            </span>
          </div>
        )}
      </div>

      <div className={styles.purchase}>
        <div className={styles.sizeHeader}>
          <span>SELECT SIZE</span>

          {/*
           * Static label only — SPIRIT does not publish garment
           * measurements yet, so this is deliberately not an
           * interactive control.
           */}
          <span className={styles.sizeGuide}>
            SIZE GUIDE
            <ArrowUpRight
              size={13}
              strokeWidth={1.1}
            />
          </span>
        </div>

        <div className={styles.sizes}>
          {sizes.map((size) => (
            <button
              key={size}
              type="button"
              className={`${styles.size} ${
                selectedSize === size
                  ? styles.sizeSelected
                  : ""
              }`}
              onClick={() =>
                setSelectedSize(size)
              }
              aria-pressed={
                selectedSize === size
              }
            >
              {size}
            </button>
          ))}
        </div>

        <div className={styles.purchaseRow}>
          <div className={styles.quantity}>
            <button
              type="button"
              onClick={decreaseQuantity}
              aria-label="Decrease quantity"
            >
              <Minus
                size={14}
                strokeWidth={1.1}
              />
            </button>

            <span>{quantity}</span>

            <button
              type="button"
              onClick={increaseQuantity}
              aria-label="Increase quantity"
            >
              <Plus
                size={14}
                strokeWidth={1.1}
              />
            </button>
          </div>

          <button
            type="button"
            className={styles.addButton}
            onClick={handleAddToBag}
            disabled={!selectedSize}
          >
            <span>
              {selectedSize
                ? "ADD TO BAG"
                : "SELECT A SIZE"}
            </span>

            <ArrowUpRight
              size={17}
              strokeWidth={1.1}
            />
          </button>
        </div>

        {!selectedSize && (
          <p className={styles.helper}>
            Select a size to continue.
          </p>
        )}
      </div>

      {detailItems.length > 0 && (
        <div className={styles.details}>
          {detailItems.map(
            (detail, index) => {
              const isOpen =
                openDetail === index;

              return (
                <div
                  className={styles.detail}
                  key={`${detail.title}-${index}`}
                >
                  <button
                    type="button"
                    className={
                      styles.detailTrigger
                    }
                    onClick={() =>
                      setOpenDetail(
                        isOpen ? null : index
                      )
                    }
                    aria-expanded={isOpen}
                  >
                    <span>
                      {detail.title}
                    </span>

                    <ChevronDown
                      size={16}
                      strokeWidth={1}
                      className={`${
                        styles.chevron
                      } ${
                        isOpen
                          ? styles.chevronOpen
                          : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`${
                      styles.detailContent
                    } ${
                      isOpen
                        ? styles.detailContentOpen
                        : ""
                    }`}
                  >
                    <p>
                      {detail.content}
                    </p>
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}

      <div className={styles.footerNote}>
        <span>DESIGNED FOR MOVEMENT</span>
        <span>SPIRIT / LAHORE</span>
      </div>
    </div>
  );
}
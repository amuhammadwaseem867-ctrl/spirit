"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  Minus,
  Plus,
  ArrowUpRight,
} from "lucide-react";

import { lockScroll, unlockScroll } from "@/lib/scrollLock";
import useDialogA11y from "@/lib/useDialogA11y";

import styles from "./CartDrawer.module.css";

export default function CartDrawer({
  isOpen,
  onClose,
  items = [],
  onUpdateQuantity,
  onRemove,
}) {
  const closeButtonRef = useRef(null);

  /*
   * Focus, Tab cycling, Escape and focus restoration are
   * handled by the shared dialog helper.
   */
  const dialogRef = useDialogA11y({
    isOpen,
    onClose,
    initialFocusRef: closeButtonRef,
  });

  useEffect(() => {
    if (!isOpen) return;

    lockScroll();

    return () => {
      unlockScroll();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const safeItems = Array.isArray(items)
    ? items
    : [];

  const hasPrices = safeItems.some(
    (item) =>
      item?.price !== undefined &&
      item?.price !== null &&
      item?.price !== ""
  );

  const subtotal = safeItems.reduce(
    (total, item) => {
      const price = Number(item?.price);

      if (!Number.isFinite(price)) {
        return total;
      }

      return (
        total +
        price * Math.max(1, Number(item?.quantity) || 1)
      );
    },
    0
  );

  const currency =
    safeItems.find(
      (item) => item?.currency
    )?.currency || "PKR";

  const itemCount = safeItems.reduce(
    (total, item) =>
      total +
      Math.max(1, Number(item?.quantity) || 1),
    0
  );

  const formatPrice = (value) =>
    Number(value).toLocaleString();

  const handleDecrease = (item) => {
    const quantity = Math.max(
      1,
      Number(item.quantity) || 1
    );

    if (quantity <= 1) {
      onRemove?.(item);
      return;
    }

    onUpdateQuantity?.(
      item,
      quantity - 1
    );
  };

  const handleIncrease = (item) => {
    const quantity = Math.max(
      1,
      Number(item.quantity) || 1
    );

    onUpdateQuantity?.(
      item,
      quantity + 1
    );
  };

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      className={styles.root}
      role="dialog"
          data-lenis-prevent
      aria-modal="true"
      aria-label="Shopping bag"
    >
      <button
        type="button"
        className={styles.backdrop}
        onClick={onClose}
        aria-label="Close shopping bag"
      />

      <aside className={styles.drawer}>
        <header className={styles.header}>
          <div className={styles.headerMeta}>
            <span>SPIRIT / BAG</span>

            <span>
              {String(itemCount).padStart(2, "0")}
            </span>
          </div>

          <div className={styles.headerMain}>
            <h2>YOUR BAG</h2>

            <button
              type="button"
              ref={closeButtonRef}
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Close shopping bag"
            >
              <X size={20} strokeWidth={1.1} />
            </button>
          </div>
        </header>

        <div className={styles.content}>
          {safeItems.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyNumber}>
                00
              </span>

              <div className={styles.emptyContent}>
                <h3>YOUR BAG IS EMPTY.</h3>

                <p>
                  Explore the SPIRIT collection
                  and find your next movement essential.
                </p>

                <Link
                  href="/shop"
                  className={styles.emptyLink}
                  onClick={onClose}
                >
                  <span>EXPLORE COLLECTION</span>

                  <ArrowUpRight
                    size={17}
                    strokeWidth={1.1}
                  />
                </Link>
              </div>
            </div>
          ) : (
            <div className={styles.items}>
              {safeItems.map((item, index) => {
                const quantity = Math.max(
                  1,
                  Number(item?.quantity) || 1
                );

                const price = Number(item?.price);

                const hasPrice =
                  Number.isFinite(price);

                const lineTotal = hasPrice
                  ? price * quantity
                  : null;

                return (
                  <article
                    key={
                      item?.id ||
                      item?.slug ||
                      `${item?.name}-${item?.selectedSize}-${index}`
                    }
                    className={styles.item}
                  >
                    <div className={styles.itemTop}>
                      <div className={styles.imageWrap}>
                        {item?.image ? (
                          <Image
                            src={item.image}
                            alt={
                              item.name ||
                              "SPIRIT product"
                            }
                            fill
                            sizes="120px"
                            className={styles.image}
                          />
                        ) : (
                          <div
                            className={
                              styles.imagePlaceholder
                            }
                          >
                            <span>SPIRIT</span>
                          </div>
                        )}

                        <span
                          className={
                            styles.itemNumber
                          }
                        >
                          {String(index + 1).padStart(
                            2,
                            "0"
                          )}
                        </span>
                      </div>

                      <div className={styles.itemInfo}>
                        <div
                          className={
                            styles.itemHeading
                          }
                        >
                          <div>
                            <span
                              className={
                                styles.category
                              }
                            >
                              {item?.category ||
                                "SPIRIT"}
                            </span>

                            <h3>
                              {item?.name ||
                                "SPIRIT PRODUCT"}
                            </h3>
                          </div>

                          <button
                            type="button"
                            className={
                              styles.remove
                            }
                            onClick={() =>
                              onRemove?.(item)
                            }
                            aria-label={`Remove ${
                              item?.name ||
                              "product"
                            }`}
                          >
                            REMOVE
                          </button>
                        </div>

                        {item?.selectedSize && (
                          <div
                            className={
                              styles.size
                            }
                          >
                            <span>SIZE</span>
                            <strong>
                              {item.selectedSize}
                            </strong>
                          </div>
                        )}

                        <div
                          className={
                            styles.itemBottom
                          }
                        >
                          <div
                            className={
                              styles.quantity
                            }
                          >
                            <button
                              type="button"
                              onClick={() =>
                                handleDecrease(item)
                              }
                              aria-label="Decrease quantity"
                            >
                              <Minus
                                size={13}
                                strokeWidth={1.1}
                              />
                            </button>

                            <span>
                              {String(
                                quantity
                              ).padStart(2, "0")}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                handleIncrease(item)
                              }
                              aria-label="Increase quantity"
                            >
                              <Plus
                                size={13}
                                strokeWidth={1.1}
                              />
                            </button>
                          </div>

                          {hasPrice && (
                            <div
                              className={
                                styles.price
                              }
                            >
                              <span>
                                {currency}
                              </span>

                              <strong>
                                {formatPrice(
                                  lineTotal
                                )}
                              </strong>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {safeItems.length > 0 && (
          <footer className={styles.footer}>
            <div className={styles.footerMeta}>
              <span>ORDER SUMMARY</span>

              <span>
                {String(itemCount).padStart(2, "0")}{" "}
                ITEMS
              </span>
            </div>

            {hasPrices ? (
              <div className={styles.subtotal}>
                <span>SUBTOTAL</span>

                <strong>
                  {currency}{" "}
                  {formatPrice(subtotal)}
                </strong>
              </div>
            ) : (
              <div className={styles.checkoutNote}>
                <span>
                  TOTAL CALCULATED AT CHECKOUT
                </span>
              </div>
            )}

            <button
              type="button"
              className={styles.checkout}
              disabled
              title="Checkout will be connected next"
            >
              <span>CHECKOUT</span>

              <ArrowUpRight
                size={18}
                strokeWidth={1.1}
              />
            </button>

            <button
              type="button"
              className={styles.continue}
              onClick={onClose}
            >
              CONTINUE SHOPPING
            </button>
          </footer>
        )}
      </aside>
    </div>
  );
}
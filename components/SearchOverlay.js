"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  ArrowUpRight,
} from "lucide-react";

import { lockScroll, unlockScroll } from "@/lib/scrollLock";
import useDialogA11y from "@/lib/useDialogA11y";

import styles from "./SearchOverlay.module.css";

const popularSearches = [
  {
    label: "PERFORMANCE",
    href: "/shop",
  },
  {
    label: "WOMEN",
    href: "/women",
  },
  {
    label: "MEN",
    href: "/men",
  },
  {
    label: "TRAINING",
    href: "/shop",
  },
];

export default function SearchOverlay({
  isOpen,
  onClose,
}) {
  const inputRef = useRef(null);
  const router = useRouter();
  const [query, setQuery] = useState("");

  /*
   * Focus, Tab cycling, Escape and focus restoration are
   * handled by the shared dialog helper. The scroll lock
   * stays here so the reference-counted behaviour is
   * unchanged.
   */
  const dialogRef = useDialogA11y({
    isOpen,
    onClose,
    initialFocusRef: inputRef,
  });

  useEffect(() => {
    if (!isOpen) return;

    lockScroll();

    return () => {
      unlockScroll();
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) return;

    /*
     * Reset the query after the overlay has closed.
     * The reset is deferred out of the effect body
     * to avoid synchronous cascading renders.
     */
    const id = window.setTimeout(() => {
      setQuery("");
    }, 0);

    return () => window.clearTimeout(id);
  }, [isOpen]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const value = query.trim();

    if (!value) return;

    /*
     * Search routing can be connected to the
     * real product search system later.
     *
     * For now, keep the interaction clean
     * without pretending that a search backend
     * exists.
     */
    router.push(`/shop?search=${encodeURIComponent(value)}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dialogRef}
          tabIndex={-1}
          className={styles.overlay}
          role="dialog"
          data-lenis-prevent
          aria-modal="true"
          aria-label="Search"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.25,
          }}
        >
          <motion.div
            className={styles.panel}
            initial={{
              y: "-3%",
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: "-3%",
              opacity: 0,
            }}
            transition={{
              duration: 0.38,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {/* HEADER */}
            <header className={styles.header}>
              <span>
                SPIRIT / SEARCH
              </span>

              <button
                type="button"
                className={styles.close}
                onClick={onClose}
                aria-label="Close search"
              >
                <span>CLOSE</span>

                <X
                  size={19}
                  strokeWidth={1.1}
                />
              </button>
            </header>

            {/* SEARCH */}
            <main className={styles.main}>
              <div className={styles.searchMeta}>
                <span>SEARCH</span>

                <span>
                  FIND YOUR MOVEMENT
                </span>
              </div>

              <form
                className={styles.form}
                onSubmit={handleSubmit}
              >
                <Search
                  size={24}
                  strokeWidth={1}
                  className={styles.searchIcon}
                />

                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(event) =>
                    setQuery(
                      event.target.value
                    )
                  }
                  placeholder="WHAT ARE YOU LOOKING FOR?"
                  aria-label="Search SPIRIT"
                  autoComplete="off"
                  spellCheck="false"
                />

                {query && (
                  <button
                    type="button"
                    className={
                      styles.clearButton
                    }
                    onClick={() =>
                      setQuery("")
                    }
                    aria-label="Clear search"
                  >
                    <X
                      size={18}
                      strokeWidth={1}
                    />
                  </button>
                )}

                <button
                  type="submit"
                  className={styles.submit}
                  aria-label="Submit search"
                >
                  <ArrowUpRight
                    size={22}
                    strokeWidth={1}
                  />
                </button>
              </form>

              {/* POPULAR */}
              <section
                className={
                  styles.popular
                }
              >
                <div
                  className={
                    styles.popularHeader
                  }
                >
                  <span>
                    POPULAR SEARCHES
                  </span>

                  <span>
                    {String(
                      popularSearches.length
                    ).padStart(2, "0")}
                  </span>
                </div>

                <div
                  className={
                    styles.popularList
                  }
                >
                  {popularSearches.map(
                    (item, index) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={onClose}
                        className={
                          styles.popularItem
                        }
                      >
                        <span
                          className={
                            styles.itemNumber
                          }
                        >
                          {String(
                            index + 1
                          ).padStart(2, "0")}
                        </span>

                        <span
                          className={
                            styles.itemLabel
                          }
                        >
                          {item.label}
                        </span>

                        <ArrowUpRight
                          size={16}
                          strokeWidth={1}
                          className={
                            styles.itemArrow
                          }
                        />
                      </Link>
                    )
                  )}
                </div>
              </section>
            </main>

            {/* FOOTER */}
            <footer
              className={styles.footer}
            >
              <span>
                LAHORE / PAKISTAN
              </span>

              <span>
                DESIGNED FOR MOVEMENT
              </span>

              <span>
                ESC TO CLOSE
              </span>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
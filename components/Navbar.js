"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingBag,
  ArrowUpRight,
} from "lucide-react";

import CartDrawer from "./CartDrawer";
import MegaMenu from "./MegaMenu";
import SearchOverlay from "./SearchOverlay";
import Logo from "./Logo";
import { useCart } from "./CartProvider";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";

import styles from "./Navbar.module.css";

const navItems = [
  { label: "WOMEN", href: "/women", mega: true },
  { label: "MEN", href: "/men", mega: true },
  { label: "COLLECTIONS", href: "/collections", mega: true },
  { label: "SHOP", href: "/shop", mega: false },
  { label: "STORY", href: "/story", mega: false },
];

/* Label that rolls up to a duplicate on hover. */
function Roll({ children }) {
  return (
    <span className={styles.roll}>
      <span className={styles.rollInner}>
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
    </span>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMega, setActiveMega] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const lastY = useRef(0);

  const {
    items,
    itemCount,
    isCartOpen,
    openCart,
    closeCart,
    updateQuantity,
    removeFromCart,
  } = useCart();

  /* glass after the first scroll; hide on the way down, return on the way up */
  useEffect(() => {
    let frame = 0;

    const update = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;

      setSolid(y > 40);

      if (Math.abs(delta) > 6) {
        setHidden(delta > 0 && y > 240);
        lastY.current = y;
      }
    };

    const onScroll = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  /* every route change closes the menus */
  useEffect(() => {
    const id = window.setTimeout(() => {
      setMobileOpen(false);
      setActiveMega(null);
    }, 0);

    return () => window.clearTimeout(id);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setActiveMega(null);
        setMobileOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return undefined;

    lockScroll();
    return () => unlockScroll();
  }, [mobileOpen]);

  const openSearch = () => {
    setSearchOpen(true);
    setMobileOpen(false);
    setActiveMega(null);
  };

  const isActive = (href) =>
    pathname === href || (href !== "/" && pathname?.startsWith(`${href}/`));

  return (
    <>
      <header
        className={styles.header}
        data-solid={solid || activeMega || mobileOpen ? "true" : "false"}
        data-hidden={hidden && !activeMega && !mobileOpen ? "true" : "false"}
        data-menu={mobileOpen ? "true" : "false"}
        onMouseLeave={() => setActiveMega(null)}
      >
        <div className={styles.bar}>
          <Link
            href="/"
            className={styles.logo}
            aria-label="SPIRIT home"
            onClick={() => setMobileOpen(false)}
          >
            <Logo variant="mark" className={styles.logoMark} />
            <Logo variant="word" className={styles.logoWord} />
          </Link>

          <nav className={styles.nav} aria-label="Primary navigation">
            {navItems.map((item) => (
              <div
                key={item.label}
                className={styles.navItem}
                onMouseEnter={() => setActiveMega(item.mega ? item.label : null)}
              >
                <Link
                  href={item.href}
                  className={styles.navLink}
                  data-active={isActive(item.href) ? "true" : "false"}
                  data-open={activeMega === item.label ? "true" : "false"}
                  aria-haspopup={item.mega ? "true" : undefined}
                  aria-expanded={item.mega ? activeMega === item.label : undefined}
                  onFocus={() => setActiveMega(item.mega ? item.label : null)}
                >
                  <Roll>{item.label}</Roll>
                  {item.mega && <span className={styles.dot} aria-hidden="true" />}
                </Link>
              </div>
            ))}
          </nav>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.icon}
              onClick={openSearch}
              aria-label="Open search"
              data-magnetic="0.35"
            >
              <Search size={17} strokeWidth={1.4} />
            </button>

            <button
              type="button"
              className={styles.bag}
              onClick={openCart}
              aria-label={`Open shopping bag${itemCount ? `, ${itemCount} items` : ""}`}
              data-magnetic="0.3"
            >
              <ShoppingBag size={16} strokeWidth={1.4} />
              <span className={styles.bagCount}>
                {itemCount > 99 ? "99+" : String(itemCount).padStart(2, "0")}
              </span>
            </button>

            <button
              type="button"
              className={styles.burger}
              onClick={() => {
                setMobileOpen((open) => !open);
                setActiveMega(null);
              }}
              aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              <span />
              <span />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {activeMega && (
            <MegaMenu
              key={activeMega}
              active={activeMega}
              onClose={() => setActiveMega(null)}
            />
          )}
        </AnimatePresence>
      </header>

      {/* mobile menu */}
      <div
        id="mobile-menu"
        className={styles.mobile}
        data-open={mobileOpen ? "true" : "false"}
        aria-hidden={!mobileOpen}
        inert={!mobileOpen}
        data-lenis-prevent
      >
        <div className={styles.mobileInner}>
          <div className={styles.mobileMeta}>
            <span>SPIRIT / Navigation</span>
            <span>SS—2026</span>
          </div>

          <nav className={styles.mobileNav} aria-label="Mobile navigation">
            {navItems.map((item, index) => (
              <Link
                key={item.label}
                href={item.href}
                className={styles.mobileLink}
                style={{ "--i": index }}
                onClick={() => setMobileOpen(false)}
              >
                <span className={styles.mobileIndex}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className={`display ${styles.mobileLabel}`}>{item.label}</span>
                <ArrowUpRight size={22} strokeWidth={1.2} />
              </Link>
            ))}
          </nav>

          <div className={styles.mobileUtilities}>
            <button type="button" onClick={openSearch}>
              <Search size={15} strokeWidth={1.4} /> Search
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                openCart();
              }}
            >
              <ShoppingBag size={15} strokeWidth={1.4} /> Bag
              {itemCount > 0 ? ` / ${itemCount}` : ""}
            </button>
          </div>

          <div className={styles.mobileFooter}>
            <span>Lahore / Pakistan</span>
            <span>Designed for movement</span>
          </div>
        </div>
      </div>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={closeCart}
        items={items}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
      />
    </>
  );
}

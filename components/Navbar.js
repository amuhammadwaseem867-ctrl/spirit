"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  UserRound,
  ShoppingBag,
  Menu,
  X,
  ArrowUpRight,
} from "lucide-react";

import CartDrawer from "./CartDrawer";
import MegaMenu from "./MegaMenu";
import SearchOverlay from "./SearchOverlay";
import { useCart } from "./CartProvider";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";

import styles from "./Navbar.module.css";

const navItems = [
  {
    label: "WOMEN",
    href: "/women",
    mega: true,
  },
  {
    label: "MEN",
    href: "/men",
    mega: true,
  },
  {
    label: "COLLECTIONS",
    href: "/collections",
    mega: true,
  },
  {
    label: "SHOP",
    href: "/shop",
    mega: false,
  },
  {
    label: "STORY",
    href: "/story",
    mega: false,
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMega, setActiveMega] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const {
    items,
    itemCount,
    isCartOpen,
    openCart,
    closeCart,
    updateQuantity,
    removeFromCart,
  } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setActiveMega(null);
        setMobileOpen(false);
        setSearchOpen(false);
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    lockScroll();

    return () => {
      unlockScroll();
    };
  }, [mobileOpen]);

  const handleMegaEnter = (label) => {
    setActiveMega(label);
  };

  const handleNavLeave = () => {
    setActiveMega(null);
  };

  const handleMobileToggle = () => {
    setMobileOpen((current) => !current);
    setActiveMega(null);
  };

  const handleMobileLink = () => {
    setMobileOpen(false);
    setActiveMega(null);
  };

  const handleSearchOpen = () => {
    setSearchOpen(true);
    setMobileOpen(false);
    setActiveMega(null);
  };

  const handleSearchClose = () => {
    setSearchOpen(false);
  };

  return (
    <>
      <header
        className={`${styles.header} ${
          scrolled ? styles.scrolled : ""
        } ${mobileOpen ? styles.menuActive : ""}`}
        onMouseLeave={handleNavLeave}
      >
        <div className={styles.navInner}>
          {/* LEFT */}
          <div className={styles.left}>
            <button
              type="button"
              className={styles.mobileMenuButton}
              onClick={handleMobileToggle}
              aria-label={
                mobileOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X
                  size={19}
                  strokeWidth={1.15}
                />
              ) : (
                <Menu
                  size={19}
                  strokeWidth={1.15}
                />
              )}
            </button>

            <Link
              href="/"
              className={styles.logo}
              aria-label="SPIRIT home"
              onClick={handleMobileLink}
            >
              SPIRIT
            </Link>
          </div>

          {/* DESKTOP NAV */}
          <nav
            className={styles.desktopNav}
            aria-label="Primary navigation"
          >
            {navItems.map((item) => (
              <div
                key={item.label}
                className={styles.navItem}
                onMouseEnter={() =>
                  item.mega
                    ? handleMegaEnter(item.label)
                    : setActiveMega(null)
                }
              >
                <Link
                  href={item.href}
                  className={`${styles.navLink} ${
                    activeMega === item.label
                      ? styles.navLinkActive
                      : ""
                  }`}
                  aria-haspopup={
                    item.mega ? "true" : undefined
                  }
                  aria-expanded={
                    item.mega
                      ? activeMega === item.label
                      : undefined
                  }
                  onFocus={() =>
                    item.mega
                      ? handleMegaEnter(item.label)
                      : setActiveMega(null)
                  }
                >
                  {item.label}

                  {item.mega && (
                    <span
                      className={styles.navDot}
                    />
                  )}
                </Link>
              </div>
            ))}
          </nav>

          {/* ACTIONS */}
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.actionButton}
              onClick={handleSearchOpen}
              aria-label="Open search"
            >
              <Search
                size={17}
                strokeWidth={1.1}
              />
            </button>

            <Link
              href="/account"
              className={`${styles.actionButton} ${styles.accountButton}`}
              aria-label="Account"
            >
              <UserRound
                size={17}
                strokeWidth={1.1}
              />
            </Link>

            <button
              type="button"
              className={styles.actionButton}
              onClick={openCart}
              aria-label={`Open shopping bag${
                itemCount
                  ? `, ${itemCount} items`
                  : ""
              }`}
            >
              <ShoppingBag
                size={17}
                strokeWidth={1.1}
              />

              {itemCount > 0 && (
                <span className={styles.bagCount}>
                  {itemCount > 99
                    ? "99+"
                    : itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* MEGA MENU */}
        {activeMega && (
          <MegaMenu
            active={activeMega}
            onClose={() =>
              setActiveMega(null)
            }
          />
        )}

        {/* MOBILE MENU */}
        <div
          className={`${styles.mobileMenu} ${
            mobileOpen
              ? styles.mobileMenuOpen
              : ""
          }`}
          aria-hidden={!mobileOpen}
        >
          <div className={styles.mobileMenuInner}>
            <div className={styles.mobileMenuMeta}>
              <span>SPIRIT / NAVIGATION</span>
              <span>2026</span>
            </div>

            <nav
              className={styles.mobileNav}
              aria-label="Mobile navigation"
            >
              {navItems.map(
                (item, index) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={
                      styles.mobileNavLink
                    }
                    onClick={handleMobileLink}
                  >
                    <span
                      className={
                        styles.mobileNavNumber
                      }
                    >
                      {String(index + 1).padStart(
                        2,
                        "0"
                      )}
                    </span>

                    <span
                      className={
                        styles.mobileNavLabel
                      }
                    >
                      {item.label}
                    </span>

                    <ArrowUpRight
                      size={20}
                      strokeWidth={1}
                    />
                  </Link>
                )
              )}
            </nav>

            <div
              className={
                styles.mobileMenuBottom
              }
            >
              <button
                type="button"
                onClick={handleSearchOpen}
                className={
                  styles.mobileUtility
                }
              >
                <Search
                  size={15}
                  strokeWidth={1.1}
                />
                <span>SEARCH</span>
              </button>

              <Link
                href="/account"
                onClick={handleMobileLink}
                className={
                  styles.mobileUtility
                }
              >
                <UserRound
                  size={15}
                  strokeWidth={1.1}
                />
                <span>ACCOUNT</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  handleMobileLink();
                  openCart();
                }}
                className={
                  styles.mobileUtility
                }
              >
                <ShoppingBag
                  size={15}
                  strokeWidth={1.1}
                />
                <span>
                  BAG
                  {itemCount > 0
                    ? ` / ${itemCount}`
                    : ""}
                </span>
              </button>
            </div>

            <div
              className={
                styles.mobileMenuFooter
              }
            >
              <span>
                LAHORE / PAKISTAN
              </span>

              <span>
                DESIGNED FOR MOVEMENT
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* SEARCH */}
      <SearchOverlay
        isOpen={searchOpen}
        onClose={handleSearchClose}
      />

      {/* CART */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={closeCart}
        items={items}
        onUpdateQuantity={
          updateQuantity
        }
        onRemove={removeFromCart}
      />
    </>
  );
}
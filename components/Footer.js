"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowUp,
} from "lucide-react";

import StrokeText from "@/components/StrokeText";
import styles from "./Footer.module.css";

const footerLinks = {
  SHOP: [
    {
      label: "ALL PRODUCTS",
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
      label: "COLLECTIONS",
      href: "/collections",
    },
  ],

  SPIRIT: [
    {
      label: "STORY",
      href: "/story",
    },
    {
      label: "PERFORMANCE",
      href: "/#performance",
    },
    {
      label: "JOURNAL",
      href: "/#journal",
    },
  ],

  SUPPORT: [
    {
      label: "CONTACT",
      href: "/contact",
    },
    {
      label: "SHIPPING",
      href: "/shipping",
    },
    {
      label: "RETURNS",
      href: "/returns",
    },
    {
      label: "FAQ",
      href: "/faq",
    },
  ],
};

const socials = [
  {
    label: "INSTAGRAM",
    href: "#",
  },
  {
    label: "FACEBOOK",
    href: "#",
  },
  {
    label: "PINTEREST",
    href: "#",
  },
];

export default function Footer() {
  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>

        {/* =====================================================
            FOOTER INTRO
        ===================================================== */}

        <section className={styles.intro}>
          <motion.div
            className={styles.meta}
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <span>09</span>

            <span>
              SPIRIT / END FRAME
            </span>

            <span>2026</span>
          </motion.div>

          <div className={styles.introMain}>
            <motion.div
              className={styles.brandHeading}
              initial={{
                opacity: 0,
                y: 45,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.25,
              }}
              transition={{
                duration: 1,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <span className={styles.eyebrow}>
                SPIRIT ACTIVEWEAR
              </span>

              <h2>
                MOVE
                <br />

                <StrokeText
                  color="#f5f5f2"
                  strokeColor="rgba(245, 245, 242, 0.9)"
                  strokeWidth={1.1}
                  className={styles.stroke}
                >
                  WITH INTENT.
                </StrokeText>
              </h2>
            </motion.div>

            <motion.div
              className={styles.introSide}
              initial={{
                opacity: 0,
                x: 30,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.8,
                delay: 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <span>
                DESIGNED FOR MOVEMENT
              </span>

              <p>
                Performance-led activewear
                designed for training,
                movement and the life
                beyond it.
              </p>
            </motion.div>
          </div>
        </section>

        {/* =====================================================
            NEWSLETTER
        ===================================================== */}

        <motion.section
          className={styles.newsletter}
          initial={{
            opacity: 0,
            y: 35,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: 0.9,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <div className={styles.newsletterHeading}>
            <span className={styles.sectionLabel}>
              SPIRIT / JOURNAL
            </span>

            <h3>
              STAY IN
              <br />

              <StrokeText
                color="#f5f5f2"
                strokeColor="rgba(245, 245, 242, 0.88)"
                strokeWidth={1}
                className={styles.newsletterStroke}
              >
                MOTION.
              </StrokeText>
            </h3>
          </div>

          <div className={styles.newsletterRight}>
            <p>
              Stories, new collections and
              ideas from the world of
              SPIRIT.
            </p>

            <form
              className={styles.newsletterForm}
              onSubmit={(event) =>
                event.preventDefault()
              }
            >
              <label htmlFor="spirit-email">
                EMAIL ADDRESS
              </label>

              <div className={styles.inputRow}>
                <input
                  id="spirit-email"
                  type="email"
                  placeholder="YOUR EMAIL"
                  autoComplete="email"
                  required
                />

                <button type="submit">
                  <span>JOIN</span>

                  <span
                    className={styles.buttonIcon}
                  >
                    <ArrowUpRight
                      size={16}
                      strokeWidth={1.15}
                    />
                  </span>
                </button>
              </div>
            </form>
          </div>
        </motion.section>

        {/* =====================================================
            NAVIGATION
        ===================================================== */}

        <section className={styles.navigation}>
          {Object.entries(footerLinks).map(
            ([title, links], columnIndex) => (
              <motion.div
                key={title}
                className={styles.navColumn}
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.2,
                }}
                transition={{
                  duration: 0.7,
                  delay: columnIndex * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <span className={styles.columnTitle}>
                  {title}
                </span>

                <div className={styles.links}>
                  {links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                    >
                      <span>{link.label}</span>

                      <ArrowUpRight
                        size={13}
                        strokeWidth={1.1}
                      />
                    </Link>
                  ))}
                </div>
              </motion.div>
            )
          )}

          <motion.div
            className={styles.connect}
            initial={{
              opacity: 0,
              y: 25,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.7,
              delay: 0.25,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <span className={styles.columnTitle}>
              CONNECT
            </span>

            <div className={styles.contact}>
              <a href="mailto:hello@spirit.com">
                HELLO@SPIRIT.COM
              </a>

              <span>
                LAHORE / PAKISTAN
              </span>

              <span>
                WORLDWIDE / ONLINE
              </span>
            </div>

            {/*
             * Placeholder destinations — real profile URLs do not
             * exist yet, so these deliberately do not open a new
             * tab.
             */}
            <div className={styles.socials}>
              {socials.map((social) => (
                <a key={social.label} href={social.href}>
                  {social.label}
                </a>
              ))}
            </div>
          </motion.div>
        </section>

        {/* =====================================================
            GIANT WORDMARK
        ===================================================== */}

        <motion.div
          className={styles.wordmark}
          initial={{
            opacity: 0,
            y: 50,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 1,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <span>SPIRIT</span>
        </motion.div>

        {/* =====================================================
            BOTTOM BAR
        ===================================================== */}

        <div className={styles.bottom}>
          <div className={styles.legal}>
            <span>
              © 2026 SPIRIT
            </span>

            <Link href="/privacy">
              PRIVACY
            </Link>

            <Link href="/terms">
              TERMS
            </Link>
          </div>

          <span className={styles.centerText}>
            DESIGNED FOR MOVEMENT
          </span>

          <button
            type="button"
            className={styles.backTop}
            onClick={scrollToTop}
            aria-label="Back to top"
          >
            <span>BACK TO TOP</span>

            <span className={styles.backTopIcon}>
              <ArrowUp
                size={15}
                strokeWidth={1.15}
              />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
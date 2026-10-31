"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUp, ArrowUpRight } from "lucide-react";

import Logo from "./Logo";
import Reveal from "./ui/Reveal";

import styles from "./Footer.module.css";

const footerLinks = {
  Shop: [
    { label: "All products", href: "/shop" },
    { label: "Women", href: "/women" },
    { label: "Men", href: "/men" },
    { label: "Collections", href: "/collections" },
  ],
  Spirit: [
    { label: "Story", href: "/story" },
    { label: "Performance", href: "/#performance" },
    { label: "Journal", href: "/#journal" },
  ],
  Support: [
    { label: "Contact", href: "/contact" },
    { label: "Shipping", href: "/shipping" },
    { label: "Returns", href: "/returns" },
    { label: "FAQ", href: "/faq" },
  ],
};

export default function Footer() {
  const wordRef = useRef(null);
  const [joined, setJoined] = useState(false);

  const { scrollYProgress } = useScroll({
    target: wordRef,
    offset: ["start end", "end end"],
  });

  const wordY = useTransform(scrollYProgress, [0, 1], ["60%", "0%"]);
  const wordClip = useTransform(scrollYProgress, (value) => {
    const shown = Math.min(1, Math.max(0, value / 0.85));
    return `inset(${((1 - shown) * 100).toFixed(2)}% 0 0 0)`;
  });

  const scrollToTop = () => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 2.2 });
      return;
    }

    window.scrollTo({ top: 0, behavior: "auto" });
  };

  return (
    <footer className={`${styles.footer} surface-ink-2`}>
      <div className="wrap">
        <Reveal className={styles.top}>
          <div className={styles.join}>
            <span className="eyebrow reveal">SPIRIT / Journal</span>
            <h2 className={`display reveal ${styles.joinTitle}`} style={{ "--rd": "60ms" }}>
              Stay in
              <br />
              <span className={styles.outline}>motion.</span>
            </h2>
          </div>

          <div className={`reveal ${styles.form}`} style={{ "--rd": "140ms" }}>
            <p>Stories, new collections and ideas from the world of SPIRIT.</p>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                setJoined(true);
              }}
            >
              <label htmlFor="spirit-email">Email address</label>
              <div className={styles.inputRow}>
                <input
                  id="spirit-email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  aria-describedby="spirit-email-note"
                />
                <button type="submit" aria-label="Join the SPIRIT journal" data-magnetic="0.3">
                  <ArrowUpRight size={18} strokeWidth={1.5} />
                </button>
              </div>
              <p id="spirit-email-note" className={styles.note} role="status">
                {joined
                  ? "Thank you — newsletter sign-ups open soon, and we'll be in touch when they do."
                  : "No spam. Unsubscribe at any time."}
              </p>
            </form>
          </div>
        </Reveal>

        <div className={styles.columns}>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className={styles.column}>
              <span className={styles.columnTitle}>{title}</span>
              <ul>
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className={styles.link}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className={styles.column}>
            <span className={styles.columnTitle}>Connect</span>
            <ul>
              <li>
                <a href="mailto:hello@spirit.com" className={styles.link}>
                  hello@spirit.com
                </a>
              </li>
              <li className={styles.plain}>Lahore / Pakistan</li>
              <li className={styles.plain}>Worldwide / Online</li>
            </ul>
          </div>
        </div>
      </div>

      <div ref={wordRef} className={styles.word} aria-hidden="true">
        <motion.div style={{ y: wordY, clipPath: wordClip }} className={styles.wordInner}>
          <Logo variant="word" className={styles.wordmark} />
        </motion.div>
      </div>

      <div className={`wrap ${styles.bottom}`}>
        <div className={styles.legal}>
          <span>© 2026 SPIRIT</span>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>

        <span className={styles.center}>
          <Logo variant="mark" className={styles.mark} /> Designed for movement
        </span>

        <button type="button" className={styles.backTop} onClick={scrollToTop}>
          Back to top
          <span>
            <ArrowUp size={15} strokeWidth={1.5} />
          </span>
        </button>
      </div>
    </footer>
  );
}

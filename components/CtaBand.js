import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import KineticText from "@/components/ui/KineticText";
import Marquee from "@/components/ui/Marquee";

import styles from "./CtaBand.module.css";

/**
 * Closing band used at the end of inner pages: a kinetic headline,
 * one call to action and a scroll-reactive marquee.
 */
export default function CtaBand({
  index = "05",
  label = "SPIRIT",
  title,
  outline = [1],
  copy,
  href = "/shop",
  cta = "Explore the collection",
  marquee = ["MOVE", "TRAIN", "RECOVER", "REPEAT"],
}) {
  return (
    <section className={`${styles.band} surface-ink`}>
      <div className="wrap">
        <div className="meta">
          <span>{index}</span>
          <span>{label}</span>
          <span>2026</span>
        </div>

        <div className={styles.body}>
          <KineticText
            as="h2"
            lines={title}
            outline={outline}
            className={`display ${styles.title}`}
          />

          <div className={styles.side}>
            {copy && <p>{copy}</p>}
            <Link href={href} className="btn btn-solid" data-magnetic="0.25">
              <span className="btn-label">{cta}</span>
              <span className="btn-icon">
                <ArrowUpRight size={16} strokeWidth={1.5} />
              </span>
            </Link>
          </div>
        </div>
      </div>

      <Marquee
        className={`display-condensed ${styles.marquee}`}
        items={marquee}
        speed={34}
        separator="✕"
      />
    </section>
  );
}

"use client";

import { useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import GLView from "@/components/three/GLView";
import KineticText from "@/components/ui/KineticText";
import Reveal from "@/components/ui/Reveal";
import Logo from "@/components/Logo";

import styles from "./FinalCTA.module.css";

const MonogramScene = dynamic(() => import("@/components/three/MonogramScene"), {
  ssr: false,
});

export default function FinalCTA() {
  const sectionRef = useRef(null);

  /* scroll progress shared with the 3D scene, read in its frame loop */
  const progress = useRef(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    progress.current = value;
  });

  return (
    <section
      ref={sectionRef}
      id="final-cta"
      className={`${styles.cta} surface-clear`}
    >
      <div className={styles.scene}>
        <GLView
          label="The SPIRIT monogram in polished chrome, circled by orbit rings"
          scene={(onReady) => (
            <MonogramScene
              progress={progress}
              trackRef={sectionRef}
              onReady={onReady}
            />
          )}
          fallback={
            <div className={styles.fallback}>
              <Logo variant="mark" />
            </div>
          }
        />
      </div>

      <div className={`wrap ${styles.inner}`}>
        <div className="meta">
          <span>10</span>
          <span>SPIRIT / FINAL MOVEMENT</span>
          <span>2026</span>
        </div>

        <div className={styles.main}>
          <KineticText
            as="h2"
            lines={["FIND", "YOUR SPIRIT."]}
            outline={[1]}
            className={`display ${styles.heading}`}
          />

          <Reveal className={styles.bottom}>
            <p className="reveal">
              Performance for the body.
              <br />
              Design for the life around it.
            </p>

            <div className={`reveal ${styles.actions}`} style={{ "--rd": "120ms" }}>
              <Link href="/shop" className="btn btn-solid" data-magnetic="0.25">
                <span className="btn-label">Explore SPIRIT</span>
                <span className="btn-icon">
                  <ArrowUpRight size={16} strokeWidth={1.5} />
                </span>
              </Link>
              <Link href="/story" className="link-line">
                Our story
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

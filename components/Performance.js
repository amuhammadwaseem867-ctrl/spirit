"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

import GLView from "@/components/three/GLView";
import KineticText from "@/components/ui/KineticText";
import Reveal from "@/components/ui/Reveal";
import { sceneState } from "@/lib/gl";
import { addTick, TICK } from "@/lib/ticker";
import { campaign } from "@/lib/media";

import styles from "./Performance.module.css";

const FabricScene = dynamic(() => import("@/components/three/FabricScene"), {
  ssr: false,
});

const modes = [
  {
    key: "01",
    title: "LIGHTNESS",
    metric: "01",
    unit: "Weight class",
    description:
      "Constructions that remove unnecessary weight without giving up structure. The swatch floats on the slightest air.",
  },
  {
    key: "02",
    title: "FLEX",
    metric: "04",
    unit: "Way stretch",
    description:
      "Adaptive knit that follows the body through every range of motion. Press into the swatch and pull it in any direction.",
  },
  {
    key: "03",
    title: "BREATHABILITY",
    metric: "360°",
    unit: "Airflow",
    description:
      "Ventilation-led construction that keeps movement feeling controlled. Watch the perforations open and the air move through.",
  },
];

export default function Performance() {
  const sectionRef = useRef(null);
  const labRef = useRef(null);
  const stretchRef = useRef(null);
  const airRef = useRef(null);
  const [mode, setMode] = useState(0);

  useEffect(() => {
    sceneState.fabric.mode = mode;
  }, [mode]);

  /* pause the simulation when the lab is offscreen */
  useEffect(() => {
    const node = labRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      sceneState.fabric.visible = entry.isIntersecting;
    });

    observer.observe(node);

    return () => {
      observer.disconnect();
      sceneState.fabric.visible = false;
    };
  }, []);

  /* live readouts, written straight to the DOM */
  useEffect(() => {
    return addTick(() => {
      if (!sceneState.fabric.visible) return;

      if (stretchRef.current) {
        stretchRef.current.textContent = String(sceneState.fabric.stretch).padStart(3, "0");
      }

      if (airRef.current) {
        airRef.current.textContent = String(sceneState.fabric.airflow).padStart(3, "0");
      }
    }, TICK.CURSOR);
  }, []);

  const active = modes[mode];

  return (
    <section
      ref={sectionRef}
      id="performance"
      className={`${styles.performance} surface-clear`}
    >
      <div className="wrap">
        <div className="meta">
          <span>04</span>
          <span>PERFORMANCE LAB</span>
          <span className={styles.live}>
            <span className="signal-dot" aria-hidden="true" /> Interactive
          </span>
        </div>

        <div className={styles.header}>
          <KineticText
            as="h2"
            lines={["PERFORMANCE", "WITHOUT", "DISTRACTION."]}
            outline={[1]}
            className={`display ${styles.heading}`}
          />
          <Reveal className={styles.headerCopy}>
            <p className="reveal">
              Every SPIRIT piece is considered from the inside out — how
              fabric moves, how the body responds, and how performance
              becomes part of everyday life.
            </p>
          </Reveal>
        </div>
      </div>

      <div className={`wrap ${styles.lab}`}>
        <div className={styles.panel}>
          <div
            className={styles.modes}
            role="radiogroup"
            aria-label="Fabric behaviour"
          >
            {modes.map((item, index) => (
              <button
                key={item.key}
                type="button"
                role="radio"
                aria-checked={mode === index}
                className={styles.mode}
                data-active={mode === index ? "true" : "false"}
                onClick={() => setMode(index)}
              >
                <span className={styles.modeKey}>{item.key}</span>
                <span className={styles.modeTitle}>{item.title}</span>
                <span className={styles.modeMetric}>
                  <strong>{item.metric}</strong>
                  <small>{item.unit}</small>
                </span>
              </button>
            ))}
          </div>

          <p key={active.key} className={styles.modeCopy} aria-live="polite">
            {active.description}
          </p>

          <div className={styles.readouts} aria-hidden="true">
            <div>
              <span>Stretch</span>
              <strong>
                <span ref={stretchRef}>000</span>%
              </strong>
            </div>
            <div>
              <span>Airflow</span>
              <strong>
                <span ref={airRef}>000</span>%
              </strong>
            </div>
            <div>
              <span>Mode</span>
              <strong>{active.title.slice(0, 5)}</strong>
            </div>
          </div>
        </div>

        <div ref={labRef} className={styles.swatch} data-cursor="PRESS">
          <GLView
            label="Interactive 3D swatch of SPIRIT performance fabric. Move the pointer over it to press and stretch the knit."
            scene={(onReady) => (
              <FabricScene trackRef={labRef} onReady={onReady} />
            )}
            fallback={
              <Image
                src={campaign.jacket.src}
                alt=""
                fill
                sizes="(max-width: 900px) 92vw, 55vw"
                className={styles.fallback}
              />
            }
          />

          <div className={styles.swatchMeta} aria-hidden="true">
            <span>SP / LAB — 04</span>
            <span>KNIT / 4-WAY / PERFORATED</span>
          </div>

          <div className={styles.crosshair} aria-hidden="true">
            <span />
            <span />
          </div>
        </div>
      </div>

      <Reveal className={`wrap ${styles.statement}`}>
        <span className="mono reveal">04 / 04</span>
        <p className={`display reveal ${styles.statementText}`}>
          Designed to move.
          <br />
          <span className={styles.statementOutline}>Built to disappear.</span>
        </p>
      </Reveal>
    </section>
  );
}

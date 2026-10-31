"use client";

import { useEffect, useState } from "react";

import useInView from "@/lib/useInView";

import styles from "./KineticText.module.css";

/**
 * Headline with a 3D character reveal.
 *
 * Each character flips up from below the baseline (rotateX -40deg,
 * 15ms stagger, expo-out), following the UI/UX Pro Max "Stagger
 * List / Complex" motion preset. The animation is pure CSS; this
 * component only splits the text and toggles a state attribute.
 *
 * - `lines` renders one masked line per entry.
 * - `trigger="view"` waits for the element to enter the viewport;
 *   `trigger="mount"` plays as soon as `play` is true.
 * - Screen readers get the plain text once via aria-label.
 * - Under reduced motion the CSS shows the final state.
 */
export default function KineticText({
  as: Tag = "h2",
  lines,
  className = "",
  lineClassName = "",
  delay = 0,
  stagger = 15,
  trigger = "view",
  play = true,
  outline = [],
  fitChars,
}) {
  const [ref, inView] = useInView({ threshold: 0.25 });

  /*
   * A mount-triggered headline must paint its hidden state for at
   * least one frame, otherwise the browser skips the transition.
   */
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    let inner = 0;
    const outer = window.requestAnimationFrame(() => {
      inner = window.requestAnimationFrame(() => setArmed(true));
    });

    return () => {
      window.cancelAnimationFrame(outer);
      window.cancelAnimationFrame(inner);
    };
  }, []);

  const active =
    trigger === "view" ? inView && play : play && armed;
  const label = lines.join(" ");

  /*
   * On small screens the headline scales to its longest line so it
   * never clips. `fitChars` lets split headlines share one size.
   */
  const chars = fitChars ?? Math.max(...lines.map((line) => line.length));

  let charIndex = 0;

  return (
    <Tag
      ref={ref}
      className={`${styles.kinetic} ${className}`}
      data-in={active ? "true" : "false"}
      aria-label={label}
      style={{ "--chars": chars }}
    >
      {lines.map((line, lineIndex) => (
        <span
          key={`${line}-${lineIndex}`}
          className={`${styles.line} ${lineClassName} ${
            outline.includes(lineIndex) ? styles.outline : ""
          }`}
          aria-hidden="true"
        >
          {line.split(" ").map((word, wordIndex, words) => (
            <span key={`${word}-${wordIndex}`} className={styles.word}>
              {Array.from(word).map((char) => {
                const index = charIndex;
                charIndex += 1;

                return (
                  <span
                    key={`${char}-${index}`}
                    className={styles.char}
                    style={{
                      "--d": `${delay + index * stagger}ms`,
                    }}
                  >
                    {char}
                  </span>
                );
              })}
              {wordIndex < words.length - 1 && (
                <span className={styles.space}> </span>
              )}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
}

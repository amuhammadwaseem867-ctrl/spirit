"use client";

import { useCallback, useRef, useState } from "react";

import styles from "./StrokeText.module.css";

const INK = "#101317";
const INK_STROKE = "rgba(16, 19, 23, 0.9)";

export default function StrokeText({
  children,
  className = "",
  color = INK,
  strokeColor = INK_STROKE,
  strokeWidth = 1.25,
}) {
  const rootRef = useRef(null);

  /*
   * Touch and pen taps toggle a persistent filled state.
   * Mouse is excluded so the desktop cursor-following
   * effect remains the only pointer-driven behaviour.
   */
  const [isTouchActive, setIsTouchActive] = useState(false);

  /*
   * The fill reveal follows the pointer.
   *
   * The position is written straight to the element as custom
   * properties so tracking the cursor never triggers a React
   * render — the mask itself animates in CSS.
   */
  const handlePointerMove = useCallback((event) => {
    const node = rootRef.current;

    if (!node) return;

    const rect = node.getBoundingClientRect();

    node.style.setProperty(
      "--fill-x",
      `${event.clientX - rect.left}px`
    );

    node.style.setProperty(
      "--fill-y",
      `${event.clientY - rect.top}px`
    );
  }, []);

  /*
   * Tap to fill on touch and pen. The fill origin is reset to
   * the centre of the element because there is no persistent
   * cursor coordinate to anchor it to.
   */
  const handlePointerUp = useCallback((event) => {
    if (event.pointerType !== "touch" && event.pointerType !== "pen") {
      return;
    }

    const node = rootRef.current;

    if (node) {
      node.style.setProperty("--fill-x", "50%");
      node.style.setProperty("--fill-y", "50%");
    }

    setIsTouchActive((active) => !active);
  }, []);

  /*
   * Keyboard parity for the tap state: Enter and Space toggle
   * the fill, matching the button semantics below.
   */
  const handleKeyDown = useCallback((event) => {
    if (event.key !== "Enter" && event.key !== " " && event.key !== "Spacebar") {
      return;
    }

    event.preventDefault();

    setIsTouchActive((active) => !active);
  }, []);

  return (
    <span
      ref={rootRef}
      className={`${styles.strokeText} ${className}${isTouchActive ? ` ${styles.touchActive}` : ""}`}
      role="button"
      tabIndex={0}
      aria-pressed={isTouchActive}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onKeyDown={handleKeyDown}
      style={{
        "--stroke-width": `${strokeWidth}px`,
        "--stroke-color": strokeColor,
        "--fill-color": color,
      }}
    >
      <span className={styles.outline}>{children}</span>

      {/*
       * Second copy of the headline, used only for the
       * interactive fill. Hidden from assistive technology so
       * the text itself is announced once.
       */}
      <span className={styles.fill} aria-hidden="true">
        {children}
      </span>
    </span>
  );
}

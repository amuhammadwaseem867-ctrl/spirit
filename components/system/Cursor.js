"use client";

import { useEffect, useRef } from "react";

import { addTick, TICK } from "@/lib/ticker";
import { pointer, listenPointer } from "@/lib/pointer";

import styles from "./Cursor.module.css";

const INTERACTIVE =
  "a, button, [role='button'], label, select, summary, [data-cursor]";

/**
 * Custom cursor with magnetic targets.
 *
 * - Only mounts behaviour on precise pointers with hover support;
 *   touch devices keep the native experience.
 * - `data-cursor="VIEW"` shows a labelled disc over the element.
 * - `data-magnetic` (optionally "0.4") pulls the element toward the
 *   pointer, clamped so it never leaves its own hit area.
 * - Positions are written straight to the DOM from the shared
 *   ticker; React never re-renders while the cursor moves.
 */
export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);
  const labelTextRef = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!fine.matches) return undefined;

    listenPointer();

    const root = document.documentElement;
    root.classList.add("has-cursor");

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    const labelText = labelTextRef.current;

    const ringPos = { x: pointer.x, y: pointer.y };
    let hovering = false;
    let labelled = false;
    let pressed = false;
    let magnet = null;
    let visible = false;

    const setState = () => {
      ring.dataset.hover = hovering ? "true" : "false";
      ring.dataset.pressed = pressed ? "true" : "false";
      dot.dataset.hidden = hovering || labelled ? "true" : "false";
      label.dataset.active = labelled ? "true" : "false";
    };

    const releaseMagnet = () => {
      if (!magnet) return;
      magnet.style.transform = "";
      magnet.style.transition = "";
      magnet = null;
    };

    const onOver = (event) => {
      const target = event.target.closest?.(INTERACTIVE);
      const labelTarget = event.target.closest?.("[data-cursor]");

      hovering = Boolean(target);
      labelled = Boolean(labelTarget?.dataset.cursor);

      if (labelled) labelText.textContent = labelTarget.dataset.cursor;

      const nextMagnet = event.target.closest?.("[data-magnetic]");

      if (nextMagnet !== magnet) {
        releaseMagnet();

        if (nextMagnet && !reduce.matches) {
          magnet = nextMagnet;
          magnet.style.transition =
            "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
        }
      }

      setState();
    };

    const onDown = () => {
      pressed = true;
      setState();
    };

    const onUp = () => {
      pressed = false;
      setState();
    };

    const onLeaveWindow = () => {
      visible = false;
      root.dataset.cursorVisible = "false";
    };

    const onEnterWindow = () => {
      visible = true;
      root.dataset.cursorVisible = "true";
    };

    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeaveWindow);
    document.documentElement.addEventListener("pointerenter", onEnterWindow);

    const removeTick = addTick(() => {
      if (!pointer.active) return;

      if (!visible) onEnterWindow();

      const ease = reduce.matches ? 1 : 0.2;

      ringPos.x += (pointer.x - ringPos.x) * ease;
      ringPos.y += (pointer.y - ringPos.y) * ease;

      dot.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
      label.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;

      if (magnet) {
        const rect = magnet.getBoundingClientRect();
        const strength = Number(magnet.dataset.magnetic) || 0.3;
        const dx = pointer.x - (rect.left + rect.width / 2);
        const dy = pointer.y - (rect.top + rect.height / 2);
        const limitX = rect.width * 0.35;
        const limitY = rect.height * 0.35;
        const mx = Math.max(-limitX, Math.min(limitX, dx * strength));
        const my = Math.max(-limitY, Math.min(limitY, dy * strength));

        magnet.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      }
    }, TICK.CURSOR);

    return () => {
      removeTick();
      releaseMagnet();
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeaveWindow);
      document.documentElement.removeEventListener("pointerenter", onEnterWindow);
      root.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div className={styles.cursor} aria-hidden="true">
      <span ref={ringRef} className={styles.ring} />
      <span ref={dotRef} className={styles.dot} />
      <span ref={labelRef} className={styles.label}>
        <span ref={labelTextRef} className={styles.labelText} />
      </span>
    </div>
  );
}

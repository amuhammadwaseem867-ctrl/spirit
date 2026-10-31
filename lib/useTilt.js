"use client";

import { useEffect, useRef } from "react";

/**
 * Pointer-driven 3D tilt with a moving specular glare.
 *
 * Writes --rx, --ry (degrees) and --gx, --gy (glare position, %)
 * as custom properties on the element; CSS composes the transform.
 * Only active on hover-capable fine pointers and when motion is
 * allowed, so touch and reduced-motion users get a static card.
 */
export default function useTilt({ max = 9 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;

    if (!node) return undefined;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!fine.matches || reduce.matches) return undefined;

    let frame = 0;

    const onMove = (event) => {
      const rect = node.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;

      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        node.style.setProperty("--ry", `${(px - 0.5) * max * 2}deg`);
        node.style.setProperty("--rx", `${(0.5 - py) * max * 2}deg`);
        node.style.setProperty("--gx", `${px * 100}%`);
        node.style.setProperty("--gy", `${py * 100}%`);
        node.dataset.tilting = "true";
      });
    };

    const onLeave = () => {
      window.cancelAnimationFrame(frame);
      node.style.setProperty("--rx", "0deg");
      node.style.setProperty("--ry", "0deg");
      node.dataset.tilting = "false";
    };

    node.addEventListener("pointermove", onMove);
    node.addEventListener("pointerleave", onLeave);

    return () => {
      window.cancelAnimationFrame(frame);
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerleave", onLeave);
    };
  }, [max]);

  return ref;
}

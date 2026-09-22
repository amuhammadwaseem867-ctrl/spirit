"use client";

import { useEffect, useRef } from "react";

/*
 * SPIRIT — lightweight dialog focus management.
 *
 * A deliberately small helper shared by SearchOverlay,
 * CartDrawer and FitFinder. On open it:
 *
 *  - remembers the element that opened the dialog,
 *  - moves focus to the first meaningful control
 *    (or to `initialFocusRef` when provided),
 *  - keeps Tab / Shift+Tab cycling inside the dialog,
 *  - closes on Escape,
 *
 * and on close it restores focus to the opening element.
 *
 * It intentionally does NOT manage the body scroll lock —
 * that stays with the shared reference-counted
 * lockScroll()/unlockScroll() helpers in each component.
 */

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export default function useDialogA11y({
  isOpen,
  onClose,
  initialFocusRef,
}) {
  const dialogRef = useRef(null);
  const openerRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const dialog = dialogRef.current;

    openerRef.current = document.activeElement;

    const initialTarget =
      initialFocusRef?.current ||
      (dialog ? dialog.querySelector(FOCUSABLE_SELECTOR) : null);

    if (initialTarget && typeof initialTarget.focus === "function") {
      initialTarget.focus();
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onCloseRef.current?.();
        return;
      }

      if (event.key !== "Tab") return;

      const node = dialogRef.current;

      if (!node) return;

      /*
       * Elements hidden with display:none or visibility:hidden
       * produce no client rects, so they never receive focus
       * and are excluded from the cycle.
       */
      const focusable = Array.from(
        node.querySelectorAll(FOCUSABLE_SELECTOR)
      ).filter((element) => element.getClientRects().length > 0);

      if (focusable.length === 0) {
        event.preventDefault();

        node.focus();

        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey) {
        if (active === first || !node.contains(active)) {
          event.preventDefault();

          last.focus();
        }

        return;
      }

      if (active === last || !node.contains(active)) {
        event.preventDefault();

        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      const opener = openerRef.current;

      openerRef.current = null;

      if (opener && typeof opener.focus === "function") {
        opener.focus({ preventScroll: true });
      }
    };
  }, [isOpen, initialFocusRef]);

  return dialogRef;
}

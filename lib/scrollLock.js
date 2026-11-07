/**
 * SPIRIT, shared body scroll lock.
 *
 * Several surfaces can be open at the same time (mobile
 * navigation, search, bag, fit finder). The lock is reference
 * counted so the original inline value is only restored once the
 * last surface has closed. Without this, closing one surface
 * would restore scrolling behind another that is still open.
 *
 * Smooth scrolling (Lenis) is paused alongside the native lock so
 * wheel input cannot move the page behind an open dialog.
 */

let lockCount = 0;
let originalOverflow = "";

export function lockScroll() {
  if (typeof document === "undefined") return;

  lockCount += 1;

  if (lockCount > 1) return;

  originalOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  window.__lenis?.stop();
}

export function unlockScroll() {
  if (typeof document === "undefined") return;
  if (lockCount === 0) return;

  lockCount -= 1;

  if (lockCount > 0) return;

  document.body.style.overflow = originalOverflow;
  originalOverflow = "";
  window.__lenis?.start();
}

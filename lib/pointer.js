/**
 * SPIRIT, global pointer state.
 *
 * A single passive listener keeps the latest pointer position in a
 * mutable object. 3D scenes and the cursor read it every frame
 * without causing React renders.
 *
 *  x, y    viewport pixels
 *  nx, ny  normalised to -1..1 (ny is up-positive, like WebGL)
 */

export const pointer = {
  x: 0,
  y: 0,
  nx: 0,
  ny: 0,
  active: false,
};

let listening = false;

export function listenPointer() {
  if (listening || typeof window === "undefined") return;

  listening = true;

  pointer.x = window.innerWidth / 2;
  pointer.y = window.innerHeight / 2;

  window.addEventListener(
    "pointermove",
    (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.nx = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.ny = -((event.clientY / window.innerHeight) * 2 - 1);
      pointer.active = true;
    },
    { passive: true }
  );

  document.addEventListener("pointerleave", () => {
    pointer.active = false;
  });
}

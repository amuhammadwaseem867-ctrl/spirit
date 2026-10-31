/**
 * SPIRIT — shared animation ticker.
 *
 * One requestAnimationFrame loop drives smooth scrolling, the
 * WebGL renderer and the cursor. Running them from a single loop
 * keeps them in lockstep: Lenis updates the scroll position first,
 * then the 3D views read their DOM bounds and render, so the
 * canvas never lags a frame behind the page.
 *
 * Lower priority values run first.
 */

const subscribers = [];
let frameId = 0;

function loop(time) {
  for (let index = 0; index < subscribers.length; index += 1) {
    subscribers[index].callback(time);
  }

  frameId = window.requestAnimationFrame(loop);
}

export function addTick(callback, priority = 0) {
  const entry = { callback, priority };

  subscribers.push(entry);
  subscribers.sort((a, b) => a.priority - b.priority);

  if (subscribers.length === 1 && typeof window !== "undefined") {
    frameId = window.requestAnimationFrame(loop);
  }

  return () => {
    const index = subscribers.indexOf(entry);

    if (index !== -1) subscribers.splice(index, 1);

    if (subscribers.length === 0) {
      window.cancelAnimationFrame(frameId);
      frameId = 0;
    }
  };
}

export const TICK = {
  SCROLL: 0,
  SCENE: 10,
  CURSOR: 20,
};

/**
 * SPIRIT, intro signal.
 *
 * The preloader calls markIntroDone() when its curtain lifts.
 * Components that choreograph their entrance (the hero) subscribe
 * with onIntroDone(); if the intro has already finished, a client
 * navigation, or a repeat visit that skips the preloader, the
 * callback runs on the next tick.
 */

let done = false;
const listeners = new Set();

export function markIntroDone() {
  if (done) return;

  done = true;
  listeners.forEach((listener) => listener());
  listeners.clear();
}

export function isIntroDone() {
  return done;
}

export function onIntroDone(callback) {
  if (done) {
    const id = window.setTimeout(callback, 0);
    return () => window.clearTimeout(id);
  }

  listeners.add(callback);

  return () => listeners.delete(callback);
}

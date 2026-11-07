/**
 * SPIRIT, WebGL capability store.
 *
 * `glStatus` is "pending" during server render and hydration, then
 * resolves once to "on" (WebGL available) or "off". Components
 * subscribe with useGLStatus() so the DOM fallbacks are used when
 * the device cannot render the 3D layer.
 */

import { useSyncExternalStore } from "react";

let status = "pending";
const listeners = new Set();

function detect() {
  try {
    const canvas = document.createElement("canvas");
    const context =
      canvas.getContext("webgl2") || canvas.getContext("webgl");

    return context ? "on" : "off";
  } catch {
    return "off";
  }
}

export function resolveGLStatus() {
  if (status !== "pending" || typeof window === "undefined") return status;

  status = detect();
  listeners.forEach((listener) => listener());

  return status;
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useGLStatus() {
  return useSyncExternalStore(
    subscribe,
    () => status,
    () => "pending"
  );
}

/*
 * Shared, mutable scene state. DOM components write here and the
 * 3D scenes read it every frame, so neither side re-renders the
 * other.
 */
export const sceneState = {
  hero: {
    index: 0,
    scroll: 0,
    visible: true,
    intro: 0,
  },
  fabric: {
    mode: 0,
    stretch: 0,
    airflow: 0,
    visible: false,
  },
};

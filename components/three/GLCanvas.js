"use client";

import { useEffect, useState } from "react";
import { Canvas, advance, useFrame } from "@react-three/fiber";
import { View } from "@react-three/drei";

import { addTick, TICK } from "@/lib/ticker";
import { resolveGLStatus, useGLStatus } from "@/lib/gl";

import styles from "./GLCanvas.module.css";

/*
 * Views draw into scissored regions and never clear outside them,
 * so the whole canvas is cleared once per frame before any view
 * renders (views use priority 2 and above).
 */
function ClearPass() {
  useFrame(({ gl }) => {
    gl.setScissorTest(false);
    gl.clear(true, true, true);
  }, 1);

  return null;
}

/**
 * The single WebGL canvas for the whole site.
 *
 * It is fixed behind the page and renders every <GLView /> region
 * through drei's View.Port. Rendering is clocked by the shared
 * ticker (frameloop "never" + advance) so the 3D always matches the
 * scroll position of the frame being painted.
 */
export default function GLCanvas() {
  const status = useGLStatus();
  const [eventSource, setEventSource] = useState(null);

  useEffect(() => {
    resolveGLStatus();

    const id = window.setTimeout(() => {
      setEventSource(document.body);
    }, 0);

    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (status !== "on" || !eventSource) return undefined;

    return addTick((time) => advance(time / 1000), TICK.SCENE);
  }, [status, eventSource]);

  if (status !== "on" || !eventSource) return null;

  return (
    <div className={styles.layer} aria-hidden="true">
      <Canvas
        className={styles.canvas}
        frameloop="never"
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
        }}
        eventSource={eventSource}
        eventPrefix="client"
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.domElement.setAttribute("role", "presentation");
        }}
      >
        <ClearPass />
        <View.Port />
      </Canvas>
    </div>
  );
}

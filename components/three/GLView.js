"use client";

import { useCallback, useState } from "react";
import { View } from "@react-three/drei";

import { useGLStatus } from "@/lib/gl";

import styles from "./GLView.module.css";

/**
 * A region of the page rendered by the shared WebGL canvas.
 *
 * - `scene(onReady)` returns the R3F scene. The scene calls onReady
 *   once its assets are loaded, which fades out the fallback.
 * - `fallback` is plain DOM (an image or SVG). It is shown during
 *   loading and permanently when WebGL is unavailable.
 * - `label` describes the visual for assistive technology, since a
 *   canvas exposes nothing on its own.
 */
export default function GLView({
  scene,
  fallback = null,
  label,
  className = "",
  index = 2,
}) {
  const status = useGLStatus();
  const [ready, setReady] = useState(false);

  const handleReady = useCallback(() => {
    setReady(true);
  }, []);

  return (
    <div
      className={`${styles.root} ${className}`}
      role={label ? "img" : undefined}
      aria-label={label}
    >
      {fallback && (
        <div
          className={styles.fallback}
          data-gl-fallback
          data-ready={ready && status === "on" ? "true" : "false"}
          aria-hidden="true"
        >
          {fallback}
        </div>
      )}

      {status === "on" && (
        <View className={styles.track} index={index}>
          {scene(handleReady)}
        </View>
      )}
    </div>
  );
}

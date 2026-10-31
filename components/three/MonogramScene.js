"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, PerspectiveCamera } from "@react-three/drei";

import { pointer } from "@/lib/pointer";
import { getMonogramGeometry, STUDIO_LIGHTS, damp } from "./monogram";

const SHELL_COUNT = 900;

function Shell({ radius }) {
  const points = useRef(null);
  const { gl } = useThree();

  const geometry = useMemo(() => {
    const positions = new Float32Array(SHELL_COUNT * 3);

    for (let i = 0; i < SHELL_COUNT; i += 1) {
      /* even distribution on a sphere (golden spiral) */
      const y = 1 - (i / (SHELL_COUNT - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = Math.PI * (3 - Math.sqrt(5)) * i;

      positions[i * 3] = Math.cos(theta) * r * radius;
      positions[i * 3 + 1] = y * radius;
      positions[i * 3 + 2] = Math.sin(theta) * r * radius;
    }

    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    return buffer;
  }, [radius]);

  useFrame((state, delta) => {
    if (points.current) points.current.rotation.y += delta * 0.04;
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial
        size={0.018 * Math.min(gl.getPixelRatio(), 2)}
        color="#ecebe6"
        transparent
        opacity={0.32}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function Ring({ radius, tilt, speed, opacity }) {
  const ref = useRef(null);

  useFrame((state, delta) => {
    if (ref.current) ref.current.rotation.z += delta * speed;
  });

  return (
    <group rotation={tilt}>
      <mesh ref={ref}>
        <torusGeometry args={[radius, 0.004, 8, 180]} />
        <meshBasicMaterial color="#ecebe6" transparent opacity={opacity} depthWrite={false} />
      </mesh>
      <mesh rotation={[0, 0, 0]} position={[radius, 0, 0]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshBasicMaterial color="#ff5b2e" />
      </mesh>
    </group>
  );
}

/**
 * Chrome SPIRIT monogram inside a gyroscope of orbit rings.
 *
 * `progress` is a ref (0–1) owned by the DOM section, read per frame;
 * it adds a scroll-linked turn. `trackRef` is the section element,
 * used to aim the tilt at the pointer within the section.
 */
export default function MonogramScene({
  progress,
  trackRef,
  scale = 1,
  onReady,
}) {
  const group = useRef(null);
  const mark = useRef(null);
  const geometry = useMemo(() => getMonogramGeometry(), []);
  const reduce = useRef(false);

  useEffect(() => {
    reduce.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    onReady?.();
  }, [onReady]);

  useFrame((state, delta) => {
    const g = group.current;
    const m = mark.current;
    if (!g || !m) return;

    const dt = Math.min(delta, 1 / 20);
    const time = state.clock.elapsedTime;
    const rect = trackRef?.current?.getBoundingClientRect();

    let nx = 0;
    let ny = 0;

    if (rect && rect.width) {
      nx = THREE.MathUtils.clamp(((pointer.x - rect.left) / rect.width) * 2 - 1, -1, 1);
      ny = THREE.MathUtils.clamp(-(((pointer.y - rect.top) / rect.height) * 2 - 1), -1, 1);
    }

    const p = progress?.current ?? 0;
    const still = reduce.current;

    g.rotation.y = damp(g.rotation.y, still ? 0 : nx * 0.45, 2.6, dt);
    g.rotation.x = damp(g.rotation.x, still ? 0 : -ny * 0.3, 2.6, dt);

    m.rotation.y = still ? 0.35 : time * 0.35 + p * Math.PI * 1.5;
    m.position.y = still ? 0 : Math.sin(time * 0.8) * 0.07;
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={32} near={0.1} far={50} />

      <Environment resolution={256} frames={1}>
        {STUDIO_LIGHTS.map((light, i) => (
          <Lightformer key={i} {...light} />
        ))}
      </Environment>

      <group ref={group} scale={scale}>
        <group ref={mark}>
          <mesh geometry={geometry} scale={1.15}>
            <meshPhysicalMaterial
              color="#e6e3dc"
              metalness={1}
              roughness={0.18}
              clearcoat={1}
              clearcoatRoughness={0.06}
              envMapIntensity={1.6}
            />
          </mesh>
        </group>

        <Ring radius={1.75} tilt={[Math.PI / 2.2, 0, 0]} speed={0.25} opacity={0.32} />
        <Ring radius={2.05} tilt={[Math.PI / 3, Math.PI / 5, 0]} speed={-0.18} opacity={0.2} />
        <Ring radius={2.35} tilt={[Math.PI / 1.7, -Math.PI / 4, 0]} speed={0.12} opacity={0.14} />

        <Shell radius={2.9} />
      </group>
    </>
  );
}

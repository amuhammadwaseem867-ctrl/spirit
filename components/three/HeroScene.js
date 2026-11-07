"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  MeshTransmissionMaterial,
  PerspectiveCamera,
  useTexture,
} from "@react-three/drei";

import { sceneState } from "@/lib/gl";
import { pointer } from "@/lib/pointer";
import {
  getMonogramGeometry,
  createRandom,
  STUDIO_LIGHTS,
  easeInOutCubic,
  easeOutExpo,
  damp,
} from "./monogram";
import {
  panelVertex,
  panelFragment,
  dustVertex,
  dustFragment,
  beamVertex,
  beamFragment,
} from "./shaders";

const CAMERA_Z = 10;
const FOV = 30;
const TRANSITION = 1.7;
const DUST_COUNT = 380;

const clamp01 = (value) => Math.min(1, Math.max(0, value));

function visibleSize(distance, aspect) {
  const height = 2 * distance * Math.tan(THREE.MathUtils.degToRad(FOV / 2));
  return { width: height * aspect, height };
}

/*
 * Layout for the panel and the monogram, derived from the view's
 * aspect ratio. Desktop places the panel right of centre beside the
 * headline; portrait screens stack it above the copy.
 */
function getLayout(aspect) {
  const view = visibleSize(CAMERA_Z, aspect);

  if (aspect < 0.9) {
    const height = view.height * 0.6;
    return {
      panel: { x: 0, y: view.height * 0.11, width: height * 0.75, height },
      mark: { x: height * 0.75 * 0.38, y: -view.height * 0.12, scale: 0.62 },
      dim: 0.32,
    };
  }

  const height = view.height * 0.72;
  const width = height * 0.75;
  const x = view.width * 0.21;

  return {
    panel: { x, y: -view.height * 0.01, width, height },
    mark: {
      x: x - width * 0.56,
      y: view.height * 0.12,
      scale: Math.min(0.9, view.width * 0.08),
    },
    dim: 0.04,
  };
}

function Dust() {
  const material = useRef(null);
  const { gl } = useThree();

  const geometry = useMemo(() => {
    const random = createRandom(11);
    const positions = new Float32Array(DUST_COUNT * 3);
    const seeds = new Float32Array(DUST_COUNT);

    for (let i = 0; i < DUST_COUNT; i += 1) {
      positions[i * 3] = (random() - 0.5) * 16;
      positions[i * 3 + 1] = (random() - 0.5) * 8;
      positions[i * 3 + 2] = -5 + random() * 7;
      seeds[i] = random();
    }

    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    buffer.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

    return buffer;
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
    }),
    [gl]
  );

  useFrame((state) => {
    if (material.current) {
      material.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        vertexShader={dustVertex}
        fragmentShader={dustFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Beam() {
  const material = useRef(null);

  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uStrength: { value: 1 } }),
    []
  );

  useFrame((state) => {
    const m = material.current;
    if (!m) return;

    m.uniforms.uTime.value = state.clock.elapsedTime;
    m.uniforms.uStrength.value = 1 - sceneState.hero.scroll * 0.8;
  });

  return (
    <mesh position={[0, 0, -6]} renderOrder={-1}>
      <planeGeometry args={[40, 22]} />
      <shaderMaterial
        ref={material}
        vertexShader={beamVertex}
        fragmentShader={beamFragment}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function HeroScene({ frames, onReady }) {
  const textures = useTexture(frames.map((frame) => frame.media.gl));

  const panel = useRef(null);
  const panelMaterial = useRef(null);
  const frame = useRef(null);
  const mark = useRef(null);
  const markMaterial = useRef(null);

  const geometry = useMemo(() => getMonogramGeometry(), []);

  const motion = useRef({
    current: 0,
    target: 0,
    progress: 0,
    transitioning: false,
    spin: 0,
    spinFrom: 0,
    intro: 0,
    mouse: new THREE.Vector2(0.5, 0.5),
    lastMouse: new THREE.Vector2(0.5, 0.5),
    vel: new THREE.Vector2(),
    tiltX: 0,
    tiltY: 0,
    reduce: false,
  });

  const uniforms = useMemo(
    () => ({
      uTexA: { value: textures[0] },
      uTexB: { value: textures[0] },
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uVel: { value: new THREE.Vector2() },
      uVelocity: { value: 0 },
      uPlaneAspect: { value: 0.75 },
      uImageAspect: { value: 0.75 },
      uDim: { value: 0 },
      uIntro: { value: 0 },
      uFold: { value: 1 },
    }),
    [textures]
  );

  useEffect(() => {
    textures.forEach((texture) => {
      texture.anisotropy = 4;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.needsUpdate = true;
    });

    motion.current.reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    onReady?.();
  }, [textures, onReady]);

  const frameGeometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const w = 0.5;
    const h = 0.5;
    const tick = 0.06;

    /* corner crop marks around the panel */
    const v = [
      -w, h, 0, -w + tick, h, 0, -w, h, 0, -w, h - tick, 0,
      w, h, 0, w - tick, h, 0, w, h, 0, w, h - tick, 0,
      -w, -h, 0, -w + tick, -h, 0, -w, -h, 0, -w, -h + tick, 0,
      w, -h, 0, w - tick, -h, 0, w, -h, 0, w, -h + tick, 0,
    ];

    g.setAttribute("position", new THREE.Float32BufferAttribute(v, 3));

    return g;
  }, []);

  useFrame((state, delta) => {
    const m = motion.current;
    const hero = sceneState.hero;
    const dt = Math.min(delta, 1 / 20);
    const time = state.clock.elapsedTime;
    const aspect = state.camera.aspect || 1;
    const layout = getLayout(aspect);

    /* the transmission buffer is expensive: skip it offscreen */
    if (markMaterial.current) {
      markMaterial.current.visible = hero.visible;
    }

    /*
     * R3F copies the uniform objects into the material, so updates
     * must go through the material's own uniforms.
     */
    const u = panelMaterial.current?.uniforms;

    if (!hero.visible || !u) return;

    /* intro */
    m.intro = m.reduce ? 1 : damp(m.intro, hero.intro, 2.2, dt);
    const intro = easeOutExpo(clamp01(m.intro));

    /* slide transitions */
    if (!m.transitioning && hero.index !== m.current) {
      m.target = hero.index;
      u.uTexB.value = textures[m.target];
      m.transitioning = true;
      m.progress = 0;
      m.spinFrom = m.spin;
    }

    if (m.transitioning) {
      m.progress = m.reduce ? 1 : m.progress + dt / TRANSITION;

      if (m.progress >= 1) {
        m.progress = 0;
        m.transitioning = false;
        m.current = m.target;
        m.spin = m.spinFrom + Math.PI * 2;
        u.uTexA.value = textures[m.current];
      } else {
        m.spin = m.spinFrom + easeInOutCubic(m.progress) * Math.PI * 2;
      }
    }

    u.uProgress.value = m.transitioning ? easeInOutCubic(m.progress) : 0;

    /* scroll choreography */
    const scroll = m.reduce ? 0 : hero.scroll;
    const s = easeInOutCubic(clamp01(scroll / 0.72));
    const full = visibleSize(CAMERA_Z - 0.4, aspect);

    const width = THREE.MathUtils.lerp(layout.panel.width, full.width * 1.04, s);
    const height = THREE.MathUtils.lerp(layout.panel.height, full.height * 1.04, s);
    const px = THREE.MathUtils.lerp(layout.panel.x, 0, s);
    const py = THREE.MathUtils.lerp(layout.panel.y, 0, s);

    /* pointer → panel uv + velocity */
    const rect = hero.el?.getBoundingClientRect();
    let ndcX = 0;
    let ndcY = 0;

    if (rect && rect.width) {
      ndcX = ((pointer.x - rect.left) / rect.width) * 2 - 1;
      ndcY = -(((pointer.y - rect.top) / rect.height) * 2 - 1);
    }

    const view = visibleSize(CAMERA_Z, aspect);
    const worldX = (ndcX * view.width) / 2;
    const worldY = (ndcY * view.height) / 2;

    m.mouse.set(
      (worldX - px) / width + 0.5,
      (worldY - py) / height + 0.5
    );

    const vx = (m.mouse.x - m.lastMouse.x) / Math.max(dt, 1e-3);
    const vy = (m.mouse.y - m.lastMouse.y) / Math.max(dt, 1e-3);
    m.lastMouse.copy(m.mouse);

    const velLimit = 3;
    m.vel.x = damp(m.vel.x, THREE.MathUtils.clamp(vx, -velLimit, velLimit), 6, dt);
    m.vel.y = damp(m.vel.y, THREE.MathUtils.clamp(vy, -velLimit, velLimit), 6, dt);

    if (m.reduce) m.vel.set(0, 0);

    u.uMouse.value.copy(m.mouse);
    u.uVel.value.copy(m.vel);
    u.uVelocity.value = Math.min(m.vel.length(), 3);
    u.uTime.value = time;
    u.uPlaneAspect.value = width / height;
    u.uIntro.value = intro;
    u.uFold.value = 1 - s;
    u.uDim.value = THREE.MathUtils.lerp(layout.dim, 0.62, s) + clamp01((scroll - 0.72) / 0.28) * 0.3;

    /* panel transform */
    m.tiltY = damp(m.tiltY, m.reduce ? 0 : ndcX * 0.14 * (1 - s), 3, dt);
    m.tiltX = damp(m.tiltX, m.reduce ? 0 : -ndcY * 0.09 * (1 - s), 3, dt);

    if (panel.current) {
      panel.current.position.set(
        px,
        py + Math.sin(time * 0.6) * 0.04 * (1 - s) - (1 - intro) * 0.4,
        THREE.MathUtils.lerp(0, 0.4, s)
      );
      panel.current.scale.set(width, height, 1);
      panel.current.rotation.set(m.tiltX, m.tiltY, 0);
    }

    if (frame.current) {
      frame.current.position.set(px, py, -0.25);
      frame.current.scale.set(width * 1.08, height * 1.06, 1);
      frame.current.rotation.set(m.tiltX * 0.6, m.tiltY * 0.6, 0);
      frame.current.material.opacity = 0.35 * intro * (1 - s);
    }

    /* monogram */
    if (mark.current) {
      const g = mark.current;
      /* flies past the camera before the outro word appears */
      const fly = clamp01((scroll - 0.15) / 0.45);

      const baseScale = layout.mark.scale * (0.6 + intro * 0.4);
      const scale = THREE.MathUtils.lerp(baseScale, baseScale * 1.9, s);

      g.position.set(
        THREE.MathUtils.lerp(layout.mark.x, 0, s),
        THREE.MathUtils.lerp(layout.mark.y, 0, s) + Math.sin(time * 0.9) * 0.08 - (1 - intro) * 2.2,
        THREE.MathUtils.lerp(1.5, 4, s) + fly * fly * 6.8
      );
      g.scale.setScalar(scale);

      const idle = m.reduce ? 0 : Math.sin(time * 0.35) * 0.45;

      g.rotation.y = damp(
        g.rotation.y,
        idle + ndcX * 0.6 + m.spin + (1 - intro) * -Math.PI + s * Math.PI * 2,
        3.2,
        dt
      );
      g.rotation.x = damp(g.rotation.x, -ndcY * 0.3 + Math.sin(time * 0.5) * 0.06, 3, dt);
      g.rotation.z = damp(g.rotation.z, m.vel.x * -0.04, 4, dt);
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, CAMERA_Z]} fov={FOV} near={0.1} far={60} />

      <Environment resolution={256} frames={1}>
        {STUDIO_LIGHTS.map((light, i) => (
          <Lightformer key={i} {...light} />
        ))}
      </Environment>

      <Beam />
      <Dust />

      <lineSegments ref={frame} geometry={frameGeometry}>
        <lineBasicMaterial color="#ecebe6" transparent opacity={0} depthWrite={false} />
      </lineSegments>

      <mesh ref={panel}>
        <planeGeometry args={[1, 1, 64, 64]} />
        <shaderMaterial
          ref={panelMaterial}
          vertexShader={panelVertex}
          fragmentShader={panelFragment}
          uniforms={uniforms}
          transparent
        />
      </mesh>

      <group ref={mark}>
        <mesh geometry={geometry}>
          <MeshTransmissionMaterial
            ref={markMaterial}
            samples={6}
            resolution={512}
            thickness={0.55}
            roughness={0.04}
            transmission={1}
            ior={1.45}
            chromaticAberration={0.09}
            anisotropicBlur={0.12}
            distortion={0.22}
            distortionScale={0.4}
            temporalDistortion={0.08}
            clearcoat={1}
            clearcoatRoughness={0.05}
            attenuationDistance={2.4}
            attenuationColor="#dcd8ce"
            color="#ffffff"
            envMapIntensity={1.4}
          />
        </mesh>
      </group>
    </>
  );
}

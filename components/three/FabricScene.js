"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";

import { sceneState } from "@/lib/gl";
import { pointer } from "@/lib/pointer";
import { NOISE } from "./shaders";
import { createRandom, damp } from "./monogram";

/*
 * PERFORMANCE LAB — an interactive swatch of SPIRIT fabric.
 *
 * Three modes, blended continuously:
 *   0 LIGHTNESS      the swatch floats and drapes on slow air
 *   1 FLEX           the pointer presses in and pulls the knit
 *                    outward in four directions
 *   2 BREATHABILITY  perforations open and backlight streams through
 */

const W = 3.2;
const H = 4.1;

const fabricVertex = /* glsl */ `
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uPress;
  uniform float uLight;
  uniform float uFlex;

  varying vec2 vUv;
  varying vec3 vPos;
  varying float vStretch;

  ${NOISE}

  void main() {
    vUv = uv;
    vec3 p = position;

    /* drape: slow folds, stronger in LIGHTNESS */
    float t = uTime * (0.35 + uLight * 0.25);
    /* broad, smooth folds — low-frequency waves plus one soft noise octave */
    float folds =
      sin(p.x * 1.3 + t * 1.2) * 0.1 +
      sin(p.y * 1.7 - t * 0.8 + p.x * 0.6) * 0.08 +
      sin((p.x + p.y) * 0.9 + t * 0.6) * 0.06 +
      (noise(p.xy * 0.42 + vec2(t * 0.12, -t * 0.09)) - 0.5) * 0.38;

    p.z += folds * (0.55 + uLight * 0.9);
    p.z += sin(uv.y * 3.14159) * uLight * 0.18;

    /* pointer: press in and stretch outward */
    vec2 d = p.xy - uPointer;
    float r = length(d);
    float g = exp(-r * r * 2.6);

    p.z -= g * uPress * (0.35 + uFlex * 0.45);
    p.xy += normalize(d + 1e-4) * g * uPress * uFlex * 0.22;

    vStretch = g * uPress * (0.4 + uFlex);
    vPos = (modelMatrix * vec4(p, 1.0)).xyz;

    gl_Position = projectionMatrix * viewMatrix * vec4(vPos, 1.0);
  }
`;

const fabricFragment = /* glsl */ `
  uniform float uTime;
  uniform float uBreath;
  uniform float uFlex;

  varying vec2 vUv;
  varying vec3 vPos;
  varying float vStretch;

  void main() {
    /* knit ribs, faded out where they would alias on screen */
    float ribCount = 120.0;
    float ribWidth = fwidth(vUv.x * ribCount);
    float ribs = 0.5 + 0.5 * sin(vUv.x * ribCount * 6.2831853)
      * (1.0 - smoothstep(0.2, 0.7, ribWidth));

    /* perforation grid, opening with BREATHABILITY and stretch */
    vec2 cell = vec2(34.0, 44.0);
    vec2 gp = vUv * cell;
    gp.x += mod(floor(gp.y), 2.0) * 0.5;
    vec2 f = fract(gp) - 0.5;
    float holeRadius = uBreath * 0.3 + vStretch * 0.06 * uBreath;
    float hole = length(f * vec2(1.0, 1.15));

    if (hole < holeRadius) discard;

    vec3 n = normalize(cross(dFdx(vPos), dFdy(vPos)));
    vec3 view = normalize(cameraPosition - vPos);

    if (dot(n, view) < 0.0) n = -n;

    /* perturb with the knit ribs */
    n = normalize(n + vec3(ribs - 0.5, 0.0, 0.0) * 0.16);

    vec3 keyDir = normalize(vec3(-0.45, 0.65, 0.7));
    vec3 fillDir = normalize(vec3(0.7, -0.2, 0.4));

    float key = max(dot(n, keyDir), 0.0);
    float fill = max(dot(n, fillDir), 0.0);
    float fres = pow(1.0 - max(dot(n, view), 0.0), 2.4);
    float spec = pow(max(dot(reflect(-keyDir, n), view), 0.0), 28.0);

    vec3 base = vec3(0.13, 0.135, 0.145);
    vec3 colour = base * (0.25 + key * 1.7 + fill * 0.4);
    colour += vec3(0.92, 0.9, 0.86) * (fres * 0.5 + spec * 0.45);
    colour += vec3(0.9, 0.88, 0.84) * (ribs - 0.5) * 0.05;

    /* stretched knit catches light: a warm signal tint under tension */
    colour = mix(colour, vec3(1.0, 0.36, 0.18), clamp(vStretch * uFlex * 0.55, 0.0, 0.5));

    /* rim of each perforation glows with the backlight */
    float rim = smoothstep(holeRadius + 0.08, holeRadius, hole) * step(0.01, uBreath);
    colour += vec3(1.0, 0.55, 0.35) * rim * 0.35;

    gl_FragColor = vec4(colour, 1.0);
  }
`;

const glowVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const glowFragment = /* glsl */ `
  uniform float uBreath;
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    float d = distance(vUv, vec2(0.5, 0.52));
    float core = smoothstep(0.5, 0.0, d);
    float pulse = 0.85 + sin(uTime * 1.4) * 0.15;

    vec3 warm = vec3(1.0, 0.42, 0.2);
    vec3 cool = vec3(0.92, 0.9, 0.86);
    vec3 colour = mix(cool * 0.05, warm * 0.55, uBreath) * core * pulse;

    gl_FragColor = vec4(vec3(0.039, 0.039, 0.043) + colour, 1.0);
  }
`;

const airVertex = /* glsl */ `
  uniform float uTime;
  uniform float uBreath;
  uniform float uPixelRatio;
  attribute float aSeed;
  varying float vAlpha;

  void main() {
    vec3 p = position;
    float speed = 0.6 + aSeed * 1.4;

    p.z = mod(p.z + uTime * speed * (0.25 + uBreath * 1.6), 6.0) - 3.5;
    p.x += sin(uTime * 0.8 + aSeed * 30.0) * 0.08;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (1.0 + aSeed * 2.2) * uPixelRatio * (7.0 / -mv.z);

    float fade = smoothstep(-3.5, -2.0, p.z) * smoothstep(2.5, 0.8, p.z);
    vAlpha = fade * (0.12 + uBreath * 0.55);
  }
`;

const airFragment = /* glsl */ `
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    gl_FragColor = vec4(vec3(1.0, 0.8, 0.7), smoothstep(0.5, 0.0, d) * vAlpha);
  }
`;

const AIR_COUNT = 520;

export default function FabricScene({ trackRef, onReady }) {
  const fabric = useRef(null);
  const glow = useRef(null);
  const air = useRef(null);
  const { gl } = useThree();

  const state = useRef({
    light: 1,
    flex: 0,
    breath: 0,
    press: 0,
    pointer: new THREE.Vector2(0, 0),
    reduce: false,
  });

  const uniforms = useMemo(
    () => ({
      fabric: {
        uTime: { value: 0 },
        uPointer: { value: new THREE.Vector2() },
        uPress: { value: 0 },
        uLight: { value: 1 },
        uFlex: { value: 0 },
        uBreath: { value: 0 },
      },
      glow: { uBreath: { value: 0 }, uTime: { value: 0 } },
      air: {
        uTime: { value: 0 },
        uBreath: { value: 0 },
        uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
      },
    }),
    [gl]
  );

  const airGeometry = useMemo(() => {
    const random = createRandom(29);
    const positions = new Float32Array(AIR_COUNT * 3);
    const seeds = new Float32Array(AIR_COUNT);

    for (let i = 0; i < AIR_COUNT; i += 1) {
      positions[i * 3] = (random() - 0.5) * W * 0.95;
      positions[i * 3 + 1] = (random() - 0.5) * H * 0.95;
      positions[i * 3 + 2] = random() * 6 - 3.5;
      seeds[i] = random();
    }

    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    buffer.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

    return buffer;
  }, []);

  useEffect(() => {
    state.current.reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    onReady?.();
  }, [onReady]);

  useFrame((frame, delta) => {
    const s = state.current;
    const lab = sceneState.fabric;
    const dt = Math.min(delta, 1 / 20);
    const time = s.reduce ? 0 : frame.clock.elapsedTime;

    if (!lab.visible) return;

    const fu = fabric.current?.material.uniforms;
    const gu = glow.current?.material.uniforms;
    const au = air.current?.material.uniforms;

    if (!fu || !gu || !au) return;

    /* blend toward the selected mode */
    s.light = damp(s.light, lab.mode === 0 ? 1 : 0.25, 3, dt);
    s.flex = damp(s.flex, lab.mode === 1 ? 1 : 0.15, 3, dt);
    s.breath = damp(s.breath, lab.mode === 2 ? 1 : 0, 3, dt);

    /* pointer in fabric space */
    const rect = trackRef?.current?.getBoundingClientRect();
    let inside = false;

    if (rect && rect.width) {
      const nx = ((pointer.x - rect.left) / rect.width) * 2 - 1;
      const ny = -(((pointer.y - rect.top) / rect.height) * 2 - 1);
      const vh = 2 * 7 * Math.tan(THREE.MathUtils.degToRad(17));
      const vw = vh * (rect.width / rect.height);

      s.pointer.x = damp(s.pointer.x, (nx * vw) / 2, 8, dt);
      s.pointer.y = damp(s.pointer.y, (ny * vh) / 2, 8, dt);

      inside =
        pointer.active &&
        Math.abs(s.pointer.x) < W * 0.62 &&
        Math.abs(s.pointer.y) < H * 0.6;
    }

    /* idle demo: when nobody touches it, a ghost pointer orbits */
    if (!inside && !s.reduce) {
      s.pointer.x = damp(s.pointer.x, Math.sin(time * 0.6) * 0.9, 1.5, dt);
      s.pointer.y = damp(s.pointer.y, Math.cos(time * 0.45) * 1.1, 1.5, dt);
    }

    s.press = damp(s.press, inside ? 1 : s.reduce ? 0 : 0.55, 4, dt);

    fu.uTime.value = time;
    fu.uPointer.value.copy(s.pointer);
    fu.uPress.value = s.press;
    fu.uLight.value = s.light;
    fu.uFlex.value = s.flex;
    fu.uBreath.value = s.breath;

    gu.uBreath.value = s.breath;
    gu.uTime.value = time;

    au.uTime.value = time;
    au.uBreath.value = s.breath;

    /* live readouts for the DOM */
    lab.stretch = Math.round(s.press * s.flex * 100);
    lab.airflow = Math.round(s.breath * 100);

    if (fabric.current) {
      fabric.current.rotation.y = damp(
        fabric.current.rotation.y,
        s.reduce ? -0.18 : -0.18 + s.pointer.x * 0.05,
        2,
        dt
      );
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={34} near={0.1} far={40} />

      <mesh ref={glow} position={[0, 0, -3.2]}>
        <planeGeometry args={[14, 10]} />
        <shaderMaterial
          vertexShader={glowVertex}
          fragmentShader={glowFragment}
          uniforms={uniforms.glow}
          depthWrite={false}
        />
      </mesh>

      <points ref={air} geometry={airGeometry} frustumCulled={false}>
        <shaderMaterial
          vertexShader={airVertex}
          fragmentShader={airFragment}
          uniforms={uniforms.air}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <mesh ref={fabric} rotation={[0.08, -0.18, 0.04]}>
        <planeGeometry args={[W, H, 180, 230]} />
        <shaderMaterial
          vertexShader={fabricVertex}
          fragmentShader={fabricFragment}
          uniforms={uniforms.fabric}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
}

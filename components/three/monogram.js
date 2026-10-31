import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

import { MARK_PATHS } from "@/lib/logo";

/*
 * The SPIRIT monogram, extruded from the brand SVG paths.
 *
 * Geometry is built once and shared by every scene. It is centred
 * on the origin and scaled so the mark is `HEIGHT` world units tall.
 * The SVG y axis points down, so the mesh is rotated 180° around X
 * (rather than mirrored) to keep face winding and normals intact.
 */

const HEIGHT = 2;
const SOURCE_HEIGHT = 85.77;

let cached = null;

export function getMonogramGeometry() {
  if (cached) return cached;

  const loader = new SVGLoader();
  const markup = `<svg xmlns="http://www.w3.org/2000/svg">${MARK_PATHS.map(
    (d) => `<path d="${d}"/>`
  ).join("")}</svg>`;

  const shapes = loader
    .parse(markup)
    .paths.flatMap((path) => path.toShapes());

  const geometry = new THREE.ExtrudeGeometry(shapes, {
    depth: 12,
    bevelEnabled: true,
    bevelThickness: 2.6,
    bevelSize: 1.25,
    bevelOffset: 0,
    bevelSegments: 10,
    curveSegments: 36,
  });

  geometry.center();
  geometry.rotateX(Math.PI);

  const scale = HEIGHT / SOURCE_HEIGHT;
  geometry.scale(scale, scale, scale);
  geometry.computeBoundingBox();

  cached = geometry;

  return geometry;
}

/*
 * Studio lighting for chrome and glass: long soft strips and a ring,
 * rendered once into an environment map. No HDR file is fetched.
 */
export const STUDIO_LIGHTS = [
  { form: "rect", intensity: 4, position: [0, 4, -6], scale: [12, 1.2, 1], rotation: [Math.PI / 2.4, 0, 0] },
  { form: "rect", intensity: 2.6, position: [-6, 1, 1], scale: [1, 8, 1], rotation: [0, Math.PI / 2, 0] },
  { form: "rect", intensity: 2.2, position: [6, -1, 1], scale: [1, 8, 1], rotation: [0, -Math.PI / 2, 0] },
  { form: "ring", intensity: 1.6, position: [0, 0, 7], scale: 3, rotation: [0, 0, 0] },
  { form: "rect", intensity: 1.2, position: [0, -5, 0], scale: [10, 2, 1], rotation: [-Math.PI / 2, 0, 0] },
  { form: "rect", intensity: 0.9, position: [0, 1, 9], scale: [16, 7, 1], rotation: [0, Math.PI, 0] },
  { form: "rect", intensity: 3, position: [-4, 5, 4], scale: [6, 0.6, 1], rotation: [Math.PI / 3, -Math.PI / 6, 0] },
];

/*
 * Seeded PRNG (mulberry32). Particle layouts are generated during
 * render, so they must be deterministic rather than Math.random().
 */
export function createRandom(seed = 1) {
  let a = seed >>> 0;

  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeOutExpo(t) {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export function damp(current, target, lambda, delta) {
  return THREE.MathUtils.damp(current, target, lambda, delta);
}

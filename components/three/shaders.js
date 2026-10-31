/*
 * SPIRIT — GLSL shared by the 3D scenes.
 *
 * Textures are sampled as raw sRGB and written straight out (no
 * colour-space include), so photographs keep their exact grade.
 */

export const NOISE = /* glsl */ `
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;

    for (int i = 0; i < 4; i++) {
      value += amplitude * noise(p);
      p *= 2.03;
      amplitude *= 0.5;
    }

    return value;
  }
`;

/* -------------------------------------------------------------
   HERO PANEL
   - liquid diagonal wipe between two frames
   - directional motion blur + chromatic fringe that follows the
     pointer's velocity ("active motion")
   - a travelling fold in the geometry during each transition
------------------------------------------------------------- */

export const panelVertex = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  uniform float uVelocity;
  uniform float uFold;

  varying vec2 vUv;
  varying float vFold;

  void main() {
    vUv = uv;

    vec3 p = position;

    float travel = sin(uProgress * 3.14159265);
    float fold = sin((uv.x - uProgress * 1.4 + 0.2) * 3.14159265);

    /* the fold flattens as the panel grows to fill the screen */
    p.z += fold * travel * 0.32 * uFold;
    p.z += sin(uv.y * 3.14159265) * 0.05;
    p.z += sin(uv.y * 7.0 + uTime * 2.6) * uVelocity * 0.05;

    vFold = fold * travel * uFold;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

export const panelFragment = /* glsl */ `
  uniform sampler2D uTexA;
  uniform sampler2D uTexB;
  uniform float uProgress;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uVel;
  uniform float uPlaneAspect;
  uniform float uImageAspect;
  uniform float uDim;
  uniform float uIntro;

  varying vec2 vUv;
  varying float vFold;

  ${NOISE}

  vec2 cover(vec2 uv, float planeAspect, float imageAspect) {
    vec2 s = vec2(1.0);

    if (planeAspect > imageAspect) {
      s.y = imageAspect / planeAspect;
    } else {
      s.x = planeAspect / imageAspect;
    }

    return (uv - 0.5) * s + 0.5;
  }

  vec3 motionSample(sampler2D tex, vec2 uv, vec2 dir, float fringe) {
    vec3 colour = vec3(0.0);

    for (int i = 0; i < 6; i++) {
      float k = float(i) / 5.0 - 0.5;
      colour += texture2D(tex, uv + dir * k).rgb;
    }

    colour /= 6.0;
    colour.r = mix(colour.r, texture2D(tex, uv + vec2(fringe, 0.0)).r, 0.8);
    colour.b = mix(colour.b, texture2D(tex, uv - vec2(fringe, 0.0)).b, 0.8);

    return colour;
  }

  void main() {
    vec2 uv = cover(vUv, uPlaneAspect, uImageAspect);
    uv = (uv - 0.5) * 0.95 + 0.5;

    /* pointer influence: strongest near the cursor */
    vec2 aspect = vec2(uPlaneAspect, 1.0);
    float dist = distance(vUv * aspect, uMouse * aspect);
    float influence = smoothstep(0.55, 0.0, dist);
    vec2 vel = uVel * influence;

    uv -= vel * 0.035;

    /* transition mask: 0 shows A, 1 shows B */
    float n = fbm(vUv * 3.2 + vec2(uTime * 0.04, 0.0));
    float edge = vUv.x * 0.72 + (1.0 - vUv.y) * 0.28 + (n - 0.5) * 0.55;
    float p = uProgress * 1.9 - 0.45;
    float t = 1.0 - smoothstep(p - 0.13, p + 0.13, edge);
    float band = 1.0 - abs(t * 2.0 - 1.0);

    vec2 uvA = (uv - 0.5) * (1.0 - uProgress * 0.07) + 0.5 + vec2(band * 0.07, 0.0);
    vec2 uvB = (uv - 0.5) * (1.07 - uProgress * 0.07) + 0.5 - vec2((1.0 - t) * band * 0.07, 0.0);

    vec2 blurDir = vel * 0.06 + vec2(band * 0.05, 0.0);
    float fringe = length(vel) * 0.012 + band * 0.008;

    vec3 colourA = motionSample(uTexA, uvA, blurDir, fringe);
    vec3 colourB = motionSample(uTexB, uvB, blurDir, fringe);
    vec3 colour = mix(colourA, colourB, t);

    /* grade: slight desaturation and contrast, cool shadows */
    float luma = dot(colour, vec3(0.299, 0.587, 0.114));
    colour = mix(vec3(luma), colour, 0.84);
    colour = (colour - 0.5) * 1.07 + 0.5;
    colour *= vec3(0.97, 0.98, 1.0);

    /* light sweep along the transition edge and the fold */
    colour += band * 0.07 + max(vFold, 0.0) * 0.05;

    /* vignette */
    vec2 q = vUv - 0.5;
    colour *= 1.0 - dot(q, q) * 0.85;

    colour *= mix(1.0, 0.16, uDim);

    /* film grain */
    colour += (hash(vUv * 900.0 + fract(uTime) * 61.0) - 0.5) * 0.035;

    /* intro: rises from the bottom edge with a ragged front */
    float front = uIntro * 1.08 - (noise(vec2(vUv.x * 9.0, uTime * 0.3)) * 0.04);
    float alpha = smoothstep(vUv.y - 0.015, vUv.y, front);

    gl_FragColor = vec4(colour, alpha);
  }
`;

/* -------------------------------------------------------------
   DUST — drifting particles caught in the light shaft
------------------------------------------------------------- */

export const dustVertex = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;

  attribute float aSeed;

  varying float vAlpha;

  void main() {
    vec3 p = position;

    p.y = mod(p.y + uTime * (0.05 + aSeed * 0.12) + 4.0, 8.0) - 4.0;
    p.x += sin(uTime * 0.3 + aSeed * 40.0) * 0.12;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);

    gl_Position = projectionMatrix * mv;
    gl_PointSize = (1.2 + aSeed * 2.6) * uPixelRatio * (8.0 / -mv.z);

    vAlpha = 0.25 + aSeed * 0.55;
  }
`;

export const dustFragment = /* glsl */ `
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d) * vAlpha;

    gl_FragColor = vec4(vec3(0.93, 0.92, 0.89), a * 0.55);
  }
`;

/* -------------------------------------------------------------
   LIGHT SHAFT — a soft diagonal beam behind everything
------------------------------------------------------------- */

export const beamVertex = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const beamFragment = /* glsl */ `
  uniform float uTime;
  uniform float uStrength;

  varying vec2 vUv;

  ${NOISE}

  void main() {
    vec2 uv = vUv;

    float beam = smoothstep(0.32, 0.0, abs((uv.x - 0.62) + (uv.y - 0.5) * 0.55));
    beam *= smoothstep(0.0, 0.9, uv.y);
    beam *= 0.55 + fbm(vec2(uv.x * 4.0 - uTime * 0.05, uv.y * 2.0)) * 0.6;

    float floorGlow = smoothstep(0.35, 0.0, uv.y) * 0.25;

    /* opaque ink base, so the beam reads as light in a dark room */
    vec3 colour = vec3(0.039, 0.039, 0.043)
      + vec3(0.92, 0.9, 0.86) * (beam * 0.11 + floorGlow * 0.05) * uStrength;

    gl_FragColor = vec4(colour, 1.0);
  }
`;

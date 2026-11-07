/**
 * SPIRIT, media manifest.
 *
 * Every image the redesign uses is listed here, so the art
 * direction can be changed in one place. All frames come from the
 * SPIRIT campaign shoot: brutalist concrete, monochrome product,
 * no third-party branding.
 *
 * `gl` entries are the 3:4 crops produced by
 * scripts/build-gl-textures.js for the WebGL hero.
 */

export const campaign = {
  sprint: {
    src: "/images/campaigns/coreperformance.jpeg",
    gl: "/images/gl/sprint.jpg",
    alt: "Athlete sprinting through a concrete stairwell in the SPIRIT Core Performance set",
  },
  lunge: {
    src: "/images/collections/training.jpeg",
    gl: "/images/gl/lunge.jpg",
    alt: "Athlete in a lateral lunge on a sunlit concrete floor",
  },
  stride: {
    src: "/images/campaigns/form corp.jpeg",
    gl: "/images/gl/stride.jpg",
    alt: "Athlete striding barefoot past concrete and glass in the Form Corp set",
  },
  walk: {
    src: "/images/collections/men.jpeg",
    gl: "/images/gl/walk.jpg",
    alt: "Athlete walking through a column of light in a concrete hall",
  },
  tee: {
    src: "/images/campaigns/aeroflextee.jpeg",
    alt: "Athlete standing in a brutalist courtyard wearing the Aeroflex Tee",
  },
  corridor: {
    src: "/images/campaigns/legging.jpeg",
    alt: "Athlete walking along a concrete corridor in the Form Legging",
  },
  jacket: {
    src: "/images/collections/performance.jpeg",
    alt: "Athlete in a technical jacket walking through a concrete atrium",
  },
  hall: {
    src: "/images/collections/women.jpeg",
    alt: "Athlete walking across a wide concrete hall",
  },
};

export const heroFrames = [
  {
    id: "01",
    media: campaign.sprint,
    eyebrow: "PERFORMANCE",
    lines: ["MOVE", "DIFFERENT."],
    caption: "Core Performance — engineered for the first step and every one after it.",
  },
  {
    id: "02",
    media: campaign.lunge,
    eyebrow: "TRAINING",
    lines: ["BUILT", "TO MOVE."],
    caption: "Training essentials cut to follow every angle of the body.",
  },
  {
    id: "03",
    media: campaign.stride,
    eyebrow: "FORM",
    lines: ["FORM IN", "MOTION."],
    caption: "Second-skin silhouettes that disappear the moment you move.",
  },
  {
    id: "04",
    media: campaign.walk,
    eyebrow: "EVERYDAY",
    lines: ["KEEP", "MOVING."],
    caption: "From the session to the street — one continuous wardrobe.",
  },
];

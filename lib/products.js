/**
 * SPIRIT, canonical product data.
 *
 * Product information here is intentionally descriptive only.
 * No prices, technical specifications or performance claims are
 * invented. A price is simply omitted until real data exists —
 * ProductInfo hides the price block when it is absent.
 */

export const products = [
  {
    slug: "core-performance",
    name: "CORE PERFORMANCE",
    category: "PERFORMANCE",
    gender: "MEN",
    description:
      "A performance essential designed to follow the body through focused training and the movement beyond it.",
    sizes: ["S", "M", "L", "XL"],
    images: [
      "/images/campaigns/coreperformance.jpeg",
      "/images/collections/performance.jpeg",
    ],
    fit: "Close to the body with room to move. True to size.",
    material:
      "Performance construction selected for structure, stretch and comfort.",
    details: [],
  },
  {
    slug: "aeroflex-tee",
    name: "AEROFLEX TEE",
    category: "ESSENTIALS",
    gender: "MEN",
    description:
      "A refined everyday layer designed to move naturally between training and the rest of the day.",
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [
      "/images/campaigns/aeroflextee.jpeg",
      "/images/collections/men.jpeg",
    ],
    fit: "Relaxed through the body. True to size.",
    material:
      "Lightweight construction chosen for breathability and ease of movement.",
    details: [],
  },
  {
    slug: "form-legging",
    name: "FORM LEGGING",
    category: "TRAINING",
    gender: "WOMEN",
    description:
      "A training essential built to follow the body's movement with a close, considered feel.",
    sizes: ["XS", "S", "M", "L"],
    images: [
      "/images/campaigns/legging.jpeg",
      "/images/collections/training.jpeg",
    ],
    fit: "Close and precise. True to size.",
    material:
      "Supportive construction with natural flexibility through movement.",
    details: [],
  },
  {
    slug: "form-corp",
    name: "FORM CORP",
    category: "TRAINING",
    gender: "WOMEN",
    description:
      "A considered training piece designed around proportion, comfort and unrestricted movement.",
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [
      "/images/campaigns/form corp.jpeg",
      "/images/collections/women.jpeg",
    ],
    fit: "Balanced through the body. True to size.",
    material:
      "Considered construction balancing structure and softness.",
    details: [],
  },
];

export function getProductBySlug(slug) {
  if (!slug) return undefined;

  return products.find((product) => product.slug === slug);
}

export function getRelatedProducts(slug, count = 3) {
  return products
    .filter((product) => product.slug !== slug)
    .slice(0, count);
}
/**
 * SPIRIT, WebGL texture builder.
 *
 * The campaign originals are 2–8 MB each, far too heavy to upload
 * to the GPU. This script crops the hero frames to the 3:4 panel
 * ratio used by the 3D hero and writes compressed copies to
 * public/images/gl/.
 *
 * Run with: node scripts/build-gl-textures.js
 */

const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const root = process.cwd();
const outDir = path.join(root, "public", "images", "gl");

/*
 * focusX is the horizontal centre of the subject (0–1) used when a
 * landscape original has to be cropped to portrait.
 */
const frames = [
  { name: "sprint", src: "public/images/campaigns/coreperformance.jpeg", focusX: 0.5 },
  { name: "lunge", src: "public/images/collections/training.jpeg", focusX: 0.635 },
  { name: "stride", src: "public/images/campaigns/form corp.jpeg", focusX: 0.5 },
  { name: "walk", src: "public/images/collections/men.jpeg", focusX: 0.5 },
];

const WIDTH = 1500;
const HEIGHT = 2000;

async function build() {
  fs.mkdirSync(outDir, { recursive: true });

  for (const frame of frames) {
    const input = path.join(root, frame.src);
    const { width, height } = await sharp(input).metadata();

    const cropHeight = height;
    const cropWidth = Math.min(width, Math.round((height * 3) / 4));
    const centre = Math.round(width * frame.focusX);
    const left = Math.max(0, Math.min(width - cropWidth, centre - Math.round(cropWidth / 2)));

    const output = path.join(outDir, `${frame.name}.jpg`);

    await sharp(input)
      .extract({ left, top: 0, width: cropWidth, height: cropHeight })
      .resize(WIDTH, HEIGHT, { fit: "cover" })
      .jpeg({ quality: 80, mozjpeg: true, progressive: true })
      .toFile(output);

    const { size } = fs.statSync(output);
    console.log(`${frame.name}.jpg  ${(size / 1024).toFixed(0)} KB`);
  }
}

build().catch((error) => {
  console.error(error);
  process.exit(1);
});

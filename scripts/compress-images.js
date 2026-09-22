const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const inputDir = path.join(
  process.cwd(),
  "public",
  "images",
  "collections"
);

const images = [
  "women.jpeg",
  "men.jpeg",
  "training.jpeg",
  "performance.jpeg",
];

async function compressImages() {
  for (const file of images) {
    const input = path.join(inputDir, file);
    const output = path.join(
      inputDir,
      `optimized-${file}`
    );

    if (!fs.existsSync(input)) {
      console.log(`Missing: ${file}`);
      continue;
    }

    await sharp(input)
      .resize({
        width: 1800,
        withoutEnlargement: true,
      })
      .jpeg({
        quality: 78,
        progressive: true,
        mozjpeg: true,
      })
      .toFile(output);

    const originalSize =
      fs.statSync(input).size / 1024;

    const optimizedSize =
      fs.statSync(output).size / 1024;

    console.log(
      `${file}: ${originalSize.toFixed(0)} KB → ${optimizedSize.toFixed(0)} KB`
    );
  }
}

compressImages().catch(console.error);
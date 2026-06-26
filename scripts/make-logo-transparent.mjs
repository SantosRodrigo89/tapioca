import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

// TODO: reativar quando o logo Mesio final existir em src/assets/brand/logo.png

const require = createRequire(import.meta.url);
const sharp = require(
  require.resolve("sharp", { paths: [require.resolve("next")] }),
);

const source = path.join(process.cwd(), "src/assets/brand/logo.png");

function isBackgroundPixel(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const spread = max - min;
  const avg = (r + g + b) / 3;

  // Checkerboard / white / neutral light gray
  if (spread <= 10 && avg >= 175) return true;
  if (r >= 248 && g >= 248 && b >= 248) return true;

  return false;
}

const input = await sharp(source).ensureAlpha().raw().toBuffer({
  resolveWithObject: true,
});

const { data, info } = input;
const { width, height, channels } = info;

for (let i = 0; i < data.length; i += channels) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];

  if (isBackgroundPixel(r, g, b)) {
    data[i + 3] = 0;
  }
}

const output = await sharp(data, { raw: { width, height, channels } })
  .png()
  .toBuffer();

fs.writeFileSync(source, output);
console.log("transparent →", path.relative(process.cwd(), source));

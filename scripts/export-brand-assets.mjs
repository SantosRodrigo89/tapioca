import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require(
  require.resolve("sharp", { paths: [require.resolve("next")] }),
);

const root = process.cwd();
const svgDir = path.join(root, "src/assets/brand/svg");
const pngDir = path.join(root, "src/assets/brand/png");

const exports = [
  { svg: "icon-default.svg", out: "icon-default.png", sizes: [16, 32, 64, 128, 180, 512] },
  { svg: "icon-light.svg", out: "icon-light.png", sizes: [32, 128, 512] },
  { svg: "icon-monochrome-dark.svg", out: "icon-monochrome-dark.png", sizes: [32, 512] },
  { svg: "icon-monochrome-white.svg", out: "icon-monochrome-white.png", sizes: [32, 512] },
  { svg: "logo-horizontal-default.svg", out: "logo-horizontal-default.png", sizes: [320, 640, 1280] },
  { svg: "logo-horizontal-light.svg", out: "logo-horizontal-light.png", sizes: [320, 640] },
  { svg: "logo-vertical-default.svg", out: "logo-vertical-default.png", sizes: [160, 320] },
  { svg: "logo-vertical-light.svg", out: "logo-vertical-light.png", sizes: [160, 320] },
];

fs.mkdirSync(pngDir, { recursive: true });

for (const item of exports) {
  const svgPath = path.join(svgDir, item.svg);
  const svgBuffer = fs.readFileSync(svgPath);

  for (const size of item.sizes) {
    const base = item.out.replace(".png", "");
    const outPath = path.join(pngDir, `${base}-${size}.png`);

    const isLogo = item.svg.includes("logo-");
    const width = isLogo ? Math.round(size * (item.svg.includes("vertical") ? 0.56 : 4)) : size;
    const height = size;

    await sharp(svgBuffer)
      .resize(width, height, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(outPath);

    console.log("exported →", path.relative(root, outPath));
  }
}

// App icon — mark on brand secondary background
const iconSvg = fs.readFileSync(path.join(svgDir, "icon-default.svg"));
const appIconSizes = [
  { size: 32, dest: path.join(root, "src/app/icon.png") },
  { size: 180, dest: path.join(root, "src/app/apple-icon.png") },
  { size: 512, dest: path.join(pngDir, "app-icon-512.png") },
];

for (const { size, dest } of appIconSizes) {
  const padding = Math.round(size * 0.18);
  const markSize = size - padding * 2;

  const mark = await sharp(iconSvg)
    .resize(markSize, markSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 24, g: 24, b: 27, alpha: 1 },
    },
  })
    .composite([{ input: mark, gravity: "center" }])
    .png()
    .toFile(dest);

  console.log("exported →", path.relative(root, dest));
}

// Primary horizontal logo for sync pipeline
const logoSrc = path.join(pngDir, "logo-horizontal-default-640.png");
const publicLogo = path.join(root, "public/logo.png");
const brandLogo = path.join(root, "src/assets/brand/logo.png");
fs.copyFileSync(logoSrc, publicLogo);
fs.copyFileSync(logoSrc, brandLogo);
console.log("copied →", path.relative(root, publicLogo));
console.log("copied →", path.relative(root, brandLogo));

console.log("\nBrand assets exported successfully.");

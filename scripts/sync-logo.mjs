import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const source = path.join(root, "src/assets/brand/png/logo-horizontal-default-640.png");
const fallbackSource = path.join(root, "src/assets/brand/logo.png");
const targets = [
  path.join(root, "public/logo.png"),
];

const logoSource = fs.existsSync(source) ? source : fallbackSource;

if (!fs.existsSync(logoSource)) {
  console.warn(
    "Logo Mesio não encontrado — execute npm run export:brand",
  );
  process.exit(0);
}

for (const target of targets) {
  fs.copyFileSync(logoSource, target);
  console.log("copied →", path.relative(root, target));
}

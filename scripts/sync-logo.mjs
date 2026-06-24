import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const source = path.join(root, "src/assets/brand/logo.png");
const targets = [
  path.join(root, "public/logo.png"),
  path.join(root, "src/app/icon.png"),
];

if (!fs.existsSync(source)) {
  console.error("Logo não encontrado:", source);
  process.exit(1);
}

for (const target of targets) {
  fs.copyFileSync(source, target);
  console.log("copied →", path.relative(root, target));
}

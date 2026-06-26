import fs from "node:fs";
import path from "node:path";

// TODO: reativar quando o logo Mesio final existir em src/assets/brand/logo.png
// O componente Logo usa wordmark em texto até o asset estar disponível.

const root = process.cwd();
const source = path.join(root, "src/assets/brand/logo.png");
const targets = [
  path.join(root, "public/logo.png"),
  path.join(root, "src/app/icon.png"),
];

if (!fs.existsSync(source)) {
  console.warn(
    "Logo Mesio ainda não disponível em",
    path.relative(root, source),
    "— sync ignorado.",
  );
  process.exit(0);
}

for (const target of targets) {
  fs.copyFileSync(source, target);
  console.log("copied →", path.relative(root, target));
}

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const photosText = fs.readFileSync(
  path.join(root, "lib/content/photos.ts"),
  "utf8",
);
const entries = [...photosText.matchAll(/^\s+(\w+):\s*"(\/[^"]+)"/gm)].map(
  (m) => ({ key: m[1], src: m[2] }),
);

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "node_modules" || e.name === ".next") continue;
      walk(p, acc);
    } else if (/\.(tsx?|jsx?)$/.test(e.name) && !p.endsWith("photos.ts")) {
      acc.push(fs.readFileSync(p, "utf8"));
    }
  }
  return acc;
}

const bodies = [
  ...walk(path.join(root, "app")),
  ...walk(path.join(root, "components")),
  ...walk(path.join(root, "lib")),
].join("\n");

const orphanKeys = entries.filter((e) => !bodies.includes(`photos.${e.key}`));
console.log("Orphan photos.ts keys:", orphanKeys.length);
orphanKeys.forEach((e) => console.log(`${e.key} -> ${e.src}`));

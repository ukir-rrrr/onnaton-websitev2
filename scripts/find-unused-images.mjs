import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");

function walkCode(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      walkCode(p, acc);
    } else if (/\.(tsx?|jsx?|css|html|json)$/.test(entry.name)) {
      acc.push(p);
    }
  }
  return acc;
}

function collectReferencedPaths() {
  const refs = new Set();
  const codeFiles = [
    ...walkCode(path.join(root, "app")),
    ...walkCode(path.join(root, "components")),
    ...walkCode(path.join(root, "lib")),
  ];

  for (const file of codeFiles) {
    const text = fs.readFileSync(file, "utf8");
    for (const m of text.matchAll(/["'`](\/(?:images|textures|連番写真_全147枚)\/[^"'`\s]+)["'`]/g)) {
      refs.add(decodeURIComponent(m[1]));
    }
  }

  return refs;
}

function walkImages(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walkImages(p, acc);
    else if (/\.(jpg|jpeg|png|webp|gif|svg)$/i.test(entry.name)) acc.push(p);
  }
  return acc;
}

const referenced = collectReferencedPaths();
const allFiles = walkImages(publicDir);
const unused = [];

for (const abs of allFiles) {
  const rel = "/" + path.relative(publicDir, abs).split(path.sep).join("/");
  if (!referenced.has(rel) && !referenced.has(decodeURIComponent(rel))) {
    unused.push(abs);
  }
}

if (process.argv.includes("--delete")) {
  for (const f of unused) fs.unlinkSync(f);
  // remove empty gallery dir
  const galleryDir = path.join(publicDir, "images", "gallery");
  if (fs.existsSync(galleryDir) && fs.readdirSync(galleryDir).length === 0) {
    fs.rmdirSync(galleryDir);
  }
  console.log(`Deleted ${unused.length} unused image(s).`);
} else {
  console.log(`Unused: ${unused.length}`);
  for (const f of unused.sort()) console.log(path.relative(root, f).replace(/\\/g, "/"));
}

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "public", "連番写真_全147枚");
const base = "/連番写真_全147枚";

function readImageSize(filePath) {
  const buf = fs.readFileSync(filePath);

  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i < buf.length) {
      if (buf[i] !== 0xff) {
        i += 1;
        continue;
      }
      const marker = buf[i + 1];
      if (marker === 0xc0 || marker === 0xc2 || marker === 0xc1) {
        return { width: buf.readUInt16BE(i + 7), height: buf.readUInt16BE(i + 5) };
      }
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }

  if (buf.toString("ascii", 1, 4) === "PNG") {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }

  return null;
}

const files = fs
  .readdirSync(dir)
  .filter((f) => /^\d{3}_/.test(f))
  .sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

const lines = files.map((f) => {
  const num = f.slice(0, 3);
  const category = f.split("_")[1] ?? "恩納豚";
  const src = `${base}/${encodeURIComponent(f)}`;
  const size = readImageSize(path.join(dir, f));
  const dims =
    size != null
      ? `, width: ${size.width}, height: ${size.height}`
      : "";
  return `  { src: "${src}", alt: "恩納豚 ${category} ${num}"${dims} },`;
});

const out = `export interface GalleryItem {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

/** 長辺がこの値未満の画像はギャラリーで拡大表示しない（ぼけ防止）。 */
export const GALLERY_LOW_RES_LONG_EDGE = 1200;

/**
 * ギャラリー画像一覧（public/連番写真_全147枚/ を 001–147 の順）。
 * 更新時: \`node scripts/generate-gallery.mjs\` を実行。
 */
export const galleryList: GalleryItem[] = [
${lines.join("\n")}
];
`;

fs.writeFileSync(path.join(root, "lib/content/gallery.ts"), out, "utf8");
console.log(`Wrote ${files.length} gallery items.`);

/**
 * Fix literal "n" newlines in locale translation files.
 * Run: node scripts/fix-locale-newlines.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";

const files = [
  "lib/i18n/locales/yue-phrases.ts",
  "lib/i18n/locales/zhTw-phrases.ts",
  "lib/i18n/locales/yue-copy.ts",
  "lib/i18n/locales/zhTw-copy.ts",
];

function fixValue(value) {
  return value
    .replace(/nn/g, "\\n\\n")
    .replace(/([。，；：])n/g, "$1\\n")
    .replace(/([分鐘])n/g, "$1\\n")
    .replace(/([制])n/g, "$1\\n")
    .replace(/([店])n/g, "$1\\n")
    .replace(/([）)])n/g, "$1\\n")
    .replace(/(['])n/g, "$1\\n")
    .replace(/(打烊)n/g, "$1\\n")
    .replace(/(香氣)n/g, "$1\\n")
    .replace(/(一部分。)n/g, "$1\\n")
    .replace(/(配合，)n/g, "$1\\n")
    .replace(/(湯底)n/g, "$1\\n")
    .replace(/(熟成)n/g, "$1\\n")
    .replace(/(預約)n/g, "$1\\n")
    .replace(/(食材，)n/g, "$1\\n")
    .replace(/(套餐後，)n/g, "$1\\n")
    .replace(/(時刻，)n/g, "$1\\n")
    .replace(/(環境，)n/g, "$1\\n")
    .replace(/(大人，)n/g, "$1\\n")
    .replace(/(偏見，)n/g, "$1\\n")
    .replace(/(申請，)n/g, "$1\\n")
    .replace(/(申請。)nn/g, "$1\\n\\n")
    .replace(/(：)nn/g, "$1\\n\\n")
    .replace(/(。)nn/g, "$1\\n\\n")
    .replace(/(ONNATON）)n/g, "$1\\n");
}

for (const file of files) {
  let content = readFileSync(file, "utf8");
  content = content.replace(/: "([^"\\]|\\.)*"/g, (match) => {
    const inner = match.slice(3, -1);
    if (!inner.includes("n") || inner.includes("\\n")) {
      return match;
    }
    const fixed = fixValue(inner);
    return `: "${fixed}"`;
  });
  writeFileSync(file, content, "utf8");
  console.log(`Fixed ${file}`);
}

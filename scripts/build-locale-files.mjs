/**
 * Generates yue-phrases.ts, zhTw-phrases.ts, yue-copy.ts, zhTw-copy.ts
 * from lib/i18n/locales/translations.json
 * Run: node scripts/build-locale-files.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const localesDir = join(root, "lib/i18n/locales");
const { phrases, copy } = JSON.parse(
  readFileSync(join(localesDir, "translations.json"), "utf8"),
);

function q(s) {
  return JSON.stringify(s);
}

function buildPhrasesFile(exportName, locale) {
  const lines = [`export const ${exportName}: Record<string, string> = {`];
  for (const [key, vals] of Object.entries(phrases)) {
    lines.push(`  ${q(key)}: ${q(vals[locale])},`);
  }
  lines.push("};");
  lines.push("");
  return lines.join("\n");
}

function buildCopyFile(exportName, patchName, locale, localeKey) {
  const lines = [
    `export const ${exportName}: Record<string, string> = {`,
  ];
  for (const [path, vals] of Object.entries(copy)) {
    lines.push(`  ${q(path)}: ${q(vals[locale])},`);
  }
  lines.push("};");
  lines.push("");
  lines.push("function setByPath(obj: Record<string, unknown>, path: string, value: string): void {");
  lines.push("  const parts = path.split(\".\");");
  lines.push("  let cur: Record<string, unknown> = obj;");
  lines.push("  for (let i = 0; i < parts.length - 1; i++) {");
  lines.push("    cur = cur[parts[i]!] as Record<string, unknown>;");
  lines.push("  }");
  lines.push("  const leaf = cur[parts[parts.length - 1]!] as Record<string, string>;");
  lines.push(`  leaf.${localeKey} = value;`);
  lines.push("}");
  lines.push("");
  lines.push(`export function ${patchName}(copy: typeof import("../copy").copy): void {`);
  lines.push(`  for (const [path, value] of Object.entries(${exportName})) {`);
  lines.push("    setByPath(copy as unknown as Record<string, unknown>, path, value);");
  lines.push("  }");
  lines.push("}");
  lines.push("");
  return lines.join("\n");
}

mkdirSync(localesDir, { recursive: true });

writeFileSync(join(localesDir, "yue-phrases.ts"), buildPhrasesFile("yuePhrases", "yue"));
writeFileSync(join(localesDir, "zhTw-phrases.ts"), buildPhrasesFile("zhTwPhrases", "zhTw"));
writeFileSync(
  join(localesDir, "yue-copy.ts"),
  buildCopyFile("yueCopyValues", "patchCopyYue", "yue", "yue"),
);
writeFileSync(
  join(localesDir, "zhTw-copy.ts"),
  buildCopyFile("zhTwCopyValues", "patchCopyZhTw", "zhTw", "zhTw"),
);

console.log("Generated locale files:");
console.log("  yue-phrases.ts:", Object.keys(phrases).length, "entries");
console.log("  zhTw-phrases.ts:", Object.keys(phrases).length, "entries");
console.log("  yue-copy.ts:", Object.keys(copy).length, "entries");
console.log("  zhTw-copy.ts:", Object.keys(copy).length, "entries");

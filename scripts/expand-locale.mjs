/**
 * Expands L(ja, en, ko, zh) → L(ja, en, ko, yue, zhTw) by duplicating the 4th arg.
 * Run: node scripts/expand-locale.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";

const files = ["lib/i18n/copy.ts", "lib/i18n/phrases.ts"];

for (const file of files) {
  const content = readFileSync(file, "utf8");
  writeFileSync(file, expandLCalls(content), "utf8");
  console.log(`Updated ${file}`);
}

function expandLCalls(source) {
  let out = "";
  let i = 0;

  while (i < source.length) {
    const start = source.indexOf("L(", i);
    if (start === -1) {
      out += source.slice(i);
      break;
    }
    out += source.slice(i, start);
    const openParen = start + 1;
    const end = findMatchingParen(source, openParen);
    if (end === -1) {
      out += source.slice(start);
      break;
    }
    const call = source.slice(start, end + 1);
    out += transformLCall(call);
    i = end + 1;
  }
  return out;
}

function findMatchingParen(source, openParenIdx) {
  let depth = 0;
  let inString = false;
  let escape = false;
  for (let i = openParenIdx; i < source.length; i++) {
    const ch = source[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (ch === "\\" && inString) {
      escape = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;
    if (ch === "(") depth++;
    if (ch === ")") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function unescapeChar(ch) {
  switch (ch) {
    case "n":
      return "\n";
    case "t":
      return "\t";
    case "r":
      return "\r";
    case "\\":
      return "\\";
    case '"':
      return '"';
    default:
      return ch;
  }
}

function parseStringArgs(inner) {
  const args = [];
  let i = 0;
  while (i < inner.length) {
    while (i < inner.length && /[\s,]/.test(inner[i])) i++;
    if (i >= inner.length) break;
    if (inner[i] !== '"') break;
    i++;
    let value = "";
    while (i < inner.length) {
      if (inner[i] === "\\") {
        value += unescapeChar(inner[i + 1] ?? "");
        i += 2;
        continue;
      }
      if (inner[i] === '"') {
        i++;
        break;
      }
      value += inner[i];
      i++;
    }
    args.push(value);
  }
  return args;
}

function q(s) {
  const escaped = s
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t");
  return `"${escaped}"`;
}

function transformLCall(call) {
  if (!call.startsWith("L(") || !call.endsWith(")")) return call;
  const inner = call.slice(2, -1);
  const args = parseStringArgs(inner);
  if (args.length === 5) return call;
  if (args.length !== 4) return call;
  const [ja, en, ko, zh] = args;
  if (call.includes("\n")) {
    return `L(\n      ${q(ja)},\n      ${q(en)},\n      ${q(ko)},\n      ${q(zh)},\n      ${q(zh)},\n    )`;
  }
  return `L(${q(ja)}, ${q(en)}, ${q(ko)}, ${q(zh)}, ${q(zh)})`;
}

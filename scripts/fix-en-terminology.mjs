import { readFileSync, writeFileSync } from "node:fs";

const copyPath = "lib/i18n/copy.ts";
let copy = readFileSync(copyPath, "utf8");

const copyReplacements = [
  [/Okinawa.s bounty, in ONNATON.s own broth\./g, "Okinawa's bounty, in ONNATON's own dashi broth."],
  [/Okinawa.s finest, as exquisite shabu-shabu\./g, "Okinawa's finest, as exquisite Shabu-shabu."],
  [/served as exquisite shabu-shabu\./g, "served as exquisite Shabu-shabu."],
  [/enjoyed in our original broth aged/g, "enjoyed in our original dashi broth aged"],
  [/a shabu-shabu house like no other/g, "a Shabu-shabu house like no other"],
  [/enjoy shabu-shabu at/g, "enjoy Shabu-shabu at"],
  [/In shabu-shabu, the delicate scents of the ingredients and broth/g, "In Shabu-shabu, the delicate scents of the ingredients and dashi broth"],
  [/natural aroma of our dishes and broth/g, "natural aroma of our dishes and dashi broth"],
  [/The broth starts slightly spicy/g, "The dashi broth starts slightly spicy"],
  [/Reservation-only shabu-shabu courses/g, "Reservation-only Shabu-shabu courses"],
];

for (const [pattern, replacement] of copyReplacements) {
  copy = copy.replace(pattern, replacement);
}
writeFileSync(copyPath, copy);

const phrasesPath = "lib/i18n/phrases.ts";
let phrases = readFileSync(phrasesPath, "utf8");
phrases = phrases.replace(
  /"gurumiki"/g,
  '"Gurumuki"',
);
phrases = phrases.replace(
  /in shabu-shabu\./g,
  "in Shabu-shabu.",
);
phrases = phrases.replace(
  /Beni-shabu soup/g,
  "Beni-shabu soup",
);
phrases = phrases.replace(
  /Shabu-shabu broth/g,
  "Shabu-shabu dashi broth",
);
phrases = phrases.replace(
  /broth that brings out/g,
  "dashi broth that brings out",
);
writeFileSync(phrasesPath, phrases);

console.log("Updated English terminology");

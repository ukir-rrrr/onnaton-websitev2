export type ReservationPolicy = {
  /** Regular list items rendered with bullet points. */
  bullets: string[];
  /** Lines starting with ※ or * rendered as notes (no bullet). */
  notes: string[];
};

/**
 * Split a `\n`-separated policy string into bulleted items and ※/* notes.
 * Shared by the international reservation page (⑦) and the phone-reservation
 * consent modal (⑭) so the wording lives in a single source.
 */
export function splitReservationPolicy(text: string): ReservationPolicy {
  const bullets: string[] = [];
  const notes: string[] = [];
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith("※") || line.startsWith("*")) {
      notes.push(line);
    } else {
      bullets.push(line);
    }
  }
  return { bullets, notes };
}

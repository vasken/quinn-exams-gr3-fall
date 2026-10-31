import recorded from "./french-audio.json";

/**
 * French is played from recordings in public/fr/ (made with `npm run audio:french`)
 * instead of the browser's speech voices, which some browsers ignore and read in English.
 */

/** Stable file name for a French phrase (FNV-1a hash of the cleaned text). */
export function audioKey(text: string): string {
  const s = text.normalize("NFC").replace(/\s+/g, " ").trim();
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

const available = new Set<string>(recorded);

/** URL of the recording for this phrase, or null if there isn't one (then the browser voice reads it). */
export function audioUrl(text: string): string | null {
  const key = audioKey(text);
  return available.has(key) ? `/fr/${key}.m4a` : null;
}

import fr from "./audio-fr.json";
import zh from "./audio-zh.json";

/**
 * French and Mandarin are played from recordings in public/fr/ and public/zh/ (made with `npm run audio`)
 * instead of the browser's speech voices, which some browsers ignore and read in English.
 */

export type RecordedLang = "fr" | "zh";

/** Stable file name for a phrase (FNV-1a hash of the cleaned text). */
export function audioKey(text: string): string {
  const s = text.normalize("NFC").replace(/\s+/g, " ").trim();
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

const available: Record<RecordedLang, Set<string>> = { fr: new Set(fr), zh: new Set(zh) };

/** URL of the recording for this phrase, or null if there isn't one (then the browser voice reads it). */
export function audioUrl(text: string, lang: RecordedLang): string | null {
  const key = audioKey(text);
  return available[lang].has(key) ? `/${lang}/${key}.m4a` : null;
}

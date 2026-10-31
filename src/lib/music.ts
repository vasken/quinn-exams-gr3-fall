/**
 * Pitch model for the music lessons.
 *
 * A note's `pos` counts letter steps (lines and spaces) from middle C:
 * C4 = 0, D4 = 1, … B4 = 6, C5 = 7, and B3 = −1. `acc` is an optional sharp or flat.
 */

export type Clef = "treble" | "bass";
export type Acc = "sharp" | "flat";
export interface Pitch {
  pos: number;
  acc?: Acc;
}

export const LETTERS = ["C", "D", "E", "F", "G", "A", "B"] as const;
const NATURAL_SEMITONES = [0, 2, 4, 5, 7, 9, 11];

export const mod = (n: number, m: number) => ((n % m) + m) % m;

export function letter(pos: number) {
  return LETTERS[mod(pos, 7)];
}

/** Scientific octave number: middle C is C4. */
export function octave(pos: number) {
  return 4 + Math.floor(pos / 7);
}

/** Half steps above middle C. */
export function semitone({ pos, acc }: Pitch) {
  return 12 * Math.floor(pos / 7) + NATURAL_SEMITONES[mod(pos, 7)] + (acc === "sharp" ? 1 : acc === "flat" ? -1 : 0);
}

export const ACC_SIGN: Record<Acc, string> = { sharp: "♯", flat: "♭" };
export const ACC_WORD: Record<Acc, string> = { sharp: "sharp", flat: "flat" };

/** "F♯", "B♭", "G". */
export function pitchName(p: Pitch) {
  return letter(p.pos) + (p.acc ? ACC_SIGN[p.acc] : "");
}

/** "F sharp", for reading aloud. */
export function spokenName(p: Pitch) {
  return letter(p.pos) + (p.acc ? ` ${ACC_WORD[p.acc]}` : "");
}

/** E♯, B♯, F♭ and C♭ are real, but too confusing for now, so they are never used. */
export function isOddSpelling({ pos, acc }: Pitch) {
  const l = letter(pos);
  return (acc === "sharp" && (l === "E" || l === "B")) || (acc === "flat" && (l === "F" || l === "C"));
}

export const samePitch = (a: Pitch, b: Pitch) => a.pos === b.pos && (a.acc ?? null) === (b.acc ?? null);

/** Line positions of each staff (bottom to top) and its middle line. */
export const STAFF: Record<Clef, { lines: number[]; bottom: number; top: number; middle: number }> = {
  treble: { lines: [2, 4, 6, 8, 10], bottom: 2, top: 10, middle: 6 },
  bass: { lines: [-10, -8, -6, -4, -2], bottom: -10, top: -2, middle: -6 },
};

/** Is `pos` on a line (as opposed to a space)? Both staves have their lines on even positions. */
export const onLine = (pos: number) => mod(pos, 2) === 0;

/** Middle line rule: on or above the middle line → stem down; below → stem up. */
export function stemDir(pos: number, clef: Clef): "up" | "down" {
  return pos >= STAFF[clef].middle ? "down" : "up";
}

/** Ledger lines a note needs (their positions), nearest the staff first. */
export function ledgerLines(pos: number, clef: Clef): number[] {
  const { bottom, top } = STAFF[clef];
  const out: number[] = [];
  for (let l = bottom - 2; l >= pos; l -= 2) out.push(l);
  for (let l = top + 2; l <= pos; l += 2) out.push(l);
  return out;
}

/**
 * Every sensible way to write the note a half or whole step away.
 * A half step may keep the letter (C → C♯) or move to the next letter (E → F, C → D♭).
 * A whole step always moves to the next letter (E → F♯).
 * The first answer is the usual one: sharps going up, flats going down.
 */
export function stepFrom(from: Pitch, size: "half" | "whole", dir: "up" | "down"): Pitch[] {
  const sign = dir === "up" ? 1 : -1;
  const target = semitone(from) + sign * (size === "half" ? 1 : 2);
  const positions = size === "half" ? [from.pos + sign, from.pos] : [from.pos + sign];
  const usual: Acc = dir === "up" ? "sharp" : "flat";
  const out: Pitch[] = [];
  for (const pos of positions) {
    for (const acc of [undefined, "sharp", "flat"] as const) {
      const p: Pitch = acc ? { pos, acc } : { pos };
      if (semitone(p) === target && !isOddSpelling(p)) out.push(p);
    }
  }
  // No sign first, then the usual sign for the direction (B down → B♭ before A♯).
  const rank = (p: Pitch) => (!p.acc ? 0 : p.acc === usual ? 1 : 2);
  return out.sort((a, b) => rank(a) - rank(b));
}

const ORDINAL = ["1st", "2nd", "3rd", "4th", "5th"];

/** "the 3rd line of the treble staff", "a ledger line above the bass staff", "the space below the treble staff". */
export function describePlace(pos: number, clef: Clef) {
  const { bottom, top } = STAFF[clef];
  const staffName = `${clef} staff`;
  if (pos >= bottom && pos <= top) {
    const n = (pos - bottom) / 2;
    return onLine(pos) ? `the ${ORDINAL[n]} line of the ${staffName}` : `the ${ORDINAL[Math.floor(n)]} space of the ${staffName}`;
  }
  if (pos === bottom - 1) return `the space just below the ${staffName}`;
  if (pos === top + 1) return `the space just above the ${staffName}`;
  const below = pos < bottom;
  const lines = ledgerLines(pos, clef).length;
  const where = below ? "below" : "above";
  if (onLine(pos)) return `ledger line ${lines} ${where} the ${staffName}`;
  return `the space ${where} ledger line ${lines} ${where} the ${staffName}`;
}

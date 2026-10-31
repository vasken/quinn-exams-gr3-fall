import type { Difficulty, Figure, Grade, Question, Rng, StaffNote } from "@/content/types";
import {
  type Acc,
  type Clef,
  STAFF,
  describePlace,
  isOddSpelling,
  letter,
  mod,
  onLine,
  type Pitch,
  pitchName,
  semitone,
  spokenName,
  stemDir,
  stepFrom,
} from "../music";
import { pickOne, randInt, shuffle } from "../random";

let counter = 0;
const id = (kind: string) => `gen-${kind}-${++counter}`;

/** Lowest and highest notes for each level: on the staff → middle C and one ledger line → two ledger lines. */
export const NOTE_RANGE: Record<Clef, Record<Difficulty, [number, number]>> = {
  treble: { easy: [1, 11], medium: [0, 12], hard: [-2, 14] },
  bass: { easy: [-11, -1], medium: [-12, 0], hard: [-14, 2] },
};

const CLEFS: Clef[] = ["treble", "bass"];

const MNEMONIC: Record<Clef, string> = {
  treble: "Treble lines: E G B D F (Every Good Boy Does Fine). Spaces: F A C E.",
  bass: "Bass lines: G B D F A (Good Boys Do Fine Always). Spaces: A C E G (All Cows Eat Grass).",
};

/** Text for the read-aloud button: "F♯" → "F sharp". */
const spoken = (s: string) => s.replace(/\*\*/g, "").replace(/♯/g, " sharp").replace(/♭/g, " flat");

const inOrOn = (pos: number) => (onLine(pos) ? "on" : "in");

function explainPlace(pos: number, clef: Clef) {
  if (pos === 0) return `This is **middle C**. It sits on its own ledger line between the treble and bass staves.`;
  const { bottom, top } = STAFF[clef];
  const inStaff = pos >= bottom && pos <= top;
  return `It is ${inOrOn(pos)} ${describePlace(pos, clef)}, so it is **${letter(pos)}**.${inStaff ? ` ${MNEMONIC[clef]}` : ""}`;
}

/* ---------- Part 1: grand staff note naming ---------- */

export function nameNote(_grade: Grade, difficulty: Difficulty, rng: Rng): Question {
  const clef = pickOne(rng, CLEFS);
  const grand = difficulty !== "easy" && rng() < 0.5;
  const [lo, hi] = NOTE_RANGE[clef][difficulty];
  const pos = randInt(rng, lo, hi);
  const answer = letter(pos);
  const figure: Figure = { id: "staff", clef: grand ? "grand" : clef, notes: [{ pos, staff: clef }] };
  const base = {
    prompt: "What is the letter name of this note?",
    figure,
    hint: MNEMONIC[clef],
    explain: explainPlace(pos, clef),
  };
  if (difficulty === "hard" && rng() < 0.5) {
    return { id: id("name-typed"), type: "typed", answer, ...base };
  }
  // Common mix-ups: the next letter up or down, and reading the other clef.
  const wrong = [...new Set([letter(pos + 1), letter(pos - 1), letter(pos + 2), letter(pos - 2)])].filter((l) => l !== answer);
  return { id: id("name"), type: "mcq", answer, wrong, ...base };
}

/** Every position in `range` that matches `want` (same letter and sign). */
function matching(range: [number, number], want: (p: number) => boolean, first: number) {
  const out: number[] = [];
  for (let p = range[0]; p <= range[1]; p++) if (want(p)) out.push(p);
  return [first, ...out.filter((p) => p !== first)];
}

export function writeNote(_grade: Grade, difficulty: Difficulty, rng: Rng): Question {
  const clef = pickOne(rng, CLEFS);
  const { bottom, top } = STAFF[clef];
  const range = NOTE_RANGE[clef][difficulty];

  // Medium/Hard: sometimes ask for a note that needs a ledger line.
  if (difficulty !== "easy" && rng() < 0.4) {
    const below = rng() < 0.5;
    const lo = below ? range[0] : top + 2;
    const hi = below ? bottom - 2 : range[1];
    const pos = randInt(rng, lo, hi);
    const L = letter(pos);
    const where = `${below ? "below" : "above"} the ${clef} staff`;
    const prompt = pos === 0 ? `Draw **middle C** ${where}.` : `Draw **${L}** on a ledger line or space ${where}.`;
    return {
      id: id("write-ledger"),
      type: "staff-write",
      prompt,
      say: spoken(prompt),
      clef,
      range,
      answer: matching([lo, hi], (p) => letter(p) === L, pos).map((p) => ({ pos: p })),
      hint: `Keep counting line, space, line, space past the edge of the staff. ${MNEMONIC[clef]}`,
      explain: explainPlace(pos, clef),
    };
  }

  const pos = randInt(rng, range[0], range[1]);
  const L = letter(pos);
  const prompt = `Draw the note **${L}** on the ${clef} staff.`;
  return {
    id: id("write"),
    type: "staff-write",
    prompt,
    say: spoken(prompt),
    clef,
    range,
    answer: matching(range, (p) => letter(p) === L, pos).map((p) => ({ pos: p })),
    hint: MNEMONIC[clef],
    explain: explainPlace(pos, clef),
  };
}

/* ---------- Part 2: the middle line rule ---------- */

type StemFault = "direction" | "side" | "short" | "crooked";

const FAULTS: Record<Difficulty, StemFault[]> = {
  easy: ["direction", "side"],
  medium: ["direction", "side", "short"],
  hard: ["direction", "side", "short", "crooked"],
};

/** Positions to use for stem questions (never so high or low that stems leave the picture). */
function stemRange(clef: Clef, difficulty: Difficulty): [number, number] {
  const { bottom, top } = STAFF[clef];
  return difficulty === "easy" ? [bottom - 1, top + 1] : NOTE_RANGE[clef][difficulty];
}

function where(pos: number, clef: Clef) {
  const { middle } = STAFF[clef];
  return pos === middle ? "on the middle line" : pos > middle ? "above the middle line" : "below the middle line";
}

function rule(clef: Clef) {
  return `The middle line of the ${clef} staff is ${letter(STAFF[clef].middle)}. On or above it, the stem goes down. Below it, the stem goes up.`;
}

function faultExplain(fault: StemFault, pos: number, clef: Clef) {
  const dir = stemDir(pos, clef);
  switch (fault) {
    case "direction":
      return `That note is ${where(pos, clef)}, so its stem should go **${dir}**.`;
    case "side":
      return dir === "up"
        ? "Stems that go **up** belong on the **right** side of the note."
        : "Stems that go **down** belong on the **left** side of the note.";
    case "short":
      return "That stem is too short. A stem should be about **one octave** long (3½ spaces).";
    case "crooked":
      return "That stem is wobbly. Stems are drawn **straight**, so use a ruler.";
  }
}

function correctStem(noteId: string, pos: number, clef: Clef): StaffNote {
  return { id: noteId, pos, stem: stemDir(pos, clef) };
}

function faultyStem(noteId: string, pos: number, clef: Clef, fault: StemFault): StaffNote {
  const dir = stemDir(pos, clef);
  switch (fault) {
    case "direction":
      return { id: noteId, pos, stem: dir === "up" ? "down" : "up" };
    case "side":
      return { id: noteId, pos, stem: dir, stemSide: dir === "up" ? "left" : "right" };
    case "short":
      return { id: noteId, pos, stem: dir, stemLen: 1.5 };
    case "crooked":
      return { id: noteId, pos, stem: dir, crooked: true };
  }
}

/** A position that isn't on the middle line (where "wrong direction" would be unclear). */
function offMiddle(rng: Rng, clef: Clef, range: [number, number]) {
  let pos = randInt(rng, range[0], range[1]);
  if (pos === STAFF[clef].middle) pos += rng() < 0.5 ? 1 : -1;
  return pos;
}

export function stemDirection(_grade: Grade, difficulty: Difficulty, rng: Rng): Question {
  const clef = pickOne(rng, CLEFS);
  const { middle } = STAFF[clef];
  const range = stemRange(clef, difficulty);
  const pos = rng() < 0.25 ? middle : randInt(rng, range[0], range[1]);
  const dir = stemDir(pos, clef);
  const figure: Figure = { id: "staff", clef, notes: [{ pos, filled: true }] };
  const explain = `This note is ${where(pos, clef)}, so the stem goes **${dir}**.`;

  if (difficulty === "easy") {
    return {
      id: id("stem-dir"),
      type: "mcq",
      prompt: "Which way should this note's stem go?",
      answer: dir === "up" ? "Up" : "Down",
      wrong: [dir === "up" ? "Down" : "Up"],
      figure,
      hint: rule(clef),
      explain,
    };
  }
  const options = ["Up, on the right side", "Up, on the left side", "Down, on the left side", "Down, on the right side"];
  const answer = dir === "up" ? options[0] : options[2];
  return {
    id: id("stem-dir-side"),
    type: "mcq",
    prompt: "How should the stem be drawn on this note?",
    answer,
    wrong: options.filter((o) => o !== answer),
    figure,
    hint: `${rule(clef)} Up-stems go on the right, down-stems on the left.`,
    explain: `${explain} ${dir === "up" ? "Up-stems go on the **right**." : "Down-stems go on the **left**."}`,
  };
}

export function findWrongStem(_grade: Grade, difficulty: Difficulty, rng: Rng): Question {
  const clef = pickOne(rng, CLEFS);
  const range = stemRange(clef, difficulty);
  const fault = pickOne(rng, difficulty === "easy" ? (["direction"] as StemFault[]) : FAULTS[difficulty]);
  const wrongAt = randInt(rng, 0, 3);
  const notes = Array.from({ length: 4 }, (_, i) => {
    const pos = i === wrongAt ? offMiddle(rng, clef, range) : randInt(rng, range[0], range[1]);
    return i === wrongAt ? faultyStem(`n${i}`, pos, clef, fault) : correctStem(`n${i}`, pos, clef);
  });
  return {
    id: id("stem-find"),
    type: "tap",
    prompt: "Tap the note with the stem drawn **wrong**.",
    figure: { id: "staff", clef, notes },
    answer: `n${wrongAt}`,
    hint: `${rule(clef)} Up-stems go on the right, down-stems on the left.`,
    explain: faultExplain(fault, notes[wrongAt].pos, clef),
  };
}

export function stemPicture(_grade: Grade, difficulty: Difficulty, rng: Rng): Question {
  const clef = pickOne(rng, CLEFS);
  const pos = offMiddle(rng, clef, stemRange(clef, difficulty));
  const faults = shuffle(rng, FAULTS[difficulty]).slice(0, 2);
  const order = shuffle(rng, [null, ...faults]);
  const notes = order.map((f, i) => (f ? faultyStem(`n${i}`, pos, clef, f) : correctStem(`n${i}`, pos, clef)));
  const dir = stemDir(pos, clef);
  return {
    id: id("stem-pick"),
    type: "tap",
    prompt: "Which stem is drawn **correctly**?",
    figure: { id: "staff", clef, notes },
    answer: `n${order.indexOf(null)}`,
    hint: `${rule(clef)} Up-stems go on the right, down-stems on the left.`,
    explain: `The note is ${where(pos, clef)}, so the stem goes **${dir}**, on the **${dir === "up" ? "right" : "left"}**, straight and about an octave long.`,
  };
}

/* ---------- Part 3: half steps, whole steps and accidentals ---------- */

const ACCS: Acc[] = ["sharp", "flat"];

/** A note on (or just next to) the staff, sometimes with a sharp or flat. */
function startNote(rng: Rng, clef: Clef, difficulty: Difficulty): Pitch {
  const { bottom, top } = STAFF[clef];
  const pos = randInt(rng, bottom - 1, top + 1);
  const accChance = { easy: 0, medium: 0.25, hard: 0.4 }[difficulty];
  if (rng() < accChance) {
    const acc = pickOne(rng, ACCS);
    if (!isOddSpelling({ pos, acc })) return { pos, acc };
  }
  return { pos };
}

type Size = "half" | "whole";
type Dir = "up" | "down";

/** A start note and step with a sensible answer (G♭ down a whole step would need F♭, so try again). */
function stepSetup(rng: Rng, clef: Clef, difficulty: Difficulty) {
  for (;;) {
    const from = startNote(rng, clef, difficulty);
    const size = pickOne(rng, ["half", "whole"] as Size[]);
    const dir = pickOne(rng, ["up", "down"] as Dir[]);
    const answers = stepFrom(from, size, dir);
    if (answers.length) return { from, size, dir, answers };
  }
}

const or = (ps: Pitch[]) => ps.map((p) => `**${pitchName(p)}**`).join(" or ");

function stepExplain(from: Pitch, size: Size, dir: Dir, answers: Pitch[]) {
  const pair = dir === "up" ? [letter(from.pos), letter(from.pos + 1)] : [letter(from.pos - 1), letter(from.pos)];
  const natural = !from.acc && !answers[0].acc && ((pair[0] === "E" && pair[1] === "F") || (pair[0] === "B" && pair[1] === "C"));
  const note = natural
    ? ` There is no black key between ${pair[0]} and ${pair[1]}, so they are a half step apart.`
    : size === "half"
      ? " A half step is the very next key."
      : " A whole step is two half steps: skip one key.";
  return `A ${size} step ${dir} from **${pitchName(from)}** is ${or(answers)}.${note}`;
}

const STEP_HINT = {
  half: "A half step is the very next key on the piano, black or white.",
  whole: "A whole step skips one key. It is two half steps.",
};

export function writeStep(_grade: Grade, difficulty: Difficulty, rng: Rng): Question {
  const clef = pickOne(rng, CLEFS);
  const { from, size, dir, answers: answer } = stepSetup(rng, clef, difficulty);
  const prompt = `Write a note a **${size} step ${dir === "up" ? "higher" : "lower"}** than this note.`;
  return {
    id: id("step-write"),
    type: "staff-write",
    prompt,
    clef,
    given: [{ pos: from.pos, acc: from.acc }],
    answer,
    accidentals: true,
    range: [from.pos - 3, from.pos + 3],
    hint: STEP_HINT[size],
    explain: stepExplain(from, size, dir, answer),
  };
}

/** Near-miss note names for a step question. */
function nearMisses(from: Pitch, target: number, exclude: string[]) {
  const out: { name: string; dist: number }[] = [];
  for (let pos = from.pos - 2; pos <= from.pos + 2; pos++) {
    for (const acc of [undefined, ...ACCS]) {
      const p: Pitch = acc ? { pos, acc } : { pos };
      const name = pitchName(p);
      if (isOddSpelling(p) || semitone(p) === target || exclude.includes(name)) continue;
      if (out.some((o) => o.name === name)) continue;
      out.push({ name, dist: Math.abs(semitone(p) - target) });
    }
  }
  return out.sort((a, b) => a.dist - b.dist).slice(0, 4).map((o) => o.name);
}

export function nameStep(_grade: Grade, difficulty: Difficulty, rng: Rng): Question {
  const clef = pickOne(rng, CLEFS);
  if (rng() < 0.5) {
    // "Is C to D a half step or a whole step?"
    const a = startNote(rng, clef, difficulty);
    const signs = difficulty === "easy" ? [undefined] : shuffle(rng, [undefined, ...ACCS]);
    const options = signs.map((acc) => (acc ? { pos: a.pos + 1, acc } : { pos: a.pos + 1 }));
    const b = options.find((p) => !isOddSpelling(p) && [1, 2].includes(semitone(p) - semitone(a)))!;
    const half = semitone(b) - semitone(a) === 1;
    const prompt = `Is **${pitchName(a)}** up to **${pitchName(b)}** a half step or a whole step?`;
    return {
      id: id("step-which"),
      type: "mcq",
      prompt,
      say: spoken(prompt),
      answer: half ? "Half step" : "Whole step",
      wrong: [half ? "Whole step" : "Half step"],
      hint: `${STEP_HINT.half} ${STEP_HINT.whole}`,
      explain: stepExplain(a, half ? "half" : "whole", "up", [b]),
    };
  }
  const { from, size, dir, answers } = stepSetup(rng, clef, difficulty);
  const answer = pitchName(answers[0]);
  const prompt = `What note is a **${size} step ${dir}** from **${pitchName(from)}**?`;
  const k = mod(semitone(from), 12) + 12;
  return {
    id: id("step-name"),
    type: "mcq",
    prompt,
    say: spoken(prompt),
    answer,
    wrong: nearMisses(from, semitone(answers[0]), answers.map(pitchName)),
    figure: difficulty === "easy" ? { id: "keyboard", keys: [k], from: 7, to: 28 } : undefined,
    hint: STEP_HINT[size],
    explain: stepExplain(from, size, dir, answers),
  };
}

/** A natural letter with a sharp or flat that isn't an odd spelling. */
function accidentalNote(rng: Rng, range: [number, number]): Pitch {
  for (;;) {
    const p: Pitch = { pos: randInt(rng, range[0], range[1]), acc: pickOne(rng, ACCS) };
    if (!isOddSpelling(p)) return p;
  }
}

export function writeAccidental(_grade: Grade, difficulty: Difficulty, rng: Rng): Question {
  const clef = pickOne(rng, CLEFS);
  const { bottom, top } = STAFF[clef];
  const range: [number, number] = difficulty === "easy" ? [bottom - 1, top + 1] : NOTE_RANGE[clef][difficulty];
  const p = accidentalNote(rng, range);
  const name = pitchName(p);
  const prompt = `Draw **${name}** on the ${clef} staff.`;
  return {
    id: id("acc-write"),
    type: "staff-write",
    prompt,
    say: spoken(prompt),
    clef,
    range,
    accidentals: true,
    answer: matching(range, (q) => letter(q) === letter(p.pos), p.pos).map((pos) => ({ pos, acc: p.acc })),
    hint: `Find ${letter(p.pos)} first, then put the ${p.acc === "sharp" ? "♯" : "♭"} in front of it. ${MNEMONIC[clef]}`,
    explain: `${spokenName(p)} is written as ${letter(p.pos)} with a ${p.acc === "sharp" ? "**sharp ♯**" : "**flat ♭**"} in front, on the same line or space.`,
  };
}

export function nameAccidental(_grade: Grade, difficulty: Difficulty, rng: Rng): Question {
  const clef = pickOne(rng, CLEFS);
  const { bottom, top } = STAFF[clef];
  const range: [number, number] = difficulty === "easy" ? [bottom, top] : NOTE_RANGE[clef][difficulty];
  const p = accidentalNote(rng, range);
  const other: Acc = p.acc === "sharp" ? "flat" : "sharp";
  const candidates: Pitch[] = [{ pos: p.pos }, { pos: p.pos, acc: other }, { pos: p.pos + 1, acc: p.acc }, { pos: p.pos - 1, acc: p.acc }];
  const answer = pitchName(p);
  const wrong = [...new Set(candidates.filter((c) => !isOddSpelling(c)).map(pitchName))].filter((n) => n !== answer);
  return {
    id: id("acc-name"),
    type: "mcq",
    prompt: "What is the name of this note?",
    answer,
    wrong,
    figure: { id: "staff", clef, notes: [{ pos: p.pos, acc: p.acc }] },
    hint: `Name the line or space first, then add the sign. ${MNEMONIC[clef]}`,
    explain: `The note is ${inOrOn(p.pos)} ${describePlace(p.pos, clef)} (**${letter(p.pos)}**) with a ${p.acc === "sharp" ? "sharp ♯" : "flat ♭"}, so it is **${answer}**.`,
  };
}

/* ---------- Mixers used by the topics ---------- */

export const grandStaffQuestion = (g: Grade, d: Difficulty, r: Rng) => (r() < 0.6 ? nameNote(g, d, r) : writeNote(g, d, r));

export function stemQuestion(g: Grade, d: Difficulty, r: Rng) {
  const x = r();
  return x < 0.4 ? stemDirection(g, d, r) : x < 0.75 ? findWrongStem(g, d, r) : stemPicture(g, d, r);
}

export function stepQuestion(g: Grade, d: Difficulty, r: Rng) {
  const x = r();
  return x < 0.3 ? writeStep(g, d, r) : x < 0.55 ? nameStep(g, d, r) : x < 0.75 ? writeAccidental(g, d, r) : nameAccidental(g, d, r);
}

/** A random note for the speed test: which staff, and where. */
export function drillNote(difficulty: Difficulty, rng: Rng, avoid?: number): StaffNote {
  for (;;) {
    const staff = pickOne(rng, CLEFS);
    const [lo, hi] = NOTE_RANGE[staff][difficulty];
    const pos = randInt(rng, lo, hi);
    if (pos !== avoid) return { pos, staff };
  }
}

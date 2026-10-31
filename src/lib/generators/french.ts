import type { Difficulty, Grade, Question, Rng } from "@/content/types";
import { frenchNumber, numberParts } from "../french";
import { pickOne, randInt, shuffle } from "../random";

let counter = 0;
const id = (kind: string) => `gen-fr-${kind}-${++counter}`;

export interface Word {
  fr: string;
  en: string;
}

/** Up to `n` distinct wrong choices from `pool`, never the answer. */
function wrongFrom(rng: Rng, pool: string[], answer: string, n = 3) {
  return shuffle(rng, [...new Set(pool)].filter((w) => w !== answer)).slice(0, n);
}

/* ---------- Numbers ---------- */

const SHEET_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

function pickNumber(difficulty: Difficulty, rng: Rng) {
  if (difficulty === "easy") return pickOne(rng, SHEET_NUMBERS);
  if (difficulty === "medium") return randInt(rng, 1, 69);
  // Hard: lean on the tricky 70–99.
  return rng() < 0.5 ? randInt(rng, 70, 99) : randInt(rng, 1, 100);
}

/** Numbers that are easy to mix up with n: ±1, ±10, 4 / 40, 6 / 60, 70 / 80 / 90. */
function confusables(n: number, difficulty: Difficulty, rng: Rng) {
  const inRange = (m: number) => m >= 1 && m <= 100 && m !== n && (difficulty !== "easy" || SHEET_NUMBERS.includes(m));
  const near = [n - 1, n + 1, n - 10, n + 10, n < 10 ? n * 10 : 0, n % 10 === 0 ? n / 10 : 0, n + 20, n - 20].filter(inRange);
  const out = [...new Set(shuffle(rng, near))].slice(0, 3);
  while (out.length < 3) {
    const m = difficulty === "easy" ? pickOne(rng, SHEET_NUMBERS) : randInt(rng, 1, 100);
    if (inRange(m) && !out.includes(m)) out.push(m);
  }
  return out;
}

function explainNumber(n: number) {
  const parts = numberParts(n);
  return `{${frenchNumber(n)}} = **${n}**${parts ? `. ${parts}` : ""}`;
}

export function numberQuestion(_grade: Grade, difficulty: Difficulty, rng: Rng): Question {
  const n = pickNumber(difficulty, rng);
  const word = frenchNumber(n);
  const explain = explainNumber(n);
  const kinds = ["read", "say", "listen", "next"] as const;
  const kind = difficulty === "hard" && rng() < 0.25 ? "write" : pickOne(rng, kinds);

  switch (kind) {
    case "read":
      return {
        id: id("num-read"),
        type: "mcq",
        prompt: `What number is {${word}}?`,
        answer: String(n),
        wrong: confusables(n, difficulty, rng).map(String),
        explain,
      };
    case "say":
      return {
        id: id("num-say"),
        type: "mcq",
        prompt: `How do you say **${n}** in French?`,
        answer: word,
        wrong: confusables(n, difficulty, rng).map(frenchNumber),
        explain,
      };
    case "listen":
      return {
        id: id("num-listen"),
        type: "typed",
        numeric: true,
        prompt: "Tap the speaker and listen. What number do you hear?",
        say: `{${word}}`,
        answer: String(n),
        explain,
      };
    case "next": {
      // Count up by one; on Easy, stay inside 1–10.
      const m = difficulty === "easy" ? randInt(rng, 1, 9) : Math.min(n, 99);
      const next = m + 1;
      return {
        id: id("num-next"),
        type: "mcq",
        prompt: `Count in French. What comes after {${frenchNumber(m)}}?`,
        answer: frenchNumber(next),
        wrong: [...new Set([m - 1, m + 2, next + 10, next - 10, m])].filter((x) => x >= 1 && x <= 100 && x !== next).slice(0, 3).map(frenchNumber),
        explain: `{${frenchNumber(m)}} (${m}), then {${frenchNumber(next)}} (${next}).`,
      };
    }
    case "write":
      return {
        id: id("num-write"),
        type: "typed",
        prompt: `Write **${n}** in French.`,
        answer: word,
        explain,
      };
  }
}

/* ---------- Word lists (days, months, weather, expressions) ---------- */

type VocabKind = "fr-en" | "en-fr" | "listen" | "write";

/** A French ↔ English question from a word list. Wrong choices come from the same list. */
export function vocabQuestion(list: Word[], difficulty: Difficulty, rng: Rng, opts: { write?: boolean } = {}): Question {
  const w = pickOne(rng, list);
  const kinds: VocabKind[] = ["fr-en", "en-fr", "listen"];
  const kind: VocabKind = opts.write && difficulty === "hard" && rng() < 0.3 ? "write" : pickOne(rng, kinds);
  const explain = `{${w.fr}} means **${w.en}**${/[.!?…:]$/.test(w.en) ? "" : "."}`;
  const n = difficulty === "easy" ? 2 : 3;
  switch (kind) {
    case "fr-en":
      return { id: id("fr-en"), type: "mcq", prompt: `What does {${w.fr}} mean?`, answer: w.en, wrong: wrongFrom(rng, list.map((x) => x.en), w.en, n), explain };
    case "en-fr":
      return { id: id("en-fr"), type: "mcq", prompt: `How do you say **${w.en}** in French?`, answer: w.fr, wrong: wrongFrom(rng, list.map((x) => x.fr), w.fr, n), explain };
    case "listen":
      return {
        id: id("listen"),
        type: "mcq",
        prompt: "Tap the speaker and listen. What does it mean?",
        say: `{${w.fr}}`,
        answer: w.en,
        wrong: wrongFrom(rng, list.map((x) => x.en), w.en, n),
        explain,
      };
    case "write":
      return { id: id("write"), type: "typed", prompt: `Write **${w.en}** in French.`, answer: w.fr, explain };
  }
}

/** "What comes after…?" and "Which one is missing?" for days and months. */
export function sequenceQuestion(list: Word[], noun: string, difficulty: Difficulty, rng: Rng): Question {
  const n = difficulty === "easy" ? 2 : 3;
  const frs = list.map((w) => w.fr);
  if (rng() < 0.5) {
    const i = randInt(rng, 0, list.length - 2);
    const answer = list[i + 1].fr;
    return {
      id: id("seq-next"),
      type: "mcq",
      prompt: `What ${noun} comes after {${list[i].fr}}?`,
      answer,
      wrong: wrongFrom(rng, frs, answer, n),
      explain: `{${list[i].fr}} (${list[i].en}), then {${answer}} (${list[i + 1].en}).`,
    };
  }
  // Show a run of the list with one gap.
  const len = Math.min(list.length, difficulty === "easy" ? 5 : 7);
  const start = randInt(rng, 0, list.length - len);
  const run = list.slice(start, start + len);
  const gap = randInt(rng, 1, run.length - 2);
  const answer = run[gap].fr;
  const shown = run.map((w, i) => (i === gap ? "___" : w.fr)).join(", ");
  return {
    id: id("seq-missing"),
    type: "mcq",
    prompt: `Which ${noun} is missing?\n{${shown}}`,
    answer,
    wrong: wrongFrom(rng, frs, answer, n),
    explain: `{${run[gap - 1].fr}}, **{${answer}}**, {${run[gap + 1].fr}}. {${answer}} means ${run[gap].en}.`,
  };
}

/* ---------- Avoir and être ---------- */

interface Pronoun {
  fr: string;
  en: string;
  avoir: string;
  etre: string;
  /** English verb forms. */
  have: string;
  be: string;
}

export const PRONOUNS: Pronoun[] = [
  { fr: "Je", en: "I", avoir: "ai", etre: "suis", have: "have", be: "am" },
  { fr: "Tu", en: "You", avoir: "as", etre: "es", have: "have", be: "are" },
  { fr: "Il", en: "He", avoir: "a", etre: "est", have: "has", be: "is" },
  { fr: "Elle", en: "She", avoir: "a", etre: "est", have: "has", be: "is" },
  { fr: "Nous", en: "We", avoir: "avons", etre: "sommes", have: "have", be: "are" },
  { fr: "Vous", en: "You (plural)", avoir: "avez", etre: "êtes", have: "have", be: "are" },
  { fr: "Ils", en: "They", avoir: "ont", etre: "sont", have: "have", be: "are" },
  { fr: "Elles", en: "They", avoir: "ont", etre: "sont", have: "have", be: "are" },
];

const AVOIR_THINGS: Word[] = [
  { fr: "un chien", en: "a dog" },
  { fr: "une règle", en: "a ruler" },
  { fr: "un lapin", en: "a rabbit" },
  { fr: "un chat", en: "a cat" },
  { fr: "un crayon", en: "a pencil" },
  { fr: "une pomme", en: "an apple" },
  { fr: "un cahier", en: "a notebook" },
  { fr: "un chapeau", en: "a hat" },
];

const ETRE_PLACES: Word[] = [
  { fr: "à l'école", en: "at school" },
  { fr: "à la maison", en: "at home" },
  { fr: "en troisième année", en: "in grade 3" },
];

/** "J'ai" and "Je suis": je becomes j' before a vowel. */
const subject = (p: Pronoun, form: string) => (p.fr === "Je" && /^[aeiouhé]/.test(form) ? "J'" : `${p.fr} `);

export function verbQuestion(_grade: Grade, difficulty: Difficulty, rng: Rng): Question {
  const p = pickOne(rng, PRONOUNS);
  const avoir = rng() < 0.5;
  const verb = avoir ? "avoir" : "être";
  const form = avoir ? p.avoir : p.etre;
  const thing = pickOne(rng, avoir ? AVOIR_THINGS : ETRE_PLACES);
  const sentence = `${subject(p, form)}${form} ${thing.fr}.`;
  const english = `${p.en} ${avoir ? p.have : p.be} ${thing.en}.`;
  const explain = `{${sentence}} = ${english}`;

  if (rng() < 0.3) {
    // Translate: the wrong choices change the person.
    const others = PRONOUNS.map((o) => `${o.en} ${avoir ? o.have : o.be} ${thing.en}.`);
    return {
      id: id("verb-translate"),
      type: "mcq",
      prompt: `What does {${sentence}} mean?`,
      answer: english,
      wrong: wrongFrom(rng, others, english),
      explain,
    };
  }

  const blank = p.fr === "Je" && avoir ? `J'___ ${thing.fr}.` : `${p.fr} ___ ${thing.fr}.`;
  const prompt = `Fill in the blank with **{${verb}}**:\n{${blank}}`;
  if (difficulty === "hard" && rng() < 0.5) {
    return { id: id("verb-typed"), type: "typed", prompt, answer: form, explain };
  }
  const forms = PRONOUNS.map((o) => (avoir ? o.avoir : o.etre));
  // Medium and hard also offer the other verb's form, a common mix-up.
  const other = avoir ? p.etre : p.avoir;
  const wrong = difficulty === "easy" ? wrongFrom(rng, forms, form, 2) : [other, ...wrongFrom(rng, forms, form, 2)];
  return { id: id("verb-fill"), type: "mcq", prompt, answer: form, wrong, explain };
}

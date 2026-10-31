import type { Difficulty, Grade, Question, Rng } from "@/content/types";
import {
  dateZh,
  FINALS,
  MONTHS_EN,
  monthZh,
  ordinal,
  pinyin,
  splitSyllable,
  timeEn,
  timeZh,
  type Tone,
  toneOf,
  withTone,
  yearZh,
  zhNumber,
} from "../mandarin";
import { pickOne, randInt, shuffle } from "../random";

let counter = 0;
const id = (kind: string) => `gen-zh-${kind}-${++counter}`;

export interface Word {
  zh: string;
  en: string;
  /** Other accepted ways to write it (星期日 for 星期天). */
  alt?: string[];
  /** A picture for "what is this?" questions. */
  emoji?: string;
}

/** Up to `n` distinct wrong choices from `pool`, never the answer or anything in `avoid`. */
function wrongFrom(rng: Rng, pool: string[], answer: string, n = 3, avoid: string[] = []) {
  return shuffle(rng, [...new Set(pool)].filter((w) => w !== answer && !avoid.includes(w))).slice(0, n);
}

/** Distinct strings, minus the answer, up to n. */
const distinct = (list: string[], answer: string, n = 3) => [...new Set(list)].filter((x) => x && x !== answer).slice(0, n);

const onlyHan = (s: string) => /^[\p{Script=Han}〇]+$/u.test(s);
const choices = (difficulty: Difficulty) => (difficulty === "easy" ? 2 : 3);

/** The same syllables with a tone changed: xīng qī → xíng qī. */
export function retone(py: string, rng: Rng, n = 3): string[] {
  const syllables = py.split(" ");
  const out = new Set<string>();
  for (let tries = 0; out.size < n && tries < 60; tries++) {
    const s = [...syllables];
    const k = randInt(rng, 0, s.length - 1);
    const t = toneOf(s[k]);
    if (t === 0) continue;
    s[k] = withTone(s[k], pickOne(rng, ([1, 2, 3, 4] as Tone[]).filter((x) => x !== t)));
    const v = s.join(" ");
    if (v !== py) out.add(v);
  }
  return [...out];
}

/** Write it on paper, then check (the exam asks for characters and pinyin). */
function selfcheck(en: string, zh: string): Question {
  return { id: id("write"), type: "selfcheck", prompt: `On paper, write **${en}** in Chinese characters and pinyin.`, answer: zh };
}

/** Put the characters in order: 二 十 三 号. */
function build(en: string, zh: string, explain?: string): Question {
  return { id: id("build"), type: "order", row: true, prompt: `Build **${en}** in Chinese.`, items: [...zh], explain: explain ?? zh };
}

/* ---------- Word lists ---------- */

export type VocabKind = "zh-en" | "en-zh" | "listen" | "pinyin" | "type-pinyin" | "picture" | "write" | "build";

export interface VocabOptions {
  /** Easy hint for "how do you say…?" questions. */
  hint?: (w: Word) => string | undefined;
  /** Hard: write it on paper. */
  write?: boolean;
  /** Medium and hard: build it from tiles. */
  build?: boolean;
  /** Only these kinds (e.g. listening practice). */
  only?: VocabKind[];
}

/** A Chinese ↔ English ↔ pinyin question from a word list. Wrong choices come from the same list. */
export function vocabQuestion(list: Word[], difficulty: Difficulty, rng: Rng, opts: VocabOptions = {}): Question {
  const w = pickOne(rng, list);
  const kinds: VocabKind[] = ["zh-en", "en-zh", "listen"];
  if (w.emoji) kinds.push("picture");
  if (difficulty !== "easy") kinds.push("pinyin");
  let kind = pickOne(rng, kinds);
  if (difficulty === "hard" && rng() < 0.12) kind = "type-pinyin";
  if (opts.build && difficulty !== "easy" && onlyHan(w.zh) && w.zh.length > 1 && rng() < 0.15) kind = "build";
  if (opts.write && difficulty === "hard" && rng() < 0.15) kind = "write";
  if (opts.only) kind = pickOne(rng, opts.only);

  const n = choices(difficulty);
  const also = w.alt?.length ? ` (or ${w.alt.join(", ")})` : "";
  const explain = `${w.zh}${also} means **${w.en}**${/[.!?…]$/.test(w.en) ? "" : "."}`;
  const ens = list.map((x) => x.en);
  const zhs = list.map((x) => x.zh);
  const py = pinyin(w.zh);

  switch (kind) {
    case "zh-en":
      return {
        id: id("zh-en"),
        type: "mcq",
        prompt: `What does ${w.zh} mean?`,
        answer: w.en,
        wrong: wrongFrom(rng, ens, w.en, n),
        hint: `[[${py}]]`,
        explain,
      };
    case "en-zh":
      return {
        id: id("en-zh"),
        type: "mcq",
        prompt: `How do you say **${w.en}** in Mandarin?`,
        answer: w.zh,
        wrong: wrongFrom(rng, zhs, w.zh, n, w.alt),
        hint: opts.hint?.(w),
        explain,
      };
    case "listen":
      return {
        id: id("listen"),
        type: "mcq",
        prompt: "Tap the speaker and listen. What does it mean?",
        say: w.zh,
        answer: w.en,
        wrong: wrongFrom(rng, ens, w.en, n),
        explain,
      };
    case "picture":
      return {
        id: id("picture"),
        type: "mcq",
        prompt: "Which one goes with the picture?",
        figure: { id: "emoji", value: w.emoji! },
        answer: w.zh,
        wrong: wrongFrom(rng, zhs, w.zh, n, w.alt),
        explain,
      };
    case "pinyin": {
      // Same syllables with the wrong tone, and sometimes another word.
      const other = pinyin(pickOne(rng, list.filter((x) => x !== w)).zh);
      const wrong = distinct([...retone(py, rng, 2), other, ...retone(py, rng, 3)], py);
      return { id: id("pinyin"), type: "mcq", prompt: `Which is the pinyin for ${w.zh}?`, answer: py, wrong, explain: `${w.zh} = [[${py}]]` };
    }
    case "type-pinyin":
      return {
        id: id("type-pinyin"),
        type: "typed",
        pinyin: true,
        prompt: `Type the pinyin for ${w.zh}. You can leave out the tone marks.`,
        answer: py,
        explain: `${w.zh} = [[${py}]]`,
      };
    case "build":
      return build(w.en, w.zh, explain);
    case "write":
      return selfcheck(w.en, w.zh);
  }
}

/** "What comes after…?" and "Which one is missing?" for days and months. */
export function sequenceQuestion(list: Word[], noun: string, difficulty: Difficulty, rng: Rng): Question {
  const n = choices(difficulty);
  const zhs = list.map((w) => w.zh);
  if (rng() < 0.5) {
    const i = randInt(rng, 0, list.length - 2);
    const answer = list[i + 1].zh;
    return {
      id: id("seq-next"),
      type: "mcq",
      prompt: `Which ${noun} comes after ${list[i].zh}?`,
      answer,
      wrong: wrongFrom(rng, zhs, answer, n),
      explain: `${list[i].zh} (${list[i].en}), then ${answer} (${list[i + 1].en}).`,
    };
  }
  const len = Math.min(list.length, difficulty === "easy" ? 4 : 5);
  const start = randInt(rng, 0, list.length - len);
  const run = list.slice(start, start + len);
  const gap = randInt(rng, 1, run.length - 2);
  const answer = run[gap].zh;
  return {
    id: id("seq-missing"),
    type: "mcq",
    prompt: `Which ${noun} is missing?\n${run.map((w, i) => (i === gap ? "___" : w.zh)).join("、")}`,
    answer,
    wrong: wrongFrom(rng, zhs, answer, n),
    explain: `${run[gap - 1].zh}, **${answer}**, ${run[gap + 1].zh}. ${answer} means ${run[gap].en}.`,
  };
}

/* ---------- Days ---------- */

/** "今天星期三。明天星期几？" */
export function relativeDayQuestion(days: Word[], difficulty: Difficulty, rng: Rng): Question {
  const i = randInt(rng, 0, 6);
  const tomorrow = rng() < 0.6;
  const j = (i + (tomorrow ? 1 : 6)) % 7;
  const which = tomorrow ? "明天" : "昨天";
  const whichEn = tomorrow ? "tomorrow" : "yesterday";
  const answer = days[j].zh;
  return {
    id: id("day-relative"),
    type: "mcq",
    prompt: `今天${days[i].zh}。${which}星期几？`,
    answer,
    wrong: wrongFrom(rng, days.map((d) => d.zh), answer, choices(difficulty), days[j].alt),
    hint: `Today is ${days[i].en}. What day is ${whichEn}?`,
    explain: `Today (今天) is ${days[i].en}, so ${whichEn} (${which}) is ${days[j].en}: ${answer}.`,
  };
}

/* ---------- Numbers ---------- */

/** Numbers that are easy to mix up with n: ±1, ±10, swapped digits (13 / 31), 3 / 30. */
function confusables(n: number, lo: number, hi: number, rng: Rng, count = 3): number[] {
  const ones = n % 10;
  const tens = Math.floor(n / 10);
  const near = [n - 1, n + 1, n - 10, n + 10, n >= 10 && ones ? ones * 10 + tens : 0, n < 10 ? n * 10 : 0, ones === 0 ? tens : 0, n + 2, n - 2];
  const ok = (m: number) => m >= lo && m <= hi && m !== n;
  const out = [...new Set(shuffle(rng, near.filter(ok)))].slice(0, count);
  while (out.length < count) {
    const m = randInt(rng, lo, hi);
    if (ok(m) && !out.includes(m)) out.push(m);
  }
  return out;
}

/** How a number is built: 23 → 二十 (20) + 三 (3). */
export function numberParts(n: number): string {
  if (n <= 10) return `${zhNumber(n)} = ${n}`;
  const tens = Math.floor(n / 10) * 10;
  const ones = n % 10;
  if (!ones) return `${zhNumber(n / 10)} × 十 = ${n}`;
  return `${zhNumber(tens)} (${tens}) + ${zhNumber(ones)} (${ones}) = ${n}`;
}

/* ---------- Dates ---------- */

export function dateQuestion(_grade: Grade, difficulty: Difficulty, rng: Rng): Question {
  const d = difficulty === "easy" ? randInt(rng, 1, 15) : difficulty === "medium" ? randInt(rng, 1, 31) : randInt(rng, rng() < 0.7 ? 11 : 1, 31);
  const zh = dateZh(d);
  const en = `the ${ordinal(d)}`;
  const explain = `${zh} = **${en}**. ${numberParts(d)}`;
  const kinds = ["read", "write", "listen", "sentence"];
  let kind = pickOne(rng, kinds);
  if (difficulty !== "easy" && rng() < 0.15) kind = "build";
  if (difficulty === "hard" && rng() < 0.12) kind = "paper";
  const n = choices(difficulty);

  switch (kind) {
    case "read":
      return {
        id: id("date-read"),
        type: "mcq",
        prompt: `What date is ${zh}?`,
        answer: en,
        wrong: confusables(d, 1, 31, rng, n).map((m) => `the ${ordinal(m)}`),
        hint: "十 is 10. 二十 is 2 tens: 20.",
        explain,
      };
    case "write": {
      // Swapped digits (七十 for 17) are a trap even past 31; 月 instead of 号 is another.
      const wrong = distinct([...(d <= 12 && rng() < 0.5 ? [monthZh(d)] : []), ...confusables(d, 1, 99, rng, 3).map(dateZh)], zh, n);
      return { id: id("date-write"), type: "mcq", prompt: `How do you write **${en}** in Chinese?`, answer: zh, wrong, hint: d > 10 ? numberParts(d) : undefined, explain };
    }
    case "listen":
      return {
        id: id("date-listen"),
        type: "typed",
        numeric: true,
        prompt: "Tap the speaker and listen. What date do you hear? Type the number.",
        say: zh,
        answer: String(d),
        explain,
      };
    case "sentence": {
      const answer = `今天${zh}。`;
      const other = confusables(d, 1, 31, rng, 1)[0];
      const wrong = distinct(shuffle(rng, [d <= 12 ? `今天${monthZh(d)}。` : `今天${dateZh(other)}。`, `明天${zh}。`, d <= 6 ? `今天星期${zhNumber(d)}。` : `昨天${zh}。`]), answer, n);
      return {
        id: id("date-sentence"),
        type: "mcq",
        prompt: `How do you say **Today is the ${ordinal(d)}.**?`,
        answer,
        wrong,
        hint: "Today is 今天. Dates end in 号.",
        explain: `${answer} = Today is ${en}.`,
      };
    }
    case "build":
      return build(en, zh, explain);
    default:
      return selfcheck(en, zh);
  }
}

/* ---------- Months ---------- */

const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export function monthQuestion(_grade: Grade, difficulty: Difficulty, rng: Rng): Question {
  const m = randInt(rng, 1, 12);
  const zh = monthZh(m);
  const en = MONTHS_EN[m - 1];
  const n = choices(difficulty);
  const monthsZh = Array.from({ length: 12 }, (_, i) => monthZh(i + 1));
  const near = confusables(m, 1, 12, rng, 3);
  const explain = `${zh} = **${en}**: month number ${m}.`;
  const kinds = ["read", "write", "listen", "next"];
  if (difficulty !== "easy") kinds.push("date-read", "date-read");
  if (difficulty === "hard") kinds.push("date-write");
  let kind = pickOne(rng, kinds);
  if (difficulty === "hard" && rng() < 0.12) kind = rng() < 0.5 ? "build" : "paper";

  const d = randInt(rng, 1, DAYS_IN_MONTH[m - 1]);
  const full = `${zh}${dateZh(d)}`;
  const fullEn = `${en} ${d}`;
  const fullExplain = `${full} = **${fullEn}**. The month (月) comes first, then the date (号).`;

  switch (kind) {
    case "read":
      return { id: id("month-read"), type: "mcq", prompt: `Which month is ${zh}?`, answer: en, wrong: near.slice(0, n).map((x) => MONTHS_EN[x - 1]), hint: `${zhNumber(m)} = ${m}`, explain };
    case "write": {
      const wrong = distinct([...near.map(monthZh), rng() < 0.4 ? dateZh(m) : ""], zh, n);
      return { id: id("month-write"), type: "mcq", prompt: `How do you write **${en}** in Chinese?`, answer: zh, wrong, hint: `${en} is month number ${m}.`, explain };
    }
    case "listen":
      return {
        id: id("month-listen"),
        type: "mcq",
        prompt: "Tap the speaker and listen. Which month is it?",
        say: zh,
        answer: en,
        wrong: near.slice(0, n).map((x) => MONTHS_EN[x - 1]),
        explain,
      };
    case "next": {
      const answer = monthZh((m % 12) + 1);
      return {
        id: id("month-next"),
        type: "mcq",
        prompt: `Which month comes after ${zh}?`,
        answer,
        wrong: wrongFrom(rng, monthsZh, answer, n),
        explain: `${zh} (${en}), then ${answer} (${MONTHS_EN[m % 12]}).`,
      };
    }
    case "date-read": {
      const wrong = distinct(
        shuffle(rng, [
          d <= 12 && d !== m ? `${MONTHS_EN[d - 1]} ${m}` : "",
          `${MONTHS_EN[near[0] - 1]} ${d}`,
          `${en} ${confusables(d, 1, DAYS_IN_MONTH[m - 1], rng, 1)[0]}`,
          `${MONTHS_EN[near[1] - 1]} ${d}`,
        ]),
        fullEn,
        n,
      );
      return { id: id("full-read"), type: "mcq", prompt: `What date is ${full}?`, answer: fullEn, wrong, explain: fullExplain };
    }
    case "date-write": {
      const wrong = distinct(
        shuffle(rng, [`${dateZh(d)}${zh}`, d <= 12 && d !== m ? `${monthZh(d)}${dateZh(m)}` : "", `${zh}${dateZh(confusables(d, 1, DAYS_IN_MONTH[m - 1], rng, 1)[0])}`, `${monthZh(near[0])}${dateZh(d)}`]),
        full,
        n,
      );
      return { id: id("full-write"), type: "mcq", prompt: `How do you write **${fullEn}** in Chinese?`, answer: full, wrong, explain: fullExplain };
    }
    case "build":
      return build(fullEn, full, fullExplain);
    default:
      return selfcheck(en, zh);
  }
}

/* ---------- Years ---------- */

export const FIRST_YEAR = 2016;
export const LAST_YEAR = 2027;

export function yearQuestion(_grade: Grade, difficulty: Difficulty, rng: Rng): Question {
  const y = randInt(rng, FIRST_YEAR, LAST_YEAR);
  const zh = yearZh(y);
  const n = choices(difficulty);
  const near = confusables(y, FIRST_YEAR, LAST_YEAR, rng, 3);
  const explain = `${zh} = **${y}**. Read it one digit at a time: 〇 is zero.`;
  let kind = pickOne(rng, ["read", "write", "listen", "relative", "relative"]);
  if (difficulty !== "easy" && rng() < 0.15) kind = "build";
  if (difficulty === "hard" && rng() < 0.12) kind = "paper";

  switch (kind) {
    case "read":
      return { id: id("year-read"), type: "mcq", prompt: `What year is ${zh}?`, answer: String(y), wrong: near.slice(0, n).map(String), hint: "Read it one digit at a time.", explain };
    case "write": {
      // Swapped last digits (二〇六二年 for 2026) are a good trap.
      const swapped = Number(String(y).slice(0, 2) + String(y)[3] + String(y)[2]);
      const wrong = distinct([...(rng() < 0.5 && swapped !== y ? [yearZh(swapped)] : []), ...near.map(yearZh)], zh, n);
      return { id: id("year-write"), type: "mcq", prompt: `How do you write **${y}** in Chinese?`, answer: zh, wrong, hint: "Say each digit: 2 0 2 6 → 二〇二六.", explain };
    }
    case "listen":
      return {
        id: id("year-listen"),
        type: "typed",
        numeric: true,
        prompt: "Tap the speaker and listen. What year do you hear? Type the number.",
        say: zh,
        answer: String(y),
        explain,
      };
    case "relative": {
      // 今年 is never the first or last year, so last and next year stay in range.
      const now = randInt(rng, FIRST_YEAR + 1, LAST_YEAR - 1);
      const next = rng() < 0.5;
      const which = next ? "明年" : "去年";
      const target = now + (next ? 1 : -1);
      const answer = yearZh(target);
      const wrong = distinct(shuffle(rng, [yearZh(now), yearZh(now + (next ? -1 : 1)), yearZh(target + (next ? 1 : -1)), yearZh(target + 10 <= LAST_YEAR ? target + 10 : target - 10)]), answer, n);
      return {
        id: id("year-relative"),
        type: "mcq",
        prompt: `今年${yearZh(now)}。Which year is ${which}?`,
        answer,
        wrong,
        hint: "今年 is this year. 明年 is next year. 去年 is last year.",
        explain: `This year (今年) is ${now}, so ${next ? "next year (明年)" : "last year (去年)"} is ${target}: ${answer}.`,
      };
    }
    case "build":
      return build(String(y), zh, explain);
    default:
      return selfcheck(String(y), zh);
  }
}

/* ---------- Time ---------- */

/** Times that are easy to mix up: the other half hour, an hour off, 2 / 12, 1 / 11 / 10. */
function nearTimes(h: number, half: boolean, rng: Rng): [number, boolean][] {
  const list: [number, boolean][] = [
    [h, !half],
    [h + 1, half],
    [h - 1, half],
    [h === 2 ? 12 : h === 12 ? 2 : h === 1 ? 11 : h === 11 ? 1 : h + 2, half],
    [h === 10 ? 1 : h === 1 ? 10 : h - 2, !half],
  ];
  const seen = new Set<string>();
  return shuffle(rng, list).filter(([x, hf]) => {
    const k = `${x}${hf}`;
    if (x < 1 || x > 12 || (x === h && hf === half) || seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

export function timeQuestion(_grade: Grade, difficulty: Difficulty, rng: Rng): Question {
  const h = randInt(rng, 1, 12);
  const half = rng() < 0.5;
  const zh = timeZh(h, half);
  const en = timeEn(h, half);
  const n = choices(difficulty);
  const near = nearTimes(h, half, rng);
  const explain = `${zh} = **${en}**.${half ? " 半 means half past." : ""}${h === 2 ? " 2 o'clock is 两点, not 二点." : ""}`;
  // 二点 is a common mistake, so it is often one of the choices.
  const nearZh = [...(h === 2 && rng() < 0.7 ? [`二点${half ? "半" : ""}`] : []), ...near.map(([x, hf]) => timeZh(x, hf))];
  let kind = pickOne(rng, ["clock", "clock", "read", "listen", "write"]);
  if (difficulty !== "easy" && rng() < 0.12) kind = "build";
  if (difficulty === "hard" && rng() < 0.12) kind = "paper";

  switch (kind) {
    case "clock":
      return {
        id: id("time-clock"),
        type: "mcq",
        prompt: "现在几点了？\nWhat time is it?",
        figure: { id: "clock", hour: h, half },
        answer: zh,
        wrong: distinct(nearZh, zh, n),
        hint: half ? "The long hand points to 6: half past (半)." : "The long hand points to 12: o'clock (点).",
        explain,
      };
    case "read":
      return { id: id("time-read"), type: "mcq", prompt: `What time is ${zh}?`, answer: en, wrong: near.slice(0, n).map(([x, hf]) => timeEn(x, hf)), explain };
    case "listen":
      return {
        id: id("time-listen"),
        type: "mcq",
        prompt: "Tap the speaker and listen. What time is it?",
        say: zh,
        answer: en,
        wrong: near.slice(0, n).map(([x, hf]) => timeEn(x, hf)),
        explain,
      };
    case "write":
      return {
        id: id("time-write"),
        type: "mcq",
        prompt: `How do you say **${en}** in Mandarin?`,
        answer: zh,
        wrong: distinct(nearZh, zh, n),
        hint: half ? "Half past is 半." : "O'clock is 点.",
        explain,
      };
    case "build":
      return build(en, zh, explain);
    default:
      return selfcheck(en, zh);
  }
}

/* ---------- Pinyin: tones, initials and finals ---------- */

export const TONE_NAMES = ["light tone (no mark)", "1st tone: flat ˉ", "2nd tone: rising ˊ", "3rd tone: dip ˇ", "4th tone: falling ˋ"];

/** Single characters from the sheet whose tone is clear when said alone. */
export const TONE_CHARS = [..."天星期三今中吃书家八妈明十年学回床玩同麻五九几点早晚好起喜马四六号月去半上下睡看饭二骂"];

/** Initials that sound alike. */
const INITIAL_PAIRS = [["b", "p", "d"], ["d", "t", "b"], ["n", "l", "m"], ["g", "k", "h"], ["j", "q", "x"], ["zh", "z", "j"], ["ch", "c", "q"], ["sh", "s", "x"], ["f", "h", "p"]];
/** Finals that look or sound alike. */
const FINAL_PAIRS = [["an", "ang", "en"], ["en", "eng", "in"], ["in", "ing", "en"], ["ong", "ang", "ing"], ["ao", "ou", "a"], ["ui", "iu", "ei"], ["i", "ie", "ei"], ["u", "ou", "ü"], ["a", "ai", "ao"], ["er", "e", "ei"]];

/** Syllables you can cleanly split into one of the taught initials and finals. */
export function splittable(py: string) {
  const { initial, final } = splitSyllable(py);
  if (!FINALS.includes(final) || initial === "y" || initial === "w") return false;
  if (["j", "q", "x"].includes(initial) && final.startsWith("u")) return false; // ju, qu, xu hide a ü
  if (["zh", "ch", "sh", "r", "z", "c", "s"].includes(initial) && final === "i") return false; // zhi, shi, si… are whole syllables
  return true;
}

function similar(groups: string[][], x: string, all: string[], rng: Rng) {
  const like = groups.filter((g) => g.includes(x)).flat();
  return distinct([...shuffle(rng, like), ...shuffle(rng, all)], x, 3);
}

export function pinyinQuestion(_grade: Grade, difficulty: Difficulty, rng: Rng): Question {
  const ch = pickOne(rng, TONE_CHARS);
  const py = pinyin(ch);
  const tone = toneOf(py);
  const n = choices(difficulty);
  const toneChoices = () => shuffle(rng, [1, 2, 3, 4].filter((t) => t !== tone)).slice(0, n).map((t) => TONE_NAMES[t]);
  const kinds = ["mark", "hear", "hear-pinyin"];
  if (difficulty !== "easy") kinds.push("initial", "final");
  const kind = pickOne(rng, kinds);

  switch (kind) {
    case "mark":
      return {
        id: id("tone-mark"),
        type: "mcq",
        prompt: `Which tone is [[${py}]]?`,
        answer: TONE_NAMES[tone],
        wrong: toneChoices(),
        hint: "ˉ flat is 1st, ˊ up is 2nd, ˇ down-and-up is 3rd, ˋ down is 4th.",
        explain: `[[${py}]] (${ch}) has the ${TONE_NAMES[tone].split(": ")[0]}.`,
      };
    case "hear":
      return {
        id: id("tone-hear"),
        type: "mcq",
        prompt: "Tap the speaker and listen. Which tone do you hear?",
        say: ch,
        answer: TONE_NAMES[tone],
        wrong: toneChoices(),
        explain: `${ch} is [[${py}]]: ${TONE_NAMES[tone]}.`,
      };
    case "hear-pinyin":
      return {
        id: id("tone-pinyin"),
        type: "mcq",
        prompt: "Tap the speaker and listen. Which pinyin do you hear?",
        say: ch,
        answer: py,
        wrong: shuffle(rng, ([1, 2, 3, 4] as Tone[]).filter((t) => t !== tone).map((t) => withTone(py, t))).slice(0, n),
        explain: `${ch} = [[${py}]]`,
      };
    default: {
      // Initial or final: pick a syllable that splits cleanly.
      const pool = TONE_CHARS.filter((c) => splittable(pinyin(c)));
      const c = pickOne(rng, pool);
      const p = pinyin(c);
      const { initial, final } = splitSyllable(p);
      if (kind === "initial" && initial) {
        return {
          id: id("initial"),
          type: "mcq",
          prompt: `What is the initial in [[${p}]]?`,
          answer: initial,
          wrong: similar(INITIAL_PAIRS, initial, ["b", "p", "m", "f", "d", "t", "n", "l", "g", "k", "h", "j", "q", "x", "zh", "ch", "sh", "z", "c", "s"], rng).slice(0, n),
          hint: "The initial is the sound at the start.",
          explain: `[[${p}]] = ${initial} + ${final}`,
        };
      }
      return {
        id: id("final"),
        type: "mcq",
        prompt: `What is the final in [[${p}]]?`,
        answer: final,
        wrong: similar(FINAL_PAIRS, final, FINALS, rng).slice(0, n),
        hint: "The final is the part after the initial. Leave out the tone mark.",
        explain: initial ? `[[${p}]] = ${initial} + ${final}` : `[[${p}]] has no initial: it is just the final ${final}.`,
      };
    }
  }
}

import type { Difficulty, Grade, Question, Rng } from "@/content/types";
import { pickOne, randInt } from "../random";

const fmt = (n: number) => n.toLocaleString("en-CA");
let counter = 0;
const id = (kind: string) => `gen-${kind}-${++counter}`;

/** Easy gets buttons; Medium mixes; Hard types the answer. */
function ask(
  rng: Rng,
  difficulty: Difficulty,
  prompt: string,
  answer: number,
  wrong: number[],
  extra: Partial<Question> = {},
): Question {
  const useTyped = difficulty === "hard" || (difficulty === "medium" && rng() < 0.5);
  if (useTyped) {
    return { id: id("typed"), type: "typed", prompt, answer: String(answer), numeric: true, ...extra } as Question;
  }
  const uniqueWrong = [...new Set(wrong.filter((w) => w !== answer && w >= 0))].map(fmt);
  return { id: id("mcq"), type: "mcq", prompt, answer: fmt(answer), wrong: uniqueWrong, ...extra } as Question;
}

export function roundTo(n: number, place: number) {
  return Math.round(n / place) * place;
}

export function frontEnd(n: number) {
  const place = 10 ** (String(n).length - 1);
  return Math.floor(n / place) * place;
}

const placeName: Record<number, string> = { 10: "ten", 100: "hundred", 1000: "thousand", 10000: "ten thousand" };

/* ---------- Rounding ---------- */
export function rounding(grade: Grade, difficulty: Difficulty, rng: Rng): Question {
  const options: [number, number, number][] =
    grade === 3
      ? { easy: [[10, 99, 10]], medium: [[100, 999, 10], [100, 999, 100]], hard: [[1000, 9999, 10], [1000, 9999, 100], [1000, 9999, 1000]] }[difficulty] as [number, number, number][]
      : { easy: [[100, 999, 10], [100, 999, 100]], medium: [[1000, 9999, 100], [1000, 9999, 1000]], hard: [[10000, 99999, 100], [10000, 99999, 1000], [10000, 99999, 10000]] }[difficulty] as [number, number, number][];
  const [min, max, place] = pickOne(rng, options);
  let n = randInt(rng, min, max);
  if (n % place === 0) n += randInt(rng, 1, place - 1);
  const answer = roundTo(n, place);
  const down = Math.floor(n / place) * place;
  const up = down + place;
  return ask(rng, difficulty, `Round ${fmt(n)} to the nearest ${placeName[place]}.`, answer, [down === answer ? up : down, roundTo(n, place * 10) || place, answer + place * 2], {
    hint: `Look at the digit to the right of the ${placeName[place]}s place. 5 or more → round up. 4 or less → round down.`,
    explain: `${fmt(n)} is between ${fmt(down)} and ${fmt(up)}. It is closer to ${fmt(answer)}.`,
  });
}

/* ---------- Front-end estimation ---------- */
export function frontEndEstimation(grade: Grade, difficulty: Difficulty, rng: Rng): Question {
  const digits = grade === 3 ? { easy: 2, medium: 3, hard: 4 }[difficulty] : { easy: 3, medium: 4, hard: 5 }[difficulty];
  const lo = 10 ** (digits - 1);
  const subtract = difficulty !== "easy" && rng() < 0.4;
  let a = randInt(rng, lo, lo * 10 - 1);
  let b = randInt(rng, lo, lo * 10 - 1);
  if (subtract && b > a) [a, b] = [b, a];
  if (subtract && frontEnd(a) === frontEnd(b)) a = Math.min(a + lo, lo * 10 - 1);
  const fa = frontEnd(a);
  const fb = frontEnd(b);
  const answer = subtract ? fa - fb : fa + fb;
  const exact = subtract ? a - b : a + b;
  const op = subtract ? "−" : "+";
  return ask(rng, difficulty, `Use front-end estimation: ${fmt(a)} ${op} ${fmt(b)} ≈ ?`, answer, [roundTo(exact, lo), answer + lo, Math.abs(answer - lo), exact], {
    hint: "Keep the first digit of each number and change the rest to zeros. Then add or subtract.",
    explain: `${fmt(a)} → ${fmt(fa)} and ${fmt(b)} → ${fmt(fb)}. ${fmt(fa)} ${op} ${fmt(fb)} = ${fmt(answer)}.`,
  });
}

/* ---------- Place value & comparing ---------- */
export function placeValue(grade: Grade, difficulty: Difficulty, rng: Rng): Question {
  const max = grade === 3 ? 9999 : 99999;
  const min = grade === 3 ? (difficulty === "easy" ? 100 : 1000) : difficulty === "easy" ? 1000 : 10000;
  const kind = pickOne(rng, difficulty === "easy" ? ["value", "compare"] : ["value", "compare", "expanded", "standard"]);

  if (kind === "compare") {
    if (grade === 4 && difficulty !== "easy" && rng() < 0.5) {
      // Decimals (Grade 4)
      const whole = randInt(rng, 0, 99);
      const a = whole + randInt(rng, 1, 99) / 100;
      let b = whole + randInt(rng, 1, 9) / 10;
      if (Math.abs(a - b) < 1e-9) b = b + 0.1;
      const sym = a > b ? ">" : a < b ? "<" : "=";
      return {
        id: id("cmp"),
        type: "mcq",
        prompt: `Which sign makes this true?  ${a.toFixed(2)}  ☐  ${b.toFixed(1)}`,
        answer: sym,
        wrong: [">", "<", "="].filter((s) => s !== sym),
        hint: "Line up the decimal points. Compare tenths first, then hundredths.",
        explain: `${b.toFixed(1)} is the same as ${b.toFixed(2)}. So ${a.toFixed(2)} ${sym} ${b.toFixed(2)}.`,
      };
    }
    const a = randInt(rng, min, max);
    // Make close numbers so place value matters.
    const swapPlace = 10 ** randInt(rng, 0, String(a).length - 2);
    let b = a + (rng() < 0.5 ? 1 : -1) * swapPlace * randInt(rng, 1, 3);
    if (rng() < 0.15) b = a;
    b = Math.max(min, Math.min(max, b));
    const sym = a > b ? ">" : a < b ? "<" : "=";
    return {
      id: id("cmp"),
      type: "mcq",
      prompt: `Which sign makes this true?  ${fmt(a)}  ☐  ${fmt(b)}`,
      answer: sym,
      wrong: [">", "<", "="].filter((s) => s !== sym),
      hint: "Start from the left. Compare the biggest place first.",
      explain: `${fmt(a)} ${sym} ${fmt(b)}. ( > means "greater than", < means "less than".)`,
    };
  }

  const n = randInt(rng, min, max);
  const digits = String(n).split("").map(Number);
  const places = digits.map((_, i) => 10 ** (digits.length - 1 - i));

  if (kind === "value") {
    let i = randInt(rng, 0, digits.length - 1);
    if (digits[i] === 0) i = 0;
    const value = digits[i] * places[i];
    return ask(rng, difficulty, `What is the value of the digit ${digits[i]} in ${fmt(n)}?`, value, [digits[i], value * 10, value / 10, digits[i] * (places[i - 1] ?? 1)].filter(Number.isInteger), {
      hint: "Think: ones, tens, hundreds, thousands, ten thousands.",
      explain: `The ${digits[i]} is in the ${placeName[places[i]] ?? "one"}s place, so it is worth ${fmt(value)}.`,
    });
  }

  const parts = digits.map((d, i) => d * places[i]).filter((v) => v > 0);
  if (kind === "expanded") {
    const answer = parts.map(fmt).join(" + ");
    const shifted = parts.map((p) => fmt(p * 10)).join(" + ");
    const digitsOnly = digits.filter((d) => d > 0).join(" + ");
    const swapped = parts.length > 1 ? [...parts.slice(0, -2), parts[parts.length - 1] * 10, parts[parts.length - 2] / 10].map(fmt).join(" + ") : fmt(n * 10);
    return {
      id: id("exp"),
      type: "mcq",
      prompt: `Which is ${fmt(n)} in expanded form?`,
      answer,
      wrong: [...new Set([shifted, digitsOnly, swapped])].filter((w) => w !== answer),
      explain: `${fmt(n)} = ${answer}`,
    };
  }
  return {
    id: id("std"),
    type: "typed",
    numeric: true,
    prompt: `Write this number in standard form: ${parts.map(fmt).join(" + ")}`,
    answer: String(n),
    explain: `${parts.map(fmt).join(" + ")} = ${fmt(n)}`,
  };
}

/* ---------- Operations ---------- */
function addSub(grade: Grade, difficulty: Difficulty, rng: Rng, op: "+" | "−"): Question {
  const digits = grade === 3 ? { easy: 2, medium: 3, hard: 4 }[difficulty] : { easy: 3, medium: 4, hard: 5 }[difficulty];
  const cap = grade === 3 ? 10000 : 100000;
  const lo = 10 ** (digits - 1);
  let a = randInt(rng, lo, lo * 10 - 1);
  let b = randInt(rng, lo, lo * 10 - 1);
  if (op === "+") {
    while (a + b > cap) b = Math.floor(b / 2);
  } else if (b > a) {
    [a, b] = [b, a];
  }
  const answer = op === "+" ? a + b : a - b;
  const story = difficulty !== "easy" && rng() < 0.35;
  const prompt = story
    ? op === "+"
      ? pickOne(rng, [
          `A library has ${fmt(a)} books. It gets ${fmt(b)} more. How many books now?`,
          `${fmt(a)} people came on Saturday and ${fmt(b)} came on Sunday. How many people in all?`,
        ])
      : pickOne(rng, [
          `A farm had ${fmt(a)} apples. They sold ${fmt(b)}. How many are left?`,
          `A school wants to collect ${fmt(a)} cans. They have ${fmt(b)}. How many more do they need?`,
        ])
    : `${fmt(a)} ${op} ${fmt(b)} = ?`;
  return ask(rng, difficulty, prompt, answer, [answer + 10, answer - 10, answer + 100, answer - 1, answer + 1], {
    hint: op === "+" ? "Line up the place values. Add the ones first, and regroup if you get 10 or more." : "Line up the place values. Subtract the ones first. Borrow (regroup) if the top digit is smaller.",
    explain: `${fmt(a)} ${op} ${fmt(b)} = ${fmt(answer)}`,
  });
}

export const addition = (g: Grade, d: Difficulty, r: Rng) => addSub(g, d, r, "+");
export const subtraction = (g: Grade, d: Difficulty, r: Rng) => addSub(g, d, r, "−");

export function multiplication(grade: Grade, difficulty: Difficulty, rng: Rng): Question {
  let a: number, b: number;
  if (grade === 3) {
    if (difficulty === "easy") [a, b] = [randInt(rng, 1, 5), randInt(rng, 1, 10)];
    else if (difficulty === "medium") [a, b] = [randInt(rng, 2, 10), randInt(rng, 2, 10)];
    else [a, b] = [randInt(rng, 11, 99), randInt(rng, 2, 9)];
    while (a * b > 1000) a = Math.floor(a / 2);
  } else {
    if (difficulty === "easy") [a, b] = [randInt(rng, 2, 12), randInt(rng, 2, 10)];
    else if (difficulty === "medium") [a, b] = [randInt(rng, 11, 99), randInt(rng, 2, 9)];
    else [a, b] = rng() < 0.5 ? [randInt(rng, 100, 999), randInt(rng, 2, 9)] : [randInt(rng, 11, 99), randInt(rng, 11, 99)];
  }
  const answer = a * b;
  const story = difficulty !== "easy" && rng() < 0.3;
  const prompt = story
    ? pickOne(rng, [
        `There are ${a} boxes with ${b} crayons in each box. How many crayons in all?`,
        `Each of ${b} buses carries ${a} students. How many students is that?`,
      ])
    : `${a} × ${b} = ?`;
  return ask(rng, difficulty, prompt, answer, [answer + a, answer - b, a + b, answer + 10], {
    hint: `${a} × ${b} means ${b} groups of ${a}. Skip count by ${a}!`,
    explain: `${a} × ${b} = ${fmt(answer)}`,
  });
}

export function division(grade: Grade, difficulty: Difficulty, rng: Rng): Question {
  let divisor: number, quotient: number;
  if (grade === 3) {
    divisor = difficulty === "easy" ? randInt(rng, 1, 5) : randInt(rng, 2, 10);
    quotient = difficulty === "hard" ? randInt(rng, 2, 12) : randInt(rng, 1, 10);
  } else {
    divisor = difficulty === "easy" ? randInt(rng, 2, 10) : randInt(rng, 2, 9);
    quotient = { easy: randInt(rng, 2, 12), medium: randInt(rng, 11, 50), hard: randInt(rng, 20, 150) }[difficulty];
  }
  const total = divisor * quotient;
  const story = difficulty !== "easy" && rng() < 0.35;
  const prompt = story
    ? pickOne(rng, [
        `${total} cookies are shared equally by ${divisor} friends. How many does each friend get?`,
        `${total} chairs are put in ${divisor} equal rows. How many chairs in each row?`,
      ])
    : `${total} ÷ ${divisor} = ?`;
  return ask(rng, difficulty, prompt, quotient, [quotient + 1, quotient - 1, quotient + 2, divisor], {
    hint: `Think: ${divisor} × ? = ${total}`,
    explain: `${divisor} × ${quotient} = ${total}, so ${total} ÷ ${divisor} = ${quotient}.`,
  });
}

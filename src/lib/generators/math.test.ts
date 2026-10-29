import { describe, expect, it } from "vitest";
import { DIFFICULTIES, GRADES, type Question } from "@/content/types";
import { seeded } from "../random";
import { addition, division, frontEnd, frontEndEstimation, multiplication, placeValue, roundTo, rounding, subtraction } from "./math";

const num = (s: string) => Number(s.replace(/,/g, ""));
const answerOf = (q: Question) => {
  if (q.type === "mcq") return q.answer;
  if (q.type === "typed") return [q.answer].flat()[0];
  throw new Error(`unexpected type ${q.type}`);
};

function sweep(fn: (q: Question, grade: 3 | 4) => void, gen: typeof rounding) {
  for (const grade of GRADES)
    for (const difficulty of DIFFICULTIES)
      for (let seed = 0; seed < 400; seed++) {
        const q = gen(grade, difficulty, seeded(seed * 31 + grade));
        if (q.type === "mcq") {
          expect(q.wrong).not.toContain(q.answer);
          expect(q.wrong.length).toBeGreaterThan(0);
        }
        fn(q, grade);
      }
}

describe("math generators", () => {
  it("rounds correctly", () => {
    const places: Record<string, number> = { ten: 10, hundred: 100, thousand: 1000, "ten thousand": 10000 };
    sweep((q, grade) => {
      const m = q.prompt.match(/^Round ([\d,]+) to the nearest (.+)\.$/)!;
      const n = num(m[1]);
      expect(num(answerOf(q))).toBe(roundTo(n, places[m[2]]));
      expect(n).toBeLessThan(grade === 3 ? 10000 : 100000);
    }, rounding);
  });

  it("does front-end estimation correctly", () => {
    sweep((q) => {
      const m = q.prompt.match(/: ([\d,]+) ([+−]) ([\d,]+) ≈/)!;
      const [a, b] = [num(m[1]), num(m[3])];
      const expected = m[2] === "+" ? frontEnd(a) + frontEnd(b) : frontEnd(a) - frontEnd(b);
      expect(num(answerOf(q))).toBe(expected);
    }, frontEndEstimation);
  });

  it("does arithmetic correctly and stays in the grade's range", () => {
    for (const [gen, op] of [
      [addition, "+"],
      [subtraction, "−"],
      [multiplication, "×"],
      [division, "÷"],
    ] as const) {
      sweep((q, grade) => {
        const answer = num(answerOf(q));
        expect(Number.isInteger(answer)).toBe(true);
        expect(answer).toBeGreaterThanOrEqual(0);
        const m = q.prompt.match(/^([\d,]+) [+−×÷] ([\d,]+) = \?$/);
        if (!m) return; // word problem
        const [a, b] = [num(m[1]), num(m[2])];
        const expected = { "+": a + b, "−": a - b, "×": a * b, "÷": a / b }[op];
        expect(answer).toBe(expected);
        if (grade === 3) {
          if (op === "+" || op === "−") expect(Math.max(a, b, answer)).toBeLessThanOrEqual(10000);
          if (op === "×") expect(answer).toBeLessThanOrEqual(1000);
        }
      }, gen);
    }
  });

  it("compares and builds place-value questions correctly", () => {
    sweep((q, grade) => {
      const cmp = q.prompt.match(/true\?\s+([\d,.]+)\s+☐\s+([\d,.]+)$/);
      if (cmp) {
        const [a, b] = [num(cmp[1]), num(cmp[2])];
        expect(answerOf(q)).toBe(a > b ? ">" : a < b ? "<" : "=");
        if (grade === 3) expect(cmp[1]).not.toContain(".");
        return;
      }
      const val = q.prompt.match(/value of the digit (\d) in ([\d,]+)\?/);
      if (val) {
        const digits = val[2].replace(/,/g, "");
        const ans = num(answerOf(q));
        const i = digits.length - String(ans).length;
        expect(digits[i]).toBe(val[1]);
        return;
      }
      const std = q.prompt.match(/standard form: (.+)$/);
      if (std) {
        const sum = std[1].split(" + ").map(num).reduce((x, y) => x + y, 0);
        expect(num(answerOf(q))).toBe(sum);
        return;
      }
      const exp = q.prompt.match(/Which is ([\d,]+) in expanded form\?/)!;
      const sum = answerOf(q).split(" + ").map(num).reduce((x, y) => x + y, 0);
      expect(sum).toBe(num(exp[1]));
    }, placeValue);
  });
});

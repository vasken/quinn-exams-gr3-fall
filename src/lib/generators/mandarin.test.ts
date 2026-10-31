import { describe, expect, it } from "vitest";
import { ACTIONS, DAYS } from "@/content/mandarin";
import { DIFFICULTIES, type Question } from "@/content/types";
import { pinyin, toneOf } from "../mandarin";
import { seeded } from "../random";
import { dateQuestion, monthQuestion, pinyinQuestion, relativeDayQuestion, retone, sequenceQuestion, splittable, TONE_CHARS, timeQuestion, vocabQuestion, yearQuestion } from "./mandarin";

function wellFormed(q: Question) {
  if (q.type === "mcq") {
    expect(q.wrong.length, q.prompt).toBeGreaterThan(0);
    expect(q.wrong, q.prompt).not.toContain(q.answer);
    expect(new Set(q.wrong).size, q.prompt).toBe(q.wrong.length);
  }
  if (q.type === "typed") expect([q.answer].flat().length).toBeGreaterThan(0);
  if (q.type === "order") expect(q.items.length).toBeGreaterThan(1);
}

describe("Mandarin generators", () => {
  it("make well-formed questions at every level", () => {
    const rng = seeded(42);
    for (const d of DIFFICULTIES) {
      for (let i = 0; i < 400; i++) {
        for (const gen of [dateQuestion, monthQuestion, yearQuestion, timeQuestion, pinyinQuestion]) wellFormed(gen(3, d, rng));
        wellFormed(vocabQuestion(DAYS, d, rng, { write: true, build: true }));
        wellFormed(vocabQuestion(ACTIONS, d, rng, { write: true, build: true }));
        wellFormed(sequenceQuestion(DAYS, "day", d, rng));
        wellFormed(relativeDayQuestion(DAYS, d, rng));
      }
    }
  });

  it("never offers 星期日 as a wrong answer for Sunday", () => {
    const rng = seeded(1);
    for (let i = 0; i < 500; i++) {
      const q = vocabQuestion(DAYS, "hard", rng);
      if (q.type === "mcq" && q.answer === "星期天") expect(q.wrong).not.toContain("星期日");
    }
  });

  it("works out tomorrow and yesterday, wrapping round the week", () => {
    const rng = seeded(9);
    for (let i = 0; i < 200; i++) {
      const q = relativeDayQuestion(DAYS, "medium", rng);
      if (q.type !== "mcq") continue;
      const today = DAYS.findIndex((d) => q.prompt.startsWith(`今天${d.zh}`));
      const step = q.prompt.includes("明天") ? 1 : 6;
      expect(q.answer).toBe(DAYS[(today + step) % 7].zh);
    }
  });

  it("changes tones for wrong pinyin", () => {
    const rng = seeded(4);
    for (const w of retone("xīng qī sān", rng)) {
      expect(w).not.toBe("xīng qī sān");
      expect(w.split(" ").length).toBe(3);
    }
  });

  it("uses tone characters with a clear tone", () => {
    for (const ch of TONE_CHARS) expect(toneOf(pinyin(ch)), ch).toBeGreaterThan(0);
    expect(TONE_CHARS.filter((c) => splittable(pinyin(c))).length).toBeGreaterThan(10);
  });
});

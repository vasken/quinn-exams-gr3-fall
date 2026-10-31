import { describe, expect, it } from "vitest";
import { DIFFICULTIES, type Question } from "@/content/types";
import { DAYS, MONTHS } from "@/content/french";
import { seeded } from "../random";
import { numberQuestion, sequenceQuestion, verbQuestion, vocabQuestion } from "./french";

function wellFormed(q: Question) {
  if (q.type === "mcq") {
    expect(q.wrong.length, q.prompt).toBeGreaterThan(0);
    expect(q.wrong, q.prompt).not.toContain(q.answer);
    expect(new Set(q.wrong).size, q.prompt).toBe(q.wrong.length);
  }
  if (q.type === "typed") expect([q.answer].flat().length).toBeGreaterThan(0);
  // Every opened brace is closed.
  for (const text of [q.prompt, q.say ?? "", q.explain ?? ""]) {
    expect(text.split("{").length, text).toBe(text.split("}").length);
  }
}

describe("French generators", () => {
  it("make well-formed questions at every level", () => {
    const rng = seeded(42);
    for (const d of DIFFICULTIES) {
      for (let i = 0; i < 300; i++) {
        wellFormed(numberQuestion(3, d, rng));
        wellFormed(verbQuestion(3, d, rng));
        wellFormed(vocabQuestion(MONTHS, d, rng, { write: true }));
        wellFormed(sequenceQuestion(DAYS, "day", d, rng));
        wellFormed(sequenceQuestion(MONTHS, "month", d, rng));
      }
    }
  });

  it("keeps easy numbers to the ones on the prep sheet", () => {
    const sheet = new Set(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "20", "30", "40", "50", "60", "70", "80", "90", "100"]);
    const rng = seeded(7);
    for (let i = 0; i < 300; i++) {
      const q = numberQuestion(3, "easy", rng);
      if (q.type === "mcq" && /^\d+$/.test(q.answer)) {
        expect(sheet.has(q.answer)).toBe(true);
        for (const w of q.wrong) expect(sheet.has(w), w).toBe(true);
      }
    }
  });

  it("asks for the missing day correctly", () => {
    const rng = seeded(3);
    for (let i = 0; i < 100; i++) {
      const q = sequenceQuestion(DAYS, "day", "medium", rng);
      if (q.type !== "mcq" || !q.prompt.startsWith("Which")) continue;
      const shown = q.prompt.split("\n")[1].replace(/[{}]/g, "").split(", ");
      expect(shown).toContain("___");
      expect(shown).not.toContain(q.answer);
    }
  });
});

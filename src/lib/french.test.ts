import { describe, expect, it } from "vitest";
import { frenchNumber } from "./french";

describe("frenchNumber", () => {
  it("matches the prep sheet", () => {
    const sheet: Record<number, string> = {
      1: "un",
      2: "deux",
      3: "trois",
      4: "quatre",
      5: "cinq",
      6: "six",
      7: "sept",
      8: "huit",
      9: "neuf",
      10: "dix",
      20: "vingt",
      30: "trente",
      40: "quarante",
      50: "cinquante",
      60: "soixante",
      70: "soixante-dix",
      80: "quatre-vingts",
      90: "quatre-vingt-dix",
      100: "cent",
    };
    for (const [n, word] of Object.entries(sheet)) expect(frenchNumber(Number(n))).toBe(word);
  });

  it("handles the tricky ones", () => {
    expect(frenchNumber(17)).toBe("dix-sept");
    expect(frenchNumber(21)).toBe("vingt et un");
    expect(frenchNumber(22)).toBe("vingt-deux");
    expect(frenchNumber(61)).toBe("soixante et un");
    expect(frenchNumber(71)).toBe("soixante et onze");
    expect(frenchNumber(72)).toBe("soixante-douze");
    expect(frenchNumber(77)).toBe("soixante-dix-sept");
    expect(frenchNumber(81)).toBe("quatre-vingt-un");
    expect(frenchNumber(91)).toBe("quatre-vingt-onze");
    expect(frenchNumber(99)).toBe("quatre-vingt-dix-neuf");
  });

  it("gives every number its own word", () => {
    const words = Array.from({ length: 100 }, (_, i) => frenchNumber(i + 1));
    expect(new Set(words).size).toBe(100);
  });

  it("rejects numbers out of range", () => {
    expect(() => frenchNumber(0)).toThrow();
    expect(() => frenchNumber(101)).toThrow();
  });
});

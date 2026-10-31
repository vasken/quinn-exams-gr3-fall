import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { audioKey, audioUrl, type RecordedLang } from "./audio";
import { spokenPhrases } from "./phrases";

describe("recordings", () => {
  for (const lang of ["fr", "zh"] as RecordedLang[]) {
    it(`exist for every ${lang} phrase (run \`npm run audio -- ${lang}\` after changing the text)`, () => {
      // A different sample than the recording script uses, to catch generated phrases it missed.
      const missing = spokenPhrases(lang, 500, 12345).filter((p) => {
        const url = audioUrl(p, lang);
        return !url || !existsSync(join(process.cwd(), "public", url));
      });
      expect(missing).toEqual([]);
    });
  }

  it("names files the same way for the same phrase", () => {
    expect(audioKey("Je suis  en troisième année.")).toBe(audioKey("Je suis en troisième année."));
    expect(audioKey("lundi")).not.toBe(audioKey("mardi"));
  });
});

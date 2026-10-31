import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { audioKey, audioUrl } from "./french-audio";
import { frenchPhrases } from "./french-phrases";

describe("French recordings", () => {
  it("exist for every French phrase (run `npm run audio:french` after changing French text)", () => {
    // A different sample than the recording script uses, to catch generated phrases it missed.
    const missing = frenchPhrases(500, 12345).filter((p) => {
      const url = audioUrl(p);
      return !url || !existsSync(join(process.cwd(), "public", url));
    });
    expect(missing).toEqual([]);
  });

  it("names files the same way for the same phrase", () => {
    expect(audioKey("Je suis  en troisième année.")).toBe(audioKey("Je suis en troisième année."));
    expect(audioKey("lundi")).not.toBe(audioKey("mardi"));
  });
});

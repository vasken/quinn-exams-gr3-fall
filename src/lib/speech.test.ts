import { describe, expect, it } from "vitest";
import { scoreVoice, speechParts } from "./speech";

const v = (name: string, lang: string, voiceURI = name) => ({ name, lang, voiceURI });

describe("speech", () => {
  it("splits English and {French}", () => {
    expect(speechParts("What does {lundi} mean?")).toEqual([
      { lang: "en", text: "What does" },
      { lang: "fr", text: "lundi" },
      { lang: "en", text: "mean?" },
    ]);
  });

  it("reads a French blank as a pause, not the word 'blank'", () => {
    expect(speechParts("{Nous ___ une règle.}")).toEqual([{ lang: "fr", text: "Nous , une règle." }]);
  });

  it("finds Chinese without markers and leaves out [[pinyin]]", () => {
    expect(speechParts("What does 星期三 mean?")).toEqual([
      { lang: "en", text: "What does" },
      { lang: "zh", text: "星期三" },
      { lang: "en", text: "mean?" },
    ]);
    expect(speechParts("Which tone is [[mǎ]]?")).toEqual([{ lang: "en", text: "Which tone is ?" }]);
    expect(speechParts("今天二〇二六年。Which year is 明年?").map((p) => p.lang)).toEqual(["zh", "en", "zh"]);
  });

  it("reads a Chinese blank as a pause", () => {
    expect(speechParts("今天（___）号。")).toEqual([{ lang: "zh", text: "今天，号。" }]);
  });

  it("never picks a Cantonese voice for Mandarin", () => {
    expect(scoreVoice(v("Sinji", "zh-HK"), "zh")).toBe(-Infinity);
    expect(scoreVoice(v("Google 粤語（香港）", "yue-HK"), "zh")).toBe(-Infinity);
    expect(scoreVoice(v("Tingting", "zh-CN"), "zh")).toBeGreaterThan(scoreVoice(v("Meijia", "zh-TW"), "zh"));
    expect(scoreVoice(v("Eddy (Chinese (China mainland))", "zh-CN", "com.apple.eloquence.zh-CN.Eddy"), "zh")).toBeLessThan(0);
  });

  it("prefers good French voices over novelty and compact ones", () => {
    const eddy = v("Eddy (French (Canada))", "fr-CA", "com.apple.eloquence.fr-CA.Eddy");
    const compact = v("Amélie", "fr-CA", "com.apple.voice.compact.fr-CA.Amelie");
    const enhanced = v("Amélie (Enhanced)", "fr-CA", "com.apple.voice.enhanced.fr-CA.Amelie");
    const google = v("Google français", "fr-FR");
    const english = v("Samantha", "en-US");
    const best = (list: ReturnType<typeof v>[]) => [...list].sort((a, b) => scoreVoice(b, "fr") - scoreVoice(a, "fr"))[0];
    expect(best([eddy, compact])).toBe(compact);
    expect(best([eddy, compact, enhanced, google])).toBe(enhanced);
    expect(best([eddy, google, compact])).toBe(google);
    expect(scoreVoice(english, "fr")).toBe(-Infinity);
    expect(scoreVoice(v("Amélie", "fr_CA"), "fr")).toBeGreaterThan(0);
  });
});

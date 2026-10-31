import { describe, expect, it } from "vitest";
import { bare, dateZh, missingPinyin, monthZh, ordinal, pinyin, splitSyllable, timeZh, toneOf, withTone, yearZh, zhNumber } from "./mandarin";

describe("Mandarin numbers", () => {
  it("writes 1–31 the way the prep sheet does", () => {
    expect([1, 10, 11, 15, 20, 23, 30, 31].map(zhNumber)).toEqual(["一", "十", "十一", "十五", "二十", "二十三", "三十", "三十一"]);
    expect(dateZh(17)).toBe("十七号");
    expect(monthZh(12)).toBe("十二月");
  });

  it("reads years digit by digit", () => {
    expect(yearZh(2016)).toBe("二〇一六年");
    expect(yearZh(2020)).toBe("二〇二〇年");
    expect(yearZh(2026)).toBe("二〇二六年");
  });

  it("says 两 for 2 o'clock only", () => {
    expect(timeZh(2, false)).toBe("两点");
    expect(timeZh(2, true)).toBe("两点半");
    expect(timeZh(12, true)).toBe("十二点半");
    expect(timeZh(1, false)).toBe("一点");
  });

  it("makes English ordinals", () => {
    expect([1, 2, 3, 4, 11, 12, 13, 21, 22, 23, 31].map(ordinal)).toEqual(["1st", "2nd", "3rd", "4th", "11th", "12th", "13th", "21st", "22nd", "23rd", "31st"]);
  });
});

describe("pinyin", () => {
  it("matches the prep sheet", () => {
    expect(pinyin("星期天")).toBe("xīng qī tiān");
    expect(pinyin("明天星期几？")).toBe("míng tiān xīng qī jǐ?");
    expect(pinyin("二〇二六年")).toBe("èr líng èr liù nián");
    expect(pinyin("两点半")).toBe("liǎng diǎn bàn");
    expect(pinyin("睡觉")).toBe("shuì jiào");
    expect(pinyin("早上好。")).toBe("zǎo shang hǎo.");
    expect(pinyin("谢谢！")).toBe("xiè xie!");
    expect(pinyin("对不起。")).toBe("duì bù qǐ.");
    expect(pinyin("今天（___）号。")).toBe("jīn tiān (___) hào.");
  });

  it("knows which characters it has no pinyin for", () => {
    expect(missingPinyin("星期一")).toEqual([]);
    expect(missingPinyin("龙")).toEqual(["龙"]);
  });

  it("reads and moves tone marks", () => {
    expect(toneOf("mā")).toBe(1);
    expect(toneOf("jǐ?")).toBe(3);
    expect(toneOf("ma")).toBe(0);
    expect(bare("lǜ")).toBe("lü");
    expect(withTone("hao", 3)).toBe("hǎo");
    expect(withTone("shuì", 2)).toBe("shuí");
    expect(withTone("liu", 4)).toBe("liù");
    expect(withTone("gou", 3)).toBe("gǒu");
    expect(withTone("xue", 2)).toBe("xué");
    expect(withTone("lü", 4)).toBe("lǜ");
  });

  it("splits syllables into initial and final", () => {
    expect(splitSyllable("xīng")).toEqual({ initial: "x", final: "ing" });
    expect(splitSyllable("zhōng")).toEqual({ initial: "zh", final: "ong" });
    expect(splitSyllable("èr")).toEqual({ initial: "", final: "er" });
  });
});

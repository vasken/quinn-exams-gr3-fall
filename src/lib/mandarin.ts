/*
 * Mandarin helpers: pinyin for every character the app uses, numbers, dates, years and times.
 * Characters are Simplified, as on the prep sheet (the exam also accepts Traditional).
 */

/** Pinyin of each character, as the prep sheet spells it (一 is always yī, 不 is bù). */
const CHARS: Record<string, string> = {
  一: "yī", 二: "èr", 三: "sān", 四: "sì", 五: "wǔ", 六: "liù", 七: "qī", 八: "bā", 九: "jiǔ", 十: "shí",
  〇: "líng", 两: "liǎng",
  星: "xīng", 期: "qī", 天: "tiān", 日: "rì", 昨: "zuó", 今: "jīn", 明: "míng", 几: "jǐ",
  号: "hào", 月: "yuè", 年: "nián", 去: "qù",
  点: "diǎn", 半: "bàn", 上: "shàng", 午: "wǔ", 早: "zǎo", 下: "xià", 中: "zhōng", 晚: "wǎn", 白: "bái",
  现: "xiàn", 在: "zài", 了: "le",
  起: "qǐ", 床: "chuáng", 睡: "shuì", 觉: "jiào", 课: "kè", 学: "xué", 放: "fàng", 回: "huí", 家: "jiā",
  喜: "xǐ", 欢: "huān", 看: "kàn", 书: "shū", 玩: "wán", 吃: "chī", 饭: "fàn",
  同: "tóng", 们: "men", 好: "hǎo", 张: "zhāng", 老: "lǎo", 师: "shī", 你: "nǐ",
  再: "zài", 见: "jiàn", 谢: "xiè", 对: "duì", 不: "bù",
  文: "wén",
  妈: "mā", 麻: "má", 马: "mǎ", 骂: "mà", 吗: "ma",
};

/** Words whose characters are read differently together (a light, toneless second syllable). */
const WORDS: Record<string, string[]> = {
  早上: ["zǎo", "shang"],
  晚上: ["wǎn", "shang"],
  谢谢: ["xiè", "xie"],
};

/** Chinese characters, plus 〇 (zero in years), which Unicode does not count as Han. */
export const HAN = /[\p{Script=Han}〇]/u;
/** A run of Chinese: characters with the punctuation and fill-in blanks between them. */
export const ZH_RUN = /([\p{Script=Han}〇](?:[\p{Script=Han}〇，。？！、：；（）“”…_ ]*[\p{Script=Han}〇，。？！）])?)/gu;

/** Each character with its pinyin (null for anything that is not a Chinese character). */
export function pinyinOf(text: string): { ch: string; py: string | null }[] {
  const chars = [...text];
  const out: { ch: string; py: string | null }[] = [];
  for (let i = 0; i < chars.length; i++) {
    const word = WORDS[chars[i] + (chars[i + 1] ?? "")];
    if (word) {
      out.push({ ch: chars[i], py: word[0] }, { ch: chars[i + 1], py: word[1] });
      i++;
      continue;
    }
    const ch = chars[i];
    out.push({ ch, py: HAN.test(ch) ? (CHARS[ch] ?? null) : null });
  }
  return out;
}

const PUNCT: Record<string, string> = { "，": ",", "。": ".", "？": "?", "！": "!", "、": ",", "：": ":", "；": ";", "（": " (", "）": ")" };

/** Pinyin for a phrase, one syllable per character: 明天星期几？ → "míng tiān xīng qī jǐ?" */
export function pinyin(text: string): string {
  let out = "";
  for (const { ch, py } of pinyinOf(text)) {
    if (py) out += (out && !/[ (]$/.test(out) ? " " : "") + py;
    else out += PUNCT[ch] ?? ch;
  }
  return out.replace(/\s+/g, " ").trim();
}

/** Characters with no pinyin listed (for tests). */
export function missingPinyin(text: string): string[] {
  return pinyinOf(text).filter((c) => HAN.test(c.ch) && !c.py).map((c) => c.ch);
}

/* ---------- Tones ---------- */

export type Tone = 0 | 1 | 2 | 3 | 4;
const MARKS = ["", "̄", "́", "̌", "̀"];

/** 1–4, or 0 for the neutral (light) tone. */
export function toneOf(syllable: string): Tone {
  const d = syllable.normalize("NFD");
  for (let t = 1; t <= 4; t++) if (d.includes(MARKS[t])) return t as Tone;
  return 0;
}

/** The syllable without its tone mark (ü keeps its dots). */
export function bare(syllable: string): string {
  return syllable.normalize("NFD").replace(/[̄́̌̀]/g, "").normalize("NFC");
}

/** Puts a tone mark on the right vowel: a or e first, then the o of ou, else the last vowel. */
export function withTone(syllable: string, tone: Tone): string {
  const s = bare(syllable);
  if (tone === 0) return s;
  let i = s.search(/[ae]/);
  if (i < 0) i = s.indexOf("ou");
  if (i < 0) {
    for (let j = s.length - 1; j >= 0; j--) {
      if ("iouü".includes(s[j])) {
        i = j;
        break;
      }
    }
  }
  if (i < 0) return s;
  return (s.slice(0, i + 1) + MARKS[tone] + s.slice(i + 1)).normalize("NFC");
}

export const INITIALS = ["b", "p", "m", "f", "d", "t", "n", "l", "g", "k", "h", "j", "q", "x", "zh", "ch", "sh", "r", "z", "c", "s", "y", "w"];
export const FINALS = ["a", "o", "e", "i", "u", "ü", "ai", "ei", "ui", "ao", "ou", "iu", "ie", "üe", "er", "an", "en", "in", "un", "ün", "ang", "eng", "ing", "ong"];

/** Splits a syllable into initial and final: "xīng" → x + ing. */
export function splitSyllable(syllable: string): { initial: string; final: string } {
  const s = bare(syllable);
  const initial = INITIALS.filter((i) => s.startsWith(i)).sort((a, b) => b.length - a.length)[0] ?? "";
  return { initial, final: s.slice(initial.length) };
}

/* ---------- Numbers, dates, years and times ---------- */

const DIGITS = ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

/** 1–99 in characters: 11 = 十一, 20 = 二十, 23 = 二十三. */
export function zhNumber(n: number): string {
  if (!Number.isInteger(n) || n < 1 || n > 99) throw new RangeError(`zhNumber: ${n}`);
  if (n < 10) return DIGITS[n];
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  return (tens === 1 ? "" : DIGITS[tens]) + "十" + (ones ? DIGITS[ones] : "");
}

export const dateZh = (day: number) => `${zhNumber(day)}号`;
export const monthZh = (month: number) => `${zhNumber(month)}月`;
/** Years are read digit by digit: 2026 → 二〇二六年. */
export const yearZh = (year: number) => `${[...String(year)].map((d) => DIGITS[Number(d)]).join("")}年`;
/** 2 o'clock is 两点, not 二点. */
export const timeZh = (hour: number, half: boolean) => `${hour === 2 ? "两" : zhNumber(hour)}点${half ? "半" : ""}`;

export const MONTHS_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function ordinal(n: number): string {
  const suffix = n % 10 === 1 && n !== 11 ? "st" : n % 10 === 2 && n !== 12 ? "nd" : n % 10 === 3 && n !== 13 ? "rd" : "th";
  return `${n}${suffix}`;
}

export const timeEn = (hour: number, half: boolean) => `${hour}:${half ? "30" : "00"}`;

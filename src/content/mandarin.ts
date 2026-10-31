import {
  dateQuestion,
  monthQuestion,
  pinyinQuestion,
  relativeDayQuestion,
  sequenceQuestion,
  timeQuestion,
  vocabQuestion,
  type Word,
  yearQuestion,
} from "@/lib/generators/mandarin";
import { MONTHS_EN, monthZh, timeEn, timeZh, yearZh } from "@/lib/mandarin";
import type { McqQuestion, Question, Subject, Topic } from "./types";

/*
 * Mandarin, Grades 3–4, Term 1 (source/G3-4 Mandarin T1 Prep Sheet.docx). Simplified characters,
 * as on the sheet (the exam also accepts Traditional). Chinese is found and read with a Chinese voice
 * automatically; pinyin shows above it on learn cards and in explanations.
 *
 * Changes from the sheet: 中午 is listed as "afternoon" but means noon; 你好 is spelled ní hǎo there
 * (how it is said) and nǐ hǎo here (how it is written), with a note.
 */

/** Translate Chinese to English: wrong choices are the other items' English (or a bigger pool's). */
function translate(idPrefix: string, list: Word[], pool: Word[] = list): McqQuestion[] {
  return list.map((w, i) => ({
    id: `${idPrefix}-${i}`,
    type: "mcq",
    prompt: `What does ${w.zh} mean?`,
    answer: w.en,
    wrong: pool.filter((o) => o.en !== w.en).map((o) => o.en),
    explain: `${w.zh} = ${w.en}`,
  }));
}

/** Say it out loud, then check. */
function sayIt(idPrefix: string, list: Word[]): Question[] {
  return list.map((w, i) => ({
    id: `${idPrefix}-${i}`,
    type: "reflect",
    prompt: `Say it out loud in Mandarin: **${w.en}**`,
    explain: w.zh,
    difficulty: ["medium", "hard"],
  }));
}

const point = (w: Word) => `${w.zh}${w.alt ? ` / ${w.alt.join(" / ")}` : ""} – ${w.en}`;
/** Chinese on one line, English under it. */
const line = (w: Word) => `${w.zh}\n${w.en}`;

/* ---------- Word lists ---------- */

export const DAYS: Word[] = [
  { zh: "星期一", en: "Monday" },
  { zh: "星期二", en: "Tuesday" },
  { zh: "星期三", en: "Wednesday" },
  { zh: "星期四", en: "Thursday" },
  { zh: "星期五", en: "Friday" },
  { zh: "星期六", en: "Saturday" },
  { zh: "星期天", en: "Sunday", alt: ["星期日"] },
];

const DAY_WORDS: Word[] = [
  { zh: "昨天", en: "yesterday" },
  { zh: "今天", en: "today" },
  { zh: "明天", en: "tomorrow" },
];

const DAY_SENTENCES: Word[] = [
  { zh: "明天星期几？", en: "What day of the week is tomorrow?" },
  { zh: "明天星期（___）。", en: "Tomorrow is ___." },
];

const DATE_SENTENCES: Word[] = [
  { zh: "今天几号？", en: "What's the date today?" },
  { zh: "今天（___）号。", en: "Today is the ___." },
];

const MONTH_SENTENCES: Word[] = [
  { zh: "今天几月几号？", en: "What's the month and date today?" },
  { zh: "今天（___）月（___）号。", en: "Today is ___ ___." },
];

export const MONTHS: Word[] = MONTHS_EN.map((en, i) => ({ zh: monthZh(i + 1), en }));

const YEAR_WORDS: Word[] = [
  { zh: "去年", en: "last year" },
  { zh: "今年", en: "this year" },
  { zh: "明年", en: "next year" },
];

const TIME_WORDS: Word[] = [
  { zh: "早上", en: "early morning" },
  { zh: "上午", en: "morning" },
  { zh: "中午", en: "noon" },
  { zh: "下午", en: "afternoon" },
  { zh: "晚上", en: "evening, night" },
  { zh: "白天", en: "daytime" },
];

const TIME_SENTENCES: Word[] = [
  { zh: "现在几点了？", en: "What time is it now?" },
  { zh: "现在（___）点。", en: "It's ___ o'clock now." },
];

const SENTENCES = [...DAY_SENTENCES, ...DATE_SENTENCES, ...MONTH_SENTENCES, ...TIME_SENTENCES];

export const ACTIONS: Word[] = [
  { zh: "起床", en: "wake up", emoji: "⏰" },
  { zh: "睡觉", en: "sleep, go to bed", emoji: "😴" },
  { zh: "上学", en: "go to school", alt: ["上课"], emoji: "🏫" },
  { zh: "放学", en: "go home from school", emoji: "🎒" },
  { zh: "回家", en: "go home", emoji: "🏠" },
  { zh: "喜欢", en: "like", emoji: "❤️" },
  { zh: "看书", en: "read books", emoji: "📖" },
  { zh: "玩", en: "play", emoji: "⚽" },
  { zh: "吃早饭", en: "eat breakfast", emoji: "🥣" },
  { zh: "吃午饭", en: "eat lunch", emoji: "🥪" },
  { zh: "吃晚饭", en: "eat dinner", emoji: "🍝" },
];

export const GREETINGS: Word[] = [
  { zh: "同学们好！", en: "Hello, students!" },
  { zh: "张老师你好！", en: "Hello, Ms. Chang!" },
  { zh: "早上好。", en: "Good morning." },
  { zh: "晚上好。", en: "Good evening." },
  { zh: "同学们再见。", en: "Goodbye, students." },
  { zh: "张老师再见。", en: "Goodbye, Ms. Chang." },
  { zh: "谢谢！", en: "Thanks!" },
  { zh: "对不起。", en: "Sorry." },
];

/* ---------- Pinyin ---------- */

const pinyinTopic: Topic = {
  slug: "pinyin",
  title: "Pinyin and tones",
  emoji: "🔤",
  learn: [
    {
      title: "What pinyin is",
      points: [
        "Pinyin writes Chinese sounds with our letters.",
        "A syllable has an **initial**, a **final** and a **tone**.",
        "[[xīng]] = **x** + **ing** + 1st tone",
        "[[míng]] = **m** + **ing** + 2nd tone",
      ],
    },
    {
      title: "The four tones",
      points: ["1st ˉ high and flat: 妈 (mom)", "2nd ˊ goes up, like asking “what?”: 麻", "3rd ˇ dips down, then up: 马 (horse)", "4th ˋ falls fast, like “No!”: 骂 (scold)"],
    },
    {
      title: "The light tone",
      points: ["No mark: say it short and soft.", "吗 · 们 in 同学们", "上 in 早上 and 晚上", "the second 谢 in 谢谢"],
    },
    {
      title: "Where the mark goes",
      points: ["On **a** or **e** if there is one: [[hǎo]], [[nián]], [[xiè]]", "In **ou**, on the **o**: [[ǒu]]", "Otherwise on the last vowel: [[shuì]], [[liù]]"],
    },
    {
      title: "Initials",
      points: ["[[b p m f · d t n l]]", "[[g k h · j q x]]", "[[zh ch sh r · z c s]]", "[[y w]]"],
    },
    {
      title: "Finals",
      points: ["[[a o e i u ü]]", "[[ai ei ui · ao ou iu]]", "[[ie üe er]]", "[[an en in un ün]]", "[[ang eng ing ong]]"],
    },
    {
      title: "Tricky pairs",
      points: [
        "**zh ch sh** curl the tongue back; **z c s** don't.",
        "**an / ang**, **en / eng**, **in / ing**: the **g** ones ring at the back of the mouth.",
        "After **j q x**, [[u]] is really [[ü]]: 去 is [[qù]].",
      ],
    },
  ],
  questions: [
    {
      id: "py-sort",
      type: "sort",
      prompt: "Initial or final?",
      buckets: ["Initial", "Final"],
      items: [
        ...["b", "m", "d", "l", "g", "x", "zh", "sh", "c", "r"].map((label) => ({ label, bucket: "Initial" })),
        ...["ai", "ou", "ie", "üe", "an", "ing", "ong", "iu", "er", "un"].map((label) => ({ label, bucket: "Final" })),
      ],
      pick: 8,
    },
    { id: "py-3rd", type: "mcq", prompt: "Which tone mark dips down, then up?", answer: "ˇ (3rd tone)", wrong: ["ˉ (1st tone)", "ˊ (2nd tone)", "ˋ (4th tone)"] },
    { id: "py-4th", type: "mcq", prompt: "Which tone falls, like saying “No!”?", answer: "4th tone ˋ", wrong: ["1st tone ˉ", "2nd tone ˊ", "3rd tone ˇ"] },
    { id: "py-1st", type: "tf", prompt: "The 1st tone is high and flat.", answer: true },
    { id: "py-light", type: "tf", prompt: "The light tone has a mark like a dot.", answer: false, explain: "The light tone has no mark at all: 吗 is [[ma]]." },
    { id: "py-hao", type: "mcq", prompt: "Where does the tone mark go in **hao**?", answer: "hǎo", wrong: ["haǒ", "hǎǒ"], explain: "On the **a**: a and e always get the mark." },
    { id: "py-liu", type: "mcq", prompt: "Where does the tone mark go in **liu** (4th tone)?", answer: "liù", wrong: ["lìu", "lìù"], explain: "In **iu**, the mark goes on the last vowel: [[liù]]." },
    { id: "py-initials", type: "mcq", prompt: "Which one is an initial?", answer: "zh", wrong: ["ang", "ui", "ou"], difficulty: ["easy", "medium"] },
    { id: "py-finals", type: "mcq", prompt: "Which one is a final?", answer: "ing", wrong: ["x", "sh", "q"], difficulty: ["easy", "medium"] },
    { id: "py-count", type: "mcq", prompt: "How many tones have a tone mark?", answer: "4", wrong: ["3", "5", "2"], explain: "Four tones have marks: ˉ ˊ ˇ ˋ. The light tone has none." },
  ],
  generate: pinyinQuestion,
};

/* ---------- Days ---------- */

const days: Topic = {
  slug: "days",
  title: "Days of the week",
  emoji: "📅",
  learn: [
    { title: "星期 + a number", points: ["星期 means week.", "Monday is day 1: 星期一", "Saturday is day 6: 星期六"] },
    { title: "The days", points: DAYS.map(point) },
    { title: "Sunday is different", points: ["Sunday is not day 7.", "It is 星期天 or 星期日.", "Both are right."] },
    { title: "Yesterday, today, tomorrow", points: DAY_WORDS.map(point) },
    { title: "Ask and answer", points: DAY_SENTENCES.map(line) },
  ],
  questions: [
    { id: "dy-match", type: "match", prompt: "Match the days.", pairs: DAYS.map((d) => [d.zh, d.en]), pick: 4, leftTitle: "中文", rightTitle: "English" },
    { id: "dy-order", type: "order", prompt: "Put the days in order, starting with Monday.", items: ["星期一", "星期二", "星期三", "星期四", "星期五"] },
    ...translate("dy-word", DAY_WORDS),
    ...translate("dy-sentence", DAY_SENTENCES, SENTENCES),
    { id: "dy-sunday", type: "tf", prompt: "Sunday is 星期七.", answer: false, explain: "Sunday is 星期天 or 星期日." },
    { id: "dy-sunday-2", type: "mcq", prompt: "Which two ways can you write Sunday?", answer: "星期天 or 星期日", wrong: ["星期七 or 星期日", "星期天 or 星期七", "星期一 or 星期天"] },
    { id: "dy-ask", type: "mcq", prompt: "How do you ask **What day of the week is tomorrow?**", answer: "明天星期几？", wrong: ["今天星期几？", "明天几号？", "昨天星期几？"] },
  ],
  generate: (_g, difficulty, rng) => {
    const r = rng();
    if (r < 0.35) return relativeDayQuestion(DAYS, difficulty, rng);
    if (r < 0.55) return sequenceQuestion(DAYS, "day", difficulty, rng);
    if (r < 0.7) return vocabQuestion(DAY_WORDS, difficulty, rng, { write: true });
    return vocabQuestion(DAYS, difficulty, rng, { write: true, build: true, hint: (w) => (w.alt ? "Sunday is not a number." : `${w.en} is day ${DAYS.indexOf(w) + 1}.`) });
  },
};

/* ---------- Dates ---------- */

const dates: Topic = {
  slug: "dates",
  title: "Dates 1–31",
  emoji: "🗓️",
  learn: [
    { title: "Dates end in 号", points: ["The 1st is 一号.", "You can also write 日: 一日.", "Both are right."] },
    { title: "1 to 10", points: ["一 1 · 二 2 · 三 3 · 四 4 · 五 5", "六 6 · 七 7 · 八 8 · 九 9 · 十 10"] },
    { title: "11 to 19: ten + one more", points: ["11 = 10 + 1: 十一", "15 = 10 + 5: 十五", "19 = 10 + 9: 十九"] },
    { title: "20 and 30: two tens, three tens", points: ["20 = 2 × 10: 二十", "30 = 3 × 10: 三十"] },
    { title: "21 to 31", points: ["23 = 二十 + 三: 二十三", "31 = 三十 + 一: 三十一", "Watch the order: 十三 is 13, 三十 is 30."] },
    { title: "Ask and answer", points: [...DATE_SENTENCES.map(line), "今天十五号。\nToday is the 15th."] },
  ],
  questions: [
    ...translate("dt-sentence", DATE_SENTENCES, SENTENCES),
    { id: "dt-13-30", type: "mcq", prompt: "Which one is the **13th**?", answer: "十三号", wrong: ["三十号", "三号", "十号"], explain: "十三 = 10 + 3 = 13. 三十 = 3 × 10 = 30." },
    { id: "dt-20", type: "mcq", prompt: "What date is 二十号?", answer: "the 20th", wrong: ["the 12th", "the 2nd", "the 21st"], explain: "二十 = 2 × 10 = 20." },
    { id: "dt-ri", type: "tf", prompt: "五号 and 五日 both mean the 5th.", answer: true },
    { id: "dt-31", type: "mcq", prompt: "How do you write the **31st**?", answer: "三十一号", wrong: ["十三号", "三一号", "一三十号"] },
    { id: "dt-ask", type: "mcq", prompt: "How do you ask **What's the date today?**", answer: "今天几号？", wrong: ["今天星期几？", "明天几号？", "现在几点了？"] },
  ],
  generate: dateQuestion,
};

/* ---------- Months ---------- */

const months: Topic = {
  slug: "months",
  title: "Months",
  emoji: "📆",
  learn: [
    { title: "A number + 月", points: ["月 means month.", "January is month 1: 一月", "December is month 12: 十二月"] },
    { title: "January to June", points: MONTHS.slice(0, 6).map(point) },
    { title: "July to December", points: MONTHS.slice(6).map(point) },
    { title: "Month, then date", points: ["十月三十一号 = October 31", "The month (月) comes first, then the date (号)."] },
    { title: "Ask and answer", points: [...MONTH_SENTENCES.map(line), "今天十月三十一号。\nToday is October 31."] },
  ],
  questions: [
    { id: "mo-match", type: "match", prompt: "Match the months.", pairs: MONTHS.map((m) => [m.zh, m.en]), pick: 4, leftTitle: "中文", rightTitle: "English" },
    { id: "mo-order", type: "order", prompt: "Put the months in order.", items: ["九月", "十月", "十一月", "十二月"] },
    ...translate("mo-sentence", MONTH_SENTENCES, SENTENCES),
    { id: "mo-yue-hao", type: "mcq", prompt: "Which word means **month**?", answer: "月", wrong: ["号", "年", "星期"] },
    { id: "mo-11", type: "mcq", prompt: "Which month is 十一月?", answer: "November", wrong: ["January", "October", "December"] },
    { id: "mo-today", type: "mcq", prompt: "How do you write **October 31**?", answer: "十月三十一号", wrong: ["三十一号十月", "十月十三号", "三十一月十号"] },
  ],
  generate: monthQuestion,
};

/* ---------- Years ---------- */

const years: Topic = {
  slug: "years",
  title: "Years",
  emoji: "⏳",
  learn: [
    { title: "One digit at a time", points: ["2026 = 2 0 2 6", "二〇二六年", "〇 is zero. 年 means year."] },
    { title: "2016 to 2021", points: [2016, 2017, 2018, 2019, 2020, 2021].map((y) => `${y} – ${yearZh(y)}`) },
    { title: "2022 to 2027", points: [2022, 2023, 2024, 2025, 2026, 2027].map((y) => `${y} – ${yearZh(y)}`) },
    { title: "Last year, this year, next year", points: [...YEAR_WORDS.map(point), "今年二〇二六年。\nThis year is 2026."] },
  ],
  questions: [
    ...translate("yr-word", YEAR_WORDS),
    { id: "yr-zero", type: "mcq", prompt: "In 二〇二六年, what does 〇 mean?", answer: "zero", wrong: ["ten", "year", "one"] },
    { id: "yr-nian", type: "mcq", prompt: "Which character means **year**?", answer: "年", wrong: ["月", "号", "天"] },
    { id: "yr-this", type: "mcq", prompt: "How do you say **This year is 2026.**?", answer: "今年二〇二六年。", wrong: ["明年二〇二六年。", "今年二〇六二年。", "去年二〇二六年。"] },
    { id: "yr-digits", type: "tf", prompt: "In Chinese, you read a year one digit at a time.", answer: true, explain: "2026 = 二〇二六年: two, zero, two, six." },
  ],
  generate: (_g, difficulty, rng) => (rng() < 0.2 ? vocabQuestion(YEAR_WORDS, difficulty, rng, { write: true }) : yearQuestion(_g, difficulty, rng)),
};

/* ---------- Time ---------- */

const time: Topic = {
  slug: "time",
  title: "Telling time",
  emoji: "🕒",
  learn: [
    { title: "O'clock: 点", points: [`${timeEn(1, false)} – ${timeZh(1, false)}`, `${timeEn(3, false)} – ${timeZh(3, false)}`, `${timeEn(11, false)} – ${timeZh(11, false)}`], figure: { id: "clock", hour: 3 } },
    { title: "Half past: 半", points: [`${timeEn(4, true)} – ${timeZh(4, true)}`, `${timeEn(6, true)} – ${timeZh(6, true)}`, `${timeEn(12, true)} – ${timeZh(12, true)}`], figure: { id: "clock", hour: 4, half: true } },
    { title: "2 o'clock is special", points: ["2:00 is 两点, not 二点.", "2:30 is 两点半.", "12:00 is still 十二点."] },
    { title: "Parts of the day", points: TIME_WORDS.map(point) },
    { title: "Ask and answer", points: [...TIME_SENTENCES.map(line), "现在八点半。\nIt's 8:30 now."] },
  ],
  questions: [
    ...translate("tm-word", TIME_WORDS),
    ...translate("tm-sentence", TIME_SENTENCES, SENTENCES),
    { id: "tm-two", type: "mcq", prompt: "How do you say **2:00**?", answer: "两点", wrong: ["二点", "十二点", "两点半"], explain: "2 o'clock is 两点, not 二点." },
    { id: "tm-ban", type: "mcq", prompt: "What does 半 mean in 六点半?", answer: "half past", wrong: ["o'clock", "morning", "minutes"] },
    { id: "tm-noon", type: "tf", prompt: "中午 means around noon, the middle of the day.", answer: true },
    { id: "tm-ask", type: "mcq", prompt: "How do you ask **What time is it now?**", answer: "现在几点了？", wrong: ["今天几号？", "明天星期几？", "现在几月？"] },
  ],
  generate: (_g, difficulty, rng) => (rng() < 0.25 ? vocabQuestion(TIME_WORDS, difficulty, rng) : timeQuestion(_g, difficulty, rng)),
};

/* ---------- Action words ---------- */

const actions: Topic = {
  slug: "actions",
  title: "Action words",
  emoji: "🏃",
  learn: [
    { title: "My day", points: ACTIONS.slice(0, 5).map(point) },
    { title: "Things I do", points: ACTIONS.slice(5, 8).map(point) },
    { title: "Meals: 早 午 晚", points: [...ACTIONS.slice(8).map(point), "早 morning, 午 noon, 晚 evening, like 早上, 中午, 晚上."] },
  ],
  questions: [
    { id: "ac-match", type: "match", prompt: "Match the actions.", pairs: ACTIONS.map((a) => [a.zh, a.en]), pick: 4, leftTitle: "中文", rightTitle: "English" },
    { id: "ac-order", type: "order", prompt: "Put the school day in order.", items: ["起床", "吃早饭", "上学", "放学", "睡觉"] },
    { id: "ac-meals", type: "mcq", prompt: "Which meal is 吃午饭?", answer: "lunch", wrong: ["breakfast", "dinner", "a snack"], explain: "午 as in 中午 (noon): lunch." },
    { id: "ac-shangke", type: "tf", prompt: "上课 and 上学 both mean going to school or class.", answer: true },
  ],
  generate: (_g, difficulty, rng) => vocabQuestion(ACTIONS, difficulty, rng, { write: true, build: true }),
};

/* ---------- Listening and speaking ---------- */

const ALL_LISTS = [DAYS, DAY_WORDS, MONTHS, YEAR_WORDS, TIME_WORDS, ACTIONS, GREETINGS];

const speaking: Topic = {
  slug: "speaking",
  title: "Listening and speaking",
  emoji: "🎤",
  learn: [
    { title: "Hello and goodbye", points: GREETINGS.slice(0, 6).map(line) },
    { title: "Thanks and sorry", points: GREETINGS.slice(6).map(line) },
    { title: "Saying 你好", points: ["你 and 好 are both 3rd tone.", "Two 3rd tones in a row: the first one goes up.", "So 你好 sounds like [[ní hǎo]]."] },
    {
      title: "Questions you may hear",
      points: [DAY_SENTENCES[0], DATE_SENTENCES[0], MONTH_SENTENCES[0], TIME_SENTENCES[0]].map(line),
    },
  ],
  questions: [
    { id: "sp-match", type: "match", prompt: "Match the phrases.", pairs: GREETINGS.map((g) => [g.zh, g.en]), pick: 4, leftTitle: "中文", rightTitle: "English" },
    ...translate("sp-line", GREETINGS),
    ...sayIt("sp-say", GREETINGS.slice(0, 4)),
    { id: "sp-reply", type: "mcq", prompt: "Your teacher says 同学们好！ What do you say back?", answer: "张老师你好！", wrong: ["同学们再见。", "对不起。", "晚上好。"] },
    { id: "sp-bye", type: "mcq", prompt: "Your teacher says 同学们再见。 What do you say back?", answer: "张老师再见。", wrong: ["张老师你好！", "早上好。", "谢谢！"] },
  ],
  generate: (_g, difficulty, rng) =>
    rng() < 0.4 ? vocabQuestion(GREETINGS, difficulty, rng) : vocabQuestion(ALL_LISTS[Math.floor(rng() * ALL_LISTS.length)], difficulty, rng, { only: ["listen"] }),
};

export const mandarin: Subject = {
  slug: "mandarin",
  title: "Mandarin",
  emoji: "🇨🇳",
  blurb: "Pinyin, days, dates, months, years, time",
  tint: "bg-red-50 text-red-700",
  topics: [pinyinTopic, days, dates, months, years, time, actions, speaking],
};


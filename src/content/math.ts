import {
  addition,
  division,
  frontEndEstimation,
  multiplication,
  placeValue,
  rounding,
  subtraction,
} from "@/lib/generators/math";
import type { Subject } from "./types";

export const math: Subject = {
  slug: "math",
  title: "Math",
  emoji: "🔢",
  blurb: "Estimating, big numbers, + − × ÷",
  tint: "bg-sky-50 text-sky-700",
  topics: [
    {
      slug: "rounding",
      title: "Estimating by Rounding",
      emoji: "🎯",
      learn: [
        {
          title: "What is rounding?",
          emoji: "🎯",
          points: [
            "Rounding makes a number **simpler** so it is easier to work with.",
            "A rounded number is **close** to the real number, but not exact.",
            "We round when we want a quick **estimate** — a smart guess.",
          ],
        },
        {
          title: "The rounding rule",
          emoji: "🖐️",
          points: [
            "Find the place you are rounding to. Look at the digit **just to its right**.",
            "**5, 6, 7, 8, 9** → round **up** (\"5 or more, raise the score\").",
            "**0, 1, 2, 3, 4** → round **down** (\"4 or less, let it rest\").",
            "Every digit after the rounding place becomes **0**.",
          ],
        },
        {
          title: "Examples",
          emoji: "✏️",
          points: [
            "**47** to the nearest ten → 7 is 5 or more → **50**",
            "**342** to the nearest hundred → 4 is 4 or less → **300**",
            "**6,750** to the nearest thousand → 7 → **7,000**",
            "Estimating: 48 + 31 → 50 + 30 = **about 80**",
          ],
        },
      ],
      questions: [
        {
          id: "round-why",
          type: "mcq",
          prompt: "Why do we round numbers?",
          answer: "To make a quick, close estimate",
          wrong: ["To get the exact answer", "To make numbers bigger", "To make numbers odd"],
        },
        {
          id: "round-est-1",
          type: "mcq",
          prompt: "Estimate by rounding to the nearest ten: 38 + 41",
          answer: "40 + 40 = 80",
          wrong: ["30 + 40 = 70", "38 + 41 = 79", "40 + 50 = 90"],
          explain: "38 rounds up to 40 and 41 rounds down to 40.",
        },
        {
          id: "round-est-2",
          type: "mcq",
          prompt: "Estimate by rounding to the nearest hundred: 612 + 289",
          answer: "600 + 300 = 900",
          wrong: ["700 + 300 = 1,000", "600 + 200 = 800", "610 + 290 = 900"],
          difficulty: ["medium", "hard"],
        },
        {
          id: "round-est-3",
          type: "typed",
          numeric: true,
          prompt: "Estimate by rounding to the nearest thousand: 4,812 + 2,390",
          answer: "7000",
          explain: "4,812 → 5,000 and 2,390 → 2,000. 5,000 + 2,000 = 7,000.",
          difficulty: ["hard"],
        },
      ],
      generate: rounding,
    },
    {
      slug: "front-end",
      title: "Front-End Estimation",
      emoji: "🚂",
      learn: [
        {
          title: "Front-end estimation",
          emoji: "🚂",
          points: [
            "Look at the **front** (first) digit of each number.",
            "Keep that digit and turn **all the other digits into zeros**.",
            "Then add or subtract the new numbers.",
          ],
        },
        {
          title: "Example",
          emoji: "✏️",
          points: [
            "**467 + 321**",
            "467 → **400**   and   321 → **300**",
            "400 + 300 = **about 700**",
            "Front-end never rounds up — it just keeps the front digit!",
          ],
        },
        {
          title: "Rounding vs. front-end",
          emoji: "⚖️",
          points: [
            "**Rounding** 467 to the nearest hundred → **500** (it looks at the next digit).",
            "**Front-end** 467 → **400** (it just drops the rest).",
            "Both are estimates. Read the question to know which one to use!",
          ],
        },
      ],
      questions: [
        {
          id: "fe-what",
          type: "mcq",
          prompt: "Using front-end estimation, 5,862 becomes…",
          answer: "5,000",
          wrong: ["6,000", "5,800", "5,900"],
        },
        {
          id: "fe-vs-round",
          type: "mcq",
          prompt: "Round 78 to the nearest ten, and front-end estimate 78. What do you get?",
          answer: "Rounding: 80, Front-end: 70",
          wrong: ["Rounding: 70, Front-end: 80", "Both: 80", "Both: 70"],
          difficulty: ["medium", "hard"],
        },
      ],
      generate: frontEndEstimation,
    },
    {
      slug: "place-value",
      title: "Big Numbers & Comparing",
      emoji: "🏔️",
      learn: [
        {
          title: "Place value",
          emoji: "🏠",
          points: [
            "Every digit has a **place**: ones, tens, hundreds, thousands, ten thousands.",
            "In **4,736**: 4 thousands, 7 hundreds, 3 tens, 6 ones.",
            "The **value** of the 7 is **700**.",
          ],
        },
        {
          title: "Expanded form",
          emoji: "🧩",
          points: [
            "**Standard form:** 4,736",
            "**Expanded form:** 4,000 + 700 + 30 + 6",
            "**Word form:** four thousand seven hundred thirty-six",
          ],
        },
        {
          title: "Comparing numbers",
          emoji: "🐊",
          points: [
            "**>** means greater than.  **<** means less than.  **=** means equal.",
            "The alligator mouth always **eats the bigger number**.",
            "Compare from the **left**: the biggest place first. 5,281 > 5,218 because 8 tens > 1 ten.",
          ],
        },
        {
          title: "Numbers to 100,000 (Grade 4)",
          emoji: "💯",
          points: [
            "**52,904** = 5 ten thousands, 2 thousands, 9 hundreds, 0 tens, 4 ones.",
            "Decimals: line up the decimal points. **3.5 = 3.50**, so 3.5 > 3.45.",
          ],
        },
      ],
      questions: [
        {
          id: "pv-largest",
          type: "mcq",
          prompt: "Which number is the greatest?",
          answer: "8,301",
          wrong: ["8,130", "8,031", "3,810"],
          grades: [3],
        },
        {
          id: "pv-largest-4",
          type: "mcq",
          prompt: "Which number is the greatest?",
          answer: "64,210",
          wrong: ["46,210", "64,120", "64,201"],
          grades: [4],
        },
        {
          id: "pv-order",
          type: "order",
          prompt: "Put these numbers in order from least to greatest.",
          items: ["1,089", "1,890", "1,908", "9,801"],
          grades: [3],
          difficulty: ["medium", "hard"],
        },
        {
          id: "pv-order-4",
          type: "order",
          prompt: "Put these numbers in order from least to greatest.",
          items: ["0.45", "0.5", "4.05", "4.5"],
          grades: [4],
          difficulty: ["medium", "hard"],
        },
      ],
      generate: placeValue,
    },
    {
      slug: "add-subtract",
      title: "Adding & Subtracting",
      emoji: "➕",
      learn: [
        {
          title: "Adding big numbers",
          emoji: "➕",
          points: [
            "Line up the numbers by **place value** (ones under ones).",
            "Add the **ones** first, then tens, hundreds, thousands.",
            "If a column makes **10 or more**, regroup: carry 1 to the next place.",
          ],
        },
        {
          title: "Subtracting big numbers",
          emoji: "➖",
          points: [
            "Line up by place value. Start with the **ones**.",
            "If the top digit is smaller, **regroup** (borrow 10 from the next place).",
            "Check your answer: **difference + smaller number = bigger number**.",
          ],
        },
        {
          title: "Word problem clue words",
          emoji: "🔎",
          points: [
            "**Add:** in all, altogether, total, sum, more (gets more)",
            "**Subtract:** left, how many more, difference, fewer, take away",
          ],
        },
      ],
      questions: [
        {
          id: "as-clue",
          type: "sort",
          prompt: "Sort the clue words: do they usually mean add or subtract?",
          buckets: ["Add ➕", "Subtract ➖"],
          items: [
            { label: "in all", bucket: "Add ➕" },
            { label: "altogether", bucket: "Add ➕" },
            { label: "total", bucket: "Add ➕" },
            { label: "left over", bucket: "Subtract ➖" },
            { label: "difference", bucket: "Subtract ➖" },
            { label: "how many more", bucket: "Subtract ➖" },
          ],
        },
      ],
      generate: (g, d, r) => (r() < 0.5 ? addition(g, d, r) : subtraction(g, d, r)),
    },
    {
      slug: "multiply-divide",
      title: "Multiplying & Dividing",
      emoji: "✖️",
      learn: [
        {
          title: "Multiplication = equal groups",
          emoji: "🍪",
          points: [
            "**4 × 3** means 4 groups of 3 → 3 + 3 + 3 + 3 = **12**.",
            "You can **skip count**: 3, 6, 9, 12.",
            "Order doesn't matter: **4 × 3 = 3 × 4**.",
          ],
        },
        {
          title: "Division = sharing equally",
          emoji: "🍕",
          points: [
            "**12 ÷ 3** means share 12 into 3 equal groups → **4** in each.",
            "Division is the **opposite** of multiplication: 3 × 4 = 12, so 12 ÷ 3 = 4.",
          ],
        },
        {
          title: "Bigger multiplication",
          emoji: "🧮",
          points: [
            "**23 × 4**: split it up! 20 × 4 = 80 and 3 × 4 = 12.",
            "Add the parts: 80 + 12 = **92**.",
          ],
        },
      ],
      questions: [
        {
          id: "md-fact-family",
          type: "mcq",
          prompt: "6 × 7 = 42. Which division fact is in the same fact family?",
          answer: "42 ÷ 7 = 6",
          wrong: ["42 ÷ 2 = 21", "7 ÷ 6 = 42", "6 + 7 = 13"],
        },
        {
          id: "md-groups",
          type: "mcq",
          prompt: "Which means the same as 5 × 3?",
          answer: "3 + 3 + 3 + 3 + 3",
          wrong: ["5 + 3", "5 + 5 + 5 + 5 + 5", "53"],
        },
      ],
      generate: (g, d, r) => (r() < 0.55 ? multiplication(g, d, r) : division(g, d, r)),
    },
  ],
};

import canada from "@svg-maps/canada";
import { describe, expect, it } from "vitest";
import { subjects } from "@/content";
import { DIFFICULTIES, GRADES, type Figure, type Question } from "@/content/types";
import { seeded } from "@/lib/random";
import { solve } from "@/lib/robot";
import { buildSession, fits, topicVisible, typedCorrect } from "@/lib/select-questions";

const allTopics = subjects.flatMap((s) => s.topics.map((t) => ({ s, t })));
const allQuestions = allTopics.flatMap(({ s, t }) => t.questions.map((q) => ({ s, t, q })));

/** Ids each figure exposes as tap targets. */
const TAP_IDS: Partial<Record<Figure["id"], string[]>> = {
  flower: ["petal", "sepal", "anther", "filament", "stigma", "style", "ovary", "ovule"],
  roots: ["taproot", "fibrous"],
  contour: ["A", "B", "C", "D", "peak"],
  "town-map": ["title", "legend", "compass", "scale", "library", "lake", "hospital", "store", "park", "school", "house", "church", "firestation"],
  canada: canada.locations.map((l) => l.id),
  comic: ["panel", "caption", "speech", "thought"],
  ad: ["logo", "headline", "picture", "slogan", "price"],
};

describe("content", () => {
  it("every topic has learn cards", () => {
    for (const { s, t } of allTopics) expect(t.learn.length, `${s.slug}/${t.slug}`).toBeGreaterThan(0);
  });

  it("every visible topic has enough questions at every level", () => {
    const short: string[] = [];
    for (const grade of GRADES) {
      for (const difficulty of DIFFICULTIES) {
        for (const { s, t } of allTopics) {
          if (!topicVisible(t, grade) || t.generate) continue;
          const n = t.questions.filter((q) => fits(q, grade, difficulty)).length;
          if (n < (difficulty === "easy" ? 6 : 5)) short.push(`${s.slug}/${t.slug} grade ${grade} ${difficulty}: ${n}`);
        }
      }
    }
    expect(short).toEqual([]);
  });

  it("question ids are unique within each topic", () => {
    for (const { s, t } of allTopics) {
      const ids = t.questions.map((q) => q.id);
      expect(new Set(ids).size, `${s.slug}/${t.slug}`).toBe(ids.length);
    }
  });

  it("questions are well-formed", () => {
    for (const { s, t, q } of allQuestions) {
      const where = `${s.slug}/${t.slug}/${q.id}`;
      checkQuestion(q, where);
    }
  });

  it("leaves out topics crossed off the prep sheet", () => {
    const text = JSON.stringify(subjects).toLowerCase();
    for (const word of ["fraction", "mixed number", "endangered", "extinct", "deforestation", "oil spill"]) {
      expect(text, word).not.toContain(word);
    }
  });
});

function checkQuestion(q: Question, where: string) {
  switch (q.type) {
    case "mcq":
      expect(q.wrong.length, where).toBeGreaterThan(0);
      expect(q.wrong, where).not.toContain(q.answer);
      expect(new Set(q.wrong).size, where).toBe(q.wrong.length);
      break;
    case "sort":
      for (const i of q.items) expect(q.buckets, `${where} ${i.label}`).toContain(i.bucket);
      for (const b of q.buckets) expect(q.items.some((i) => i.bucket === b), `${where} ${b}`).toBe(true);
      expect(new Set(q.items.map((i) => i.label)).size, where).toBe(q.items.length);
      break;
    case "match":
      expect(new Set(q.pairs.map((p) => p[0])).size, where).toBe(q.pairs.length);
      expect(new Set(q.pairs.map((p) => p[1])).size, where).toBe(q.pairs.length);
      break;
    case "order":
      expect(new Set(q.items).size, where).toBe(q.items.length);
      break;
    case "wordparts":
      expect(q.target[0], where).toBeGreaterThanOrEqual(0);
      expect(q.target[1], where).toBeLessThanOrEqual(q.word.length);
      expect(q.target[1], where).toBeGreaterThan(q.target[0]);
      break;
    case "tap": {
      const ids = TAP_IDS[q.figure.id] ?? [];
      for (const a of [q.answer].flat()) expect(ids, where).toContain(a);
      break;
    }
    case "robot":
      expect(solve(q), where).not.toBeNull();
      break;
    case "typed":
      expect([q.answer].flat().length, where).toBeGreaterThan(0);
      break;
  }
}

describe("sessions", () => {
  it("builds full sessions with unique keys for every topic, grade and level", () => {
    let seed = 1;
    for (const grade of GRADES) {
      for (const difficulty of DIFFICULTIES) {
        for (const { t } of allTopics) {
          if (!topicVisible(t, grade)) continue;
          const items = buildSession([t], grade, difficulty, seeded(seed++));
          expect(items.length).toBeGreaterThan(0);
          expect(new Set(items.map((i) => i.key)).size).toBe(items.length);
          for (const it of items) {
            if (it.q.type === "mcq") {
              expect(it.choices).toContain(it.q.answer);
              expect(new Set(it.choices).size).toBe(it.choices!.length);
            }
          }
        }
        const quiz = buildSession(allTopics.map((x) => x.t), grade, difficulty, seeded(seed++), 20);
        expect(quiz.length).toBe(20);
        // A mixed quiz should cover lots of subjects, including math.
        expect(new Set(quiz.map((i) => i.topic)).size).toBeGreaterThan(10);
      }
    }
  });

  it("uses only the chosen grade's topics", () => {
    const phonics = subjects.find((s) => s.slug === "phonics")!;
    const items = buildSession(phonics.topics, 3, "hard", seeded(7), 200);
    for (const it of items) expect(it.topic.grades ?? [3]).toContain(3);
  });
});

describe("typed answers", () => {
  it("ignores case, commas in numbers, curly apostrophes and trailing periods", () => {
    expect(typedCorrect(" Heart ", "heart")).toBe(true);
    expect(typedCorrect("7,000", "7000")).toBe(true);
    expect(typedCorrect("you’re", "you're")).toBe(true);
    expect(typedCorrect("Canadian Shield.", ["the Canadian Shield", "Canadian Shield"])).toBe(true);
    expect(typedCorrect("hart", "heart")).toBe(false);
  });
});

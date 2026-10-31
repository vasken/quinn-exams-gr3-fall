import { subjects } from "@/content";
import { DIFFICULTIES, GRADES, type Question } from "@/content/types";
import { seeded } from "./random";
import { speechParts } from "./speech";

/**
 * Every French phrase the app can say: all {French} parts of learn cards and questions,
 * plus a large sample of generated questions (their word lists are small, so this finds them all).
 */
export function frenchPhrases(samples = 3000, seed = 99): string[] {
  const found = new Set<string>();
  const add = (text?: string) => {
    if (text) for (const p of speechParts(text)) if (p.lang === "fr") found.add(p.text);
  };
  const addQuestion = (q: Question) => [q.prompt, q.say, q.explain, q.hint, q.passage].forEach(add);

  for (const s of subjects) {
    for (const t of s.topics) {
      for (const c of t.learn) [c.title, ...c.points].forEach(add);
      t.questions.forEach(addQuestion);
      if (!t.generate) continue;
      const rng = seeded(seed);
      for (const g of t.grades ?? GRADES) for (const d of DIFFICULTIES) for (let i = 0; i < samples; i++) addQuestion(t.generate(g, d, rng));
    }
  }
  return [...found].sort();
}

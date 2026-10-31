import type { Difficulty, Grade, Question, Rng, Topic } from "@/content/types";
import { DIFFICULTY_INFO } from "./settings";
import { shuffle } from "./random";

export interface Prepared {
  /** Unique within a session (React key). */
  key: string;
  q: Question;
  /** mcq / tf: the buttons to show, in order. */
  choices?: string[];
  /** sort / match / order: shuffled labels to show. */
  shuffled?: string[];
  topic: Topic;
}

export function fits(q: { difficulty?: Difficulty[]; grades?: Grade[] }, grade: Grade, difficulty: Difficulty) {
  return (!q.difficulty || q.difficulty.includes(difficulty)) && (!q.grades || q.grades.includes(grade));
}

export function topicVisible(t: Topic, grade: Grade) {
  return !t.grades || t.grades.includes(grade);
}

/** Shuffle choices / sample items so a question is ready to show. */
export function prepare(q: Question, topic: Topic, difficulty: Difficulty, rng: Rng, index: number): Prepared {
  const key = `${index}-${q.id}`;
  switch (q.type) {
    case "mcq": {
      const n = DIFFICULTY_INFO[difficulty].choices - 1;
      const wrong = shuffle(rng, q.wrong).slice(0, n);
      return { key, q, topic, choices: shuffle(rng, [q.answer, ...wrong]) };
    }
    case "tf":
      return { key, q, topic, choices: ["True", "False"] };
    case "sort": {
      const n = q.pick ?? q.items.length;
      // Make sure every bucket gets at least one item.
      const byBucket = q.buckets.map((b) => shuffle(rng, q.items.filter((i) => i.bucket === b)));
      const firsts = byBucket.map((list) => list[0]).filter(Boolean);
      const rest = shuffle(rng, byBucket.flatMap((list) => list.slice(1)));
      const items = shuffle(rng, [...firsts, ...rest].slice(0, Math.max(n, firsts.length)));
      return { key, q: { ...q, items }, topic, shuffled: items.map((i) => i.label) };
    }
    case "match": {
      const pairs = shuffle(rng, q.pairs).slice(0, q.pick ?? q.pairs.length);
      return { key, q: { ...q, pairs }, topic, shuffled: shuffle(rng, pairs.map((p) => p[1])) };
    }
    case "order": {
      let shuffled = shuffle(rng, q.items);
      if (shuffled.every((s, i) => s === q.items[i])) shuffled = [...q.items].reverse();
      return { key, q, topic, shuffled };
    }
    default:
      return { key, q, topic };
  }
}

/** Build a practice session from one or more topics. */
export function buildSession(
  topics: Topic[],
  grade: Grade,
  difficulty: Difficulty,
  rng: Rng,
  count = DIFFICULTY_INFO[difficulty].count,
): Prepared[] {
  // One queue per topic; take turns so one big topic doesn't crowd out the rest.
  const queues = shuffle(
    rng,
    topics
      .filter((t) => topicVisible(t, grade))
      .map((topic) => ({ topic, qs: shuffle(rng, topic.questions.filter((q) => fits(q, grade, difficulty))) })),
  );
  const picked: { q: Question; topic: Topic }[] = [];
  while (picked.length < count) {
    let added = false;
    for (const { topic, qs } of queues) {
      if (picked.length >= count) break;
      // Topics with a generator (math) mix fresh questions in with their fixed ones.
      const q = topic.generate && (!qs.length || rng() < 0.6) ? topic.generate(grade, difficulty, rng) : qs.shift();
      if (q) {
        picked.push({ q, topic });
        added = true;
      }
    }
    if (!added) break;
  }

  return shuffle(rng, picked).map(({ q, topic }, i) => prepare(q, topic, difficulty, rng, i));
}

/** Loose comparison for typed answers. */
export function normalize(s: string) {
  return s
    .toLowerCase()
    // French: accents are optional and "quatre-vingts" = "quatre vingts".
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/(\p{L})-(?=\p{L})/gu, "$1 ")
    .replace(/[’‘]/g, "'")
    .replace(/(\d),(\d)/g, "$1$2")
    .replace(/[.!?]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function typedCorrect(input: string, answer: string | string[]) {
  const accepted = Array.isArray(answer) ? answer : [answer];
  return accepted.some((a) => normalize(a) === normalize(input));
}

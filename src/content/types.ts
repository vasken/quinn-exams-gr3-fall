export type Difficulty = "easy" | "medium" | "hard";
export type Grade = 3 | 4;

export const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];
export const GRADES: Grade[] = [3, 4];

/* ---------- Figures (pictures that go with a question or learn card) ---------- */

export type ScratchBlock =
  | { kind: "event" | "motion" | "looks" | "sound" | "pen"; text: string }
  | { kind: "repeat"; times: number; body: ScratchBlock[] };

export type Figure =
  | { id: "flower"; highlight?: string[] }
  | { id: "roots" }
  | { id: "contour" }
  | { id: "town-map" }
  | { id: "canada"; highlight?: string[] }
  | { id: "comic" }
  | { id: "ad" }
  | { id: "bar-graph"; title: string; labels: string[]; values: number[]; unit?: string }
  | { id: "scratch"; blocks: ScratchBlock[] }
  | { id: "emoji"; value: string };

/* ---------- Questions ---------- */

interface QuestionBase {
  id: string;
  prompt: string;
  /** Levels this question appears in. Default: all. */
  difficulty?: Difficulty[];
  /** Grades this question appears in. Default: both. */
  grades?: Grade[];
  /** Shown on Easy before answering. */
  hint?: string;
  /** Shown after answering. */
  explain?: string;
  figure?: Figure;
  /** A short reading passage shown above the question. */
  passage?: string;
  /** Text read aloud instead of the prompt (e.g. spelling words). */
  say?: string;
}

export interface McqQuestion extends QuestionBase {
  type: "mcq";
  answer: string;
  /** Wrong choices. Easy shows 2 of them, Medium/Hard up to 3. */
  wrong: string[];
}

export interface TrueFalseQuestion extends QuestionBase {
  type: "tf";
  answer: boolean;
}

export interface TypedQuestion extends QuestionBase {
  type: "typed";
  /** Accepted answers (case/space/comma-insensitive). */
  answer: string | string[];
  numeric?: boolean;
  /** Hide the answer word in the prompt for spelling. */
  placeholder?: string;
}

export interface SortQuestion extends QuestionBase {
  type: "sort";
  buckets: string[];
  items: { label: string; bucket: string }[];
  /** Only use this many random items per session. */
  pick?: number;
}

export interface MatchQuestion extends QuestionBase {
  type: "match";
  pairs: [string, string][];
  pick?: number;
  leftTitle?: string;
  rightTitle?: string;
}

export interface OrderQuestion extends QuestionBase {
  type: "order";
  /** Items in the correct order. */
  items: string[];
}

export interface WordPartsQuestion extends QuestionBase {
  type: "wordparts";
  word: string;
  /** Start and end (exclusive) index of the letters to tap. */
  target: [number, number];
}

export interface TapQuestion extends QuestionBase {
  type: "tap";
  figure: Figure;
  /** One or more ids in the figure that count as correct. */
  answer: string | string[];
}

export interface RobotQuestion extends QuestionBase {
  type: "robot";
  size: [number, number];
  start: { x: number; y: number; dir: Dir };
  goal: { x: number; y: number };
  blocks?: [number, number][];
  requireLoop?: boolean;
}

export interface ReflectQuestion extends QuestionBase {
  type: "reflect";
}

export type Dir = "N" | "E" | "S" | "W";

export type Question =
  | McqQuestion
  | TrueFalseQuestion
  | TypedQuestion
  | SortQuestion
  | MatchQuestion
  | OrderQuestion
  | WordPartsQuestion
  | TapQuestion
  | RobotQuestion
  | ReflectQuestion;

/* ---------- Learning content ---------- */

export interface LearnCard {
  title: string;
  emoji?: string;
  /** Each string is a bullet. Supports **bold**. */
  points: string[];
  figure?: Figure;
}

export type Rng = () => number;

export interface Topic {
  slug: string;
  title: string;
  emoji: string;
  grades?: Grade[];
  /** Calm tone: no confetti, gentle messages. */
  gentle?: boolean;
  learn: LearnCard[];
  questions: Question[];
  /** Makes fresh questions each session (math). */
  generate?: (grade: Grade, difficulty: Difficulty, rng: Rng) => Question;
}

export interface Subject {
  slug: string;
  title: string;
  emoji: string;
  /** Quiet background + text colour for this subject's icon. */
  tint: string;
  blurb: string;
  topics: Topic[];
}

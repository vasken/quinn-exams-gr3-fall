import type { Acc, Clef, Pitch } from "@/lib/music";

export type Difficulty = "easy" | "medium" | "hard";
export type Grade = 3 | 4;

export const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];
export const GRADES: Grade[] = [3, 4];

/* ---------- Figures (pictures that go with a question or learn card) ---------- */

export type ScratchBlock =
  | { kind: "event" | "motion" | "looks" | "sound" | "pen"; text: string }
  | { kind: "repeat"; times: number; body: ScratchBlock[] };

/** A note drawn on a staff. `pos` counts lines and spaces from middle C (C4 = 0). */
export interface StaffNote {
  /** Tap id (for questions that ask you to tap a note). */
  id?: string;
  pos: number;
  acc?: Acc | "natural";
  /** Which staff of a grand staff the note sits on. Default: treble if pos ≥ 0. */
  staff?: Clef;
  /** Filled note with a stem. No stem → a whole note. */
  stem?: "up" | "down";
  /** Default: right for up-stems, left for down-stems. */
  stemSide?: "left" | "right";
  /** In staff spaces. Default 3.5 (one octave). */
  stemLen?: number;
  crooked?: boolean;
  /** A filled note head without a stem. */
  filled?: boolean;
  /** Text under the note (learn cards). */
  label?: string;
  /** Leave a gap of this many note columns before this note. */
  gap?: number;
}

export interface KeyArc {
  from: number;
  to: number;
  label: string;
}

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
  | { id: "emoji"; value: string }
  | { id: "staff"; clef: Clef | "grand"; notes?: StaffNote[]; parts?: boolean }
  /** Two octaves from middle C. Keys are half steps above middle C (0–23). */
  | { id: "keyboard"; keys?: number[]; arcs?: KeyArc[]; from?: number; to?: number };

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

/** Tap the staff to draw a note. */
export interface StaffWriteQuestion extends QuestionBase {
  type: "staff-write";
  clef: Clef;
  /** Notes already on the staff (e.g. "a half step up from this note"). */
  given?: StaffNote[];
  /** Every accepted answer. The first is shown when revealing. */
  answer: Pitch[];
  /** Show ♯ / ♭ buttons. */
  accidentals?: boolean;
  /** Lowest and highest position you can tap. */
  range: [number, number];
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
  | StaffWriteQuestion
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
  /** Has a one-minute note-naming speed test. */
  drill?: boolean;
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

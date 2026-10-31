import { describe, expect, it } from "vitest";
import { DIFFICULTIES, type Question, type StaffNote } from "@/content/types";
import { letter, semitone, stemDir, STAFF, type Clef } from "../music";
import { seeded } from "../random";
import {
  NOTE_RANGE,
  drillNote,
  findWrongStem,
  nameAccidental,
  nameNote,
  nameStep,
  stemDirection,
  stemPicture,
  writeAccidental,
  writeNote,
  writeStep,
} from "./music";

const RUNS = 300;

function each(gen: (g: 3, d: (typeof DIFFICULTIES)[number], r: () => number) => Question, check: (q: Question, d: (typeof DIFFICULTIES)[number]) => void) {
  let seed = 1;
  for (const d of DIFFICULTIES) {
    const rng = seeded(seed++);
    for (let i = 0; i < RUNS; i++) check(gen(3, d, rng), d);
  }
}

function checkMcq(q: Question) {
  if (q.type !== "mcq") return;
  expect(q.wrong.length).toBeGreaterThan(0);
  expect(q.wrong).not.toContain(q.answer);
  expect(new Set(q.wrong).size).toBe(q.wrong.length);
}

const staffNotes = (q: Question): StaffNote[] => (q.figure?.id === "staff" ? (q.figure.notes ?? []) : []);

/** Does this stem follow every rule? */
function stemOk(n: StaffNote, clef: Clef) {
  const dir = stemDir(n.pos, clef);
  return n.stem === dir && (n.stemSide ?? (dir === "up" ? "right" : "left")) === (dir === "up" ? "right" : "left") && !n.crooked && (n.stemLen ?? 3.5) >= 3;
}

describe("music generators", () => {
  it("nameNote answers the letter of the note shown, within the level's range", () => {
    each(nameNote, (q, d) => {
      checkMcq(q);
      const [n] = staffNotes(q);
      const clef = n.staff!;
      expect(n.pos).toBeGreaterThanOrEqual(NOTE_RANGE[clef][d][0]);
      expect(n.pos).toBeLessThanOrEqual(NOTE_RANGE[clef][d][1]);
      expect(q.type === "mcq" || q.type === "typed" ? q.answer : null).toBe(letter(n.pos));
    });
  });

  it("writeNote accepts only the asked letter, inside the tap range", () => {
    each(writeNote, (q) => {
      if (q.type !== "staff-write") throw new Error("expected staff-write");
      expect(q.answer.length).toBeGreaterThan(0);
      const letters = new Set(q.answer.map((a) => letter(a.pos)));
      expect(letters.size).toBe(1);
      for (const a of q.answer) {
        expect(a.pos).toBeGreaterThanOrEqual(q.range[0]);
        expect(a.pos).toBeLessThanOrEqual(q.range[1]);
      }
    });
  });

  it("stemDirection matches the middle line rule", () => {
    each(stemDirection, (q) => {
      if (q.type !== "mcq" || q.figure?.id !== "staff") throw new Error("expected mcq with staff");
      checkMcq(q);
      const clef = q.figure.clef as Clef;
      const dir = stemDir(staffNotes(q)[0].pos, clef);
      expect(q.answer.toLowerCase().startsWith(dir)).toBe(true);
    });
  });

  it("findWrongStem has exactly one wrong stem, and it is the answer", () => {
    each(findWrongStem, (q) => {
      if (q.type !== "tap" || q.figure.id !== "staff") throw new Error("expected tap on staff");
      const clef = q.figure.clef as Clef;
      const wrong = staffNotes(q).filter((n) => !stemOk(n, clef));
      expect(wrong.map((n) => n.id)).toEqual([q.answer]);
    });
  });

  it("stemPicture has exactly one correct stem, and it is the answer", () => {
    each(stemPicture, (q) => {
      if (q.type !== "tap" || q.figure.id !== "staff") throw new Error("expected tap on staff");
      const clef = q.figure.clef as Clef;
      const right = staffNotes(q).filter((n) => stemOk(n, clef));
      expect(right.map((n) => n.id)).toEqual([q.answer]);
      expect(staffNotes(q).every((n) => n.pos !== STAFF[clef].middle)).toBe(true);
    });
  });

  it("writeStep answers are a half or whole step away and inside the tap range", () => {
    each(writeStep, (q) => {
      if (q.type !== "staff-write") throw new Error("expected staff-write");
      const from = q.given![0];
      const size = q.prompt.includes("half") ? 1 : 2;
      const sign = q.prompt.includes("higher") ? 1 : -1;
      expect(q.answer.length).toBeGreaterThan(0);
      for (const a of q.answer) {
        expect(semitone(a) - semitone({ pos: from.pos, acc: from.acc === "natural" ? undefined : from.acc })).toBe(sign * size);
        expect(a.pos).toBeGreaterThanOrEqual(q.range[0]);
        expect(a.pos).toBeLessThanOrEqual(q.range[1]);
      }
    });
  });

  it("step, accidental and naming questions are well-formed", () => {
    for (const gen of [nameStep, nameAccidental]) each(gen, checkMcq);
    each(writeAccidental, (q) => {
      if (q.type !== "staff-write") throw new Error("expected staff-write");
      expect(q.accidentals).toBe(true);
      expect(q.answer.every((a) => a.acc)).toBe(true);
    });
  });

  it("drill notes never repeat back to back", () => {
    const rng = seeded(5);
    let prev = drillNote("hard", rng);
    for (let i = 0; i < 200; i++) {
      const next = drillNote("hard", rng, prev.pos);
      expect(next.pos).not.toBe(prev.pos);
      prev = next;
    }
  });
});

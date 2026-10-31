import { describe, expect, it } from "vitest";
import { STAFF, describePlace, ledgerLines, letter, octave, pitchName, semitone, stemDir, stepFrom } from "./music";

const names = (ps: { pos: number; acc?: "sharp" | "flat" }[]) => ps.map(pitchName);

describe("pitch model", () => {
  it("names notes from middle C", () => {
    expect([0, 1, 2, 3, 4, 5, 6, 7].map(letter).join("")).toBe("CDEFGABC");
    expect(letter(-1)).toBe("B");
    expect(octave(0)).toBe(4);
    expect(octave(-1)).toBe(3);
    expect(octave(7)).toBe(5);
  });

  it("matches the treble and bass clef charts", () => {
    expect(STAFF.treble.lines.map(letter).join("")).toBe("EGBDF");
    expect([3, 5, 7, 9].map(letter).join("")).toBe("FACE");
    expect(STAFF.bass.lines.map(letter).join("")).toBe("GBDFA");
    expect([-9, -7, -5, -3].map(letter).join("")).toBe("ACEG");
  });

  it("counts half steps", () => {
    expect(semitone({ pos: 0 })).toBe(0);
    expect(semitone({ pos: 2 })).toBe(4); // E
    expect(semitone({ pos: 3 })).toBe(5); // F
    expect(semitone({ pos: 3, acc: "sharp" })).toBe(6);
    expect(semitone({ pos: 6, acc: "flat" })).toBe(10);
    expect(semitone({ pos: -1 })).toBe(-1); // B3
    expect(semitone({ pos: 7 })).toBe(12);
  });

  it("follows the middle line rule", () => {
    expect(stemDir(6, "treble")).toBe("down"); // B, on the middle line
    expect(stemDir(5, "treble")).toBe("up");
    expect(stemDir(9, "treble")).toBe("down");
    expect(stemDir(-6, "bass")).toBe("down"); // D, on the middle line
    expect(stemDir(-7, "bass")).toBe("up");
  });

  it("adds ledger lines outside the staff", () => {
    expect(ledgerLines(0, "treble")).toEqual([0]); // middle C below the treble staff
    expect(ledgerLines(0, "bass")).toEqual([0]); // middle C above the bass staff
    expect(ledgerLines(1, "treble")).toEqual([]); // D hangs below the staff
    expect(ledgerLines(-1, "treble")).toEqual([0]);
    expect(ledgerLines(-2, "treble")).toEqual([0, -2]);
    expect(ledgerLines(13, "treble")).toEqual([12]);
    expect(ledgerLines(-14, "bass")).toEqual([-12, -14]);
    expect(ledgerLines(6, "treble")).toEqual([]);
  });

  it("finds half and whole steps", () => {
    expect(names(stepFrom({ pos: 2 }, "half", "up"))).toEqual(["F"]); // E → F
    expect(names(stepFrom({ pos: 6 }, "half", "up"))).toEqual(["C"]); // B → C
    expect(names(stepFrom({ pos: 0 }, "half", "up"))).toEqual(["C♯", "D♭"]);
    expect(names(stepFrom({ pos: 6 }, "half", "down"))).toEqual(["B♭", "A♯"]);
    expect(names(stepFrom({ pos: 3 }, "half", "down"))).toEqual(["E"]); // F → E
    expect(names(stepFrom({ pos: 2 }, "whole", "up"))).toEqual(["F♯"]);
    expect(names(stepFrom({ pos: 0 }, "whole", "up"))).toEqual(["D"]);
    expect(names(stepFrom({ pos: 3 }, "whole", "down"))).toEqual(["E♭"]);
    expect(names(stepFrom({ pos: 6, acc: "flat" }, "whole", "up"))).toEqual(["C"]);
  });

  it("describes where a note sits", () => {
    expect(describePlace(6, "treble")).toBe("the 3rd line of the treble staff");
    expect(describePlace(3, "treble")).toBe("the 1st space of the treble staff");
    expect(describePlace(1, "treble")).toBe("the space just below the treble staff");
    expect(describePlace(12, "treble")).toBe("ledger line 1 above the treble staff");
    expect(describePlace(-12, "bass")).toBe("ledger line 1 below the bass staff");
  });
});

import { grandStaffQuestion, stemQuestion, stepQuestion } from "@/lib/generators/music";
import type { Figure, Subject } from "./types";

const PARTS: Figure = { id: "staff", clef: "grand", parts: true, notes: [{ id: "middle-c", pos: 0, staff: "treble" }] };

export const music: Subject = {
  slug: "music",
  title: "Music",
  emoji: "🎵",
  blurb: "Note names, stems, steps & sharps",
  tint: "bg-fuchsia-50 text-fuchsia-700",
  topics: [
    {
      slug: "grand-staff",
      title: "Grand Staff Note Naming",
      emoji: "🎼",
      drill: true,
      learn: [
        {
          title: "The grand staff",
          points: [
            "A **staff** has **5 lines** and **4 spaces**.",
            "The **treble clef** (G clef) is for higher notes. It curls around the G line.",
            "The **bass clef** (F clef) is for lower notes. Its two dots sit around the F line.",
            "A **brace** joins the treble staff and bass staff into a **grand staff**.",
          ],
          figure: PARTS,
        },
        {
          title: "Treble clef lines",
          points: ["From the bottom up: **E G B D F**.", "**E**very **G**ood **B**oy **D**oes **F**ine."],
          figure: {
            id: "staff",
            clef: "treble",
            notes: [2, 4, 6, 8, 10].map((pos, i) => ({ pos, label: "EGBDF"[i] })),
          },
        },
        {
          title: "Treble clef spaces",
          points: ["From the bottom up: **F A C E**.", "The spaces spell **FACE**."],
          figure: {
            id: "staff",
            clef: "treble",
            notes: [3, 5, 7, 9].map((pos, i) => ({ pos, label: "FACE"[i] })),
          },
        },
        {
          title: "Bass clef lines",
          points: ["From the bottom up: **G B D F A**.", "**G**ood **B**oys **D**o **F**ine **A**lways."],
          figure: {
            id: "staff",
            clef: "bass",
            notes: [-10, -8, -6, -4, -2].map((pos, i) => ({ pos, label: "GBDFA"[i] })),
          },
        },
        {
          title: "Bass clef spaces",
          points: ["From the bottom up: **A C E G**.", "**A**ll **C**ows **E**at **G**rass."],
          figure: {
            id: "staff",
            clef: "bass",
            notes: [-9, -7, -5, -3].map((pos, i) => ({ pos, label: "ACEG"[i] })),
          },
        },
        {
          title: "Notes go in order",
          points: [
            "The music alphabet is **A B C D E F G**. After G it starts again at **A**.",
            "Going up the staff, each line or space is the **next letter**: line, space, line, space.",
          ],
          figure: {
            id: "staff",
            clef: "treble",
            notes: [0, 1, 2, 3, 4, 5, 6, 7].map((pos) => ({ pos, label: "CDEFGABC"[pos] })),
          },
        },
        {
          title: "Ledger lines (treble)",
          points: [
            "**Ledger lines** are short lines for notes **above** or **below** the staff.",
            "**Middle C** sits on one ledger line just below the treble staff.",
            "Keep counting past the staff: below E comes **D**, **C**, **B**, **A**. Above F comes **G**, **A**, **B**, **C**.",
          ],
          figure: {
            id: "staff",
            clef: "treble",
            notes: [
              ...[1, 0, -1, -2].map((pos) => ({ pos, label: "DCBA"[1 - pos] })),
              ...[11, 12, 13, 14].map((pos, i) => ({ pos, label: "GABC"[i], gap: i === 0 ? 1 : 0 })),
            ],
          },
        },
        {
          title: "Ledger lines (bass)",
          points: [
            "**Middle C** also sits on one ledger line just above the bass staff. It is the **same note**.",
            "Above A comes **B**, **C**, **D**, **E**. Below G comes **F**, **E**, **D**, **C**.",
          ],
          figure: {
            id: "staff",
            clef: "bass",
            notes: [
              ...[-1, 0, 1, 2].map((pos, i) => ({ pos, label: "BCDE"[i] })),
              ...[-11, -12, -13, -14].map((pos, i) => ({ pos, label: "FEDC"[i], gap: i === 0 ? 1 : 0 })),
            ],
          },
        },
      ],
      questions: [
        { id: "gs-tap-treble", type: "tap", prompt: "Tap the **treble clef**.", figure: PARTS, answer: "treble-clef" },
        { id: "gs-tap-bass", type: "tap", prompt: "Tap the **bass clef**.", figure: PARTS, answer: "bass-clef" },
        { id: "gs-tap-brace", type: "tap", prompt: "Tap the **brace**.", figure: PARTS, answer: "brace" },
        { id: "gs-tap-bass-staff", type: "tap", prompt: "Tap the **bass staff**.", figure: PARTS, answer: "bass-staff" },
        { id: "gs-tap-treble-staff", type: "tap", prompt: "Tap the **treble staff**.", figure: PARTS, answer: "treble-staff" },
        { id: "gs-tap-middle-c", type: "tap", prompt: "Tap **middle C**.", figure: PARTS, answer: "middle-c", explain: "Middle C sits on a ledger line between the two staves." },
        {
          id: "gs-treble-lines",
          type: "mcq",
          prompt: "What are the lines of the treble staff, from the bottom up?",
          answer: "E G B D F",
          wrong: ["F A C E", "G B D F A", "A C E G"],
          explain: "Every Good Boy Does Fine.",
        },
        {
          id: "gs-treble-spaces",
          type: "mcq",
          prompt: "What are the spaces of the treble staff, from the bottom up?",
          answer: "F A C E",
          wrong: ["E G B D F", "A C E G", "G B D F A"],
          explain: "The treble spaces spell FACE.",
        },
        {
          id: "gs-bass-lines",
          type: "mcq",
          prompt: "What are the lines of the bass staff, from the bottom up?",
          answer: "G B D F A",
          wrong: ["E G B D F", "A C E G", "F A C E"],
          explain: "Good Boys Do Fine Always.",
        },
        {
          id: "gs-bass-spaces",
          type: "mcq",
          prompt: "What are the spaces of the bass staff, from the bottom up?",
          answer: "A C E G",
          wrong: ["F A C E", "G B D F A", "E G B D F"],
          explain: "All Cows Eat Grass.",
        },
        {
          id: "gs-brace",
          type: "mcq",
          prompt: "What joins the treble staff and bass staff into a grand staff?",
          answer: "A brace",
          wrong: ["A clef", "A ledger line", "A stem"],
        },
        {
          id: "gs-ledger",
          type: "mcq",
          prompt: "A short line added above or below the staff is called a…",
          answer: "ledger line",
          wrong: ["brace", "stem", "clef"],
        },
        { id: "gs-five-lines", type: "tf", prompt: "A staff has 5 lines and 4 spaces.", answer: true },
        { id: "gs-middle-c", type: "tf", prompt: "Middle C sits on a ledger line between the treble staff and the bass staff.", answer: true },
        {
          id: "gs-g-clef",
          type: "mcq",
          prompt: "The treble clef is also called the…",
          answer: "G clef",
          wrong: ["F clef", "C clef", "A clef"],
          explain: "It curls around the G line.",
          difficulty: ["medium", "hard"],
        },
        {
          id: "gs-f-clef",
          type: "mcq",
          prompt: "The bass clef is also called the…",
          answer: "F clef",
          wrong: ["G clef", "C clef", "B clef"],
          explain: "Its two dots sit above and below the F line.",
          difficulty: ["medium", "hard"],
        },
        {
          id: "gs-alphabet",
          type: "mcq",
          prompt: "The music alphabet goes A B C D E F G. What comes after G?",
          answer: "A",
          wrong: ["H", "B", "C"],
          difficulty: ["easy"],
        },
      ],
      generate: grandStaffQuestion,
    },
    {
      slug: "stems",
      title: "Middle Line Rule",
      emoji: "🎵",
      learn: [
        {
          title: "The middle line rule",
          points: [
            "Find the **middle line**: **B** on the treble staff, **D** on the bass staff.",
            "Notes **below** the middle line: stem goes **up**.",
            "Notes **on or above** the middle line: stem goes **down**.",
          ],
          figure: {
            id: "staff",
            clef: "treble",
            notes: [
              { pos: 3, stem: "up", label: "up" },
              { pos: 5, stem: "up", label: "up" },
              { pos: 6, stem: "down", label: "down" },
              { pos: 9, stem: "down", label: "down" },
            ],
          },
        },
        {
          title: "Which side?",
          points: [
            "Stem **up**: draw it on the **right** side of the note.",
            "Stem **down**: draw it on the **left** side of the note.",
            "Remember: **up-right, down-left**.",
          ],
          figure: {
            id: "staff",
            clef: "treble",
            notes: [
              { pos: 4, stem: "up", label: "right" },
              { pos: 8, stem: "down", label: "left" },
            ],
          },
        },
        {
          title: "Straight and the right length",
          points: [
            "A stem is about **one octave** long: about 3½ spaces.",
            "Draw stems **straight**. Use a ruler.",
            "The stem touches the side of the note head.",
          ],
          figure: {
            id: "staff",
            clef: "treble",
            notes: [
              { pos: 4, stem: "up", label: "good" },
              { pos: 4, stem: "up", stemLen: 1.5, label: "short" },
              { pos: 4, stem: "up", crooked: true, label: "wobbly" },
            ],
          },
        },
        {
          title: "Bass clef too",
          points: ["The middle line of the bass staff is **D**.", "Same rule: below D, stem up. On or above D, stem down."],
          figure: {
            id: "staff",
            clef: "bass",
            notes: [
              { pos: -9, stem: "up", label: "up" },
              { pos: -6, stem: "down", label: "down" },
              { pos: -3, stem: "down", label: "down" },
            ],
          },
        },
      ],
      questions: [
        { id: "st-treble-middle", type: "mcq", prompt: "What is the middle line of the treble staff?", answer: "B", wrong: ["C", "D", "G"] },
        { id: "st-bass-middle", type: "mcq", prompt: "What is the middle line of the bass staff?", answer: "D", wrong: ["B", "F", "A"] },
        { id: "st-on-middle", type: "tf", prompt: "A note on the middle line gets a stem going down.", answer: true },
        {
          id: "st-below",
          type: "mcq",
          prompt: "A note below the middle line has a stem that goes…",
          answer: "Up, on the right side",
          wrong: ["Up, on the left side", "Down, on the left side", "Down, on the right side"],
        },
        {
          id: "st-above",
          type: "mcq",
          prompt: "A note above the middle line has a stem that goes…",
          answer: "Down, on the left side",
          wrong: ["Down, on the right side", "Up, on the right side", "Up, on the left side"],
        },
        {
          id: "st-length",
          type: "mcq",
          prompt: "About how long should a stem be?",
          answer: "About one octave (3½ spaces)",
          wrong: ["Half a space", "One space", "As tall as the whole grand staff"],
        },
        { id: "st-straight", type: "tf", prompt: "Stems should be drawn straight. A ruler helps.", answer: true },
        {
          id: "st-up-left",
          type: "tf",
          prompt: "A stem going up is drawn on the left side of the note.",
          answer: false,
          explain: "Up-stems go on the **right**. Down-stems go on the **left**.",
        },
      ],
      generate: stemQuestion,
    },
    {
      slug: "steps",
      title: "Half Steps, Whole Steps & Accidentals",
      emoji: "🎹",
      learn: [
        {
          title: "Half steps",
          points: [
            "A **half step** is the very **next key** on the piano, black or white.",
            "**E to F** and **B to C** are half steps. There is no black key between them.",
            "**C to C♯** is a half step too.",
          ],
          figure: {
            id: "keyboard",
            to: 16,
            keys: [0, 1, 4, 5, 11, 12],
            arcs: [
              { from: 0, to: 1, label: "half" },
              { from: 4, to: 5, label: "half" },
              { from: 11, to: 12, label: "half" },
            ],
          },
        },
        {
          title: "Whole steps",
          points: [
            "A **whole step** is **two half steps**. Skip one key.",
            "**C to D** is a whole step: it skips C♯.",
            "**E to F♯** is a whole step: it skips F.",
          ],
          figure: {
            id: "keyboard",
            to: 16,
            keys: [0, 2, 4, 6],
            arcs: [
              { from: 0, to: 2, label: "whole" },
              { from: 4, to: 6, label: "whole" },
            ],
          },
        },
        {
          title: "Sharps and flats",
          points: [
            "A **sharp ♯** raises a note a **half step**.",
            "A **flat ♭** lowers a note a **half step**.",
            "We say \"F sharp\", but we write the sign **before** the note, on the **same line or space**.",
          ],
          figure: {
            id: "staff",
            clef: "treble",
            notes: [
              { pos: 3, label: "F" },
              { pos: 3, acc: "sharp", label: "F♯" },
              { pos: 6, label: "B", gap: 1 },
              { pos: 6, acc: "flat", label: "B♭" },
            ],
          },
        },
        {
          title: "Steps on the staff",
          points: [
            "Half step: go to the **next letter** (E → F, B → C), or keep the letter and add a sign (C → C♯).",
            "Whole step: go to the **next letter**, then add a ♯ or ♭ if you need one (E → F♯).",
            "Going **up**, use sharps. Going **down**, use flats (B → B♭).",
          ],
          figure: {
            id: "staff",
            clef: "treble",
            notes: [
              { pos: 2, label: "E" },
              { pos: 3, label: "F" },
              { pos: 2, label: "E", gap: 1 },
              { pos: 3, acc: "sharp", label: "F♯" },
            ],
          },
        },
      ],
      questions: [
        {
          id: "sp-sharp",
          type: "mcq",
          prompt: "What does a sharp ♯ do?",
          say: "What does a sharp do?",
          answer: "Raises a note a half step",
          wrong: ["Lowers a note a half step", "Raises a note a whole step", "Makes the note louder"],
        },
        {
          id: "sp-flat",
          type: "mcq",
          prompt: "What does a flat ♭ do?",
          say: "What does a flat do?",
          answer: "Lowers a note a half step",
          wrong: ["Raises a note a half step", "Lowers a note a whole step", "Makes the note shorter"],
        },
        { id: "sp-which-sharp", type: "mcq", prompt: "Which sign is a sharp?", answer: "♯", wrong: ["♭", "♮"] },
        { id: "sp-which-flat", type: "mcq", prompt: "Which sign is a flat?", answer: "♭", wrong: ["♯", "♮"] },
        {
          id: "sp-where",
          type: "mcq",
          prompt: "Where do you write a sharp or flat?",
          answer: "Before the note, on the same line or space",
          wrong: ["After the note", "Above the staff", "On the stem"],
        },
        {
          id: "sp-ef",
          type: "mcq",
          prompt: "Which two white keys are only a half step apart?",
          answer: "E and F",
          wrong: ["C and D", "F and G", "G and A"],
          explain: "There is no black key between **E and F** (or **B and C**).",
        },
        {
          id: "sp-bc",
          type: "mcq",
          prompt: "Which two white keys are only a half step apart?",
          answer: "B and C",
          wrong: ["A and B", "D and E", "F and G"],
          explain: "There is no black key between **B and C** (or **E and F**).",
        },
        { id: "sp-two-halves", type: "mcq", prompt: "How many half steps make one whole step?", answer: "2", wrong: ["1", "3", "4"] },
        { id: "sp-cd", type: "tf", prompt: "C to D is a whole step.", answer: true, explain: "C to D skips the black key C♯, so it is a **whole step**." },
        { id: "sp-ef-tf", type: "tf", prompt: "E to F is a whole step.", answer: false, explain: "There is no black key between E and F, so it is a **half step**." },
        {
          id: "sp-half-def",
          type: "mcq",
          prompt: "A half step is…",
          answer: "The very next key, black or white",
          wrong: ["Skipping one key", "Always a black key", "Going up a whole octave"],
        },
      ],
      generate: stepQuestion,
    },
  ],
};

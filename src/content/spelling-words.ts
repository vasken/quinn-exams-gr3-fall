import type { Grade } from "./types";

/**
 * Spelling practice words, grouped by the phonics patterns on the prep sheet.
 * Swap in the real "lesson 1–5" words here when you have them — each needs a
 * sentence that uses the word exactly once.
 */
export interface SpellingWord {
  word: string;
  sentence: string;
  pattern: string;
  grades: Grade[];
}

export const spellingWords: SpellingWord[] = [
  // Grade 3 — r-controlled vowels
  { word: "heart", sentence: "My heart beats fast when I run.", pattern: "ar sound", grades: [3] },
  { word: "garden", sentence: "We grew carrots in the garden.", pattern: "ar sound", grades: [3] },
  { word: "sharp", sentence: "Be careful, the knife is sharp.", pattern: "ar sound", grades: [3] },
  { word: "sports", sentence: "Hockey and soccer are my favourite sports.", pattern: "or sound", grades: [3] },
  { word: "storm", sentence: "The storm knocked down a tree.", pattern: "or sound", grades: [3] },
  { word: "north", sentence: "A compass needle points north.", pattern: "or sound", grades: [3] },
  { word: "curb", sentence: "Wait at the curb before you cross.", pattern: "ur sound", grades: [3] },
  { word: "purple", sentence: "Grapes can be green or purple.", pattern: "ur sound", grades: [3] },
  { word: "nurse", sentence: "The nurse gave me a bandage.", pattern: "ur sound", grades: [3] },
  // Grade 3 — long & short vowels, hard & soft c/g
  { word: "smile", sentence: "Her smile made everyone happy.", pattern: "long vowel", grades: [3] },
  { word: "rope", sentence: "We pulled hard on the rope.", pattern: "long vowel", grades: [3] },
  { word: "jump", sentence: "Can you jump over the puddle?", pattern: "short vowel", grades: [3] },
  { word: "city", sentence: "Toronto is a very big city.", pattern: "soft c", grades: [3, 4] },
  { word: "celery", sentence: "I dipped my celery in hummus.", pattern: "soft c", grades: [3, 4] },
  { word: "cactus", sentence: "A cactus can live in the desert.", pattern: "hard c", grades: [3, 4] },
  { word: "giant", sentence: "The giant had huge boots.", pattern: "soft g", grades: [3, 4] },
  { word: "gentle", sentence: "Be gentle with the baby bird.", pattern: "soft g", grades: [3, 4] },
  { word: "game", sentence: "We played a board game after dinner.", pattern: "hard g", grades: [3, 4] },
  // Grade 4 — k, kw, n sounds
  { word: "speaker", sentence: "Music played from the speaker.", pattern: "k sound", grades: [4] },
  { word: "quiet", sentence: "Please be quiet in the library.", pattern: "kw sound", grades: [4] },
  { word: "question", sentence: "I raised my hand to ask a question.", pattern: "kw sound", grades: [4] },
  { word: "knowing", sentence: "Knowing the answer made me smile.", pattern: "n sound (kn)", grades: [4] },
  // Grade 4 — f sound
  { word: "frightened", sentence: "The kitten was frightened by the thunder.", pattern: "f", grades: [4] },
  { word: "suffer", sentence: "Plants suffer when they get no water.", pattern: "ff", grades: [4] },
  { word: "enough", sentence: "Do we have enough chairs for everyone?", pattern: "gh", grades: [4] },
  { word: "photograph", sentence: "Grandma framed the photograph.", pattern: "ph", grades: [4] },
  { word: "laugh", sentence: "Funny jokes make me laugh.", pattern: "gh", grades: [4] },
  // Grade 4 — kn, gn, wr, rr
  { word: "known", sentence: "She is known for her kindness.", pattern: "kn", grades: [4] },
  { word: "sign", sentence: "The stop sign is red.", pattern: "gn", grades: [4] },
  { word: "wreath", sentence: "We hung a wreath on the door.", pattern: "wr", grades: [4] },
  { word: "arrow", sentence: "Follow the arrow to the exit.", pattern: "rr", grades: [4] },
  { word: "wrist", sentence: "He wears a watch on his wrist.", pattern: "wr", grades: [4] },
  // Grade 4 — le, el, al
  { word: "pickle", sentence: "I like a pickle with my sandwich.", pattern: "le", grades: [4] },
  { word: "fuel", sentence: "The car needs fuel to go.", pattern: "el", grades: [4] },
  { word: "final", sentence: "This is the final question.", pattern: "al", grades: [4] },
  { word: "squirrel", sentence: "A squirrel hid an acorn.", pattern: "el", grades: [4] },
  { word: "animal", sentence: "A moose is a very large animal.", pattern: "al", grades: [4] },
  // Grade 4 — vowel pairs
  { word: "paint", sentence: "Let's paint a picture.", pattern: "ai", grades: [4] },
  { word: "crayon", sentence: "I need a blue crayon.", pattern: "ay", grades: [4] },
  { word: "toast", sentence: "I had toast for breakfast.", pattern: "oa", grades: [4] },
  { word: "window", sentence: "Snow piled up on the window.", pattern: "ow", grades: [4] },
  { word: "dream", sentence: "I had a dream about dragons.", pattern: "ea", grades: [4] },
  { word: "sleep", sentence: "Bears sleep all winter.", pattern: "ee", grades: [4] },
  { word: "bread", sentence: "We baked bread together.", pattern: "ea (short e)", grades: [4] },
];

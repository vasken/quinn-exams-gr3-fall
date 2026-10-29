import type { Question, Subject } from "./types";

export const PROVINCES: Record<string, { name: string; kind: "province" | "territory" }> = {
  bc: { name: "British Columbia", kind: "province" },
  ab: { name: "Alberta", kind: "province" },
  sk: { name: "Saskatchewan", kind: "province" },
  mb: { name: "Manitoba", kind: "province" },
  on: { name: "Ontario", kind: "province" },
  qc: { name: "Quebec", kind: "province" },
  nb: { name: "New Brunswick", kind: "province" },
  ns: { name: "Nova Scotia", kind: "province" },
  pe: { name: "Prince Edward Island", kind: "province" },
  nl: { name: "Newfoundland and Labrador", kind: "province" },
  yt: { name: "Yukon", kind: "territory" },
  nt: { name: "Northwest Territories", kind: "territory" },
  nu: { name: "Nunavut", kind: "territory" },
};

const names = Object.values(PROVINCES).map((p) => p.name);
const hard = ["nb", "ns", "pe", "nt", "yt", "sk", "mb"];

const tapProvince: Question[] = Object.entries(PROVINCES).map(([code, p]) => ({
  id: `prov-tap-${code}`,
  type: "tap",
  prompt: `Tap **${p.name}** on the map.`,
  figure: { id: "canada" },
  answer: code,
  difficulty: hard.includes(code) ? ["medium", "hard"] : undefined,
}));

const nameProvince: Question[] = Object.entries(PROVINCES).map(([code, p]) => ({
  id: `prov-name-${code}`,
  type: "mcq",
  prompt: `Which ${p.kind} is coloured in on the map?`,
  figure: { id: "canada", highlight: [code] },
  answer: p.name,
  wrong: names.filter((n) => n !== p.name),
  difficulty: hard.includes(code) ? ["medium", "hard"] : undefined,
}));

const typeProvince: Question[] = ["on", "qc", "bc", "ab", "mb", "sk", "nu"].map((code) => ({
  id: `prov-type-${code}`,
  type: "typed",
  prompt: "Write the name of the coloured province or territory.",
  figure: { id: "canada", highlight: [code] },
  answer: PROVINCES[code].name,
  difficulty: ["hard"],
}));

export const maps: Subject = {
  slug: "maps",
  title: "Maps & Topography",
  emoji: "🧭",
  blurb: "Map features, Canada & elevation",
  tint: "bg-amber-50 text-amber-800",
  topics: [
    {
      slug: "map-features",
      title: "Map Features",
      emoji: "🗺️",
      learn: [
        {
          title: "Parts of a map (TLSSCC)",
          emoji: "🗺️",
          points: [
            "**Title** — tells what the map is about.",
            "**Legend** (or key) — explains what the **symbols** and **colours** mean.",
            "**Scale** — shows how real distance compares to distance on the map.",
            "**Symbols** — small pictures that stand for real things (🏫 = school).",
            "**Colours** — show things like water (blue) and parks or forests (green).",
            "**Compass rose** — shows the directions **N, E, S, W**.",
          ],
          figure: { id: "town-map" },
        },
        {
          title: "Using a compass rose",
          emoji: "🧭",
          points: [
            "**North** is usually at the **top** of a map.",
            "**South** is at the bottom, **East** is on the right, **West** is on the left.",
            "Memory trick: **N**ever **E**at **S**oggy **W**affles (clockwise from the top).",
          ],
        },
      ],
      questions: [
        { id: "mf-tap-title", type: "tap", prompt: "Tap the **title** of the map.", figure: { id: "town-map" }, answer: "title" },
        { id: "mf-tap-legend", type: "tap", prompt: "Tap the **legend**.", figure: { id: "town-map" }, answer: "legend" },
        { id: "mf-tap-compass", type: "tap", prompt: "Tap the **compass rose**.", figure: { id: "town-map" }, answer: "compass" },
        { id: "mf-tap-scale", type: "tap", prompt: "Tap the **scale**.", figure: { id: "town-map" }, answer: "scale" },
        { id: "mf-tap-school", type: "tap", prompt: "Use the legend. Tap the **school** symbol on the map.", figure: { id: "town-map" }, answer: "school" },
        { id: "mf-tap-hospital", type: "tap", prompt: "Use the legend. Tap the **hospital** symbol on the map.", figure: { id: "town-map" }, answer: "hospital" },
        {
          id: "mf-match",
          type: "match",
          prompt: "Match each map feature to its job.",
          pairs: [
            ["Title", "tells what the map is about"],
            ["Legend", "explains symbols and colours"],
            ["Scale", "shows real distance"],
            ["Compass rose", "shows directions"],
            ["Symbols", "small pictures for real things"],
          ],
          pick: 4,
        },
        { id: "mf-1", type: "mcq", prompt: "Which part of a map tells you what the **symbols** mean?", answer: "Legend", wrong: ["Title", "Scale", "Compass rose"] },
        { id: "mf-2", type: "mcq", prompt: "On most maps, what colour shows **water**?", answer: "Blue", wrong: ["Green", "Red", "Brown"] },
        { id: "mf-3", type: "mcq", prompt: "Which direction is usually at the **top** of a map?", answer: "North", wrong: ["South", "East", "West"] },
        {
          id: "mf-order",
          type: "order",
          prompt: "Put the directions in order, going clockwise from the top (Never Eat Soggy Waffles).",
          items: ["North", "East", "South", "West"],
          difficulty: ["medium", "hard"],
        },
      ],
    },
    {
      slug: "reading-maps",
      title: "Reading Maps",
      emoji: "🔎",
      learn: [
        {
          title: "Find your way",
          emoji: "🔎",
          points: [
            "Use the **compass rose** to find directions: N ⬆️  S ⬇️  E ➡️  W ⬅️",
            "Use the **legend** to find what symbols mean.",
            "Use the **scale** to figure out how far apart places are.",
          ],
          figure: { id: "town-map" },
        },
        {
          title: "Example",
          emoji: "✏️",
          points: [
            "On the Maple Town map, the **lake** 💧 is **north** of the **park** 🌳.",
            "The **school** 🏫 is **east** of the park.",
            "Each block is **1 km** (look at the scale). From the house 🏠 to the fire station 🚒 is **2 km**.",
          ],
        },
      ],
      questions: [
        { id: "rm-1", type: "mcq", prompt: "What is directly **north** of the park 🌳?", figure: { id: "town-map" }, answer: "The lake 💧", wrong: ["The church ⛪", "The store 🛒", "The school 🏫"] },
        { id: "rm-2", type: "mcq", prompt: "What is directly **east** of the park 🌳?", figure: { id: "town-map" }, answer: "The school 🏫", wrong: ["The store 🛒", "The lake 💧", "The church ⛪"] },
        { id: "rm-3", type: "mcq", prompt: "What is directly **west** of the park 🌳?", figure: { id: "town-map" }, answer: "The store 🛒", wrong: ["The school 🏫", "The lake 💧", "The church ⛪"] },
        { id: "rm-4", type: "mcq", prompt: "What is directly **south** of the park 🌳?", figure: { id: "town-map" }, answer: "The church ⛪", wrong: ["The lake 💧", "The store 🛒", "The school 🏫"] },
        { id: "rm-5", type: "mcq", prompt: "The hospital 🏥 is in which corner of the map?", figure: { id: "town-map" }, answer: "North-east", wrong: ["North-west", "South-east", "South-west"], difficulty: ["medium", "hard"] },
        { id: "rm-6", type: "mcq", prompt: "From the house 🏠, which direction do you go to reach the fire station 🚒?", figure: { id: "town-map" }, answer: "East", wrong: ["West", "North", "South"], difficulty: ["medium", "hard"] },
        {
          id: "rm-7",
          type: "typed",
          numeric: true,
          prompt: "Use the scale. How many km is it from the house 🏠 to the fire station 🚒 (going straight east)?",
          figure: { id: "town-map" },
          answer: "2",
          difficulty: ["hard"],
        },
        {
          id: "rm-8",
          type: "typed",
          numeric: true,
          prompt: "Use the scale. How many km is it from the library 📚 straight south to the house 🏠?",
          figure: { id: "town-map" },
          answer: "2",
          difficulty: ["hard"],
        },
        { id: "rm-9", type: "mcq", prompt: "What is directly **east** of the house 🏠?", figure: { id: "town-map" }, answer: "The church ⛪", wrong: ["The store 🛒", "The library 📚", "The lake 💧"] },
        { id: "rm-10", type: "tap", prompt: "Tap the place that is directly **north** of the school 🏫.", figure: { id: "town-map" }, answer: "hospital" },
        { id: "rm-tap", type: "tap", prompt: "Tap the place that is directly **south** of the lake 💧.", figure: { id: "town-map" }, answer: "park", difficulty: ["medium", "hard"] },
      ],
    },
    {
      slug: "canada",
      title: "Provinces & Territories",
      emoji: "🍁",
      learn: [
        {
          title: "Canada",
          emoji: "🍁",
          points: [
            "Canada has **10 provinces** and **3 territories**.",
            "The **3 territories** are in the **north**: **Yukon, Northwest Territories, Nunavut**.",
            "We live in **Ontario**! Canada's capital city, **Ottawa**, is in Ontario too.",
          ],
          figure: { id: "canada" },
        },
        {
          title: "West to east",
          emoji: "➡️",
          points: [
            "**British Columbia** → **Alberta** → **Saskatchewan** → **Manitoba** → **Ontario** → **Quebec**",
            "Then the **Atlantic provinces**: **New Brunswick**, **Nova Scotia**, **Prince Edward Island** (the smallest!), **Newfoundland and Labrador**.",
            "Memory trick for the prairies: **A**lberta, **S**askatchewan, **M**anitoba — “**A S**mall **M**oose”.",
          ],
        },
        {
          title: "Biggest and smallest",
          emoji: "📏",
          points: [
            "**Nunavut** is the **biggest** territory (and the biggest of all!).",
            "**Quebec** is the **biggest province**.",
            "**Prince Edward Island** is the **smallest province**.",
          ],
        },
      ],
      questions: [
        ...tapProvince,
        ...nameProvince,
        ...typeProvince,
        { id: "cn-1", type: "mcq", prompt: "How many provinces does Canada have?", answer: "10", wrong: ["3", "7", "13"] },
        { id: "cn-2", type: "mcq", prompt: "How many territories does Canada have?", answer: "3", wrong: ["10", "2", "5"] },
        { id: "cn-3", type: "mcq", prompt: "Which is the smallest province?", answer: "Prince Edward Island", wrong: ["Ontario", "Nova Scotia", "Quebec"] },
        {
          id: "cn-sort",
          type: "sort",
          prompt: "Province or territory?",
          buckets: ["Province", "Territory"],
          items: Object.values(PROVINCES).map((p) => ({ label: p.name, bucket: p.kind === "province" ? "Province" : "Territory" })),
          pick: 7,
        },
        {
          id: "cn-order",
          type: "order",
          prompt: "Put these provinces in order from **west** to **east**.",
          items: ["British Columbia", "Alberta", "Saskatchewan", "Manitoba", "Ontario"],
          difficulty: ["medium", "hard"],
        },
      ],
    },
    {
      slug: "elevation",
      title: "Elevation & Contour Maps",
      emoji: "⛰️",
      learn: [
        {
          title: "Elevation",
          emoji: "⛰️",
          points: [
            "**Elevation** is **how high** a place is **above the surface of the ocean** (sea level).",
            "Sea level = **0 m**. A mountain top might be hundreds or thousands of metres high.",
          ],
        },
        {
          title: "Contour lines",
          emoji: "🌀",
          points: [
            "A **topographic map** uses **contour lines** to show the shape and height of the land.",
            "**Each line** shows a **change in elevation**. Every point on a line is the **same height**.",
            "The **middle circle** is the **peak** (top) of the mountain. ▲",
            "If the lines have the same interval, **the more lines, the greater the elevation**.",
          ],
          figure: { id: "contour" },
        },
      ],
      questions: [
        { id: "el-1", type: "mcq", prompt: "What is **elevation**?", answer: "How high a place is above the ocean's surface", wrong: ["How far a place is from your house", "How hot a place is", "How many people live there"] },
        { id: "el-peak", type: "tap", prompt: "Tap the **peak** of the mountain.", figure: { id: "contour" }, answer: "peak", hint: "The peak is in the middle of all the circles." },
        { id: "el-2", type: "mcq", prompt: "What is the elevation of the peak?", figure: { id: "contour" }, answer: "325 m", wrong: ["0 m", "200 m", "50 m"] },
        { id: "el-3", type: "mcq", prompt: "Which point is **higher**, C or D?", figure: { id: "contour" }, answer: "D", wrong: ["C", "They are the same"] },
        { id: "el-4", type: "mcq", prompt: "What elevation is point **A**?", figure: { id: "contour" }, answer: "0 m (sea level)", wrong: ["325 m", "100 m", "200 m"], difficulty: ["medium", "hard"] },
        { id: "el-5", type: "mcq", prompt: "How much does the elevation change between each line?", figure: { id: "contour" }, answer: "50 m", wrong: ["10 m", "100 m", "325 m"], difficulty: ["medium", "hard"] },
        { id: "el-tap-low", type: "tap", prompt: "Tap the **lowest** of the lettered points A, C or D.", figure: { id: "contour" }, answer: "A", difficulty: ["medium", "hard"] },
        { id: "el-6", type: "typed", numeric: true, prompt: "What is the elevation of point **D**, in metres?", figure: { id: "contour" }, answer: "200", difficulty: ["hard"] },
        { id: "el-7", type: "mcq", prompt: "The middle circle on a contour map shows…", answer: "the peak (top) of the mountain", wrong: ["the bottom of a lake", "sea level", "a road"] },
        { id: "el-8", type: "tf", prompt: "Every point on the same contour line is at the same elevation.", answer: true },
        {
          id: "el-9",
          type: "mcq",
          prompt: "Two mountains have lines every 50 m. Mountain X has 4 lines and Mountain Y has 7 lines. Which is taller?",
          answer: "Mountain Y",
          wrong: ["Mountain X", "They are the same"],
          explain: "With the same interval, more lines means greater elevation.",
          difficulty: ["medium", "hard"],
        },
      ],
    },
  ],
};

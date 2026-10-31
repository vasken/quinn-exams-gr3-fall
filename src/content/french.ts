import { numberQuestion, sequenceQuestion, verbQuestion, vocabQuestion, type Word } from "@/lib/generators/french";
import type { Difficulty, Figure, Grade, McqQuestion, Question, Rng, Subject, Topic } from "./types";

/*
 * French, Grade 3, Term 1 (source/Grade 3 French T1 Prep Sheet.docx), plus what the teacher's
 * days and months videos teach. French text is wrapped in {braces}: it is read with a French voice,
 * and tapping it on screen says it out loud.
 *
 * Mistakes on the sheet fixed here: "la pomme (the apples)" → apple, "les fraises: feminine, singular"
 * → plural, "elles ont: they have (masculine)" → feminine.
 */

/** Every French topic is Grade 3 only. */
const grade3 = (t: Omit<Topic, "grades">): Topic => ({ ...t, grades: [3] });

/** Translate a French sentence: wrong choices are the other sentences' English. */
function translate(idPrefix: string, list: Word[], extra: Partial<McqQuestion> = {}): McqQuestion[] {
  return list.map((w, i) => ({
    id: `${idPrefix}-${i}`,
    type: "mcq",
    prompt: `What does {${w.fr}} mean?`,
    answer: w.en,
    wrong: list.filter((o) => o.en !== w.en).map((o) => o.en),
    ...extra,
  }));
}

/* ---------- Word lists ---------- */

export const DAYS: Word[] = [
  { fr: "lundi", en: "Monday" },
  { fr: "mardi", en: "Tuesday" },
  { fr: "mercredi", en: "Wednesday" },
  { fr: "jeudi", en: "Thursday" },
  { fr: "vendredi", en: "Friday" },
  { fr: "samedi", en: "Saturday" },
  { fr: "dimanche", en: "Sunday" },
];

export const MONTHS: Word[] = [
  { fr: "janvier", en: "January" },
  { fr: "février", en: "February" },
  { fr: "mars", en: "March" },
  { fr: "avril", en: "April" },
  { fr: "mai", en: "May" },
  { fr: "juin", en: "June" },
  { fr: "juillet", en: "July" },
  { fr: "août", en: "August" },
  { fr: "septembre", en: "September" },
  { fr: "octobre", en: "October" },
  { fr: "novembre", en: "November" },
  { fr: "décembre", en: "December" },
];

const SEASONS: Word[] = [
  { fr: "le printemps", en: "spring" },
  { fr: "l'été", en: "summer" },
  { fr: "l'automne", en: "fall" },
  { fr: "l'hiver", en: "winter" },
];

const WEATHER: Word[] = [
  { fr: "Quel temps fait-il aujourd'hui?", en: "What is the weather like today?" },
  { fr: "Il fait beau aujourd'hui.", en: "The weather is nice today." },
  { fr: "Il fait mauvais.", en: "The weather is bad." },
  { fr: "Il vente.", en: "It's windy." },
  { fr: "Il fait chaud.", en: "It's hot." },
  { fr: "Il fait froid.", en: "It's cold." },
  { fr: "J'ai chaud.", en: "I am hot." },
  { fr: "J'ai froid.", en: "I am cold." },
  { fr: "Il pleut aujourd'hui.", en: "It's raining today." },
  { fr: "Il fait soleil.", en: "It's sunny." },
];

const EXPRESSIONS: Word[] = [
  { fr: "Merci beaucoup.", en: "Thank you very much." },
  { fr: "Passez une bonne journée.", en: "Have a good day." },
  { fr: "Allez, on y va!", en: "Let's go!" },
  { fr: "Je peux te poser une question?", en: "Can I ask you a question?" },
  { fr: "Je n'ai rien fait.", en: "I didn't do anything." },
  { fr: "Qu'est-ce que tu veux dire?", en: "What do you mean?" },
];

/** The oral exam reading, line by line. */
const READING: Word[][] = [
  [
    { fr: "De la crème glacée à l'eau de rose", en: "Rose water ice cream" },
    { fr: "Est-ce que tu cuisines parfois?", en: "Do you sometimes cook?" },
    { fr: "Quelle est ta recette préférée?", en: "What is your favourite recipe?" },
    { fr: "Pourquoi?", en: "Why?" },
    { fr: "Aimes-tu la crème glacée?", en: "Do you like ice cream?" },
    { fr: "Quelle est ta saveur préférée?", en: "What is your favourite flavour?" },
  ],
  [
    { fr: "Hum… Tu aimes sûrement la crème glacée…", en: "Hmm… You probably love ice cream…" },
    { fr: "Et les roses, les aimes-tu?", en: "And roses, do you like them?" },
    { fr: "Elles sentent si bon…", en: "They smell so good…" },
  ],
  [
    {
      fr: "Lorsqu'on laisse des pétales de roses dans l'eau bouillante pendant plusieurs heures, on obtient de l'eau de rose.",
      en: "When you leave rose petals in boiling water for several hours, you get rose water.",
    },
    { fr: "On peut aussi en trouver dans plusieurs magasins spécialisés.", en: "You can also find it in several specialty stores." },
    { fr: "Si tu décides d'en acheter, assure-toi qu'elle est pure et naturelle.", en: "If you decide to buy some, make sure it is pure and natural." },
    {
      fr: "Certaines personnes utilisent l'eau de rose comme parfum, mais on peut aussi s'en servir dans la préparation des aliments.",
      en: "Some people use rose water as a perfume, but it can also be used to make food.",
    },
  ],
  [
    { fr: "Savais-tu qu'on peut ajouter de l'eau de rose dans la crème glacée?", en: "Did you know that you can add rose water to ice cream?" },
    { fr: "Et oui, le goût est fantastique!", en: "And yes, the taste is fantastic!" },
    { fr: "Ce soir, épate ta famille. Sers-lui de la crème glacée parfumée… à la rose.", en: "Tonight, impress your family. Treat them to rose-flavoured ice cream." },
    { fr: "Cette recette doit être faite avec un adulte.", en: "This recipe must be made with an adult." },
  ],
  [
    { fr: "Tu as besoin des ingrédients suivants:", en: "You need the following ingredients:" },
    { fr: "500 ml de crème bien froide (à 35 % de matière grasse)", en: "500 ml of very cold whipping cream (35% fat)" },
    { fr: "60 ml d'eau de rose pure (naturelle)", en: "60 ml of pure (natural) rose water" },
    { fr: "100 g de sucre blanc", en: "100 g of white sugar" },
    { fr: "5 gouttes de colorant alimentaire rouge", en: "5 drops of red food colouring" },
    { fr: "Il te faut aussi un mélangeur électrique.", en: "You also need an electric mixer." },
  ],
];

const READING_TITLES = ["{Le titre et les questions}", "{Les roses}", "{L'eau de rose}", "{Dans la crème glacée}", "{Les ingrédients}"];

/** French on one line, English under it. */
const line = (w: Word) => `{${w.fr}}\n${w.en}`;

/* ---------- Nouns ---------- */

type Article = "Le" | "La" | "L'";
const NOUNS: { word: string; article: Article; en: string }[] = [
  { word: "pomme", article: "La", en: "the apple" },
  { word: "singe", article: "Le", en: "the monkey" },
  { word: "cahier", article: "Le", en: "the notebook" },
  { word: "orange", article: "L'", en: "the orange" },
  { word: "crayon", article: "Le", en: "the pencil" },
  { word: "horloge", article: "L'", en: "the clock" },
  { word: "maison", article: "La", en: "the house" },
  { word: "fille", article: "La", en: "the girl" },
  { word: "porte", article: "La", en: "the door" },
  { word: "bureau", article: "Le", en: "the desk" },
  { word: "chapeau", article: "Le", en: "the hat" },
  { word: "tigre", article: "Le", en: "the tiger" },
  { word: "chien", article: "Le", en: "the dog" },
  { word: "cheval", article: "Le", en: "the horse" },
  { word: "école", article: "L'", en: "the school" },
];

const withArticle = (n: (typeof NOUNS)[number]) => (n.article === "L'" ? `l'${n.word}` : `${n.article.toLowerCase()} ${n.word}`);

const GENDER_NUMBER = ["masculine, singular", "feminine, singular", "masculine, plural", "feminine, plural"];
const GENDERED: { label: string; bucket: string }[] = [
  { label: "les pommes", bucket: "feminine, plural" },
  { label: "le pupitre", bucket: "masculine, singular" },
  { label: "les chaises", bucket: "feminine, plural" },
  { label: "le chat", bucket: "masculine, singular" },
  { label: "la table", bucket: "feminine, singular" },
  { label: "le bureau", bucket: "masculine, singular" },
  { label: "les fraises", bucket: "feminine, plural" },
  { label: "la porte", bucket: "feminine, singular" },
  { label: "les crayons", bucket: "masculine, plural" },
  { label: "les chiens", bucket: "masculine, plural" },
];

const WHY_GENDER: Record<string, string> = {
  "les pommes": "One apple is {la pomme}, so it is feminine. {Les} means more than one.",
  "les chaises": "One chair is {la chaise}, so it is feminine. {Les} means more than one.",
  "les fraises": "One strawberry is {la fraise}, so it is feminine. {Les} means more than one.",
  "les crayons": "One pencil is {le crayon}, so it is masculine. {Les} means more than one.",
  "les chiens": "One dog is {le chien}, so it is masculine. {Les} means more than one.",
};

/* ---------- Topics ---------- */

const nombres = grade3({
  slug: "nombres",
  title: "Les nombres (1–100)",
  emoji: "🔢",
  learn: [
    {
      title: "1 to 10",
      points: ["**1** {un} · **2** {deux}", "**3** {trois} · **4** {quatre}", "**5** {cinq} · **6** {six}", "**7** {sept} · **8** {huit}", "**9** {neuf} · **10** {dix}"],
    },
    {
      title: "11 to 19",
      points: [
        "**11** {onze} · **12** {douze} · **13** {treize}",
        "**14** {quatorze} · **15** {quinze} · **16** {seize}",
        "From 17 it is **10 + 7**: {dix-sept}, {dix-huit}, {dix-neuf}.",
      ],
    },
    {
      title: "The tens",
      points: ["**10** {dix} · **20** {vingt}", "**30** {trente} · **40** {quarante}", "**50** {cinquante} · **60** {soixante}", "Watch out: **4** {quatre} and **40** {quarante} start the same way."],
    },
    {
      title: "Building numbers to 69",
      points: [
        "Ten word + a dash + one word: **22** {vingt-deux}, **35** {trente-cinq}, **48** {quarante-huit}.",
        "When it ends in **1**, say **{et un}** (and one): **21** {vingt et un}, **31** {trente et un}, **61** {soixante et un}.",
      ],
    },
    {
      title: "70s: sixty + ten",
      points: [
        "**70** = 60 + 10: {soixante-dix}",
        "**71** = 60 + 11: {soixante et onze}",
        "**72** {soixante-douze} … **77** {soixante-dix-sept} … **79** {soixante-dix-neuf}",
      ],
    },
    {
      title: "80s: four twenties",
      points: ["**80** = 4 × 20: {quatre-vingts}", "**81** {quatre-vingt-un}: no **s** and no **{et}**.", "**85** {quatre-vingt-cinq}"],
    },
    {
      title: "90s and 100",
      points: ["**90** = 80 + 10: {quatre-vingt-dix}", "**91** {quatre-vingt-onze} … **99** {quatre-vingt-dix-neuf}", "**100** {cent}"],
    },
  ],
  questions: [
    { id: "nb-70", type: "mcq", prompt: "How do you say **70** in French?", answer: "soixante-dix", wrong: ["septante", "sept-dix", "soixante"], explain: "70 = 60 + 10: {soixante-dix}." },
    { id: "nb-80", type: "mcq", prompt: "How do you say **80** in French?", answer: "quatre-vingts", wrong: ["huitante", "huit-dix", "quarante"], explain: "80 = 4 × 20: {quatre-vingts}." },
    { id: "nb-90", type: "mcq", prompt: "How do you say **90** in French?", answer: "quatre-vingt-dix", wrong: ["neuf-dix", "quatre-vingts", "soixante-dix"], explain: "90 = 80 + 10: {quatre-vingt-dix}." },
    { id: "nb-100", type: "mcq", prompt: "What number is {cent}?", answer: "100", wrong: ["10", "1,000", "50"] },
    { id: "nb-4x20", type: "tf", prompt: "{quatre-vingts} means four twenties: 4 × 20 = 80.", answer: true },
    { id: "nb-40", type: "mcq", prompt: "What number is {quarante}?", answer: "40", wrong: ["4", "14", "80"], explain: "{quatre} is 4, {quarante} is 40, {quatre-vingts} is 80." },
    { id: "nb-21", type: "mcq", prompt: "How do you say **21** in French?", answer: "vingt et un", wrong: ["vingt-un", "deux-un", "vingt-deux"], explain: "Numbers ending in 1 use **et un**: {vingt et un}." },
  ],
  generate: numberQuestion,
});

const presente = grade3({
  slug: "je-me-presente",
  title: "Je me présente",
  emoji: "👋",
  learn: [
    {
      title: "Three sentences about me",
      points: [
        "{Je m'appelle Quinn.}\nMy name is Quinn.",
        "{J'ai huit ans.}\nI am 8 years old.",
        "{Je suis en troisième année à l'école Pierre Angulaire.}\nI am in grade 3 at Cornerstone School.",
      ],
    },
    {
      title: "Age uses {avoir}",
      points: [
        "In French you **have** years: {J'ai huit ans} (I have eight years).",
        "Not {Je suis huit ans}.",
        "{ans} = years. **9** is {J'ai neuf ans}.",
      ],
    },
    {
      title: "Words to know",
      points: [
        "{Je m'appelle} = My name is",
        "{J'ai} = I have · {Je suis} = I am",
        "{troisième année} = third grade",
        "{l'école Pierre Angulaire} = Cornerstone School",
      ],
    },
  ],
  questions: [
    {
      id: "pr-name",
      type: "mcq",
      prompt: "How do you say **My name is…** in French?",
      answer: "Je m'appelle…",
      wrong: ["Je suis…", "J'ai…", "Il s'appelle…"],
      explain: "{Je m'appelle} = My name is.",
    },
    {
      id: "pr-age",
      type: "mcq",
      prompt: "How do you say **I am 8 years old**?",
      answer: "J'ai huit ans.",
      wrong: ["Je suis huit ans.", "J'ai huit.", "Je huit ans."],
      explain: "In French you **have** your age: {J'ai huit ans.}",
    },
    {
      id: "pr-age-9",
      type: "mcq",
      prompt: "How do you say **I am 9 years old**?",
      answer: "J'ai neuf ans.",
      wrong: ["Je suis neuf ans.", "J'ai dix ans.", "J'ai neuf."],
      explain: "{neuf} = 9. {J'ai neuf ans.}",
      difficulty: ["medium", "hard"],
    },
    {
      id: "pr-grade",
      type: "mcq",
      prompt: "What does {Je suis en troisième année} mean?",
      answer: "I am in grade 3.",
      wrong: ["I am 3 years old.", "I have 3 friends.", "I am in grade 4."],
    },
    { id: "pr-ans", type: "mcq", prompt: "In {J'ai huit ans}, what does {ans} mean?", answer: "years", wrong: ["friends", "and", "grade"] },
    {
      id: "pr-school",
      type: "mcq",
      prompt: "How do you say **Cornerstone School** in French?",
      answer: "l'école Pierre Angulaire",
      wrong: ["la maison Pierre Angulaire", "l'école Pierre", "la classe Angulaire"],
    },
    { id: "pr-avoir", type: "tf", prompt: "To say your age in French, you use **{avoir}** (to have).", answer: true, explain: "{J'ai huit ans.} I have eight years." },
    { id: "pr-troisieme", type: "tf", prompt: "{troisième} means **third**.", answer: true },
    {
      id: "pr-fill-appelle",
      type: "typed",
      prompt: "Fill in the blank:\n{Je m'___ Quinn.}",
      answer: "appelle",
      hint: "**My name is** = {Je m'appelle}",
      explain: "{Je m'appelle Quinn.}",
    },
    { id: "pr-fill-ans", type: "typed", prompt: "Fill in the blank:\n{J'ai huit ___.}", answer: "ans", hint: "It means **years**.", explain: "{J'ai huit ans.}" },
    {
      id: "pr-fill-suis",
      type: "typed",
      prompt: "Fill in the blank:\n{Je ___ en troisième année.}",
      answer: "suis",
      hint: "**I am** = {Je suis}",
      explain: "{Je suis en troisième année.}",
    },
    {
      id: "pr-order-age",
      type: "order",
      prompt: "Put the words in order: **I am 8 years old.**",
      items: ["J'ai", "huit", "ans."],
      explain: "{J'ai huit ans.}",
    },
    {
      id: "pr-order-grade",
      type: "order",
      prompt: "Put the words in order: **I am in grade 3 at Cornerstone School.**",
      items: ["Je suis", "en troisième année", "à l'école", "Pierre Angulaire."],
      explain: "{Je suis en troisième année à l'école Pierre Angulaire.}",
    },
    {
      id: "pr-write",
      type: "reflect",
      prompt: "Write your three sentences in French: your **name**, your **age**, and your **grade and school**.",
      explain: "{Je m'appelle Quinn. J'ai huit ans. Je suis en troisième année à l'école Pierre Angulaire.}",
      difficulty: ["medium", "hard"],
    },
  ],
});

/** Days and months both come from the generator part of the time. */
function joursMoisQuestion(_g: Grade, difficulty: Difficulty, rng: Rng): Question {
  const list = rng() < 0.5 ? DAYS : MONTHS;
  const noun = list === DAYS ? "day" : "month";
  return rng() < 0.5 ? sequenceQuestion(list, noun, difficulty, rng) : vocabQuestion(list, difficulty, rng, { write: true });
}

const DAY_SENTENCES: Word[] = [
  { fr: "Lundi, elle joue au soccer après l'école.", en: "On Monday she is playing soccer after school." },
  { fr: "Mercredi, elle marche à la maison après l'école.", en: "On Wednesday she is walking home after school." },
];

const MONTH_SENTENCES: Word[] = [
  { fr: "Le 31 octobre est le jour de l'Halloween.", en: "October 31st is Halloween." },
  { fr: "Le 25 décembre est le jour de Noël.", en: "December 25th is Christmas Day." },
  { fr: "Nous sommes en vacances les mois de juillet et août.", en: "We are on summer break in July and August." },
  { fr: "Nous retournons à l'école au début de septembre.", en: "We go back to school at the beginning of September." },
  { fr: "Nous finissons l'école à la fin de juin.", en: "We finish school at the end of June." },
];

const joursMois = grade3({
  slug: "jours-mois",
  title: "Les jours et les mois",
  emoji: "📅",
  learn: [
    { title: "{Les jours de la semaine}", points: DAYS.map((d) => `{${d.fr}} – ${d.en}`) },
    {
      title: "Where the names come from",
      points: [
        "{lundi}: {la lune}, the moon",
        "{mardi}: Mars · {mercredi}: Mercury",
        "{jeudi}: Jupiter · {vendredi}: Venus",
        "{samedi}: Saturn",
        "{dimanche}: the Lord's day",
      ],
    },
    {
      title: "Spot the pattern",
      points: ["Six days **end** in **{-di}**. It means **day**: {lundi}, {mardi}, {mercredi}…", "{dimanche} is different: it **starts** with **{di}**."],
    },
    { title: "{Les mois}: {janvier} to {juin}", points: MONTHS.slice(0, 6).map((m) => `{${m.fr}} – ${m.en}`) },
    { title: "{Les mois}: {juillet} to {décembre}", points: MONTHS.slice(6).map((m) => `{${m.fr}} – ${m.en}`) },
    {
      title: "Same start as English",
      points: [
        "Every month starts with the **same letter** as in English, and usually the **same two letters**: {janvier} and January both start with **ja**.",
        "Two months are different: {avril} (**av** / **ap**ril) and {août} (**ao** / **au**gust).",
      ],
    },
    {
      title: "Easy months",
      points: [
        "{septembre}, {octobre}, {novembre}, {décembre}: the English word with **-er** switched to **-re**.",
        "{mars}, {avril} and {mai} sound a lot like March, April and May.",
      ],
    },
    {
      title: "Tricky months",
      points: ["{janvier}, {février}, {juin}, {juillet}", "{août} sounds like **oot**.", "Tap each one to hear it."],
    },
    {
      title: "Small letters",
      points: ["In French, days and months start with a **small letter**: {le 25 décembre}, {lundi}.", "Use a capital only at the start of a sentence: {Lundi, elle joue au soccer.}"],
    },
    { title: "Sentences with days", points: DAY_SENTENCES.map(line) },
    { title: "Sentences with months", points: MONTH_SENTENCES.map(line) },
    {
      title: "Talk about you",
      points: ["{Mon jour préféré est samedi.}\nMy favourite day is Saturday.", "{Mon anniversaire est en mai.}\nMy birthday is in May."],
    },
  ],
  questions: [
    { id: "jm-order-days", type: "order", prompt: "Put the days in order, starting with Monday.", items: DAYS.map((d) => d.fr) },
    { id: "jm-order-months-1", type: "order", prompt: "Put the months in order.", items: MONTHS.slice(0, 6).map((m) => m.fr), difficulty: ["easy", "medium"] },
    { id: "jm-order-months-2", type: "order", prompt: "Put the months in order.", items: MONTHS.slice(6).map((m) => m.fr), difficulty: ["easy", "medium"] },
    { id: "jm-order-months", type: "order", prompt: "Put all 12 months in order.", items: MONTHS.map((m) => m.fr), difficulty: ["hard"] },
    { id: "jm-match-days", type: "match", prompt: "Match each day to its English name.", pairs: DAYS.map((d) => [d.fr, d.en]), pick: 5, leftTitle: "Français", rightTitle: "English" },
    { id: "jm-match-months", type: "match", prompt: "Match each month to its English name.", pairs: MONTHS.map((m) => [m.fr, m.en]), pick: 5, leftTitle: "Français", rightTitle: "English" },
    ...translate("jm-day-sentence", [
      DAY_SENTENCES[0],
      DAY_SENTENCES[1],
      { fr: "Lundi, elle marche à la maison après l'école.", en: "On Monday she is walking home after school." },
      { fr: "Mercredi, elle joue au soccer après l'école.", en: "On Wednesday she is playing soccer after school." },
    ]).slice(0, 2),
    ...translate("jm-month-sentence", MONTH_SENTENCES),
    { id: "jm-planet-mardi", type: "mcq", prompt: "Which planet gives {mardi} its name?", answer: "Mars", wrong: ["Jupiter", "Venus", "Saturn"] },
    { id: "jm-planet-jeudi", type: "mcq", prompt: "Which planet gives {jeudi} its name?", answer: "Jupiter", wrong: ["Mars", "Mercury", "Saturn"] },
    { id: "jm-lune", type: "mcq", prompt: "{lundi} comes from {la lune}. What is {la lune}?", answer: "the moon", wrong: ["the sun", "Monday", "a star"] },
    { id: "jm-di", type: "tf", prompt: "Every day ends in **{-di}** except {dimanche}.", answer: true, explain: "{dimanche} starts with **{di}** instead." },
    {
      id: "jm-not-like-english",
      type: "mcq",
      prompt: "Which two months do **not** start with the same two letters as in English?",
      answer: "avril and août",
      wrong: ["mars and mai", "juin and juillet", "janvier and février"],
      explain: "{avril} / April and {août} / August.",
    },
    { id: "jm-capital", type: "tf", prompt: "In French, months start with a capital letter, like **{Octobre}**.", answer: false, explain: "Use a small letter: {le 31 octobre}." },
    { id: "jm-halloween", type: "mcq", prompt: "When is Halloween?", answer: "le 31 octobre", wrong: ["le 25 décembre", "le 31 août", "le 13 octobre"], explain: "{Le 31 octobre est le jour de l'Halloween.}" },
    { id: "jm-christmas", type: "mcq", prompt: "When is Christmas?", answer: "le 25 décembre", wrong: ["le 31 octobre", "le 25 novembre", "le 1 janvier"], explain: "{Le 25 décembre est le jour de Noël.}" },
    {
      id: "jm-septembre",
      type: "typed",
      prompt: "Finish the month **September**:\n{sept___}",
      answer: ["septembre", "embre"],
      explain: "{septembre}: like September with **-er** switched to **-re**.",
      difficulty: ["hard"],
    },
    {
      id: "jm-favourite",
      type: "reflect",
      prompt: "Say your favourite day in French:\n{Mon jour préféré est ___.}",
      explain: "For example: {Mon jour préféré est samedi.}",
      difficulty: ["medium", "hard"],
    },
    {
      id: "jm-birthday",
      type: "reflect",
      prompt: "Say your birthday month in French:\n{Mon anniversaire est en ___.}",
      explain: "For example: {Mon anniversaire est en mai.}",
      difficulty: ["medium", "hard"],
    },
  ],
  generate: joursMoisQuestion,
});

const AVOIR: Word[] = [
  { fr: "J'ai", en: "I have" },
  { fr: "Tu as", en: "You have" },
  { fr: "Il a", en: "He has" },
  { fr: "Elle a", en: "She has" },
  { fr: "Nous avons", en: "We have" },
  { fr: "Vous avez", en: "You (plural) have" },
  { fr: "Ils ont", en: "They have (boys)" },
  { fr: "Elles ont", en: "They have (girls)" },
];

const ETRE: Word[] = [
  { fr: "Je suis", en: "I am" },
  { fr: "Tu es", en: "You are" },
  { fr: "Il est", en: "He is" },
  { fr: "Elle est", en: "She is" },
  { fr: "Nous sommes", en: "We are" },
  { fr: "Vous êtes", en: "You (plural) are" },
  { fr: "Ils sont", en: "They are (boys)" },
  { fr: "Elles sont", en: "They are (girls)" },
];

/** The sheet's fill-in-the-blank sentences. */
const VERB_BLANKS: { blank: string; answer: string; verb: "avoir" | "être"; full: string; en: string; wrong: string[] }[] = [
  { blank: "J'___ un chien.", answer: "ai", verb: "avoir", full: "J'ai un chien.", en: "I have a dog.", wrong: ["as", "a", "suis"] },
  { blank: "Nous ___ une règle.", answer: "avons", verb: "avoir", full: "Nous avons une règle.", en: "We have a ruler.", wrong: ["avez", "ont", "sommes"] },
  { blank: "Vous ___ un lapin.", answer: "avez", verb: "avoir", full: "Vous avez un lapin.", en: "You have a rabbit.", wrong: ["avons", "as", "êtes"] },
  { blank: "Claude ___ intelligent.", answer: "est", verb: "être", full: "Claude est intelligent.", en: "Claude is smart.", wrong: ["es", "suis", "a"] },
  { blank: "Dominique et Yvette ___ aimables.", answer: "sont", verb: "être", full: "Dominique et Yvette sont aimables.", en: "Dominique and Yvette are kind.", wrong: ["est", "sommes", "ont"] },
];

const avoirEtre = grade3({
  slug: "avoir-etre",
  title: "Avoir et être",
  emoji: "🧩",
  learn: [
    {
      title: "{Les pronoms}",
      points: [
        "{je} = I · {tu} = you (one friend)",
        "{il} = he · {elle} = she",
        "{nous} = we",
        "{vous} = you (more than one, or polite)",
        "{ils} = they (boys, or boys and girls) · {elles} = they (only girls)",
      ],
    },
    { title: "{être} = to be", points: ETRE.map((w) => `{${w.fr}} – ${w.en}`) },
    { title: "{avoir} = to have", points: AVOIR.map((w) => `{${w.fr}} – ${w.en}`) },
    {
      title: "{Je} + {ai} = {J'ai}",
      points: ["{je} drops its **e** before a vowel: {J'ai}, not {Je ai}.", "{Je suis} keeps its **e**: {suis} starts with **s**."],
    },
    { title: "Sentences", points: VERB_BLANKS.map((b) => line({ fr: b.full, en: b.en })) },
  ],
  questions: [
    {
      id: "ae-match-pronouns",
      type: "match",
      prompt: "Match each pronoun to its English meaning.",
      pairs: [
        ["je", "I"],
        ["tu", "you (one friend)"],
        ["il", "he"],
        ["elle", "she"],
        ["nous", "we"],
        ["vous", "you (plural or polite)"],
        ["ils", "they (boys)"],
        ["elles", "they (girls)"],
      ],
      pick: 5,
      leftTitle: "Français",
      rightTitle: "English",
    },
    {
      id: "ae-sort",
      type: "sort",
      prompt: "Is it a form of **{avoir}** or **{être}**?",
      buckets: ["avoir (to have)", "être (to be)"],
      items: [
        ...["ai", "as", "avons", "avez", "ont"].map((label) => ({ label, bucket: "avoir (to have)" })),
        ...["suis", "es", "sommes", "êtes", "sont"].map((label) => ({ label, bucket: "être (to be)" })),
      ],
      pick: 6,
    },
    { id: "ae-have", type: "mcq", prompt: "Which verb means **to have**?", answer: "avoir", wrong: ["être", "aller", "aimer"] },
    { id: "ae-be", type: "mcq", prompt: "Which verb means **to be**?", answer: "être", wrong: ["avoir", "aller", "faire"] },
    { id: "ae-elles-ont", type: "tf", prompt: "{Elles ont} means **they have**, for a group of girls.", answer: true },
    { id: "ae-je-ai", type: "mcq", prompt: "Which one is right?", answer: "J'ai", wrong: ["Je ai", "Je a", "J'as"], explain: "{je} drops its **e** before a vowel: {J'ai}." },
    { id: "ae-nous-sommes", type: "mcq", prompt: "What does {nous sommes} mean?", answer: "we are", wrong: ["we have", "you are", "they are"] },
    { id: "ae-vous-avez", type: "mcq", prompt: "What does {vous avez} mean?", answer: "you have (plural)", wrong: ["you are (plural)", "we have", "they have"] },
    ...VERB_BLANKS.map(
      (b, i): Question => ({
        id: `ae-blank-${i}`,
        type: "mcq",
        prompt: `Fill in the blank with **{${b.verb}}**:\n{${b.blank}}`,
        answer: b.answer,
        wrong: b.wrong,
        explain: `{${b.full}} = ${b.en}`,
        difficulty: ["easy", "medium"],
      }),
    ),
    ...VERB_BLANKS.map(
      (b, i): Question => ({
        id: `ae-blank-typed-${i}`,
        type: "typed",
        prompt: `Fill in the blank with **{${b.verb}}**:\n{${b.blank}}`,
        answer: b.answer,
        explain: `{${b.full}} = ${b.en}`,
        difficulty: ["hard"],
      }),
    ),
  ],
  generate: verbQuestion,
});

const emoji = (value: string): Figure => ({ id: "emoji", value });

/** Weather pictures: pick the French. Wrong choices are other weather phrases. */
const PICTURE_WEATHER: [string, string, string][] = [
  ["☀️", "Il fait soleil.", "It's sunny."],
  ["🌧️", "Il pleut.", "It's raining."],
  ["💨", "Il vente.", "It's windy."],
  ["❄️", "Il fait froid.", "It's cold."],
  ["⛈️", "Il fait mauvais.", "The weather is bad."],
];

const PICTURE_SEASONS: [string, string][] = [
  ["🌷", "le printemps"],
  ["🏖️", "l'été"],
  ["🍂", "l'automne"],
  ["⛄", "l'hiver"],
];

const temps = grade3({
  slug: "le-temps",
  title: "Le temps et les saisons",
  emoji: "🌦️",
  learn: [
    { title: "{Les saisons}", points: SEASONS.map((s) => `{${s.fr}} – ${s.en}`) },
    { title: "{Quel temps fait-il?}", points: ["{Quel temps fait-il aujourd'hui?}\nWhat is the weather like today?", "{Il fait beau aujourd'hui.}\nThe weather is nice today.", "{Il fait mauvais.}\nThe weather is bad."] },
    { title: "Sun, rain and wind", points: ["{Il fait soleil.} – It's sunny.", "{Il pleut aujourd'hui.} – It's raining today.", "{Il vente.} – It's windy."] },
    { title: "Hot and cold", points: ["{Il fait chaud.} – It's hot.", "{Il fait froid.} – It's cold."] },
    {
      title: "{Il fait chaud} or {J'ai chaud}?",
      points: ["{Il fait…} talks about the **weather**: {Il fait froid.} It's cold outside.", "{J'ai…} talks about **you**: {J'ai froid.} I am cold.", "In French you **have** hot or cold, like you have your age."],
    },
  ],
  questions: [
    ...PICTURE_WEATHER.map(
      ([value, answer, en], i): Question => ({
        id: `tp-pic-${i}`,
        type: "mcq",
        prompt: "{Quel temps fait-il?}",
        figure: emoji(value),
        answer,
        wrong: PICTURE_WEATHER.filter((p) => p[1] !== answer).map((p) => p[1]),
        explain: `{${answer}} = ${en}`,
      }),
    ),
    ...PICTURE_SEASONS.map(
      ([value, answer], i): Question => ({
        id: `tp-season-${i}`,
        type: "mcq",
        prompt: "Which season is it?",
        figure: emoji(value),
        answer,
        wrong: PICTURE_SEASONS.filter((p) => p[1] !== answer).map((p) => p[1]),
        explain: `{${answer}} = ${SEASONS.find((s) => s.fr === answer)?.en}`,
      }),
    ),
    { id: "tp-match-seasons", type: "match", prompt: "Match each season.", pairs: SEASONS.map((s) => [s.fr, s.en]), leftTitle: "Français", rightTitle: "English" },
    { id: "tp-jai-froid", type: "mcq", prompt: "What does {J'ai froid} mean?", answer: "I am cold.", wrong: ["It's cold.", "I am hot.", "It's windy."], explain: "{J'ai…} is about you. {Il fait froid} is about the weather." },
    { id: "tp-il-fait-froid", type: "mcq", prompt: "How do you say **It's cold** (the weather)?", answer: "Il fait froid.", wrong: ["J'ai froid.", "Il fait chaud.", "Il pleut."] },
    { id: "tp-jai-chaud", type: "mcq", prompt: "How do you say **I am hot**?", answer: "J'ai chaud.", wrong: ["Je suis chaud.", "Il fait chaud.", "J'ai froid."], explain: "You **have** hot in French: {J'ai chaud.}" },
    { id: "tp-quel-temps", type: "mcq", prompt: "What does {Quel temps fait-il aujourd'hui?} mean?", answer: "What is the weather like today?", wrong: ["What time is it?", "What day is it today?", "Is it hot today?"] },
    { id: "tp-automne", type: "tf", prompt: "{l'automne} means **fall**.", answer: true },
    { id: "tp-beau", type: "mcq", prompt: "What does {Il fait beau} mean?", answer: "The weather is nice.", wrong: ["The weather is bad.", "It's windy.", "It's raining."] },
  ],
  generate: (_g, difficulty, rng) => vocabQuestion(rng() < 0.3 ? SEASONS : WEATHER, difficulty, rng),
});

const nom = grade3({
  slug: "le-nom",
  title: "Le nom: le, la, l', les",
  emoji: "🏷️",
  learn: [
    {
      title: "Masculine or feminine",
      points: ["Every French noun is **masculine** or **feminine**.", "{le} goes with masculine nouns: {le chien}, {le crayon}.", "{la} goes with feminine nouns: {la pomme}, {la maison}."],
    },
    {
      title: "{l'} before a vowel",
      points: ["Before **a, e, i, o, u** or **h**, {le} and {la} become {l'}.", "{l'orange}, {l'école}, {l'horloge}"],
    },
    {
      title: "{les} = more than one",
      points: [
        "{les} is for **plural** nouns: {les pommes}, {les chaises}.",
        "To know if it is masculine or feminine, think of **one**: {la pomme} → **feminine**.",
      ],
    },
    { title: "{Le} words (masculine)", points: ["{le singe}, {le cahier}, {le crayon}", "{le bureau}, {le chapeau}, {le tigre}", "{le chien}, {le cheval}, {le pupitre}, {le chat}"] },
    { title: "{La} words (feminine)", points: ["{la pomme}, {la maison}, {la fille}", "{la porte}, {la table}, {la chaise}, {la fraise}"] },
  ],
  questions: [
    ...NOUNS.map(
      (n): Question => ({
        id: `nm-article-${n.word}`,
        type: "mcq",
        prompt: `Which word goes in front?\n**___ {${n.word}}** (${n.en.replace("the ", "")})`,
        answer: n.article,
        wrong: (["Le", "La", "L'"] as const).filter((a) => a !== n.article),
        explain: n.article === "L'" ? `{${withArticle(n)}}: **${n.word}** starts with a vowel or h, so use {l'}.` : `{${withArticle(n)}} = ${n.en}`,
      }),
    ),
    {
      id: "nm-sort-article",
      type: "sort",
      prompt: "Sort the words by the article that goes in front.",
      buckets: ["Le", "La", "L'"],
      items: NOUNS.map((n) => ({ label: n.word, bucket: n.article })),
      pick: 8,
    },
    {
      id: "nm-sort-gender",
      type: "sort",
      prompt: "Masculine or feminine? One or more than one?",
      buckets: GENDER_NUMBER,
      items: GENDERED,
      pick: 6,
      difficulty: ["medium", "hard"],
    },
    ...GENDERED.filter((g) => g.label.startsWith("les") || g.label === "la table" || g.label === "le pupitre").map(
      (g): Question => ({
        id: `nm-gender-${g.label.replace(" ", "-")}`,
        type: "mcq",
        prompt: `{${g.label}} is…`,
        answer: g.bucket,
        wrong: GENDER_NUMBER.filter((b) => b !== g.bucket),
        explain: WHY_GENDER[g.label] ?? `{${g.label}}: ${g.bucket}.`,
      }),
    ),
    { id: "nm-les", type: "mcq", prompt: "What does {les} tell you?", answer: "There is more than one.", wrong: ["It is masculine.", "It is feminine.", "There is only one."] },
    { id: "nm-l-vowel", type: "tf", prompt: "We write {l'} when the noun starts with a vowel or h, like {l'école}.", answer: true },
    { id: "nm-pomme", type: "mcq", prompt: "What does {la pomme} mean?", answer: "the apple", wrong: ["the door", "the house", "the girl"] },
    { id: "nm-horloge", type: "mcq", prompt: "What does {l'horloge} mean?", answer: "the clock", wrong: ["the school", "the orange", "the hat"] },
    { id: "nm-cheval", type: "mcq", prompt: "What does {le cheval} mean?", answer: "the horse", wrong: ["the dog", "the monkey", "the tiger"] },
  ],
});

/** The reading's shorter lines, for matching and translating. */
const SHORT_LINES = READING.flat().filter((w) => w.fr.length <= 45 && !/^\d/.test(w.fr));

const oral = grade3({
  slug: "oral",
  title: "Examen oral",
  emoji: "🎤",
  learn: [
    ...READING.map((lines, i) => ({ title: READING_TITLES[i], points: lines.map(line) })),
    { title: "Expressions", points: EXPRESSIONS.map((w) => `${w.en}\n{${w.fr}}`) },
  ],
  questions: [
    { id: "or-match-1", type: "match", prompt: "Match the French to the English.", pairs: SHORT_LINES.map((w) => [w.fr, w.en]), pick: 4, leftTitle: "Français", rightTitle: "English" },
    ...translate("or-line", SHORT_LINES),
    {
      id: "or-make",
      type: "mcq",
      prompt: "How do you make rose water?",
      answer: "Leave rose petals in boiling water for several hours.",
      wrong: ["Freeze rose petals in ice cream.", "Mix roses with sugar.", "Squeeze roses into cream."],
      passage: "{Lorsqu'on laisse des pétales de roses dans l'eau bouillante pendant plusieurs heures, on obtient de l'eau de rose.}",
    },
    { id: "or-rose-water", type: "mcq", prompt: "How much rose water do you need?", answer: "60 ml", wrong: ["500 ml", "100 ml", "5 ml"], explain: "{60 ml d'eau de rose pure}" },
    { id: "or-cream", type: "mcq", prompt: "How much cream do you need?", answer: "500 ml", wrong: ["60 ml", "100 ml", "35 ml"], explain: "{500 ml de crème bien froide}" },
    { id: "or-drops", type: "mcq", prompt: "How many drops of red food colouring?", answer: "5", wrong: ["60", "35", "100"], explain: "{5 gouttes de colorant alimentaire rouge}" },
    { id: "or-adult", type: "mcq", prompt: "Who must make the recipe with you?", answer: "An adult", wrong: ["A friend", "Your teacher", "Nobody"], explain: "{Cette recette doit être faite avec un adulte.}" },
    { id: "or-mixer", type: "mcq", prompt: "What machine do you need?", answer: "An electric mixer", wrong: ["An oven", "A blender", "A freezer"], explain: "{Il te faut aussi un mélangeur électrique.}" },
    { id: "or-perfume", type: "mcq", prompt: "Besides food, what do some people use rose water as?", answer: "Perfume", wrong: ["Soap", "Paint", "Medicine"], explain: "{Certaines personnes utilisent l'eau de rose comme parfum.}" },
    { id: "or-sucre", type: "mcq", prompt: "What does {sucre} mean?", answer: "sugar", wrong: ["salt", "cream", "flour"] },
    { id: "or-gouttes", type: "mcq", prompt: "What does {gouttes} mean?", answer: "drops", wrong: ["cups", "grams", "petals"] },
    { id: "or-sentent", type: "tf", prompt: "{Elles sentent si bon} means **They smell so good**.", answer: true },
    ...EXPRESSIONS.map(
      (w, i): Question => ({
        id: `or-expr-${i}`,
        type: "mcq",
        prompt: `How do you say **${w.en}** in French?`,
        answer: w.fr,
        wrong: EXPRESSIONS.filter((o) => o !== w).map((o) => o.fr),
        explain: `{${w.fr}}`,
      }),
    ),
    ...EXPRESSIONS.slice(0, 3).map(
      (w, i): Question => ({
        id: `or-say-${i}`,
        type: "reflect",
        prompt: `Say it out loud in French: **${w.en}**`,
        explain: `{${w.fr}}`,
        difficulty: ["medium", "hard"],
      }),
    ),
  ],
  generate: (_g, difficulty, rng) => vocabQuestion(rng() < 0.5 ? EXPRESSIONS : SHORT_LINES, difficulty, rng),
});

export const french: Subject = {
  slug: "french",
  title: "French",
  emoji: "🇫🇷",
  blurb: "Nombres, jours, mois, avoir & être",
  tint: "bg-blue-50 text-blue-700",
  topics: [nombres, presente, joursMois, avoirEtre, temps, nom, oral],
};


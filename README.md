# Exam Study Buddy

An interactive, tablet-friendly study guide for the Cornerstone Montessori Grade 4.3 **Term 1** exams. It's built from the teacher's prep sheet, with a Grade 3 / Grade 4 toggle and Easy / Medium / Hard levels.

Built with Next.js 16, React 19, Tailwind CSS 4 and shadcn/ui.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000 (also reachable on your Wi-Fi)
```

**On a tablet:** keep the Mac and tablet on the same Wi-Fi, then open `http://<your-mac-ip>:3000` on the tablet. Get the IP with `ipconfig getifaddr en0`. In Safari, use **Share → Add to Home Screen** to open it full-screen like an app.

For a faster, production-style server, run:

```bash
npm run build && npm start
```

**Deploy:** the app is fully static and has no secrets, so `npx vercel` works as-is.

## What's inside

- **Subjects:** Language, Phonics & Spelling, Math, Financial Literacy, Coding, Social Studies, Maps & Topography, Science, and Christian Education.
- **Each topic** has **Learn** cards you can swipe through, and **Practise** questions.
- **Question types:** multiple choice, true/false, typing, sorting into boxes, matching, putting things in order, tapping word parts, tapping pictures (flower parts, contour map, town map, map of Canada), and a robot coding puzzle.
- **Levels:**
  - **Easy:** 6 questions, fewer choices, hints, and a second try.
  - **Medium:** 8 questions, with more choices and some typing.
  - **Hard:** 10 questions, with more typing, bigger numbers and no hints.
- **Math questions** are generated fresh every round, matched to the selected grade.
- **Stars** are saved on the device. Open **My stars** to see them, or to reset them.
- **🔊 Read aloud** uses the tablet's built-in voice.

## Editing content

All content is in `src/content/`, with one file per subject.

- **Spelling words:** the prep sheet lists "Spelling words from lessons 1–5" but doesn't include the words. Put the real list in `src/content/spelling-words.ts`.

Run `npm test` after you edit. It checks that every answer is valid, that every robot puzzle can be solved, that the math is correct, and that each topic has enough questions for every level.

/**
 * Records every French or Chinese phrase in the app with a macOS voice, into public/<lang>/<key>.m4a,
 * and lists them in src/lib/audio-<lang>.json. Only new phrases are recorded; unused files are removed.
 *
 *   npm run audio -- fr
 *   npm run audio -- zh
 *   VOICE="Amélie (Premium)" npm run audio -- fr --all   # re-record everything with another voice
 */
import { execFile } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { audioKey, type RecordedLang } from "@/lib/audio";
import { spokenPhrases } from "@/lib/phrases";

/** Rates are words per minute: a little slower than normal, for learners. */
const LANGS: Record<RecordedLang, { voice: string; rate: string }> = {
  fr: { voice: "Amélie", rate: "150" },
  zh: { voice: "Tingting", rate: "150" },
};

const run = promisify(execFile);
const ROOT = process.cwd();
const lang = process.argv.find((a): a is RecordedLang => a in LANGS);
const all = process.argv.includes("--all");

async function main() {
  if (!lang) throw new Error(`Say which language to record: ${Object.keys(LANGS).join(" or ")}.`);
  if (process.platform !== "darwin") throw new Error("This script uses the macOS `say` command.");
  const VOICE = process.env.VOICE ?? LANGS[lang].voice;
  const RATE = process.env.RATE ?? LANGS[lang].rate;
  const OUT = join(ROOT, "public", lang);
  const MANIFEST = join(ROOT, "src", "lib", `audio-${lang}.json`);

  const { stdout } = await run("say", ["-v", "?"]);
  if (!stdout.split("\n").some((l) => l.startsWith(VOICE + " ") || l.startsWith(VOICE + "\t"))) {
    throw new Error(`Voice "${VOICE}" is not installed. Run \`say -v '?'\` to see the voices.`);
  }

  mkdirSync(OUT, { recursive: true });
  const phrases = spokenPhrases(lang);
  const byKey = new Map<string, string>();
  for (const p of phrases) {
    const key = audioKey(p);
    const other = byKey.get(key);
    if (other && other !== p) throw new Error(`Two phrases share the file ${key}: "${other}" and "${p}"`);
    byKey.set(key, p);
  }

  const todo = [...byKey].filter(([key]) => all || !existsSync(join(OUT, `${key}.m4a`)));
  console.log(`${byKey.size} phrases, recording ${todo.length} with ${VOICE}…`);

  // A few at a time keeps it quick without overloading the speech engine.
  const tmp = mkdtempSync(join(tmpdir(), `audio-${lang}-`));
  let done = 0;
  const worker = async () => {
    for (let job = todo.shift(); job; job = todo.shift()) {
      const [key, text] = job;
      // `say` writes large files, so record uncompressed and encode small AAC (about 8 KB a second).
      const raw = join(tmp, `${key}.aiff`);
      await run("say", ["-v", VOICE, "-r", RATE, "-o", raw, "--", text]);
      await run("afconvert", ["-f", "m4af", "-d", "aac", "-b", "24000", raw, join(OUT, `${key}.m4a`)]);
      rmSync(raw);
      if (++done % 50 === 0) console.log(`  ${done}`);
    }
  };
  await Promise.all(Array.from({ length: 6 }, worker));
  rmSync(tmp, { recursive: true, force: true });

  let removed = 0;
  for (const f of readdirSync(OUT)) {
    if (!byKey.has(f.replace(/\.m4a$/, ""))) {
      rmSync(join(OUT, f));
      removed++;
    }
  }
  writeFileSync(MANIFEST, JSON.stringify([...byKey.keys()].sort(), null, 0) + "\n");
  console.log(`Done. ${removed} unused file(s) removed. Wrote ${MANIFEST}.`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});

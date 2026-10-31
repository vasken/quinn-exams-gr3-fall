/**
 * Records every French phrase in the app with a macOS voice, into public/fr/<key>.m4a,
 * and lists them in src/lib/french-audio.json. Only new phrases are recorded; unused files are removed.
 *
 *   npm run audio:french
 *   FRENCH_VOICE="Amélie (Premium)" npm run audio:french -- --all   # re-record everything with another voice
 */
import { execFile } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { audioKey } from "@/lib/french-audio";
import { frenchPhrases } from "@/lib/french-phrases";

const run = promisify(execFile);
const ROOT = process.cwd();
const OUT = join(ROOT, "public", "fr");
const MANIFEST = join(ROOT, "src", "lib", "french-audio.json");
const VOICE = process.env.FRENCH_VOICE ?? "Amélie";
/** Words per minute: a little slower than normal, for learners. */
const RATE = process.env.FRENCH_RATE ?? "150";
const all = process.argv.includes("--all");

async function main() {
  if (process.platform !== "darwin") throw new Error("This script uses the macOS `say` command.");
  const { stdout } = await run("say", ["-v", "?"]);
  if (!stdout.split("\n").some((l) => l.startsWith(VOICE + " ") || l.startsWith(VOICE + "\t"))) {
    throw new Error(`Voice "${VOICE}" is not installed. Run \`say -v '?'\` to see the voices.`);
  }

  mkdirSync(OUT, { recursive: true });
  const phrases = frenchPhrases();
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
  const tmp = mkdtempSync(join(tmpdir(), "french-audio-"));
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

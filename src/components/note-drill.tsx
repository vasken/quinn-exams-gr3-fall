"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { primaryButton, secondaryButton } from "@/components/button-styles";
import { StaffView } from "@/components/figures/staff";
import { Tile, type TileState } from "@/components/questions/shared";
import { Progress } from "@/components/ui/progress";
import type { Difficulty, StaffNote } from "@/content/types";
import { NOTE_RANGE, drillNote } from "@/lib/generators/music";
import { LETTERS, letter } from "@/lib/music";
import { DIFFICULTY_INFO, useSettings } from "@/lib/settings";
import { createStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const SECONDS = 60;

type Best = Record<string, Partial<Record<Difficulty, number>>>;
const bestStore = createStore<Best>("study-guide:drill:v1", {});

function saveBest(key: string, difficulty: Difficulty, score: number) {
  const all = bestStore.read();
  if (score <= (all[key]?.[difficulty] ?? 0)) return;
  bestStore.write({ ...all, [key]: { ...all[key], [difficulty]: score } });
}

/** One-minute note-naming speed test on the grand staff. */
export function NoteDrill({ drillKey, backHref }: { drillKey: string; backHref: string }) {
  const settings = useSettings();
  const best = bestStore.useValue();
  if (!settings || !best) return <div className="py-20 text-center text-2xl text-muted-foreground">Getting ready…</div>;
  return <Drill key={settings.difficulty} difficulty={settings.difficulty} best={best[drillKey]?.[settings.difficulty] ?? 0} drillKey={drillKey} backHref={backHref} />;
}

function Drill({ difficulty, best, drillKey, backHref }: { difficulty: Difficulty; best: number; drillKey: string; backHref: string }) {
  const [phase, setPhase] = useState<"ready" | "running" | "done">("ready");
  const [note, setNote] = useState<StaffNote>(() => drillNote(difficulty, Math.random));
  const [score, setScore] = useState(0);
  const [tries, setTries] = useState(0);
  const [endAt, setEndAt] = useState(0);
  const [now, setNow] = useState(0);
  const [bestBefore, setBestBefore] = useState(best);
  const [feedback, setFeedback] = useState<{ picked: string; ok: boolean } | null>(null);

  useEffect(() => {
    if (phase !== "running") return;
    const timer = setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (t >= endAt) setPhase("done");
    }, 100);
    return () => clearInterval(timer);
  }, [phase, endAt]);

  useEffect(() => {
    if (phase === "done") saveBest(drillKey, difficulty, score);
  }, [phase, drillKey, difficulty, score]);

  function start() {
    const t = Date.now();
    setBestBefore(best);
    setScore(0);
    setTries(0);
    setFeedback(null);
    setNote((n) => drillNote(difficulty, Math.random, n.pos));
    setNow(t);
    setEndAt(t + SECONDS * 1000);
    setPhase("running");
  }

  function answer(l: string) {
    if (phase !== "running" || feedback) return;
    const ok = l === letter(note.pos);
    setTries((n) => n + 1);
    if (ok) setScore((s) => s + 1);
    setFeedback({ picked: l, ok });
    setTimeout(
      () => {
        setFeedback(null);
        setNote((n) => drillNote(difficulty, Math.random, n.pos));
      },
      ok ? 250 : 900,
    );
  }

  // Letter keys work too, on a keyboard.
  useEffect(() => {
    if (phase !== "running") return;
    const onKey = (e: KeyboardEvent) => {
      const l = e.key.toUpperCase();
      if ((LETTERS as readonly string[]).includes(l)) answer(l);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const left = Math.max(0, endAt - now) / 1000;
  const level = DIFFICULTY_INFO[difficulty].label;

  if (phase === "done") {
    return (
      <div className="animate-pop mx-auto max-w-lg rounded-2xl border bg-white p-8 text-center">
        <p className="text-6xl font-bold tabular-nums">{score}</p>
        <h2 className="mt-2 text-2xl font-bold">{score === 1 ? "note" : "notes"} named in one minute</h2>
        <p className="mt-2 text-lg text-muted-foreground">
          {tries - score > 0 ? `${tries - score} missed. ` : ""}
          {score > bestBefore && bestBefore > 0 ? "New best!" : Math.max(best, score) > 0 ? `Best on ${level}: ${Math.max(best, score)}` : ""}
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <button type="button" onClick={start} className={primaryButton}>
            <RotateCcw className="size-5" /> Try again
          </button>
          <Link href={backHref} className={secondaryButton}>
            Back to topics
          </Link>
        </div>
      </div>
    );
  }

  const running = phase === "running";
  const correct = letter(note.pos);
  const tileState = (l: string): TileState => {
    if (!feedback) return "idle";
    if (l === correct) return "right";
    if (l === feedback.picked) return "wrong";
    return "muted";
  };

  return (
    <div className="mx-auto max-w-3xl pb-10">
      <div className="mb-4 flex items-center gap-3">
        <Progress value={running ? (left / SECONDS) * 100 : 100} className="h-3 flex-1 bg-border" />
        <span className="w-12 shrink-0 text-right text-lg font-bold tabular-nums text-muted-foreground">{Math.ceil(running ? left : SECONDS)}s</span>
        <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-lg font-bold tabular-nums text-secondary-foreground">{score}</span>
      </div>

      <div className={cn("rounded-2xl border bg-white p-3", feedback && !feedback.ok && "animate-shake")}>
        <StaffView
          clef="grand"
          notes={running ? [{ ...note, id: "q" }] : []}
          columns={1}
          room={{ treble: NOTE_RANGE.treble[difficulty], bass: NOTE_RANGE.bass[difficulty] }}
          marks={feedback ? { q: feedback.ok ? "right" : "wrong" } : undefined}
          className="mx-auto h-72 w-full sm:h-96"
        />
      </div>

      {running ? (
        <div className="mt-4 grid grid-cols-7 gap-2">
          {LETTERS.map((l) => (
            <Tile key={l} state={tileState(l)} onClick={() => answer(l)} className="px-0 text-2xl">
              {l}
            </Tile>
          ))}
        </div>
      ) : (
        <div className="mt-5 flex flex-col items-center gap-3 text-center">
          <p className="text-xl">Name as many notes as you can in one minute.</p>
          {best > 0 && <p className="text-lg text-muted-foreground">Best on {level}: {best}</p>}
          <button type="button" onClick={start} className={cn(primaryButton, "w-full max-w-xs text-xl")}>
            Start
          </button>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, RotateCcw, X } from "lucide-react";
import { primaryButton, secondaryButton } from "@/components/button-styles";
import { Figure } from "@/components/figures";
import { QuestionBody, type SubmitResult } from "@/components/questions";
import { RichText } from "@/components/rich-text";
import { SpeakButton } from "@/components/speak-button";
import { Progress } from "@/components/ui/progress";
import type { Difficulty, Grade, Topic } from "@/content/types";
import { saveStars, starsFor } from "@/lib/progress";
import { buildSession } from "@/lib/select-questions";
import { DIFFICULTY_INFO, useSettings } from "@/lib/settings";
import { speak, stopSpeaking } from "@/lib/speech";
import { cn } from "@/lib/utils";
import { Stars } from "./topic-list";

const CHEERS = ["Great job!", "You got it!", "That's right!", "Well done!", "Correct!"];
const OOPS = ["Not quite. That's okay!", "Good try. Here's the answer.", "Almost! Here's the answer."];

interface SessionProps {
  topics: Topic[];
  /** Where stars are saved (one topic, or a whole-subject key). */
  progressKey: string;
  backHref: string;
  learnHref?: string;
  /** Multiply the usual number of questions (the mixed quiz is longer). */
  countScale?: number;
}

export function PracticeSession(props: SessionProps) {
  const settings = useSettings();
  const [round, setRound] = useState(0);
  if (!settings) return <div className="py-20 text-center text-2xl text-muted-foreground">Getting ready…</div>;
  return (
    <Session
      key={`${settings.grade}-${settings.difficulty}-${round}`}
      {...props}
      grade={settings.grade}
      difficulty={settings.difficulty}
      autoRead={settings.autoRead}
      onAgain={() => setRound((r) => r + 1)}
    />
  );
}

function Session({
  topics,
  progressKey,
  backHref,
  learnHref,
  countScale = 1,
  grade,
  difficulty,
  autoRead,
  onAgain,
}: SessionProps & { grade: Grade; difficulty: Difficulty; autoRead: boolean; onAgain: () => void }) {
  const [items] = useState(() => buildSession(topics, grade, difficulty, Math.random, DIFFICULTY_INFO[difficulty].count * countScale));
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState<"idle" | "retry" | "right" | "wrong">("idle");
  const [tries, setTries] = useState(0);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [message, setMessage] = useState("");
  const [finished, setFinished] = useState(false);

  const item = items[index];
  const gentle = topics.every((t) => t.gentle);
  const locked = status === "right" || status === "wrong";

  useEffect(() => {
    if (autoRead && item) speak(item.q.say ?? item.q.prompt);
    return stopSpeaking;
  }, [autoRead, item]);

  if (!items.length) {
    return <p className="py-16 text-center text-xl">No questions here for this grade yet. Try another topic!</p>;
  }

  function submit(correct: boolean, final = false): SubmitResult {
    if (correct) {
      setStatus("right");
      setScore((s) => s + 1);
      setMessage(item.q.type === "reflect" ? "Thanks for sharing!" : gentle ? "That's right." : CHEERS[Math.floor(Math.random() * CHEERS.length)]);
      return "done";
    }
    if (difficulty === "easy" && tries === 0 && !final) {
      setTries(1);
      setStatus("retry");
      setMessage("Not quite. Try again!");
      return "retry";
    }
    setStatus("wrong");
    setMessage(gentle ? "Here is the answer." : OOPS[Math.floor(Math.random() * OOPS.length)]);
    return "done";
  }

  async function next() {
    if (index + 1 < items.length) {
      setIndex(index + 1);
      setStatus("idle");
      setTries(0);
      setShowHint(false);
      setMessage("");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const stars = starsFor(score, items.length);
    saveStars(progressKey, difficulty, stars);
    setFinished(true);
    window.scrollTo({ top: 0 });
    if (!gentle && stars === 3) {
      const confetti = (await import("canvas-confetti")).default;
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 }, colors: ["#2f5bd3", "#ffe38a", "#2e8b57"], disableForReducedMotion: true });
    }
  }

  if (finished) {
    const stars = starsFor(score, items.length);
    return (
      <div className="animate-pop mx-auto max-w-lg rounded-2xl border bg-white p-8 text-center">
        {gentle ? (
          <>
            <h2 className="text-3xl font-bold">Thank you for learning</h2>
            <p className="mt-2 text-xl">
              You answered <strong>{score}</strong> of <strong>{items.length}</strong> correctly.
            </p>
            <p className="mt-2 text-lg text-muted-foreground">Every Child Matters.</p>
          </>
        ) : (
          <>
            <Stars n={stars} className="[&_svg]:size-14" />
            <h2 className="mt-4 text-3xl font-bold">
              {stars === 3 ? "Amazing!" : stars === 2 ? "Great work!" : stars === 1 ? "Good effort!" : "Keep practising!"}
            </h2>
            <p className="mt-2 text-xl">
              You got <strong>{score}</strong> out of <strong>{items.length}</strong> on {DIFFICULTY_INFO[difficulty].label}.
            </p>
          </>
        )}
        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={onAgain}
            className={primaryButton}
          >
            <RotateCcw className="size-5" /> Practise again
          </button>
          {learnHref && (
            <Link href={learnHref} className={secondaryButton}>
              Review the lesson
            </Link>
          )}
          <Link href={backHref} className={secondaryButton}>
            Back to topics
          </Link>
        </div>
      </div>
    );
  }

  const { q } = item;
  const sideFigure = q.type !== "tap" && q.type !== "robot" && q.type !== "staff-write" && (q.figure || q.passage);

  return (
    <div className="pb-40">
      <div className="mb-4 flex items-center gap-3">
        <Progress value={((index + (locked ? 1 : 0)) / items.length) * 100} className="h-3 flex-1 bg-border" />
        <span className="shrink-0 text-lg font-bold tabular-nums text-muted-foreground">
          {index + 1} / {items.length}
        </span>
      </div>

      <div className={cn("grid gap-5", sideFigure && "lg:grid-cols-2 lg:items-start")}>
        {sideFigure && (
          <div className="rounded-2xl border bg-white p-4 lg:sticky lg:top-24">
            {q.passage && (
              <div className="flex items-start gap-3">
                <p className="flex-1 text-xl leading-relaxed">
                  <RichText text={q.passage} />
                </p>
                <SpeakButton text={q.passage} />
              </div>
            )}
            {q.figure && <Figure figure={q.figure} />}
          </div>
        )}

        <div key={item.key} className="animate-pop">
          <div className="mb-4 flex items-start gap-3">
            <h2 className="flex-1 text-2xl font-bold leading-snug sm:text-3xl">
              <RichText text={q.prompt} />
            </h2>
            <SpeakButton text={q.say ?? q.prompt} />
          </div>

          {difficulty === "easy" && q.hint && !locked && (
            <div className="mb-4">
              {showHint ? (
                <p className="rounded-xl border-l-4 border-amber-300 bg-white p-3 text-lg">
                  <RichText text={q.hint} />
                </p>
              ) : (
                <button type="button" onClick={() => setShowHint(true)} className="rounded-full border-2 border-border bg-white px-4 py-2 text-base font-bold text-muted-foreground">
                  Show a hint
                </button>
              )}
            </div>
          )}

          <QuestionBody item={item} locked={locked} onSubmit={submit} />
        </div>
      </div>

      {status !== "idle" && (
        <div
          className={cn(
            "fixed inset-x-0 bottom-0 z-30 border-t-4 bg-white pb-[max(1rem,env(safe-area-inset-bottom))] pt-4",
            status === "right" && "border-good",
            status === "wrong" && "border-bad",
            status === "retry" && "border-amber-300",
          )}
        >
          <div className="pad-safe mx-auto flex max-w-5xl flex-col gap-3 !pb-0 sm:flex-row sm:items-center">
            <div className="flex flex-1 items-start gap-3">
              <span
                className={cn(
                  "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full text-white",
                  status === "right" ? "bg-good" : status === "wrong" ? "bg-bad" : "bg-amber-400",
                )}
              >
                {status === "right" ? <Check className="size-6" strokeWidth={3} /> : <X className="size-6" strokeWidth={3} />}
              </span>
              <div>
              <p className="text-2xl font-bold">{message}</p>
              {locked && q.explain && (
                <p className="mt-1 text-lg">
                  <RichText text={q.explain} />
                </p>
              )}
              </div>
            </div>
            {locked && (
              <button
                type="button"
                onClick={next}
                autoFocus
                className={cn(primaryButton, "px-8 text-xl")}
              >
                {index + 1 < items.length ? "Next question" : "See my stars"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

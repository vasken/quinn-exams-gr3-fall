"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Mark } from "@/components/figures";
import { StaffView } from "@/components/figures/staff";
import type { StaffNote } from "@/content/types";
import { type Acc, samePitch } from "@/lib/music";
import { cn } from "@/lib/utils";
import { CheckButton, Instruction, type QProps } from "./shared";

const ACCS: { value: Acc | undefined; label: string; aria: string }[] = [
  { value: undefined, label: "No sign", aria: "No sharp or flat" },
  { value: "sharp", label: "♯", aria: "Sharp" },
  { value: "flat", label: "♭", aria: "Flat" },
];

const small = "chunky inline-flex min-h-12 min-w-12 items-center justify-center border-border border-b-[#c3cbd8] bg-white px-3 text-lg font-bold disabled:opacity-40";

/** Tap a line or space to draw a note, then add a sharp or flat if needed. */
export function StaffWriteQuestion({ item, locked, onSubmit }: QProps<"staff-write">) {
  const { q } = item;
  const [pos, setPos] = useState<number | null>(null);
  const [acc, setAcc] = useState<Acc | undefined>(undefined);
  const [missed, setMissed] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);
  const [shaking, setShaking] = useState(false);
  const [lo, hi] = q.range;

  function place(p: number) {
    if (locked) return;
    setPos(Math.min(hi, Math.max(lo, p)));
    setMissed(false);
  }

  function chooseAcc(a: Acc | undefined) {
    if (locked) return;
    setAcc(a);
    setMissed(false);
  }

  function check() {
    if (locked || pos === null) return;
    const ok = q.answer.some((a) => samePitch(a, { pos, acc }));
    const r = onSubmit(ok);
    if (!ok && r === "retry") {
      setMissed(true);
      setShaking(true);
    } else setResult(ok);
  }

  const given = q.given ?? [];
  const notes: StaffNote[] = [...given];
  const marks: Record<string, Mark> = {};
  if (pos !== null) {
    notes.push({ id: "answer", pos, acc });
    if (result === true) marks.answer = "right";
    else if (result === false || missed) marks.answer = "wrong";
  }
  if (result === false) {
    const a = q.answer[0];
    notes.push({ id: "reveal", pos: a.pos, acc: a.acc });
    marks.reveal = "reveal";
  }

  return (
    <div>
      <Instruction>Tap a line or space on the staff{q.accidentals ? ", then choose a sign" : ""}.</Instruction>
      <div className={cn("rounded-2xl border bg-white p-2", shaking && "animate-shake")} onAnimationEnd={() => setShaking(false)}>
        <StaffView
          clef={q.clef}
          notes={notes}
          columns={given.length + 2}
          marks={marks}
          pick={locked ? undefined : { range: q.range, onPick: place }}
          className="mx-auto w-full max-w-2xl touch-manipulation select-none"
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        <button type="button" className={small} aria-label="Move note up" disabled={locked || pos === null || pos >= hi} onClick={() => pos !== null && place(pos + 1)}>
          <ChevronUp className="size-6" />
        </button>
        <button type="button" className={small} aria-label="Move note down" disabled={locked || pos === null || pos <= lo} onClick={() => pos !== null && place(pos - 1)}>
          <ChevronDown className="size-6" />
        </button>
        {q.accidentals && (
          <div role="radiogroup" aria-label="Sharp or flat" className="ml-3 flex gap-2">
            {ACCS.map((a) => (
              <button
                key={a.aria}
                type="button"
                role="radio"
                aria-checked={acc === a.value}
                aria-label={a.aria}
                disabled={locked}
                onClick={() => chooseAcc(a.value)}
                className={cn(small, a.value && "text-2xl", acc === a.value && "border-primary border-b-[#1d3f9c] bg-secondary text-secondary-foreground")}
              >
                {a.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {!locked && <CheckButton disabled={pos === null} onClick={check} />}
    </div>
  );
}

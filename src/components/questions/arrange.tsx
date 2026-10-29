"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CheckButton, Instruction, type QProps, Tile, type TileState } from "./shared";

/* ---------- Sort into buckets ---------- */

export function SortQuestion({ item, locked, onSubmit }: QProps<"sort">) {
  const { q } = item;
  const labels = item.shuffled ?? q.items.map((i) => i.label);
  const correctBucket = Object.fromEntries(q.items.map((i) => [i.label, i.bucket]));
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [bounced, setBounced] = useState<string[]>([]);

  const tray = labels.filter((l) => !placed[l]);

  function drop(bucket: string) {
    if (locked || !selected) return;
    setPlaced({ ...placed, [selected]: bucket });
    // Keep going with the next word to make tapping quick.
    const next = tray.find((l) => l !== selected) ?? null;
    setSelected(next);
  }

  function check() {
    const wrong = labels.filter((l) => placed[l] !== correctBucket[l]);
    const r = onSubmit(wrong.length === 0);
    if (wrong.length && r === "retry") {
      const kept = { ...placed };
      wrong.forEach((l) => delete kept[l]);
      setPlaced(kept);
      setBounced(wrong);
      setSelected(wrong[0]);
    }
  }

  return (
    <div>
      {!locked && <Instruction>Tap a word, then tap the box it belongs in.</Instruction>}
      <div className="mb-4 flex min-h-16 flex-wrap justify-center gap-2 rounded-2xl border-2 border-dashed border-input p-3">
        {tray.length === 0 && !locked && <span className="self-center text-muted-foreground">All sorted! Press Check.</span>}
        {tray.map((l) => (
          <Tile
            key={l}
            state={selected === l ? "selected" : "idle"}
            className={cn("min-h-12 px-3 py-2 text-base", bounced.includes(l) && "animate-shake")}
            onClick={() => setSelected(selected === l ? null : l)}
          >
            {l}
          </Tile>
        ))}
      </div>
      <div className={cn("grid gap-3", q.buckets.length === 2 ? "grid-cols-2" : q.buckets.length === 4 ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-3")}>
        {q.buckets.map((b) => (
          <div
            key={b}
            role="button"
            tabIndex={0}
            onClick={() => drop(b)}
            onKeyDown={(e) => e.key === "Enter" && drop(b)}
            className={cn(
              "min-h-36 rounded-2xl border-2 bg-white p-3 transition-colors",
              selected && !locked ? "cursor-pointer border-primary bg-secondary/60 active:bg-secondary" : "border-border",
            )}
          >
            <div className="mb-2 text-center text-lg font-bold">{b}</div>
            <div className="flex flex-wrap justify-center gap-2">
              {labels
                .filter((l) => placed[l] === b)
                .map((l) => {
                  const ok = correctBucket[l] === b;
                  return (
                    <Tile
                      key={l}
                      state={locked ? (ok ? "right" : "wrong") : "idle"}
                      className="min-h-11 px-3 py-1.5 text-base"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (locked) return;
                        const rest = { ...placed };
                        delete rest[l];
                        setPlaced(rest);
                        setSelected(l);
                      }}
                    >
                      {l}
                      {locked && !ok && <span className="block text-sm font-normal">→ {correctBucket[l]}</span>}
                    </Tile>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
      {!locked && <CheckButton disabled={tray.length > 0} onClick={check} />}
    </div>
  );
}

/* ---------- Match pairs ---------- */

// Pale tints so you can see which tiles you have joined together.
const PAIR_COLORS = ["bg-sky-100", "bg-amber-100", "bg-rose-100", "bg-lime-100", "bg-violet-100", "bg-orange-100", "bg-teal-100", "bg-slate-200"];

export function MatchQuestion({ item, locked, onSubmit }: QProps<"match">) {
  const { q } = item;
  const lefts = q.pairs.map((p) => p[0]);
  const rights = item.shuffled ?? q.pairs.map((p) => p[1]);
  const answer = Object.fromEntries(q.pairs);
  // left label -> right label
  const [links, setLinks] = useState<Record<string, string>>({});
  const [selLeft, setSelLeft] = useState<string | null>(null);
  const [selRight, setSelRight] = useState<string | null>(null);

  const leftOf = (r: string) => Object.keys(links).find((l) => links[l] === r);
  const colorOf = (l: string) => PAIR_COLORS[lefts.indexOf(l) % PAIR_COLORS.length];

  function link(l: string, r: string) {
    const next = { ...links };
    for (const k of Object.keys(next)) if (next[k] === r) delete next[k];
    next[l] = r;
    setLinks(next);
    setSelLeft(null);
    setSelRight(null);
  }

  function tapLeft(l: string) {
    if (locked) return;
    if (links[l] && !selRight) {
      const next = { ...links };
      delete next[l];
      setLinks(next);
      setSelLeft(l);
      return;
    }
    if (selRight) link(l, selRight);
    else setSelLeft(selLeft === l ? null : l);
  }

  function tapRight(r: string) {
    if (locked) return;
    const owner = leftOf(r);
    if (owner && !selLeft) {
      const next = { ...links };
      delete next[owner];
      setLinks(next);
      setSelRight(r);
      return;
    }
    if (selLeft) link(selLeft, r);
    else setSelRight(selRight === r ? null : r);
  }

  function check() {
    const wrong = lefts.filter((l) => links[l] !== answer[l]);
    const r = onSubmit(wrong.length === 0);
    if (wrong.length && r === "retry") {
      const kept = { ...links };
      wrong.forEach((l) => delete kept[l]);
      setLinks(kept);
    }
  }

  const state = (selected: boolean, ok: boolean): TileState =>
    locked ? (ok ? "right" : "wrong") : selected ? "selected" : "idle";

  return (
    <div>
      {!locked && <Instruction>Tap one on the left, then its partner on the right.</Instruction>}
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        <div className="flex flex-col gap-3">
          {q.leftTitle && <div className="text-center font-bold">{q.leftTitle}</div>}
          {lefts.map((l) => (
            <Tile
              key={l}
              state={state(selLeft === l, links[l] === answer[l])}
              onClick={() => tapLeft(l)}
              className={cn("relative text-base sm:text-lg", !locked && links[l] && colorOf(l))}
            >
              {l}
              {locked && links[l] !== answer[l] && <span className="block text-sm font-normal">→ {answer[l]}</span>}
            </Tile>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          {q.rightTitle && <div className="text-center font-bold">{q.rightTitle}</div>}
          {rights.map((r) => {
            const owner = leftOf(r);
            return (
              <Tile
                key={r}
                state={state(selRight === r, !!owner && answer[owner] === r)}
                onClick={() => tapRight(r)}
                className={cn("text-base sm:text-lg", !locked && owner && colorOf(owner))}
              >
                {r}
              </Tile>
            );
          })}
        </div>
      </div>
      {!locked && <CheckButton disabled={Object.keys(links).length < lefts.length} onClick={check} />}
    </div>
  );
}

/* ---------- Put in order ---------- */

export function OrderQuestion({ item, locked, onSubmit }: QProps<"order">) {
  const { q } = item;
  const [seq, setSeq] = useState<string[]>([]);
  const pool = (item.shuffled ?? q.items).filter((s) => !seq.includes(s));

  function check() {
    const ok = seq.every((s, i) => s === q.items[i]);
    const r = onSubmit(ok);
    if (!ok && r === "retry") {
      // Keep the correct start, send the rest back.
      let k = 0;
      while (seq[k] === q.items[k]) k++;
      setSeq(seq.slice(0, k));
    }
  }

  return (
    <div>
      {!locked && <Instruction>Tap them in the right order. Tap a placed one to take it back.</Instruction>}
      <ol className="mb-4 flex flex-col gap-2">
        {q.items.map((_, i) => {
          const s = seq[i];
          return (
            <li key={i} className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-border bg-white text-lg font-bold text-muted-foreground">{i + 1}</span>
              {s ? (
                <Tile
                  state={locked ? (s === q.items[i] ? "right" : "wrong") : "idle"}
                  className="flex-1 text-left text-base sm:text-lg"
                  onClick={() => !locked && setSeq(seq.filter((x) => x !== s))}
                >
                  {s}
                  {locked && s !== q.items[i] && <span className="block text-sm font-normal">→ {q.items[i]}</span>}
                </Tile>
              ) : (
                <div className="min-h-14 flex-1 rounded-[0.875rem] border-2 border-dashed border-input" />
              )}
            </li>
          );
        })}
      </ol>
      {!locked && (
        <div className="flex flex-wrap justify-center gap-2">
          {pool.map((s) => (
            <Tile key={s} onClick={() => setSeq([...seq, s])} className="text-base sm:text-lg">
              {s}
            </Tile>
          ))}
        </div>
      )}
      {!locked && <CheckButton disabled={pool.length > 0} onClick={check} />}
    </div>
  );
}

/* ---------- Tap the letters of a word part ---------- */

export function WordPartsQuestion({ item, locked, onSubmit }: QProps<"wordparts">) {
  const { q } = item;
  const [sel, setSel] = useState<number[]>([]);
  const [shaking, setShaking] = useState(false);
  const inTarget = (i: number) => i >= q.target[0] && i < q.target[1];

  function check() {
    const ok = sel.length === q.target[1] - q.target[0] && sel.every(inTarget);
    const r = onSubmit(ok);
    if (!ok && r === "retry") {
      setSel([]);
      setShaking(true);
    }
  }

  return (
    <div>
      {!locked && <Instruction>Tap each letter to select it. Tap again to unselect.</Instruction>}
      <div className={cn("flex flex-wrap justify-center gap-1.5", shaking && "animate-shake")} onAnimationEnd={() => setShaking(false)}>
        {q.word.split("").map((ch, i) => {
          const on = sel.includes(i);
          const state: TileState = locked ? (inTarget(i) ? "right" : on ? "wrong" : "muted") : on ? "selected" : "idle";
          return (
            <Tile
              key={i}
              state={state}
              className="min-h-16 w-11 px-0 text-3xl sm:w-14"
              onClick={() => !locked && setSel(on ? sel.filter((x) => x !== i) : [...sel, i])}
            >
              {ch}
            </Tile>
          );
        })}
      </div>
      {!locked && <CheckButton disabled={sel.length === 0} onClick={check} />}
    </div>
  );
}

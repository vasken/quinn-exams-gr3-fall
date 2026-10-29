"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { type QProps, Tile } from "./shared";

/** Multiple choice and true/false. */
export function ChoiceQuestion({ item, locked, onSubmit }: QProps<"mcq" | "tf">) {
  const { q } = item;
  const choices = item.choices ?? [];
  const answer = q.type === "tf" ? (q.answer ? "True" : "False") : q.answer;
  const [picked, setPicked] = useState<string | null>(null);
  const [struck, setStruck] = useState<string[]>([]);

  function choose(c: string) {
    if (locked || struck.includes(c)) return;
    const result = onSubmit(c === answer);
    if (c !== answer && result === "retry") setStruck([...struck, c]);
    else setPicked(c);
  }

  const long = choices.some((c) => c.length > 22);
  return (
    <div className={cn("grid gap-3", long ? "grid-cols-1" : choices.length === 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2")}>
      {choices.map((c) => {
        const state = locked
          ? c === answer
            ? "right"
            : c === picked
              ? "wrong"
              : "muted"
          : struck.includes(c)
            ? "wrong"
            : "idle";
        return (
          <Tile
            key={c}
            state={state}
            onClick={() => choose(c)}
            disabled={locked || struck.includes(c)}
            className={cn(q.type === "tf" && "text-2xl", struck.includes(c) && "line-through")}
          >
            {q.type === "tf" ? (c === "True" ? "👍 True" : "👎 False") : c}
          </Tile>
        );
      })}
    </div>
  );
}

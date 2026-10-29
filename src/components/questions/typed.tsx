"use client";

import { useState } from "react";
import { typedCorrect } from "@/lib/select-questions";
import { cn } from "@/lib/utils";
import { CheckButton, type QProps } from "./shared";

export function TypedQuestion({ item, locked, onSubmit }: QProps<"typed">) {
  const { q } = item;
  const [value, setValue] = useState("");
  const [shaking, setShaking] = useState(false);
  const [missed, setMissed] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);

  function check() {
    if (locked || !value.trim()) return;
    const ok = typedCorrect(value, q.answer);
    const r = onSubmit(ok);
    if (!ok && r === "retry") {
      setShaking(true);
      setMissed(true);
    } else setResult(ok);
  }

  const shown = Array.isArray(q.answer) ? q.answer[0] : q.answer;
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        check();
      }}
    >
      <input
        value={value}
        onAnimationEnd={() => setShaking(false)}
        onChange={(e) => setValue(e.target.value)}
        disabled={locked}
        inputMode={q.numeric ? "numeric" : "text"}
        autoCapitalize="off"
        autoCorrect="off"
        autoComplete="off"
        spellCheck={false}
        enterKeyHint="done"
        placeholder={q.numeric ? "Type the number" : "Type your answer"}
        aria-label="Your answer"
        className={cn(
          "block w-full rounded-2xl border-2 bg-white px-5 py-4 text-center text-3xl font-bold tracking-wide outline-none transition-colors",
          "border-input focus:border-primary focus:ring-4 focus:ring-primary/15",
          shaking && "animate-shake",
          missed && !locked && "border-bad",
          result === true && "border-good bg-emerald-50 text-emerald-900",
          result === false && "border-bad bg-red-50 text-red-900 line-through",
        )}
      />
      {result === false && (
        <p className="mt-3 text-center text-2xl font-bold text-good">
          Answer: <span className="rounded-md bg-highlight px-2 text-foreground">{shown}</span>
        </p>
      )}
      {!locked && <CheckButton disabled={!value.trim()} onClick={check} />}
    </form>
  );
}

export function ReflectQuestion({ locked, onSubmit }: QProps<"reflect">) {
  const [value, setValue] = useState("");
  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={locked}
        rows={3}
        placeholder="Write your answer here (or say it out loud to a grown-up!)"
        className="block w-full rounded-2xl border-2 border-input bg-white px-4 py-3 text-xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
      />
      {!locked && (
        <div className="flex flex-col items-center">
          <CheckButton label="I'm done" disabled={!value.trim()} onClick={() => onSubmit(true)} />
          <button type="button" className="mt-3 text-base text-muted-foreground underline underline-offset-4" onClick={() => onSubmit(true)}>
            I said it out loud instead
          </button>
        </div>
      )}
    </div>
  );
}

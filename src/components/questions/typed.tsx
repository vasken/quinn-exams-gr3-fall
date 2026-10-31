"use client";

import { useState } from "react";
import { primaryButton, secondaryButton } from "@/components/button-styles";
import { RichText } from "@/components/rich-text";
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
    const ok = typedCorrect(value, q.answer, { pinyin: q.pinyin });
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
        placeholder={q.numeric ? "Type the number" : q.pinyin ? "Type the pinyin" : "Type your answer"}
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

/** Write the answer on paper, then show it and say whether you got it. */
export function SelfCheckQuestion({ item, locked, onSubmit }: QProps<"selfcheck">) {
  const [shown, setShown] = useState(false);
  return (
    <div>
      {shown || locked ? (
        <div className="rounded-2xl border bg-white p-5 text-center">
          <div className="text-5xl font-bold leading-[1.6]">
            <RichText text={item.q.answer} pinyin />
          </div>
          {!locked && (
            <>
              <p className="mt-4 text-lg text-muted-foreground">Does yours match?</p>
              <div className="mt-3 flex flex-col justify-center gap-3 sm:flex-row">
                <button type="button" onClick={() => onSubmit(true, true)} className={cn(primaryButton, "text-xl")}>
                  Yes, I got it
                </button>
                <button type="button" onClick={() => onSubmit(false, true)} className={cn(secondaryButton, "text-xl")}>
                  Not yet
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <p className="text-lg text-muted-foreground">Write it on paper first.</p>
          <CheckButton label="Show the answer" onClick={() => setShown(true)} />
        </div>
      )}
    </div>
  );
}

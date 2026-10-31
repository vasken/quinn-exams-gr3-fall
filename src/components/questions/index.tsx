"use client";

import { useState } from "react";
import { Figure, type Mark } from "@/components/figures";
import { MatchQuestion, OrderQuestion, SortQuestion, WordPartsQuestion } from "./arrange";
import { ChoiceQuestion } from "./choice";
import { RobotQuestion } from "./robot";
import type { Prepared } from "@/lib/select-questions";
import type { QProps, SubmitResult } from "./shared";
import { StaffWriteQuestion } from "./staff-write";
import { ReflectQuestion, TypedQuestion } from "./typed";

export type { SubmitResult } from "./shared";

function TapQuestion({ item, locked, onSubmit }: QProps<"tap">) {
  const { q } = item;
  const answers = Array.isArray(q.answer) ? q.answer : [q.answer];
  const [marks, setMarks] = useState<Record<string, Mark>>({});

  function tap(id: string) {
    if (locked) return;
    const ok = answers.includes(id);
    const r = onSubmit(ok);
    const next: Record<string, Mark> = { ...marks, [id]: ok ? "right" : "wrong" };
    if (!ok && r === "done") answers.forEach((a) => (next[a] = "reveal"));
    setMarks(next);
  }

  return (
    <div className="rounded-2xl bg-white p-2">
      <Figure figure={q.figure} onTap={locked ? undefined : tap} marks={marks} />
    </div>
  );
}

interface BodyProps {
  item: Prepared;
  locked: boolean;
  onSubmit: (correct: boolean, final?: boolean) => SubmitResult;
}

/** Renders the answer area for any question type. */
export function QuestionBody({ item, ...rest }: BodyProps) {
  const { q } = item;
  switch (q.type) {
    case "mcq":
    case "tf":
      return <ChoiceQuestion item={{ ...item, q }} {...rest} />;
    case "typed":
      return <TypedQuestion item={{ ...item, q }} {...rest} />;
    case "reflect":
      return <ReflectQuestion item={{ ...item, q }} {...rest} />;
    case "sort":
      return <SortQuestion item={{ ...item, q }} {...rest} />;
    case "match":
      return <MatchQuestion item={{ ...item, q }} {...rest} />;
    case "order":
      return <OrderQuestion item={{ ...item, q }} {...rest} />;
    case "wordparts":
      return <WordPartsQuestion item={{ ...item, q }} {...rest} />;
    case "tap":
      return <TapQuestion item={{ ...item, q }} {...rest} />;
    case "robot":
      return <RobotQuestion item={{ ...item, q }} {...rest} />;
    case "staff-write":
      return <StaffWriteQuestion item={{ ...item, q }} {...rest} />;
  }
}

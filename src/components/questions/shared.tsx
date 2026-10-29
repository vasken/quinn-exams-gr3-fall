"use client";

import { primaryButton } from "@/components/button-styles";
import { cn } from "@/lib/utils";
import type { Prepared } from "@/lib/select-questions";
import type { Question } from "@/content/types";

export type SubmitResult = "retry" | "done";

export interface QProps<T extends Question["type"]> {
  item: Prepared & { q: Extract<Question, { type: T }> };
  /** The question has been answered for good. */
  locked: boolean;
  /** `final` skips the Easy-mode second try (used by the robot, which has its own tries). */
  onSubmit: (correct: boolean, final?: boolean) => SubmitResult;
}

export type TileState = "idle" | "selected" | "right" | "wrong" | "muted";

const tileStyles: Record<TileState, string> = {
  idle: "bg-white border-border border-b-[#c3cbd8] text-foreground",
  selected: "bg-secondary border-primary border-b-[#1d3f9c] text-secondary-foreground",
  right: "bg-emerald-50 border-good border-b-good text-emerald-900",
  wrong: "bg-red-50 border-bad/60 border-b-bad/80 text-red-900",
  muted: "bg-white border-border border-b-border text-muted-foreground/70",
};

/** A big, pressable answer tile. */
export function Tile({
  state = "idle",
  className,
  children,
  ...props
}: React.ComponentProps<"button"> & { state?: TileState }) {
  return (
    <button
      type="button"
      className={cn("chunky min-h-14 px-4 py-3 text-xl font-bold leading-snug", tileStyles[state], className)}
      {...props}
    >
      {children}
    </button>
  );
}

/** The "Check" button used by questions with more than one step. */
export function CheckButton({ disabled, onClick, label = "Check" }: { disabled?: boolean; onClick: () => void; label?: string }) {
  return (
    <button type="button" disabled={disabled} onClick={onClick} className={cn(primaryButton, "mx-auto mt-5 flex w-full max-w-xs text-xl")}>
      {label}
    </button>
  );
}

export function Instruction({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 text-lg text-muted-foreground">{children}</p>;
}

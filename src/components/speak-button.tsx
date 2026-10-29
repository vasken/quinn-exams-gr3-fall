"use client";

import { useSyncExternalStore } from "react";
import { Volume2 } from "lucide-react";
import { canSpeak, speak } from "@/lib/speech";
import { cn } from "@/lib/utils";

const noop = () => () => {};

export function SpeakButton({ text, className }: { text: string; className?: string }) {
  // False on the server, so it never causes a hydration mismatch.
  const available = useSyncExternalStore(noop, canSpeak, () => false);
  if (!available) return null;
  return (
    <button
      type="button"
      onClick={() => speak(text)}
      aria-label="Read out loud"
      className={cn(
        "flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-border bg-white text-primary transition-transform active:scale-90",
        className,
      )}
    >
      <Volume2 className="size-6" />
    </button>
  );
}

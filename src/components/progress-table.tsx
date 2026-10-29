"use client";

import { useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { secondaryButton } from "@/components/button-styles";
import { subjects, topicKey } from "@/content";
import { DIFFICULTIES } from "@/content/types";
import { resetProgress, useProgress } from "@/lib/progress";
import { topicVisible } from "@/lib/select-questions";
import { DIFFICULTY_INFO, useSettings } from "@/lib/settings";
import { cn } from "@/lib/utils";

function Stars({ n }: { n: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${n} of 3 stars`}>
      {[1, 2, 3].map((i) => (
        <Star key={i} className={cn("size-5", i <= n ? "fill-highlight text-amber-500" : "text-slate-300")} />
      ))}
    </span>
  );
}

export function ProgressTable() {
  const settings = useSettings();
  const progress = useProgress();
  const [confirming, setConfirming] = useState(false);
  if (!settings || !progress) return null;

  return (
    <div className="flex flex-col gap-5">
      {subjects.map((s) => (
        <section key={s.slug} className="overflow-hidden rounded-2xl border bg-white">
          <h2 className="flex items-center gap-3 border-b px-4 py-3 text-xl font-bold">
            <span className={cn("flex size-10 items-center justify-center rounded-lg text-2xl", s.tint)}>{s.emoji}</span>
            {s.title}
          </h2>
          <table className="w-full text-left">
            <thead>
              <tr className="text-sm text-muted-foreground">
                <th className="px-4 py-2 font-semibold">Topic</th>
                {DIFFICULTIES.map((d) => (
                  <th key={d} className="px-2 py-2 text-center font-semibold">
                    {DIFFICULTY_INFO[d].label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {s.topics
                .filter((t) => topicVisible(t, settings.grade))
                .map((t) => (
                  <tr key={t.slug} className="border-t">
                    <td className="px-4 py-2.5">
                      <Link href={`/${s.slug}/${t.slug}/practice`} className="text-lg font-bold underline-offset-4 active:underline">
                        {t.title}
                      </Link>
                    </td>
                    {DIFFICULTIES.map((d) => (
                      <td key={d} className="px-2 py-2.5 text-center">
                        <Stars n={progress[topicKey(s, t)]?.[d] ?? 0} />
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </section>
      ))}

      <div className="mb-10 text-center">
        {confirming ? (
          <div className="inline-flex flex-wrap items-center justify-center gap-3">
            <span className="text-lg">Erase all stars?</span>
            <button
              type="button"
              onClick={() => {
                resetProgress();
                setConfirming(false);
              }}
              className="chunky min-h-12 border-bad border-b-[#8f2c27] bg-bad px-5 font-bold text-white"
            >
              Yes, reset
            </button>
            <button type="button" onClick={() => setConfirming(false)} className={cn(secondaryButton, "min-h-12")}>
              Cancel
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => setConfirming(true)} className="text-base text-muted-foreground underline underline-offset-4">
            Reset all stars (grown-ups)
          </button>
        )}
      </div>
    </div>
  );
}

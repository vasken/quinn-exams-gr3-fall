"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { subjects, topicKey } from "@/content";
import type { Subject } from "@/content/types";
import { useProgress } from "@/lib/progress";
import { topicVisible } from "@/lib/select-questions";
import { useSettings } from "@/lib/settings";
import { cn } from "@/lib/utils";

function useSubjectStars(subject: Subject) {
  const settings = useSettings();
  const progress = useProgress();
  if (!settings || !progress) return null;
  const topics = subject.topics.filter((t) => topicVisible(t, settings.grade));
  const earned = topics.reduce((sum, t) => sum + (progress[topicKey(subject, t)]?.[settings.difficulty] ?? 0), 0);
  return { earned, total: topics.length * 3, topics: topics.length };
}

function SubjectTile({ subject }: { subject: Subject }) {
  const stars = useSubjectStars(subject);
  return (
    <Link
      href={`/${subject.slug}`}
      className="chunky flex min-h-28 items-center gap-4 border-border border-b-[#c3cbd8] bg-white p-4 active:bg-muted"
    >
      <span className={cn("flex size-16 shrink-0 items-center justify-center rounded-xl text-4xl", subject.tint)}>{subject.emoji}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-xl font-bold leading-tight">{subject.title}</span>
        <span className="mt-0.5 block text-base text-muted-foreground">{subject.blurb}</span>
        {stars && (
          <span className="mt-1.5 flex items-center gap-1 text-sm text-muted-foreground">
            <Star className={cn("size-4", stars.earned ? "fill-highlight text-amber-500" : "text-slate-300")} />
            {stars.earned} of {stars.total} stars
          </span>
        )}
      </span>
    </Link>
  );
}

export function SubjectGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {subjects.map((s) => (
        <SubjectTile key={s.slug} subject={s} />
      ))}
    </div>
  );
}

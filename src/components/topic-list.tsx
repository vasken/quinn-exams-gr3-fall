"use client";

import Link from "next/link";
import { BookOpen, PencilLine, Star } from "lucide-react";
import { primaryButton, secondaryButton } from "@/components/button-styles";
import { getSubject, topicKey } from "@/content";
import { useProgress } from "@/lib/progress";
import { topicVisible } from "@/lib/select-questions";
import { useSettings } from "@/lib/settings";
import { cn } from "@/lib/utils";

export function Stars({ n, className }: { n: number; className?: string }) {
  return (
    <span className={cn("inline-flex gap-0.5", className)} aria-label={`${n} of 3 stars`}>
      {[1, 2, 3].map((i) => (
        <Star key={i} className={cn("size-5", i <= n ? "fill-highlight text-amber-500" : "text-slate-300")} />
      ))}
    </span>
  );
}

export function TopicList({ subjectSlug }: { subjectSlug: string }) {
  const subject = getSubject(subjectSlug)!;
  const settings = useSettings();
  const progress = useProgress();
  const grade = settings?.grade ?? 3;
  const topics = subject.topics.filter((t) => topicVisible(t, grade));

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-lg text-muted-foreground">
          {topics.length} topics. Read the lesson, then practise.
        </p>
        <Link href={`/${subject.slug}/practice`} className={primaryButton}>
          Practise all topics
        </Link>
      </div>

      <ul className="divide-y overflow-hidden rounded-2xl border bg-white">
        {topics.map((t) => {
          const stars = (settings && progress?.[topicKey(subject, t)]?.[settings.difficulty]) || 0;
          return (
            <li key={t.slug} className="flex flex-wrap items-center gap-4 p-4">
              <span className={cn("flex size-12 shrink-0 items-center justify-center rounded-xl text-2xl", subject.tint)}>{t.emoji}</span>
              <div className="min-w-0 flex-1 basis-48">
                <h2 className="text-xl font-bold leading-tight">{t.title}</h2>
                <div className="mt-1 flex items-center gap-2">
                  <Stars n={stars} />
                  {t.grades && <span className="text-sm text-muted-foreground">Grade {t.grades.join(" and ")} only</span>}
                </div>
              </div>
              <div className="flex gap-2">
                <Link href={`/${subject.slug}/${t.slug}`} className={cn(secondaryButton, "min-h-12 px-4")}>
                  <BookOpen className="size-5" /> Learn
                </Link>
                <Link href={`/${subject.slug}/${t.slug}/practice`} className={cn(primaryButton, "min-h-12 px-4")}>
                  <PencilLine className="size-5" /> Practise
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

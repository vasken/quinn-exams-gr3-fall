"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { primaryButton, secondaryButton } from "@/components/button-styles";
import { Figure } from "@/components/figures";
import { plain, RichText } from "@/components/rich-text";
import { SpeakButton } from "@/components/speak-button";
import type { LearnCard } from "@/content/types";
import { cn } from "@/lib/utils";

export function LearnCards({ cards, practiceHref, drillHref }: { cards: LearnCard[]; practiceHref: string; drillHref?: string }) {
  const [i, setI] = useState(0);
  const startX = useRef<number | null>(null);
  const card = cards[i];
  const last = i === cards.length - 1;

  const go = (d: number) => setI((n) => Math.min(cards.length - 1, Math.max(0, n + d)));

  return (
    <div
      onPointerDown={(e) => {
        // Only swipe from plain card areas, not from figures you can tap.
        startX.current = (e.target as HTMLElement).closest("svg,button") ? null : e.clientX;
      }}
      onPointerUp={(e) => {
        if (startX.current === null) return;
        const dx = e.clientX - startX.current;
        if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1);
        startX.current = null;
      }}
      className="touch-pan-y"
    >
      {/* A page from an exercise book: ruled lines, red margin. */}
      <article key={i} className="margin-page overflow-hidden rounded-2xl border pt-6 pr-5 pb-7 pl-[4.75rem] sm:pr-8">
        <div className="mb-3 flex items-start gap-3">
          <h2 className="flex-1 text-[1.75rem] font-bold leading-[2.25rem] sm:text-3xl sm:leading-[2.25rem]">{plain(card.title)}</h2>
          <SpeakButton text={`${card.title}. ${card.points.join(". ")}`} />
        </div>
        <ul className="rules flex flex-col">
          {card.points.map((p) => (
            <li key={p} className="relative text-xl leading-[2.25rem]">
              <span className="absolute top-[0.95rem] -left-[1.1rem] size-2 rounded-full bg-primary" />
              <RichText text={p} pinyin />
            </li>
          ))}
        </ul>
        {card.figure && (
          <div className="mt-6 -ml-6 rounded-xl border bg-white p-3 sm:-ml-4">
            <Figure figure={card.figure} labelled />
          </div>
        )}
      </article>

      <div className="mt-5 flex items-center justify-between gap-3">
        <button type="button" onClick={() => go(-1)} disabled={i === 0} className={secondaryButton}>
          <ChevronLeft className="size-6" /> Back
        </button>
        <div className="flex flex-wrap justify-center gap-2">
          {cards.map((c, n) => (
            <button
              key={c.title}
              type="button"
              aria-label={`Page ${n + 1} of ${cards.length}`}
              aria-current={n === i}
              onClick={() => setI(n)}
              className={cn("size-3 rounded-full transition-all", n === i ? "w-7 bg-primary" : "bg-slate-300")}
            />
          ))}
        </div>
        {last ? (
          <div className="flex gap-2">
            {drillHref && (
              <Link href={drillHref} className={secondaryButton}>
                Speed test
              </Link>
            )}
            <Link href={practiceHref} className={primaryButton}>
              Practise
            </Link>
          </div>
        ) : (
          <button type="button" onClick={() => go(1)} className={primaryButton}>
            Next <ChevronRight className="size-6" />
          </button>
        )}
      </div>
    </div>
  );
}

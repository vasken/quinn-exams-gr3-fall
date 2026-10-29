"use client";

import type { Difficulty } from "@/content/types";
import { createStore } from "./store";

type Stars = Partial<Record<Difficulty, number>>;
type Progress = Record<string, Stars>;

const store = createStore<Progress>("study-guide:progress:v1", {});

export const useProgress = store.useValue;

export function starsFor(score: number, total: number) {
  if (total === 0) return 0;
  const pct = score / total;
  if (pct >= 0.9) return 3;
  if (pct >= 0.7) return 2;
  if (pct >= 0.4) return 1;
  return 0;
}

export function saveStars(key: string, difficulty: Difficulty, stars: number) {
  const all = store.read();
  const prev = all[key]?.[difficulty] ?? 0;
  if (stars <= prev) return;
  store.write({ ...all, [key]: { ...all[key], [difficulty]: stars } });
}

export function resetProgress() {
  store.write({});
}

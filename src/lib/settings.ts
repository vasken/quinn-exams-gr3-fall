"use client";

import type { Difficulty, Grade } from "@/content/types";
import { createStore } from "./store";

export interface Settings {
  grade: Grade;
  difficulty: Difficulty;
  autoRead: boolean;
}

const store = createStore<Settings>("study-guide:settings:v1", {
  grade: 3,
  difficulty: "easy",
  autoRead: false,
});

export const useSettings = store.useValue;

export function updateSettings(patch: Partial<Settings>) {
  store.write({ ...store.read(), ...patch });
}

export const DIFFICULTY_INFO: Record<
  Difficulty,
  { label: string; emoji: string; count: number; choices: number }
> = {
  easy: { label: "Easy", emoji: "🌱", count: 6, choices: 3 },
  medium: { label: "Medium", emoji: "🌿", count: 8, choices: 4 },
  hard: { label: "Hard", emoji: "🌳", count: 10, choices: 4 },
};

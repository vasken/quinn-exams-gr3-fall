"use client";

import { SlidersHorizontal } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { DIFFICULTIES, type Difficulty, type Grade } from "@/content/types";
import { DIFFICULTY_INFO, updateSettings, useSettings } from "@/lib/settings";
import { cn } from "@/lib/utils";
import { secondaryButton } from "./button-styles";

const item =
  "h-12 flex-1 rounded-xl border-2 border-border bg-white px-4 text-lg font-bold text-foreground hover:bg-white data-[state=on]:border-primary data-[state=on]:bg-secondary data-[state=on]:text-secondary-foreground";

const DIFFICULTY_HELP: Record<Difficulty, string> = {
  easy: "6 questions, 3 choices, hints and a second try.",
  medium: "8 questions, 4 choices and some typing.",
  hard: "10 questions, mostly typing, bigger numbers, no hints.",
};

const compactItem =
  "h-11 rounded-lg border-2 border-transparent px-3 text-base font-bold text-muted-foreground hover:bg-transparent data-[state=on]:border-primary data-[state=on]:bg-secondary data-[state=on]:text-secondary-foreground";

/** One row of settings for the home page: grade, level and read aloud. */
export function SettingsBar() {
  const settings = useSettings();
  if (!settings) return <div className="h-11" />;
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
      <ToggleGroup
        type="single"
        value={String(settings.grade)}
        onValueChange={(v) => v && updateSettings({ grade: Number(v) as Grade })}
        aria-label="Grade"
      >
        <ToggleGroupItem value="3" className={compactItem}>
          Grade 3
        </ToggleGroupItem>
        <ToggleGroupItem value="4" className={compactItem}>
          Grade 4
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup
        type="single"
        value={settings.difficulty}
        onValueChange={(v) => v && updateSettings({ difficulty: v as Difficulty })}
        aria-label="Level"
      >
        {DIFFICULTIES.map((d) => (
          <ToggleGroupItem key={d} value={d} className={compactItem} title={DIFFICULTY_HELP[d]}>
            {DIFFICULTY_INFO[d].label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <label className="flex items-center gap-3 text-base font-bold text-muted-foreground">
        <Switch checked={settings.autoRead} onCheckedChange={(v) => updateSettings({ autoRead: v })} />
        Read aloud
      </label>
    </div>
  );
}

export function SettingsPanel() {
  const settings = useSettings();
  if (!settings) return <div className="h-40" />;
  return (
    <div className="grid gap-5 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-x-6">
      <span className="text-lg font-bold">Grade</span>
      <ToggleGroup
        type="single"
        value={String(settings.grade)}
        onValueChange={(v) => v && updateSettings({ grade: Number(v) as Grade })}
        className="w-full"
        aria-label="Grade"
      >
        <ToggleGroupItem value="3" className={item}>
          Grade 3
        </ToggleGroupItem>
        <ToggleGroupItem value="4" className={item}>
          Grade 4
        </ToggleGroupItem>
      </ToggleGroup>

      <span className="text-lg font-bold">Level</span>
      <div>
        <ToggleGroup
          type="single"
          value={settings.difficulty}
          onValueChange={(v) => v && updateSettings({ difficulty: v as Difficulty })}
          className="w-full"
          aria-label="Level"
        >
          {DIFFICULTIES.map((d) => (
            <ToggleGroupItem key={d} value={d} className={item}>
              {DIFFICULTY_INFO[d].label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <p className="mt-2 text-base text-muted-foreground">{DIFFICULTY_HELP[settings.difficulty]}</p>
      </div>

      <label htmlFor="auto-read" className="text-lg font-bold">
        Read aloud
      </label>
      <div className="flex items-center gap-3">
        <Switch id="auto-read" checked={settings.autoRead} onCheckedChange={(v) => updateSettings({ autoRead: v })} className="scale-125" />
        <span className="text-base text-muted-foreground">Read each question out loud automatically</span>
      </div>
    </div>
  );
}

/** Compact button that shows the current grade and level and opens the settings. */
export function SettingsChip() {
  const settings = useSettings();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className={cn(secondaryButton, "min-h-12 px-3 text-base")}>
          <SlidersHorizontal className="size-5" />
          {settings ? (
            <span>
              Grade {settings.grade}, {DIFFICULTY_INFO[settings.difficulty].label}
            </span>
          ) : (
            <span>Settings</span>
          )}
        </button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl p-6 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">Settings</DialogTitle>
          <DialogDescription className="text-base">Changes start with the next round of questions.</DialogDescription>
        </DialogHeader>
        <SettingsPanel />
      </DialogContent>
    </Dialog>
  );
}

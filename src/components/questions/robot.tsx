"use client";

import { useEffect, useRef, useState } from "react";
import { type Block, type Cmd, type RobotState, expand, loopify, solve, step } from "@/lib/robot";
import { Repeat, Undo2 } from "lucide-react";
import { primaryButton, secondaryButton } from "@/components/button-styles";
import { cn } from "@/lib/utils";
import type { QProps } from "./shared";

const ICON: Record<Cmd, string> = { F: "⬆️", L: "↺", R: "↻" };
const NAME: Record<Cmd, string> = { F: "Forward", L: "Turn left", R: "Turn right" };
const ROTATE = { N: 0, E: 90, S: 180, W: 270 };
const MAX_TRIES = 3;

function ProgramView({ program, openLoop, onTimes }: { program: Block[]; openLoop?: boolean; onTimes?: (i: number, d: number) => void }) {
  if (!program.length) return <span className="text-muted-foreground">Your code goes here…</span>;
  return (
    <>
      {program.map((b, i) =>
        "cmd" in b ? (
          <span key={i} className="flex h-11 min-w-11 items-center justify-center rounded-lg bg-primary px-2 text-2xl text-white">
            {ICON[b.cmd]}
          </span>
        ) : (
          <span
            key={i}
            className={cn(
              "flex flex-wrap items-center gap-1 rounded-lg border-2 border-amber-300 bg-amber-50 p-1",
              openLoop && i === program.length - 1 && "ring-4 ring-amber-200",
            )}
          >
            <span className="flex items-center gap-1 px-1 font-bold text-amber-900">
              <Repeat className="size-5" />
              {onTimes && (
                <button type="button" className="size-9 rounded-md border bg-white text-lg" onClick={() => onTimes(i, -1)} aria-label="fewer times">
                  −
                </button>
              )}
              <span className="min-w-6 text-center text-lg">{b.repeat}×</span>
              {onTimes && (
                <button type="button" className="size-9 rounded-md border bg-white text-lg" onClick={() => onTimes(i, 1)} aria-label="more times">
                  +
                </button>
              )}
            </span>
            {b.body.map((c, j) => (
              <span key={j} className="flex h-10 min-w-10 items-center justify-center rounded-md bg-primary px-1 text-xl text-white">
                {ICON[c]}
              </span>
            ))}
            {b.body.length === 0 && <span className="px-1 text-base text-amber-800">add moves…</span>}
          </span>
        ),
      )}
    </>
  );
}

export function RobotQuestion({ item, locked, onSubmit }: QProps<"robot">) {
  const { q } = item;
  const [w, h] = q.size;
  const [program, setProgram] = useState<Block[]>([]);
  const [openLoop, setOpenLoop] = useState(false);
  const [bot, setBot] = useState<RobotState>(q.start);
  const [status, setStatus] = useState<"edit" | "running" | "crash" | "short" | "noloop" | "won" | "lost">("edit");
  const [tries, setTries] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const editing = status === "edit" && !locked;
  const hasLoop = program.some((b) => "repeat" in b && b.body.length > 0);

  function add(cmd: Cmd) {
    if (!editing) return;
    const last = program[program.length - 1];
    if (openLoop && last && "repeat" in last) {
      setProgram([...program.slice(0, -1), { ...last, body: [...last.body, cmd] }]);
    } else {
      setProgram([...program, { cmd }]);
    }
  }

  function undo() {
    if (!editing) return;
    const last = program[program.length - 1];
    if (!last) return;
    if ("repeat" in last && openLoop && last.body.length) {
      setProgram([...program.slice(0, -1), { ...last, body: last.body.slice(0, -1) }]);
    } else {
      setProgram(program.slice(0, -1));
      setOpenLoop(false);
    }
  }

  function startLoop() {
    if (!editing) return;
    setProgram([...program, { repeat: 2, body: [] }]);
    setOpenLoop(true);
  }

  function changeTimes(i: number, d: number) {
    if (!editing) return;
    setProgram(program.map((b, j) => (j === i && "repeat" in b ? { ...b, repeat: Math.min(9, Math.max(2, b.repeat + d)) } : b)));
  }

  function finish(result: "won" | "crash" | "short" | "noloop") {
    if (result === "won") {
      setStatus("won");
      onSubmit(true, true);
      return;
    }
    const n = tries + 1;
    setTries(n);
    if (n >= MAX_TRIES) {
      setStatus("lost");
      onSubmit(false, true);
    } else {
      setStatus(result);
    }
  }

  function run() {
    if (!editing || !program.length) return;
    setOpenLoop(false);
    setStatus("running");
    const cmds = expand(program);
    let s = q.start;
    setBot(s);
    let i = 0;
    const tick = () => {
      if (i >= cmds.length) {
        const atGoal = s.x === q.goal.x && s.y === q.goal.y;
        finish(!atGoal ? "short" : q.requireLoop && !hasLoop ? "noloop" : "won");
        return;
      }
      const next = step(q, s, cmds[i++]);
      if (!next) {
        finish("crash");
        return;
      }
      s = next;
      setBot(s);
      timer.current = setTimeout(tick, 420);
    };
    timer.current = setTimeout(tick, 300);
  }

  function reset() {
    setBot(q.start);
    setStatus("edit");
  }

  const solution = status === "lost" ? solve(q) : null;
  const messages: Record<string, string> = {
    crash: "Bonk! The robot bumped into something. Fix the bug and try again.",
    short: "The robot didn't stop on the star. Try again.",
    noloop: "You reached the star, but this puzzle needs a Repeat block. Try again.",
    won: "You did it!",
  };

  return (
    <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-start lg:justify-center">
      {/* Board */}
      <div className="relative w-full max-w-sm rounded-2xl sm:max-w-md lg:max-w-sm border-2 border-border bg-muted p-1.5" style={{ aspectRatio: `${w} / ${h}` }}>
        <div className="grid size-full gap-1" style={{ gridTemplateColumns: `repeat(${w}, 1fr)`, gridTemplateRows: `repeat(${h}, 1fr)` }}>
          {Array.from({ length: w * h }, (_, n) => {
            const x = n % w;
            const y = Math.floor(n / w);
            const blocked = q.blocks?.some(([bx, by]) => bx === x && by === y);
            const goal = q.goal.x === x && q.goal.y === y;
            return (
              <div key={n} className="flex items-center justify-center rounded-md bg-white text-3xl sm:text-4xl">
                {blocked ? "🌲" : goal ? "⭐" : ""}
              </div>
            );
          })}
        </div>
        <div className="pointer-events-none absolute inset-1.5">
          <div
            className="relative flex items-center justify-center transition-transform duration-300 ease-out"
            style={{
              width: `calc((100% - ${(w - 1) * 4}px) / ${w})`,
              height: `calc((100% - ${(h - 1) * 4}px) / ${h})`,
              transform: `translate(calc(${bot.x} * (100% + 4px)), calc(${bot.y} * (100% + 4px)))`,
            }}
          >
            <span className={cn("text-3xl sm:text-4xl", status === "crash" && "animate-shake")}>🤖</span>
            <span className="absolute inset-0 flex items-start justify-center transition-transform duration-300" style={{ transform: `rotate(${ROTATE[bot.dir]}deg)` }}>
              <span className="-mt-1 text-lg leading-none text-primary">▲</span>
            </span>
          </div>
        </div>
      </div>

      {/* Code */}
      <div className="w-full max-w-md">
        <div className="mb-3 flex min-h-16 flex-wrap items-center gap-1.5 rounded-2xl border-2 border-border bg-white p-2">
          <span className="mr-1 rounded-md bg-muted px-2 py-1 text-base font-bold text-muted-foreground">when 🏁 clicked</span>
          <ProgramView program={program} openLoop={openLoop} onTimes={editing ? changeTimes : undefined} />
        </div>

        {editing && (
          <>
            <div className="grid grid-cols-3 gap-2">
              {(["F", "L", "R"] as Cmd[]).map((c) => (
                <button key={c} type="button" onClick={() => add(c)} className={cn(secondaryButton, "min-h-16 flex-col gap-0 px-2")}>
                  <span className="text-2xl">{ICON[c]}</span>
                  <span className="text-base font-bold">{NAME[c]}</span>
                </button>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {openLoop ? (
                <button type="button" onClick={() => setOpenLoop(false)} className={cn(secondaryButton, "px-2 text-base")}>
                  End repeat
                </button>
              ) : (
                <button type="button" onClick={startLoop} className={cn(secondaryButton, "px-2 text-base")}>
                  <Repeat className="size-5" /> Repeat
                </button>
              )}
              <button type="button" onClick={undo} disabled={!program.length} className={cn(secondaryButton, "px-2 text-base")}>
                <Undo2 className="size-5" /> Undo
              </button>
              <button
                type="button"
                onClick={run}
                disabled={!program.length}
                className={cn(primaryButton, "px-2")}
              >
                🏁 Go!
              </button>
            </div>
            {tries > 0 && <p className="mt-2 text-center text-sm text-muted-foreground">Try {tries + 1} of {MAX_TRIES}</p>}
          </>
        )}

        {status in messages && status !== "won" && (
          <div className="mt-2 rounded-2xl border bg-white p-4 text-center text-lg">
            {messages[status]}
            <button type="button" onClick={reset} className={cn(primaryButton, "mt-3 flex w-full")}>
              Reset robot and fix my code
            </button>
          </div>
        )}
        {solution && (
          <div className="mt-2 rounded-2xl border bg-white p-4 text-center">
            <p className="mb-2 text-lg font-bold">Here is one way to do it:</p>
            <div className="flex flex-wrap justify-center gap-1.5">
              <ProgramView program={loopify(solution, q)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import type { Dir, RobotQuestion } from "@/content/types";

export type Cmd = "F" | "L" | "R";
export type Block = { cmd: Cmd } | { repeat: number; body: Cmd[] };

export interface RobotState {
  x: number;
  y: number;
  dir: Dir;
}

const DIRS: Dir[] = ["N", "E", "S", "W"];
const STEP: Record<Dir, [number, number]> = { N: [0, -1], E: [1, 0], S: [0, 1], W: [-1, 0] };

export function turn(dir: Dir, cmd: "L" | "R"): Dir {
  return DIRS[(DIRS.indexOf(dir) + (cmd === "R" ? 1 : 3)) % 4];
}

export function expand(program: Block[]): Cmd[] {
  return program.flatMap((b) => ("cmd" in b ? [b.cmd] : Array.from({ length: b.repeat }, () => b.body).flat()));
}

export function isBlocked(q: RobotQuestion, x: number, y: number) {
  const [w, h] = q.size;
  return x < 0 || y < 0 || x >= w || y >= h || (q.blocks ?? []).some(([bx, by]) => bx === x && by === y);
}

/** Apply one command. Returns null if the robot bumps into something. */
export function step(q: RobotQuestion, s: RobotState, cmd: Cmd): RobotState | null {
  if (cmd !== "F") return { ...s, dir: turn(s.dir, cmd) };
  const [dx, dy] = STEP[s.dir];
  const next = { ...s, x: s.x + dx, y: s.y + dy };
  return isBlocked(q, next.x, next.y) ? null : next;
}

/** Shortest list of commands from start to goal (breadth-first search). */
export function solve(q: RobotQuestion): Cmd[] | null {
  const key = (s: RobotState) => `${s.x},${s.y},${s.dir}`;
  const queue: { s: RobotState; path: Cmd[] }[] = [{ s: q.start, path: [] }];
  const seen = new Set([key(q.start)]);
  while (queue.length) {
    const { s, path } = queue.shift()!;
    if (s.x === q.goal.x && s.y === q.goal.y) return path;
    for (const cmd of ["F", "L", "R"] as Cmd[]) {
      const n = step(q, s, cmd);
      if (n && !seen.has(key(n))) {
        seen.add(key(n));
        queue.push({ s: n, path: [...path, cmd] });
      }
    }
  }
  return null;
}

/** Squash runs of the same command into repeat blocks, e.g. F F F → repeat 3 [F]. */
export function compress(cmds: Cmd[]): Block[] {
  const out: Block[] = [];
  for (let i = 0; i < cmds.length; ) {
    let j = i;
    while (j < cmds.length && cmds[j] === cmds[i]) j++;
    const n = j - i;
    out.push(n > 1 ? { repeat: n, body: [cmds[i]] } : { cmd: cmds[i] });
    i = j;
  }
  return out;
}

/** Show a solution using one repeat block when the moves follow a pattern. */
export function loopify(cmds: Cmd[], q: RobotQuestion): Block[] {
  for (let p = 2; p <= cmds.length / 2; p++) {
    const times = Math.ceil(cmds.length / p);
    const body = cmds.slice(0, p);
    if (!cmds.every((c, i) => c === body[i % p])) continue;
    // Extra commands from the last pass must not move the robot off the path.
    let s: RobotState | null = q.start;
    for (const c of expand([{ repeat: times, body }])) s = s && step(q, s, c);
    if (s && s.x === q.goal.x && s.y === q.goal.y) return [{ repeat: times, body }];
  }
  return compress(cmds);
}

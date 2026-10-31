import type { StaffNote } from "@/content/types";
import { type Clef, STAFF, ledgerLines, letter } from "@/lib/music";
import * as G from "./staff-glyphs";
import { type FigureProps, hit } from "./shared";

/** One staff space (the gap between two staff lines) in SVG units. */
export const SP = 10;
const HALF = SP / 2;
const INK = "#1e293b";
const LINE = "#475569";
/** Width of one note column. */
const COL = 4.5 * SP;
/** Space between the treble and bass staves of a grand staff. */
const GAP = 6 * SP;
const DEFAULT_STEM = 3.5;

export interface StaffViewProps extends FigureProps {
  clef: Clef | "grand";
  notes?: StaffNote[];
  /** Make the clefs, staves and brace tappable (and labelled on learn cards). */
  parts?: boolean;
  /** Leave room for at least this many note columns. */
  columns?: number;
  /** Tap a line or space to choose a position (staff-write questions). Single staff only. */
  pick?: { range: [number, number]; onPick: (pos: number) => void };
  /** Keep room for notes in this range on each staff, so the picture doesn't resize as notes change. */
  room?: Partial<Record<Clef, [number, number]>>;
  className?: string;
}

function Glyph({ glyph, x, y, scale = SP, fill = INK }: { glyph: { d: string }; x: number; y: number; scale?: number; fill?: string }) {
  return <path d={glyph.d} transform={`translate(${x} ${y}) scale(${scale})`} fill={fill} />;
}

function markColour(mark: string | undefined) {
  return mark === "wrong" ? "var(--bad)" : mark ? "var(--good)" : INK;
}

export function StaffView({ clef, notes = [], parts, columns = 1, pick, room, className, ...fig }: StaffViewProps) {
  const grand = clef === "grand";
  const staves: { clef: Clef; top: number }[] = grand
    ? [
        { clef: "treble", top: 0 },
        { clef: "bass", top: 4 * SP + GAP },
      ]
    : [{ clef, top: 0 }];
  const staffOf = (n: StaffNote): Clef => (grand ? (n.staff ?? (n.pos >= 0 ? "treble" : "bass")) : clef);
  const topOf = (c: Clef) => staves.find((s) => s.clef === c)?.top ?? 0;
  const y = (pos: number, c: Clef) => topOf(c) + (STAFF[c].top - pos) * HALF;
  const partLabels = !!(parts && fig.labelled);
  const tappableParts = !!(parts && (fig.onTap || fig.marks));

  /* ----- Horizontal layout ----- */
  const systemTop = 0;
  const systemBottom = staves[staves.length - 1].top + 4 * SP;
  const braceScale = (systemBottom - systemTop) / 4;
  const padL = partLabels && grand ? 7 * SP : 0.5 * SP;
  const braceX = padL;
  const sx = grand ? braceX + G.brace.width * braceScale + 0.5 * SP : padL;
  const clefX = sx + 0.7 * SP;
  const noteX0 = sx + 4.2 * SP;

  // Each note takes the next column, after any gap it asks for.
  const placed = notes.reduce<{ n: StaffNote; c: number; staff: Clef }[]>((out, n) => {
    const prev = out.length ? out[out.length - 1].c + 1 : 0;
    return [...out, { n, c: prev + (n.gap ?? 0), staff: staffOf(n) }];
  }, []);
  const ncols = Math.max(parts ? 3 : columns, placed.length ? placed[placed.length - 1].c + 1 : 0);
  const ex = noteX0 + ncols * COL;
  const padR = partLabels ? 13 * SP : 0.5 * SP;
  const width = ex + padR;
  const headLeft = (c: number) => noteX0 + c * COL + 1.6 * SP;

  /* ----- Vertical extent ----- */
  let minY = systemTop - 0.5 * SP;
  let maxY = systemBottom + 0.5 * SP;
  const grow = (a: number, b = a) => {
    minY = Math.min(minY, a, b);
    maxY = Math.max(maxY, a, b);
  };
  for (const s of staves) {
    if (s.clef === "treble") grow(s.top - 1.5 * SP, s.top + 5.7 * SP);
  }
  for (const { n, staff } of placed) {
    const ny = y(n.pos, staff);
    grow(ny - 0.7 * SP, ny + 0.7 * SP);
    if (n.stem) grow(ny + (n.stem === "up" ? -1 : 1) * (n.stemLen ?? DEFAULT_STEM) * SP);
  }
  for (const s of staves) {
    const r = room?.[s.clef];
    if (r) grow(y(r[1], s.clef) - 0.7 * SP, y(r[0], s.clef) + 0.7 * SP);
  }
  if (pick && !grand) grow(y(pick.range[1], clef) - SP, y(pick.range[0], clef) + SP);
  if (partLabels) grow(systemTop - 3 * SP, systemBottom + 3 * SP);
  const labelY = maxY + 1.8 * SP;
  if (placed.some(({ n }) => n.label)) maxY = labelY + 0.6 * SP;

  const top = minY - 0.6 * SP;
  const height = maxY - minY + 1.2 * SP;

  return (
    <svg
      viewBox={`0 ${top} ${width} ${height}`}
      className={className ?? "mx-auto w-full"}
      // Same scale for every staff, so a two-note picture isn't drawn huge.
      style={className ? undefined : { maxWidth: width * 2.2 }}
      role="img"
      aria-label={grand ? "Grand staff" : `${clef} staff`}
    >
      {/* Staves */}
      {staves.map((s) => (
        <g key={s.clef} {...(tappableParts ? hit(`${s.clef}-staff`, fig) : {})}>
          {tappableParts && <rect x={sx} y={s.top - 0.4 * SP} width={ex - sx} height={4.8 * SP} fill="transparent" />}
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={i} x1={sx} x2={ex} y1={s.top + i * SP} y2={s.top + i * SP} stroke={LINE} strokeWidth={0.13 * SP} />
          ))}
          <line x1={ex} x2={ex} y1={s.top} y2={s.top + 4 * SP} stroke={LINE} strokeWidth={0.16 * SP} />
        </g>
      ))}

      {/* Brace and the line joining the staves */}
      {grand && (
        <>
          <line x1={sx} x2={sx} y1={systemTop} y2={systemBottom} stroke={LINE} strokeWidth={0.16 * SP} />
          <line x1={ex} x2={ex} y1={systemTop} y2={systemBottom} stroke={LINE} strokeWidth={0.16 * SP} />
          <g {...(tappableParts ? hit("brace", fig) : {})}>
            {tappableParts && <rect x={braceX - 0.5 * SP} y={systemTop} width={sx - braceX + 0.3 * SP} height={systemBottom - systemTop} fill="transparent" />}
            <Glyph glyph={G.brace} x={braceX} y={systemBottom} scale={braceScale} />
          </g>
        </>
      )}

      {/* Clefs: treble curls around the G line, bass dots sit around the F line. */}
      {staves.map((s) => {
        const glyph = s.clef === "treble" ? G.treble : G.bass;
        const anchor = s.clef === "treble" ? s.top + 3 * SP : s.top + SP;
        return (
          <g key={s.clef} {...(tappableParts ? hit(`${s.clef}-clef`, fig) : {})}>
            {tappableParts && (
              <rect
                x={clefX - 0.4 * SP}
                y={s.clef === "treble" ? s.top - 1.5 * SP : s.top - 0.4 * SP}
                width={glyph.width * SP + 0.8 * SP}
                height={s.clef === "treble" ? 7.2 * SP : 4.4 * SP}
                fill="transparent"
              />
            )}
            <Glyph glyph={glyph} x={clefX} y={anchor} />
          </g>
        );
      })}

      {/* Notes */}
      {placed.map(({ n, c, staff }, i) => (
        <Note key={n.id ?? i} note={n} x={headLeft(c)} y={y(n.pos, staff)} staff={staff} staffY={(p) => y(p, staff)} labelY={labelY} fig={fig} />
      ))}

      {/* Part labels on learn cards */}
      {partLabels && (
        <g fontSize={1.5 * SP} fontWeight={700} fill={INK}>
          {staves.map((s) => (
            <text key={`${s.clef}-staff`} x={ex + 0.8 * SP} y={s.top + 2 * SP + 0.5 * SP}>
              {s.clef === "treble" ? "Treble staff" : "Bass staff"}
            </text>
          ))}
          {staves.map((s) =>
            s.clef === "treble" ? (
              <text key="tc" x={clefX} y={s.top - 2.2 * SP}>
                Treble clef
              </text>
            ) : (
              <text key="bc" x={clefX} y={s.top + 6.6 * SP}>
                Bass clef
              </text>
            ),
          )}
          {placed
            .filter(({ n }) => n.id === "middle-c")
            .map(({ n, c, staff }) => (
              <text key="mc" x={headLeft(c) + 2.4 * SP} y={y(n.pos, staff) + 0.5 * SP}>
                Middle C
              </text>
            ))}
          {grand && (
            <text x={braceX - 0.6 * SP} y={(systemTop + systemBottom) / 2 + 0.5 * SP} textAnchor="end">
              Brace
            </text>
          )}
        </g>
      )}

      {/* Tap bands for drawing a note */}
      {pick &&
        !grand &&
        Array.from({ length: pick.range[1] - pick.range[0] + 1 }, (_, k) => pick.range[0] + k).map((pos) => (
          <rect
            key={pos}
            data-pos={pos}
            x={sx + 3.5 * SP}
            y={y(pos, clef) - HALF / 2}
            width={ex - sx - 3.5 * SP}
            height={HALF}
            fill="transparent"
            className="cursor-pointer"
            role="button"
            aria-label={`${letter(pos)} ${pos % 2 === 0 ? "line" : "space"}`}
            onClick={() => pick.onPick(pos)}
          />
        ))}
    </svg>
  );
}

function Note({
  note: n,
  x,
  y,
  staff,
  staffY,
  labelY,
  fig,
}: {
  note: StaffNote;
  x: number;
  y: number;
  staff: Clef;
  staffY: (pos: number) => number;
  labelY: number;
  fig: FigureProps;
}) {
  const mark = n.id ? fig.marks?.[n.id] : undefined;
  const colour = markColour(mark);
  const filled = !!n.stem || n.filled;
  const head = filled ? G.blackHead : G.wholeHead;
  const headW = head.width * SP;
  const interactive = n.id && (fig.onTap || mark);

  const stemLen = (n.stemLen ?? DEFAULT_STEM) * SP;
  const side = n.stemSide ?? (n.stem === "up" ? "right" : "left");
  const stemX = side === "right" ? x + headW - 0.06 * SP : x + 0.06 * SP;
  const stemEnd = n.stem === "up" ? y - stemLen : y + stemLen;
  const stemStart = y + (n.stem === "up" ? -0.15 : 0.15) * SP;

  const accGlyph = n.acc === "sharp" ? G.sharp : n.acc === "flat" ? G.flat : n.acc === "natural" ? G.natural : null;
  const stemTop = n.stem === "up" ? stemEnd : y - 0.8 * SP;
  const stemBottom = n.stem === "down" ? stemEnd : y + 0.8 * SP;

  return (
    <g {...(interactive ? hit(n.id!, fig) : {})}>
      {interactive && <rect x={x - 1.6 * SP} y={Math.min(stemTop, y - 1.4 * SP)} width={COL} height={Math.max(stemBottom, y + 1.4 * SP) - Math.min(stemTop, y - 1.4 * SP)} fill="transparent" />}
      {ledgerLines(n.pos, staff).map((l) => (
        <line key={l} x1={x - 0.4 * SP} x2={x + headW + 0.4 * SP} y1={staffY(l)} y2={staffY(l)} stroke={INK} strokeWidth={0.16 * SP} />
      ))}
      {accGlyph && <Glyph glyph={accGlyph} x={x - accGlyph.width * SP - 0.3 * SP} y={y} fill={colour} />}
      <Glyph glyph={head} x={x} y={y} fill={colour} />
      {n.stem &&
        (n.crooked ? (
          <polyline
            points={Array.from({ length: 13 }, (_, k) => {
              const t = k / 12;
              return `${stemX + Math.sin(t * Math.PI * 2) * 0.55 * SP},${stemStart + (stemEnd - stemStart) * t}`;
            }).join(" ")}
            fill="none"
            stroke={colour}
            strokeWidth={0.12 * SP}
            strokeLinecap="round"
          />
        ) : (
          <line x1={stemX} x2={stemX} y1={stemStart} y2={stemEnd} stroke={colour} strokeWidth={0.12 * SP} strokeLinecap="round" />
        ))}
      {n.label && (
        <text x={x + headW / 2} y={labelY} textAnchor="middle" fontSize={1.3 * SP} fontWeight={700} fill={mark ? colour : "var(--primary)"}>
          {n.label}
        </text>
      )}
    </g>
  );
}

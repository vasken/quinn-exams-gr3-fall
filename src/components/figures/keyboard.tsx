import type { KeyArc } from "@/content/types";

const W = 30;
const H = 120;
const BW = 18;
const BH = 74;
const WHITE = [0, 2, 4, 5, 7, 9, 11];
const NAMES = ["C", "D", "E", "F", "G", "A", "B"];
const INK = "#1e293b";

const isBlack = (k: number) => !WHITE.includes(((k % 12) + 12) % 12);
/** Index of the white key at or just left of key `k`. */
const whiteIndex = (k: number) => Math.floor(k / 12) * 7 + WHITE.filter((w) => w <= ((k % 12) + 12) % 12).length - 1;

/** Piano keys from `from` to `to` (half steps above middle C), with highlighted keys and step arcs. */
export function Keyboard({ keys = [], arcs = [], from = 0, to = 23 }: { keys?: number[]; arcs?: KeyArc[]; from?: number; to?: number }) {
  const first = whiteIndex(from);
  const last = whiteIndex(to);
  const x0 = (k: number) => (whiteIndex(k) - first) * W;
  const centre = (k: number) => (isBlack(k) ? x0(k) + W : x0(k) + W / 2);
  const top = arcs.length ? 44 : 4;
  const width = (last - first + 1) * W;
  const range = Array.from({ length: to - from + 1 }, (_, i) => from + i);

  return (
    <svg viewBox={`-4 ${-top} ${width + 8} ${H + top + 6}`} className="mx-auto w-full max-w-xl" role="img" aria-label="Piano keyboard">
      {range
        .filter((k) => !isBlack(k))
        .map((k) => (
          <g key={k}>
            <rect x={x0(k)} y={0} width={W} height={H} rx={3} fill={keys.includes(k) ? "#c9d6f8" : "#fff"} stroke={INK} strokeWidth={1.2} />
            <text x={x0(k) + W / 2} y={H - 10} textAnchor="middle" fontSize={13} fontWeight={700} fill={keys.includes(k) ? "var(--primary)" : "#64748b"}>
              {NAMES[WHITE.indexOf(((k % 12) + 12) % 12)]}
            </text>
          </g>
        ))}
      {range.filter(isBlack).map((k) => (
        <rect key={k} x={x0(k) + W - BW / 2} y={0} width={BW} height={BH} rx={2} fill={keys.includes(k) ? "var(--primary)" : INK} />
      ))}
      {arcs.map((a) => {
        const x1 = centre(a.from);
        const x2 = centre(a.to);
        const mid = (x1 + x2) / 2;
        return (
          <g key={`${a.from}-${a.to}`}>
            <path d={`M${x1} -4 Q${mid} -30 ${x2} -4`} fill="none" stroke="var(--primary)" strokeWidth={2} />
            <text x={mid} y={-26} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--primary)" stroke="#fff" strokeWidth={4} paintOrder="stroke">
              {a.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

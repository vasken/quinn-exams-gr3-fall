import { type FigureProps, hit } from "./shared";

const LEVELS = [0, 50, 100, 150, 200, 250, 300, 325];
const SCALES = [1, 0.86, 0.72, 0.58, 0.45, 0.33, 0.2, 0.09];

/** A point on the contour line for `level` at angle `t` (radians, SVG y-down). */
function point(i: number, t: number): [number, number] {
  const k = SCALES[i];
  const cx = 200 - (1 - k) * 25;
  const cy = 150 - (1 - k) * 12;
  const r = 1 + 0.12 * Math.sin(2 * t + 0.5) + 0.08 * Math.cos(3 * t);
  return [cx + Math.cos(t) * 155 * k * r, cy + Math.sin(t) * 105 * k * r];
}

function ring(i: number) {
  const pts = Array.from({ length: 72 }, (_, n) => point(i, (n / 72) * Math.PI * 2));
  return `M${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L")} Z`;
}

const A = point(0, Math.PI);
const B = point(0, 0);
const C = point(1, Math.PI * 0.72);
const D = point(4, Math.PI * 0.72);
const PEAK: [number, number] = [200 - (1 - SCALES[7]) * 25, 150 - (1 - SCALES[7]) * 12 + 3];

export function Contour(props: FigureProps) {
  const pts: [string, [number, number]][] = [
    ["A", A],
    ["B", B],
    ["C", C],
    ["D", D],
  ];
  return (
    <svg viewBox="0 0 400 290" className="mx-auto w-full max-w-lg rounded-xl bg-slate-200" role="img" aria-label="Topographic map of a mountain">
      {LEVELS.map((lvl, i) => (
        <path key={lvl} d={ring(i)} fill={i === 0 ? "#f1f5f9" : "none"} stroke="#334155" strokeWidth="1.6" />
      ))}
      {LEVELS.slice(0, -1).map((lvl, i) => {
        // Alternate sides so the labels near the peak don't pile up.
        const [x, y] = point(i, i % 2 ? Math.PI / 5 : -Math.PI / 5);
        return (
          <text key={lvl} x={x} y={y + 4} fontSize="12" textAnchor="middle" fill="#0f172a" stroke="#f1f5f9" strokeWidth="4" paintOrder="stroke">
            {lvl}
          </text>
        );
      })}
      <line x1={A[0]} y1={A[1]} x2={B[0]} y2={B[1]} stroke="#0f172a" strokeWidth="1.2" />
      <line x1={C[0]} y1={C[1]} x2={D[0]} y2={D[1]} stroke="#0f172a" strokeWidth="1.2" />

      <g {...hit("peak", props)}>
        <circle cx={PEAK[0]} cy={PEAK[1]} r="20" fill="transparent" />
        <path d={`M${PEAK[0]} ${PEAK[1] - 9} l9 15 h-18 Z`} fill="#f8fafc" stroke="#0f172a" strokeWidth="1.8" />
        <text x={PEAK[0] - 14} y={PEAK[1] + 5} textAnchor="end" fontSize="12" fill="#0f172a" stroke="#f1f5f9" strokeWidth="4" paintOrder="stroke">
          325
        </text>
      </g>

      {pts.map(([id, [x, y]]) => (
        <g key={id} {...hit(id, props)}>
          <circle cx={x} cy={y} r="18" fill="transparent" />
          <circle cx={x} cy={y} r="5" fill="#0f172a" />
          <text x={x + (id === "B" ? 10 : -10)} y={y + (id === "C" ? 16 : id === "D" ? -8 : -6)} fontSize="16" fontWeight="700" textAnchor={id === "B" ? "start" : "end"} fill="#0f172a">
            {id}
          </text>
        </g>
      ))}
      <text x="392" y="282" fontSize="11" textAnchor="end" fill="#475569">
        elevation in metres (m)
      </text>
    </svg>
  );
}

import { type FigureProps, hit } from "./shared";

const CELL = 80;
const OX = 16;
const OY = 52;

/** Rows go north → south, columns west → east. */
const places: { id: string; emoji: string; name: string; row: number; col: number; fill?: string }[] = [
  { id: "library", emoji: "📚", name: "Library", row: 0, col: 0 },
  { id: "lake", emoji: "💧", name: "Lake", row: 0, col: 1, fill: "#7dd3fc" },
  { id: "hospital", emoji: "🏥", name: "Hospital", row: 0, col: 2 },
  { id: "store", emoji: "🛒", name: "Store", row: 1, col: 0 },
  { id: "park", emoji: "🌳", name: "Park", row: 1, col: 1, fill: "#86efac" },
  { id: "school", emoji: "🏫", name: "School", row: 1, col: 2 },
  { id: "house", emoji: "🏠", name: "House", row: 2, col: 0 },
  { id: "church", emoji: "⛪", name: "Church", row: 2, col: 1 },
  { id: "firestation", emoji: "🚒", name: "Fire station", row: 2, col: 2 },
];

export function TownMap(props: FigureProps) {
  const right = OX + CELL * 3 + 14;
  return (
    <svg viewBox="0 0 400 360" className="mx-auto w-full max-w-lg" role="img" aria-label="Map of Maple Town">
      <rect x="0" y="0" width="400" height="360" rx="14" fill="#fefce8" stroke="#a16207" strokeWidth="2" />

      <g {...hit("title", props)}>
        <rect x="80" y="8" width="240" height="34" rx="8" fill={props.labelled ? "#fef3c7" : "transparent"} />
        <text x="200" y="33" textAnchor="middle" fontSize="22" fontWeight="800" fill="#78350f">
          Map of Maple Town
        </text>
      </g>

      {/* roads */}
      <rect x={OX} y={OY} width={CELL * 3} height={CELL * 3} fill="#d6d3d1" rx="6" />
      {places.map((p) => (
        <g key={p.id} {...hit(p.id, props)}>
          <rect
            x={OX + p.col * CELL + 6}
            y={OY + p.row * CELL + 6}
            width={CELL - 12}
            height={CELL - 12}
            rx="10"
            fill={p.fill ?? "#ffffff"}
            stroke="#a8a29e"
          />
          <text x={OX + p.col * CELL + CELL / 2} y={OY + p.row * CELL + CELL / 2 + 13} textAnchor="middle" fontSize="36">
            {p.emoji}
          </text>
        </g>
      ))}

      <g {...hit("legend", props)}>
        <rect x={right} y={OY} width={400 - right - 10} height="196" rx="8" fill="#ffffff" stroke="#78716c" />
        <text x={right + 10} y={OY + 20} fontSize="14" fontWeight="800" fill="#44403c">
          Legend
        </text>
        {places
          .filter((p) => !p.fill)
          .map((p, i) => (
            <text key={p.id} x={right + 10} y={OY + 42 + i * 20} fontSize="13" fill="#44403c">
              {p.emoji} {p.name}
            </text>
          ))}
        <rect x={right + 10} y={OY + 162} width="14" height="12" fill="#7dd3fc" />
        <text x={right + 30} y={OY + 172} fontSize="13" fill="#44403c">
          water
        </text>
        <rect x={right + 10} y={OY + 178} width="14" height="12" fill="#86efac" />
        <text x={right + 30} y={OY + 188} fontSize="13" fill="#44403c">
          park
        </text>
      </g>

      <g {...hit("compass", props)}>
        <circle cx={right + 52} cy="304" r="40" fill="transparent" />
        <path d={`M${right + 52} 270 l8 26 l-8 8 l-8 -8 Z`} fill="#dc2626" />
        <path d={`M${right + 52} 338 l8 -26 l-8 -8 l-8 8 Z`} fill="#57534e" />
        <path d={`M${right + 18} 304 l26 -8 l8 8 l-8 8 Z`} fill="#57534e" />
        <path d={`M${right + 86} 304 l-26 -8 l-8 8 l8 8 Z`} fill="#57534e" />
        <text x={right + 52} y="266" textAnchor="middle" fontSize="13" fontWeight="800" fill="#dc2626">N</text>
        <text x={right + 52} y="354" textAnchor="middle" fontSize="13" fontWeight="800" fill="#44403c">S</text>
        <text x={right + 96} y="309" textAnchor="middle" fontSize="13" fontWeight="800" fill="#44403c">E</text>
        <text x={right + 8} y="309" textAnchor="middle" fontSize="13" fontWeight="800" fill="#44403c">W</text>
      </g>

      <g {...hit("scale", props)}>
        <rect x={OX} y="300" width="140" height="48" fill="transparent" />
        <line x1={OX} y1="320" x2={OX + CELL} y2="320" stroke="#1c1917" strokeWidth="4" />
        <line x1={OX} y1="312" x2={OX} y2="328" stroke="#1c1917" strokeWidth="3" />
        <line x1={OX + CELL} y1="312" x2={OX + CELL} y2="328" stroke="#1c1917" strokeWidth="3" />
        <text x={OX} y="344" fontSize="12" fill="#1c1917">0</text>
        <text x={OX + CELL} y="344" fontSize="12" textAnchor="middle" fill="#1c1917">1 km</text>
        <text x={OX + CELL + 14} y="324" fontSize="11" fill="#57534e">1 block = 1 km</text>
      </g>

      {props.labelled && (
        <g className="pointer-events-none" fontSize="12" fontWeight="800" fill="#be185d">
          <text x="326" y="22">← Title</text>
          <text x={right + 64} y={OY + 20}>Legend</text>
          <text x={OX + 180} y="316">Scale</text>
          <text x={right + 2} y="356" fontSize="11">Compass rose</text>
        </g>
      )}
    </svg>
  );
}

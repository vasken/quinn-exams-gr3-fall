import { type FigureProps, hit } from "./shared";

const HL = "#fb923c";

const labels: { id: string; text: string; x: number; y: number; to: [number, number]; anchor: "start" | "end" }[] = [
  { id: "stigma", text: "stigma", x: 330, y: 110, to: [218, 120], anchor: "start" },
  { id: "style", text: "style", x: 330, y: 170, to: [206, 180], anchor: "start" },
  { id: "petal", text: "petal", x: 330, y: 230, to: [300, 200], anchor: "start" },
  { id: "ovule", text: "ovule", x: 330, y: 290, to: [212, 266], anchor: "start" },
  { id: "anther", text: "anther", x: 70, y: 110, to: [136, 128], anchor: "end" },
  { id: "filament", text: "filament", x: 70, y: 175, to: [160, 190], anchor: "end" },
  { id: "ovary", text: "ovary", x: 70, y: 260, to: [160, 262], anchor: "end" },
  { id: "sepal", text: "sepal", x: 70, y: 310, to: [150, 298], anchor: "end" },
];

export function Flower(props: FigureProps) {
  const hl = (id: string) => props.highlight?.includes(id);
  const fill = (id: string, base: string) => (hl(id) ? HL : base);

  return (
    <svg viewBox={props.labelled ? "-10 90 420 250" : "40 90 320 250"} className="mx-auto w-full max-w-md" role="img" aria-label="Diagram of a flower">
      {/* stem */}
      <rect x="194" y="300" width="12" height="40" rx="4" fill="#4d7c0f" />

      {/* petals */}
      <g {...hit("petal", props)}>
        <ellipse cx="112" cy="200" rx="78" ry="38" transform="rotate(-28 112 200)" fill={fill("petal", "#f9a8d4")} stroke="#db2777" strokeWidth="2" />
        <ellipse cx="288" cy="200" rx="78" ry="38" transform="rotate(28 288 200)" fill={fill("petal", "#f9a8d4")} stroke="#db2777" strokeWidth="2" />
      </g>

      {/* sepals */}
      <g {...hit("sepal", props)}>
        <path d="M200 302 Q150 310 128 282 Q170 280 196 292 Z" fill={fill("sepal", "#65a30d")} stroke="#3f6212" strokeWidth="2" />
        <path d="M200 302 Q250 310 272 282 Q230 280 204 292 Z" fill={fill("sepal", "#65a30d")} stroke="#3f6212" strokeWidth="2" />
      </g>

      {/* filaments (wide invisible stroke = bigger touch target) */}
      <g {...hit("filament", props)}>
        <path d="M178 262 L150 140 M222 262 L250 140" stroke="transparent" strokeWidth="24" />
        <path d="M178 262 L150 140 M222 262 L250 140" stroke={fill("filament", "#a3a3a3")} strokeWidth="6" strokeLinecap="round" />
      </g>

      {/* anthers */}
      <g {...hit("anther", props)}>
        <ellipse cx="150" cy="130" rx="18" ry="12" fill={fill("anther", "#facc15")} stroke="#a16207" strokeWidth="2" />
        <ellipse cx="250" cy="130" rx="18" ry="12" fill={fill("anther", "#facc15")} stroke="#a16207" strokeWidth="2" />
        {[[140, 116], [158, 114], [244, 115], [260, 117]].map(([x, y]) => (
          <circle key={`${x}`} cx={x} cy={y} r="3" fill="#eab308" />
        ))}
      </g>

      {/* ovary */}
      <g {...hit("ovary", props)}>
        <ellipse cx="200" cy="265" rx="46" ry="34" fill={fill("ovary", "#bef264")} stroke="#4d7c0f" strokeWidth="2.5" />
      </g>

      {/* ovules */}
      <g {...hit("ovule", props)}>
        <ellipse cx="200" cy="266" rx="24" ry="15" fill="transparent" />
        {[[186, 268], [200, 260], [214, 270]].map(([x, y]) => (
          <circle key={x} cx={x} cy={y} r="7" fill={fill("ovule", "#fef9c3")} stroke="#854d0e" strokeWidth="1.5" />
        ))}
      </g>

      {/* style */}
      <g {...hit("style", props)}>
        <rect x="186" y="132" width="28" height="100" fill="transparent" />
        <rect x="194" y="132" width="12" height="102" rx="4" fill={fill("style", "#a3e635")} stroke="#4d7c0f" strokeWidth="2" />
      </g>

      {/* stigma */}
      <g {...hit("stigma", props)}>
        <ellipse cx="200" cy="122" rx="24" ry="13" fill={fill("stigma", "#84cc16")} stroke="#3f6212" strokeWidth="2.5" />
      </g>

      {props.labelled &&
        labels.map((l) => (
          <g key={l.id} className="pointer-events-none">
            <line x1={l.anchor === "start" ? l.x - 4 : l.x + 4} y1={l.y - 5} x2={l.to[0]} y2={l.to[1]} stroke="#475569" strokeWidth="1.5" />
            <text x={l.x} y={l.y} textAnchor={l.anchor} fontSize="17" fontWeight="600" fill="#1e293b">
              {l.text}
            </text>
          </g>
        ))}
      {props.labelled && (
        <text x="70" y="140" textAnchor="end" fontSize="13" fill="#64748b" fontWeight="600" className="pointer-events-none">
          (stamen)
        </text>
      )}
    </svg>
  );
}

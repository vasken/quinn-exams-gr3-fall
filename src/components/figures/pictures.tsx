import type { ScratchBlock } from "@/content/types";
import { cn } from "@/lib/utils";
import { type FigureProps, hit } from "./shared";

export function Roots(props: FigureProps) {
  return (
    <svg viewBox="0 0 400 260" className="mx-auto w-full max-w-md" role="img" aria-label="A tap root and fibrous roots">
      <rect x="0" y="90" width="400" height="170" fill="#d6b88d" rx="10" />
      <rect x="0" y="86" width="400" height="8" fill="#65a30d" />

      <g {...hit("taproot", props)}>
        <rect x="20" y="0" width="170" height="260" fill="transparent" />
        <path d="M100 90 Q80 40 70 20 M100 90 Q100 30 104 12 M100 90 Q120 40 134 22" stroke="#16a34a" strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M80 92 Q100 88 120 92 L103 230 Q100 240 97 230 Z" fill="#f97316" stroke="#c2410c" strokeWidth="2" />
        <path d="M90 130 l-14 6 M110 160 l14 6 M95 190 l-12 4" stroke="#c2410c" strokeWidth="2" />
      </g>

      <g {...hit("fibrous", props)}>
        <rect x="210" y="0" width="170" height="260" fill="transparent" />
        {[-30, -18, -6, 6, 18, 30].map((dx) => (
          <path key={dx} d={`M300 90 Q${300 + dx * 0.6} 50 ${300 + dx * 1.4} 18`} stroke="#22c55e" strokeWidth="4" fill="none" strokeLinecap="round" />
        ))}
        {[-70, -50, -32, -16, 0, 16, 32, 50, 70].map((dx, i) => (
          <path
            key={dx}
            d={`M300 92 Q${300 + dx * 0.5} ${130 + (i % 3) * 8} ${300 + dx} ${150 + (i % 2) * 25}`}
            stroke="#78350f"
            strokeWidth="2.5"
            fill="none"
          />
        ))}
      </g>

      {props.labelled && (
        <g fontSize="18" fontWeight="700" fill="#1c1917" className="pointer-events-none">
          <text x="100" y="255" textAnchor="middle">Tap root</text>
          <text x="300" y="255" textAnchor="middle">Fibrous roots</text>
        </g>
      )}
    </svg>
  );
}

export function Comic(props: FigureProps) {
  return (
    <svg viewBox="0 0 400 210" className="mx-auto w-full max-w-lg" role="img" aria-label="A two-panel comic">
      <g {...hit("panel", props)}>
        <rect x="4" y="4" width="192" height="202" fill="#e0f2fe" stroke="#0f172a" strokeWidth="3" />
        <rect x="204" y="4" width="192" height="202" fill="#dcfce7" stroke="#0f172a" strokeWidth="3" />
      </g>

      <g {...hit("caption", props)}>
        <rect x="10" y="10" width="140" height="34" fill="#fef08a" stroke="#0f172a" strokeWidth="2" />
        <text x="18" y="25" fontSize="11" fill="#0f172a">One morning, on a</text>
        <text x="18" y="38" fontSize="11" fill="#0f172a">wild island…</text>
      </g>
      <text x="60" y="190" fontSize="62">🤖</text>
      <g {...hit("speech", props)}>
        <path d="M108 120 L96 150 L124 122 Z" fill="#fff" stroke="#0f172a" strokeWidth="2" />
        <ellipse cx="130" cy="96" rx="58" ry="30" fill="#fff" stroke="#0f172a" strokeWidth="2" />
        <path d="M100 118 L118 122" stroke="#fff" strokeWidth="5" />
        <text x="130" y="93" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0f172a">Hello,</text>
        <text x="130" y="109" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0f172a">friends!</text>
      </g>

      <text x="250" y="190" fontSize="62">🦊</text>
      <g {...hit("thought", props)}>
        <circle cx="292" cy="140" r="5" fill="#fff" stroke="#0f172a" strokeWidth="2" />
        <circle cx="304" cy="124" r="8" fill="#fff" stroke="#0f172a" strokeWidth="2" />
        {[[290, 70], [320, 58], [350, 70], [360, 94], [334, 108], [300, 104], [280, 90]].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="22" fill="#fff" stroke="#0f172a" strokeWidth="2" />
        ))}
        <ellipse cx="320" cy="84" rx="44" ry="24" fill="#fff" />
        <text x="320" y="80" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0f172a">Is that a</text>
        <text x="320" y="96" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0f172a">robot?</text>
      </g>
    </svg>
  );
}

export function Ad(props: FigureProps) {
  return (
    <svg viewBox="0 0 300 330" className="mx-auto w-full max-w-xs" role="img" aria-label="An ad for lemonade">
      <rect x="2" y="2" width="296" height="326" rx="18" fill="#fef9c3" stroke="#ca8a04" strokeWidth="4" />
      <g {...hit("logo", props)}>
        <circle cx="38" cy="38" r="24" fill="#facc15" stroke="#a16207" strokeWidth="3" />
        <text x="38" y="45" textAnchor="middle" fontSize="18" fontWeight="900" fill="#a16207">SS</text>
      </g>
      <g {...hit("headline", props)}>
        <text x="170" y="40" textAnchor="middle" fontSize="22" fontWeight="900" fill="#c2410c">SUNNY SQUEEZE</text>
        <text x="170" y="64" textAnchor="middle" fontSize="18" fontWeight="800" fill="#c2410c">LEMONADE</text>
      </g>
      <g {...hit("picture", props)}>
        <text x="150" y="180" textAnchor="middle" fontSize="90">🍋🥤</text>
      </g>
      <g {...hit("slogan", props)}>
        <rect x="40" y="206" width="220" height="40" rx="20" fill="#f97316" />
        <text x="150" y="232" textAnchor="middle" fontSize="18" fontWeight="800" fontStyle="italic" fill="#fff">
          “Sip the sunshine!”
        </text>
      </g>
      <g {...hit("price", props)}>
        <circle cx="240" cy="282" r="34" fill="#dc2626" />
        <text x="240" y="281" textAnchor="middle" fontSize="13" fontWeight="700" fill="#fff">ONLY</text>
        <text x="240" y="299" textAnchor="middle" fontSize="20" fontWeight="900" fill="#fff">$2</text>
      </g>
      <text x="30" y="290" fontSize="13" fontWeight="700" fill="#713f12">Buy yours today</text>
      <text x="30" y="306" fontSize="13" fontWeight="700" fill="#713f12">at Maple Market!</text>
    </svg>
  );
}

export function BarGraph({ title, labels, values, unit }: { title: string; labels: string[]; values: number[]; unit?: string }) {
  const max = Math.max(...values);
  const top = Math.ceil(max / 2) * 2;
  const H = 180;
  const W = 340;
  const bw = W / labels.length;
  return (
    <svg viewBox="0 0 400 270" className="mx-auto w-full max-w-lg" role="img" aria-label={title}>
      <text x="200" y="22" textAnchor="middle" fontSize="17" fontWeight="800" fill="#1e293b">
        {title}
      </text>
      {Array.from({ length: top / 2 + 1 }, (_, i) => i * 2).map((v) => {
        const y = 40 + H - (v / top) * H;
        return (
          <g key={v}>
            <line x1="44" x2={44 + W} y1={y} y2={y} stroke="#e2e8f0" />
            <text x="36" y={y + 4} textAnchor="end" fontSize="12" fill="#475569">
              {v}
            </text>
          </g>
        );
      })}
      {values.map((v, i) => {
        const h = (v / top) * H;
        return (
          <g key={labels[i]}>
            <rect x={44 + i * bw + bw * 0.18} y={40 + H - h} width={bw * 0.64} height={h} rx="6" fill={["#f87171", "#facc15", "#f472b6", "#a78bfa", "#60a5fa"][i % 5]} />
            <text x={44 + i * bw + bw / 2} y={40 + H + 20} textAnchor="middle" fontSize="14" fill="#1e293b">
              {labels[i]}
            </text>
          </g>
        );
      })}
      <line x1="44" x2="44" y1="40" y2={40 + H} stroke="#334155" strokeWidth="2" />
      <line x1="44" x2={44 + W} y1={40 + H} y2={40 + H} stroke="#334155" strokeWidth="2" />
      <text x="12" y="140" fontSize="12" fill="#475569" transform="rotate(-90 12 140)" textAnchor="middle">
        {unit ?? "number of students"}
      </text>
    </svg>
  );
}

const blockColor: Record<string, string> = {
  event: "bg-[#FFBF00] border-[#CC9900] text-stone-900",
  motion: "bg-[#4C97FF] border-[#3373CC] text-white",
  looks: "bg-[#9966FF] border-[#774DCB] text-white",
  sound: "bg-[#CF63CF] border-[#BD42BD] text-white",
  pen: "bg-[#0FBD8C] border-[#0B8E69] text-white",
  repeat: "bg-[#FFAB19] border-[#CF8B17] text-stone-900",
};

function BlockList({ blocks }: { blocks: ScratchBlock[] }) {
  return (
    <div className="flex flex-col">
      {blocks.map((b, i) =>
        b.kind === "repeat" ? (
          <div key={i} className={cn("w-fit min-w-56 rounded-lg border-2", blockColor.repeat)}>
            <div className="px-3 py-2 font-bold">
              repeat <span className="rounded-full bg-white px-2 text-stone-900">{b.times}</span>
            </div>
            <div className="ml-5 border-l-0 bg-white/0 pb-1">
              <BlockList blocks={b.body} />
            </div>
            <div className="h-4" />
          </div>
        ) : (
          <div
            key={i}
            className={cn(
              "w-fit min-w-44 border-2 px-3 py-2 font-bold",
              blockColor[b.kind],
              b.kind === "event" ? "rounded-t-3xl rounded-b-lg pt-3" : "rounded-lg",
            )}
          >
            {b.text}
          </div>
        ),
      )}
    </div>
  );
}

export function Scratch({ blocks }: { blocks: ScratchBlock[] }) {
  return (
    <div className="mx-auto w-fit rounded-xl bg-slate-100 p-4 text-base" aria-label="Code blocks">
      <BlockList blocks={blocks} />
    </div>
  );
}

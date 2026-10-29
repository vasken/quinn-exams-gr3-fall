"use client";

import { useState, type AnimationEvent } from "react";
import { cn } from "@/lib/utils";

const SKIN = "#f5d2b3";
const SKIN_SHADE = "#e6b892";
const HAIR = "#1c1a22";
const HAIR_SHINE = "#4a4656";
const CHEEK = "#f4a0a6";
const MOUTH = "#b04f5c";
const EYE = "#2a1d18";

function Eyes({ x1, x2, y, rx, ry }: { x1: number; x2: number; y: number; rx: number; ry: number }) {
  return (
    <g className="sis-blink">
      {[x1, x2].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={EYE} />
          <circle cx={x + rx * 0.35} cy={y - ry * 0.4} r={rx * 0.3} fill="#fff" />
        </g>
      ))}
    </g>
  );
}

/** Big sister: long hair down with blunt bangs, pink dress, waving. */
function BigSister() {
  return (
    <g className="sis-bob">
      {/* hair behind */}
      <path d="M46,58 Q46,24 78,24 Q110,24 110,58 L114,128 Q78,138 42,128 Z" fill={HAIR} />

      {/* legs + shoes */}
      <rect x="67" y="158" width="8" height="28" rx="3" fill={SKIN} />
      <rect x="81" y="158" width="8" height="28" rx="3" fill={SKIN} />
      <ellipse cx="70" cy="187" rx="8" ry="4" fill="#8a2b52" />
      <ellipse cx="86" cy="187" rx="8" ry="4" fill="#8a2b52" />

      {/* arm at side */}
      <line x1="59" y1="100" x2="49" y2="138" stroke={SKIN} strokeWidth="8" strokeLinecap="round" />

      {/* waving arm */}
      <g className="sis-wave">
        <line x1="97" y1="100" x2="117" y2="70" stroke={SKIN} strokeWidth="8" strokeLinecap="round" />
        <circle cx="118" cy="67" r="6" fill={SKIN} />
      </g>

      {/* pink dress */}
      <g className="sis-sway">
        <path d="M60,92 Q78,86 96,92 L114,160 Q78,170 42,160 Z" fill="#f48fbf" />
        <path d="M62,118 Q78,122 94,118" stroke="#e46aa6" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M46,156 Q78,165 110,156" stroke="#fbc4dd" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="60" cy="96" r="7" fill="#f48fbf" />
        <circle cx="96" cy="96" r="7" fill="#f48fbf" />
      </g>

      {/* neck + head */}
      <rect x="72" y="80" width="12" height="12" rx="3" fill={SKIN_SHADE} />
      <circle cx="78" cy="58" r="28" fill={SKIN} />

      <Eyes x1={67} x2={89} y={64} rx={3.4} ry={3.2} />
      <ellipse cx="61" cy="72" rx="5" ry="3" fill={CHEEK} opacity="0.6" />
      <ellipse cx="95" cy="72" rx="5" ry="3" fill={CHEEK} opacity="0.6" />
      <path d="M73,76 Q78,80.5 83,76" stroke={MOUTH} strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* hair front: straight bangs and strands down each side of the face */}
      <path
        d="M48,100 L48,56 Q48,26 78,26 Q108,26 108,56 L108,100 L101,100 L101,58 Q100,52 98,50 Q93,53 88,50 Q83,53 78,50 Q73,53 68,50 Q63,53 58,50 Q56,52 55,58 L55,100 Z"
        fill={HAIR}
      />
      <path d="M60,34 Q72,28 86,30" stroke={HAIR_SHINE} strokeWidth="3" fill="none" strokeLinecap="round" />
    </g>
  );
}

/** Little sister: two ponytails, yellow dress. */
function LittleSister() {
  return (
    <g className="sis-bob sis-bob-quick">
      {/* ponytails */}
      <g className="sis-tail-l">
        <path d="M150,82 Q130,76 124,94 Q122,108 132,116 Q134,100 149,90 Z" fill={HAIR} />
      </g>
      <g className="sis-tail-r">
        <path d="M190,82 Q210,76 216,94 Q218,108 208,116 Q206,100 191,90 Z" fill={HAIR} />
      </g>
      <circle cx="150" cy="85" r="4" fill="#ef5b6b" />
      <circle cx="190" cy="85" r="4" fill="#ef5b6b" />

      {/* legs + shoes */}
      <rect x="163" y="162" width="7" height="24" rx="3" fill={SKIN} />
      <rect x="171" y="162" width="7" height="24" rx="3" fill={SKIN} />
      <ellipse cx="165" cy="187" rx="7" ry="3.5" fill="#33405e" />
      <ellipse cx="177" cy="187" rx="7" ry="3.5" fill="#33405e" />

      {/* arms */}
      <line x1="158" y1="126" x2="148" y2="150" stroke={SKIN} strokeWidth="7" strokeLinecap="round" />
      <line x1="182" y1="126" x2="192" y2="150" stroke={SKIN} strokeWidth="7" strokeLinecap="round" />

      {/* yellow dress */}
      <g className="sis-sway sis-sway-quick">
        <path d="M157,120 Q170,115 183,120 L195,164 Q170,171 145,164 Z" fill="#fcd468" />
        <path d="M160,120 Q170,128 180,120" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" />
        <circle cx="158" cy="124" r="6" fill="#fcd468" />
        <circle cx="182" cy="124" r="6" fill="#fcd468" />
      </g>

      {/* neck + head */}
      <rect x="165" y="112" width="10" height="9" rx="3" fill={SKIN_SHADE} />
      <circle cx="170" cy="94" r="24" fill={SKIN} />

      <Eyes x1={161} x2={179} y={99} rx={3} ry={3} />
      <ellipse cx="156" cy="106" rx="4.5" ry="2.6" fill={CHEEK} opacity="0.6" />
      <ellipse cx="184" cy="106" rx="4.5" ry="2.6" fill={CHEEK} opacity="0.6" />
      <path d="M165,108 Q170,115 175,108 Z" fill={MOUTH} />

      {/* hair cap with bangs */}
      <path
        d="M146,98 Q144,68 170,68 Q196,68 194,98 L190,98 Q189,89 186,86 Q182,89 178,86 Q174,89 170,86 Q166,89 162,86 Q158,89 154,86 Q151,89 150,98 Z"
        fill={HAIR}
      />
      <path d="M156,76 Q166,71 178,73" stroke={HAIR_SHINE} strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </g>
  );
}

export function Sisters({ className }: { className?: string }) {
  const [hopping, setHopping] = useState(false);

  // The little sister hops last, so her hop ending means both are done.
  function onAnimationEnd(e: AnimationEvent) {
    if (e.animationName === "sis-hop" && (e.target as Element).classList.contains("sis-little")) setHopping(false);
  }

  return (
    <button
      type="button"
      aria-label="Two sisters waving. Tap to make them jump."
      onClick={() => setHopping(true)}
      onAnimationEnd={onAnimationEnd}
      className={cn("sisters shrink-0 rounded-xl focus-visible:outline-3 focus-visible:outline-ring", className)}
    >
      <svg viewBox="36 20 186 174" className="h-full w-auto" aria-hidden>
        <ellipse cx="78" cy="189" rx="28" ry="4" fill="#1f2a44" opacity="0.08" />
        <ellipse cx="171" cy="189" rx="22" ry="3.5" fill="#1f2a44" opacity="0.08" />
        <g className={cn(hopping && "sis-hop")}>
          <BigSister />
        </g>
        <g className={cn("sis-little", hopping && "sis-hop")}>
          <LittleSister />
        </g>
      </svg>
    </button>
  );
}

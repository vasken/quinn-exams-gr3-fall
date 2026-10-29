"use client";

import { useState } from "react";
import canada from "@svg-maps/canada";
import { PROVINCES } from "@/content/maps";
import { type FigureProps, hit } from "./shared";

const COLORS = ["#bfdbfe", "#bbf7d0", "#fde68a", "#fecaca", "#ddd6fe", "#a5f3fc"];
/** Small provinces get a fat invisible outline so fingers can hit them. */
const SMALL = ["pe", "ns", "nb"];

export function CanadaMap(props: FigureProps) {
  const [picked, setPicked] = useState<string | null>(null);
  // On Learn cards, tapping a province shows its name.
  const onTap = props.onTap ?? (props.labelled ? setPicked : undefined);
  const marks = props.marks ?? (picked ? { [picked]: "reveal" as const } : undefined);

  return (
    <div>
      <svg viewBox={canada.viewBox} className="mx-auto max-h-[52vh] w-full max-w-xl" role="img" aria-label="Map of Canada">
        {canada.locations.map((loc, i) => {
          const on = props.highlight?.includes(loc.id);
          return (
            <g key={loc.id} {...hit(loc.id, { ...props, onTap, marks })}>
              {SMALL.includes(loc.id) && <path d={loc.path} fill="transparent" stroke="transparent" strokeWidth="22" />}
              <path
                d={loc.path}
                fill={on ? "#f97316" : props.highlight ? "#e7e5e4" : COLORS[i % COLORS.length]}
                stroke="#57534e"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </g>
          );
        })}
      </svg>
      {props.labelled && (
        <p className="mt-2 text-center text-lg font-semibold text-amber-800">
          {picked ? `${PROVINCES[picked].name} (${PROVINCES[picked].kind})` : "👆 Tap a province or territory to see its name"}
        </p>
      )}
    </div>
  );
}

export type Mark = "right" | "wrong" | "reveal";

export interface FigureProps {
  /** When set, tappable parts call this with their id. */
  onTap?: (id: string) => void;
  /** Colour feedback on parts after an answer. */
  marks?: Record<string, Mark>;
  /** Parts to colour in (e.g. "which part is highlighted?"). */
  highlight?: string[];
  /** Show name labels (used on Learn cards). */
  labelled?: boolean;
}

/** Props that make an SVG group tappable and colour it for feedback. */
export function hit(id: string, { onTap, marks }: FigureProps) {
  const mark = marks?.[id];
  return {
    "data-part": id,
    "data-mark": mark,
    role: onTap ? "button" : undefined,
    "aria-label": onTap ? id : undefined,
    onClick: onTap ? () => onTap(id) : undefined,
    className: [
      "fig-part",
      onTap ? "cursor-pointer" : "",
      mark === "right" || mark === "reveal" ? "fig-right" : mark === "wrong" ? "fig-wrong" : "",
    ].join(" "),
  };
}

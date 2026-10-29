import type { Figure as FigureData } from "@/content/types";
import { CanadaMap } from "./canada";
import { Contour } from "./contour";
import { Flower } from "./flower";
import { Ad, BarGraph, Comic, Roots, Scratch } from "./pictures";
import type { FigureProps } from "./shared";
import { TownMap } from "./town-map";

export type { Mark } from "./shared";

export function Figure({ figure, ...props }: FigureProps & { figure: FigureData }) {
  switch (figure.id) {
    case "flower":
      return <Flower {...props} highlight={figure.highlight} />;
    case "roots":
      return <Roots {...props} />;
    case "contour":
      return <Contour {...props} />;
    case "town-map":
      return <TownMap {...props} />;
    case "canada":
      return <CanadaMap {...props} highlight={figure.highlight} />;
    case "comic":
      return <Comic {...props} />;
    case "ad":
      return <Ad {...props} />;
    case "bar-graph":
      return <BarGraph {...figure} />;
    case "scratch":
      return <Scratch blocks={figure.blocks} />;
    case "emoji":
      return <div className="text-center text-7xl">{figure.value}</div>;
  }
}

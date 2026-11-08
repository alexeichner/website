import { memo } from "react";
import { COUNTRY_NAMES, type CountryName } from "@/lib/countries";
import worldMap from "@/app/countries/world-map.json";

const countries = worldMap.countries as Record<
  CountryName,
  { d: string; dot?: [number, number] }
>;

type Props = {
  found: ReadonlySet<CountryName>;
  // After the game, unfound countries switch color and show their name on hover.
  revealMissed: boolean;
};

function WorldMap({ found, revealMissed }: Props) {
  return (
    <svg
      viewBox={`0 0 ${worldMap.width} ${worldMap.height}`}
      className="h-auto max-h-[72vh] w-full"
      role="img"
      aria-label={`World map, ${found.size} countries found`}
    >
      {COUNTRY_NAMES.map((name) => {
        const { d, dot } = countries[name];
        const color = found.has(name)
          ? "fill-found"
          : revealMissed
            ? "fill-tert"
            : "fill-accent";
        return (
          <g
            key={name}
            className={`${color} stroke-background transition-colors duration-300`}
          >
            {revealMissed && <title>{name}</title>}
            {d && <path d={d} strokeWidth={0.4} strokeLinejoin="round" />}
            {dot && <circle cx={dot[0]} cy={dot[1]} r={2.6} strokeWidth={0.8} />}
          </g>
        );
      })}
    </svg>
  );
}

// The map is large, so only redraw it when the found set or reveal state changes.
export default memo(WorldMap);

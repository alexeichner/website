import { memo } from "react";
import { COUNTRY_NAMES, type CountryName } from "@/lib/countries";
import worldMap from "@/app/countries/world-map.json";

const countries = worldMap.countries as Record<
  CountryName,
  { d: string; dot?: [number, number] }
>;

const dotted = COUNTRY_NAMES.filter((name) => countries[name].dot);

type Props = {
  found: ReadonlySet<CountryName>;
  // After the game, unfound countries switch color and show their name on hover.
  revealMissed: boolean;
};

function WorldMap({ found, revealMissed }: Props) {
  const colorOf = (name: CountryName) =>
    found.has(name) ? "fill-found" : revealMissed ? "fill-tert" : "fill-accent";
  const shared = "stroke-background transition-colors duration-300";

  return (
    <svg
      viewBox={`0 0 ${worldMap.width} ${worldMap.height}`}
      className="h-auto max-h-[72vh] w-full"
      role="img"
      aria-label={`World map, ${found.size} countries found`}
    >
      {COUNTRY_NAMES.map((name) => {
        const { d } = countries[name];
        if (!d) return null;
        return (
          <path
            key={name}
            d={d}
            strokeWidth={0.4}
            strokeLinejoin="round"
            className={`${colorOf(name)} ${shared}`}
          >
            {revealMissed && <title>{name}</title>}
          </path>
        );
      })}

      {/* Dots go after every shape so a neighbor (France over Andorra) can't cover them. */}
      {dotted.map((name) => {
        const [cx, cy] = countries[name].dot!;
        return (
          <circle
            key={name}
            cx={cx}
            cy={cy}
            r={2.6}
            strokeWidth={0.8}
            className={`${colorOf(name)} ${shared}`}
          >
            {revealMissed && <title>{name}</title>}
          </circle>
        );
      })}
    </svg>
  );
}

// The map is large, so only redraw it when the found set or reveal state changes.
export default memo(WorldMap);

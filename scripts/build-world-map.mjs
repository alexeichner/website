// Builds app/countries/world-map.json from Natural Earth data (world-atlas).
// Run with `node scripts/build-world-map.mjs` after changing anything below.
import { writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { geoArea, geoCentroid, geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import { presimplify, quantile, simplify } from "topojson-simplify";

const require = createRequire(import.meta.url);
const topology = require("world-atlas/countries-50m.json");

const WIDTH = 1000;
// Countries whose largest piece is smaller than this many square pixels get a dot.
const DOT_AREA = 14;
// Dots closer than this (in pixels) get pushed apart so each one stays visible.
const DOT_SPACING = 7;

// Territories that clear along with the country that governs them.
const OWNER = {
  Greenland: "Denmark",
  "Faeroe Is.": "Denmark",
  "Fr. Polynesia": "France",
  "Fr. S. Antarctic Lands": "France",
  "New Caledonia": "France",
  "St-Barthélemy": "France",
  "St-Martin": "France",
  "St. Pierre and Miquelon": "France",
  "Wallis and Futuna Is.": "France",
  Anguilla: "United Kingdom",
  Bermuda: "United Kingdom",
  "Br. Indian Ocean Ter.": "United Kingdom",
  "British Virgin Is.": "United Kingdom",
  "Cayman Is.": "United Kingdom",
  "Falkland Is.": "United Kingdom",
  Guernsey: "United Kingdom",
  "Isle of Man": "United Kingdom",
  Jersey: "United Kingdom",
  Montserrat: "United Kingdom",
  "Pitcairn Is.": "United Kingdom",
  "S. Geo. and the Is.": "United Kingdom",
  "Saint Helena": "United Kingdom",
  "Turks and Caicos Is.": "United Kingdom",
  "American Samoa": "United States",
  Guam: "United States",
  "N. Mariana Is.": "United States",
  "Puerto Rico": "United States",
  "U.S. Virgin Is.": "United States",
  Aruba: "Netherlands",
  Curaçao: "Netherlands",
  "Sint Maarten": "Netherlands",
  "Ashmore and Cartier Is.": "Australia",
  "Heard I. and McDonald Is.": "Australia",
  "Indian Ocean Ter.": "Australia",
  "Norfolk Island": "Australia",
  "Cook Is.": "New Zealand",
  Niue: "New Zealand",
  "Hong Kong": "China",
  Macao: "China",
  Åland: "Finland",
  "W. Sahara": "Morocco",
  Somaliland: "Somalia",
  "N. Cyprus": "Cyprus",
  "Siachen Glacier": "India",
};

// Natural Earth's abbreviated names mapped to the names the game uses.
const RENAME = {
  "Antigua and Barb.": "Antigua and Barbuda",
  "Bosnia and Herz.": "Bosnia and Herzegovina",
  "Central African Rep.": "Central African Republic",
  Congo: "Republic of the Congo",
  "Dem. Rep. Congo": "Democratic Republic of the Congo",
  "Dominican Rep.": "Dominican Republic",
  "Eq. Guinea": "Equatorial Guinea",
  eSwatini: "Eswatini",
  Macedonia: "North Macedonia",
  "Marshall Is.": "Marshall Islands",
  "S. Sudan": "South Sudan",
  "São Tomé and Principe": "São Tomé and Príncipe",
  "Solomon Is.": "Solomon Islands",
  "St. Kitts and Nevis": "Saint Kitts and Nevis",
  "St. Vin. and Gren.": "Saint Vincent and the Grenadines",
  Turkey: "Türkiye",
  "United States of America": "United States",
  Vatican: "Vatican City",
};

// Countries too small to appear in the 50m data at all: [longitude, latitude].
const EXTRA_DOTS = {
  Tuvalu: [179.2, -8.5],
};

// Keep the most important 20% of points: plenty at screen size, and a much smaller file.
const presimplified = presimplify(topology);
const simplified = simplify(presimplified, quantile(presimplified, 0.2));
const features = feature(simplified, simplified.objects.countries).features.filter(
  (f) => f.properties.name !== "Antarctica",
);

// Rotate slightly so the map's seam falls in the open Pacific.
const projection = geoNaturalEarth1()
  .rotate([-11, 0])
  .fitWidth(WIDTH, { type: "FeatureCollection", features });
const path = geoPath(projection).digits(1);
const [[, top], [, bottom]] = path.bounds({ type: "FeatureCollection", features });
projection.translate([projection.translate()[0], projection.translate()[1] - top]);
const height = Math.ceil(bottom - top);

// Group every feature under the country it belongs to.
const byCountry = new Map();
for (const f of features) {
  const name = f.properties.name;
  const country = OWNER[name] ?? RENAME[name] ?? name;
  if (!byCountry.has(country)) byCountry.set(country, []);
  byCountry.get(country).push(f);
}

function polygonsOf(f) {
  const g = f.geometry;
  if (!g) return [];
  if (g.type === "Polygon") return [{ type: "Polygon", coordinates: g.coordinates }];
  return g.coordinates.map((coordinates) => ({ type: "Polygon", coordinates }));
}

const round = (n) => Math.round(n * 10) / 10;
const countries = {};

for (const [country, parts] of byCountry) {
  // Only the country's own feature decides whether it needs a dot; territories don't count.
  const own = parts.filter((f) => !OWNER[f.properties.name]);
  const polygons = (own.length ? own : parts).flatMap(polygonsOf);
  const largest = polygons.reduce((a, b) => (geoArea(b) > geoArea(a) ? b : a), polygons[0]);

  const entry = { d: parts.map((f) => path(f)).filter(Boolean).join("") };
  if (!largest || path.area(largest) < DOT_AREA) {
    const [x, y] = projection(geoCentroid(largest));
    entry.dot = [round(x), round(y)];
  }
  countries[country] = entry;
}

for (const [country, lonLat] of Object.entries(EXTRA_DOTS)) {
  const [x, y] = projection(lonLat);
  countries[country] = { d: "", dot: [round(x), round(y)] };
}

// Nudge overlapping dots apart; the map doesn't need to be exact, just readable.
const dots = Object.values(countries).filter((c) => c.dot).map((c) => c.dot);
for (let pass = 0; pass < 200; pass++) {
  let moved = false;
  for (let i = 0; i < dots.length; i++) {
    for (let j = i + 1; j < dots.length; j++) {
      const [a, b] = [dots[i], dots[j]];
      const dx = b[0] - a[0] || 0.01;
      const dy = b[1] - a[1];
      const dist = Math.hypot(dx, dy);
      if (dist >= DOT_SPACING) continue;
      const push = (DOT_SPACING - dist) / 2 / dist;
      a[0] -= dx * push;
      a[1] -= dy * push;
      b[0] += dx * push;
      b[1] += dy * push;
      moved = true;
    }
  }
  if (!moved) break;
}
for (const dot of dots) {
  dot[0] = round(dot[0]);
  dot[1] = round(dot[1]);
}

const out = new URL("../app/countries/world-map.json", import.meta.url);
await writeFile(out, JSON.stringify({ width: WIDTH, height, countries }));
console.log(`Wrote ${Object.keys(countries).length} countries, ${WIDTH}x${height}`);

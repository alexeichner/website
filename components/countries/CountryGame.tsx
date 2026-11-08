"use client";

import { useEffect, useRef, useState } from "react";
import WorldMap from "@/components/countries/WorldMap";
import ScoreForm from "@/components/countries/ScoreForm";
import {
  ANSWERS,
  COUNTRY_NAMES,
  TOTAL_COUNTRIES,
  normalize,
  type CountryName,
} from "@/lib/countries";
import { formatClock } from "@/lib/time";

const GAME_MS = 15 * 60 * 1000;

type Game =
  | { status: "ready" }
  | { status: "playing"; startedAt: number }
  | { status: "over"; startedAt: number; endedAt: number; reason: "time" | "gave-up" | "all" };

export default function CountryGame({ leaderboard }: { leaderboard: React.ReactNode }) {
  const [game, setGame] = useState<Game>({ status: "ready" });
  const [found, setFound] = useState<ReadonlySet<CountryName>>(() => new Set());
  const [input, setInput] = useState("");
  const [now, setNow] = useState(0);
  const [round, setRound] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const elapsed =
    game.status === "ready" ? 0 : (game.status === "over" ? game.endedAt : now) - game.startedAt;
  const remaining = Math.max(0, GAME_MS - elapsed);

  // Tick while playing, and end the game when the clock runs out.
  useEffect(() => {
    if (game.status !== "playing") return;
    const { startedAt } = game;
    const tick = () => {
      const t = Date.now();
      if (t - startedAt >= GAME_MS) {
        setGame({ status: "over", startedAt, endedAt: startedAt + GAME_MS, reason: "time" });
      } else {
        setNow(t);
      }
    };
    tick();
    const id = setInterval(tick, 200);
    return () => clearInterval(id);
  }, [game]);

  function handleInput(value: string) {
    const country = ANSWERS.get(normalize(value));
    if (!country || found.has(country)) {
      setInput(value);
      return;
    }

    const next = new Set(found).add(country);
    setFound(next);
    setInput("");

    const t = Date.now();
    const startedAt = game.status === "playing" ? game.startedAt : t;
    if (next.size === TOTAL_COUNTRIES) {
      setGame({ status: "over", startedAt, endedAt: t, reason: "all" });
    } else if (game.status === "ready") {
      setNow(t);
      setGame({ status: "playing", startedAt });
    }
  }

  function giveUp() {
    if (game.status !== "playing") return;
    setGame({ status: "over", startedAt: game.startedAt, endedAt: Date.now(), reason: "gave-up" });
  }

  function playAgain() {
    setGame({ status: "ready" });
    setFound(new Set());
    setInput("");
    setRound((r) => r + 1);
    // Wait for the input to be re-enabled before focusing it.
    setTimeout(() => inputRef.current?.focus());
  }

  const over = game.status === "over";
  const missed = over ? COUNTRY_NAMES.filter((name) => !found.has(name)) : [];
  const secondsUsed = Math.max(1, Math.round(elapsed / 1000));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            disabled={over}
            autoFocus
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            placeholder={game.status === "ready" ? "Type a country to start" : "Keep going..."}
            aria-label="Country name"
            className="w-64 rounded border border-foreground/20 bg-white/60 px-3 py-2 focus:border-accent focus:outline-none disabled:opacity-50"
          />
          <p className="whitespace-nowrap tabular-nums">
            <span className="text-2xl font-semibold">{found.size}</span>
            <span className="text-gray-500"> / {TOTAL_COUNTRIES}</span>
          </p>
        </div>

        <div className="flex items-center gap-4">
          {game.status === "playing" && (
            <button
              onClick={giveUp}
              className="rounded border border-foreground/20 px-3 py-2 text-sm transition-colors hover:border-accent hover:text-accent"
            >
              Give up
            </button>
          )}
          {over && (
            <button
              onClick={playAgain}
              className="rounded bg-accent px-4 py-2 text-sm text-white transition-opacity hover:opacity-90"
            >
              Play again
            </button>
          )}
          <p
            className={`text-4xl font-semibold tabular-nums ${
              game.status === "playing" && remaining < 60_000 ? "text-accent" : ""
            }`}
            aria-label="Time remaining"
          >
            {formatClock(remaining)}
          </p>
        </div>
      </div>

      <WorldMap found={found} revealMissed={over} />

      <div className="grid gap-12 md:grid-cols-2">
        <section className="space-y-4">
          {over ? (
            <>
              <h2 className="text-2xl font-semibold">
                {game.reason === "all"
                  ? `All ${TOTAL_COUNTRIES}! Incredible.`
                  : `You named ${found.size} of ${TOTAL_COUNTRIES} countries.`}
              </h2>
              <p className="text-gray-500">
                {game.reason === "time" ? "Time ran out" : `Finished in ${formatClock(elapsed)}`}
                {game.reason === "gave-up" && " (gave up)"}.
              </p>
              {found.size > 0 && (
                <ScoreForm key={round} found={found.size} secondsUsed={secondsUsed} />
              )}
              {missed.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold">
                    Missed <span className="text-tert">({missed.length})</span>
                  </h3>
                  <ul className="columns-2 gap-6 text-sm sm:columns-3">
                    {missed.map((name) => (
                      <li key={name} className="text-tert">
                        {name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold">Name every country.</h2>
              <p>
                You have 15 minutes to name all {TOTAL_COUNTRIES} countries. No need to press
                enter: a country is counted as soon as you finish typing it. The clock starts with
                your first correct answer.
              </p>
            </>
          )}
        </section>

        <section className="space-y-4">{leaderboard}</section>
      </div>
    </div>
  );
}

import { TOTAL_COUNTRIES } from "@/lib/countries";
import type { Score } from "@/lib/scores";
import { formatClock } from "@/lib/time";

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export default function Leaderboard({ scores }: { scores: Score[] | null }) {
  return (
    <>
      <h2 className="text-2xl font-semibold">Leaderboard</h2>
      {scores === null ? (
        <p>The leaderboard is taking a nap. Check back soon.</p>
      ) : scores.length === 0 ? (
        <p>No scores yet. Be the first!</p>
      ) : (
        <table className="w-full text-left tabular-nums">
          <thead className="text-sm text-gray-500">
            <tr>
              <th className="pb-2 font-normal">#</th>
              <th className="pb-2 font-normal">Name</th>
              <th className="pb-2 font-normal">Countries</th>
              <th className="pb-2 font-normal">Time</th>
              <th className="hidden pb-2 font-normal sm:table-cell">Date</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score, i) => (
              <tr key={score.id} className="border-t border-foreground/10">
                <td className="py-2 pr-3 text-gray-500">{i + 1}</td>
                <td className="py-2 pr-3 break-all">{score.name}</td>
                <td className="py-2 pr-3">
                  {score.found}
                  <span className="text-gray-500">/{TOTAL_COUNTRIES}</span>
                </td>
                <td className="py-2 pr-3">{formatClock(score.secondsUsed * 1000)}</td>
                <td className="hidden py-2 text-sm text-gray-500 sm:table-cell">
                  {dateFormat.format(score.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

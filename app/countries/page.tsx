import CountryGame from "@/components/countries/CountryGame";
import Leaderboard from "@/components/countries/Leaderboard";
import { getTopScores, type Score } from "@/lib/scores";

// The leaderboard changes whenever someone submits a score, so render on every request.
export const dynamic = "force-dynamic";

export default async function Countries() {
  let scores: Score[] | null = null;
  try {
    scores = await getTopScores();
  } catch (error) {
    console.error("Failed to load leaderboard", error);
  }

  return (
    // Break out of the site's narrow column so the map can use the whole screen.
    <main className="relative left-1/2 w-[min(100vw-3rem,1400px)] -translate-x-1/2">
      <CountryGame leaderboard={<Leaderboard scores={scores} />} />
    </main>
  );
}

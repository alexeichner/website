"use server";

import { revalidatePath } from "next/cache";
import { TOTAL_COUNTRIES } from "@/lib/countries";
import { clientIpHash } from "@/lib/ip";
import { addScore, countRecentScores } from "@/lib/scores";

export type SubmitScoreState = {
  status: "idle" | "success" | "error";
  message?: string;
  name?: string;
};

const NAME_MAX = 30;
const GAME_SECONDS = 15 * 60;
const RATE_LIMIT = 5;
const RATE_WINDOW_MINUTES = 10;
// Faster than this many countries per second isn't humanly possible to type.
const MAX_COUNTRIES_PER_SECOND = 2;

export async function submitScore(
  _prev: SubmitScoreState,
  formData: FormData,
): Promise<SubmitScoreState> {
  const name = String(formData.get("name") ?? "").trim();
  const found = Number(formData.get("found"));
  const secondsUsed = Number(formData.get("secondsUsed"));

  if (!name) {
    return { status: "error", message: "Please enter a name.", name };
  }
  if (name.length > NAME_MAX) {
    return { status: "error", message: `Names can be up to ${NAME_MAX} characters.`, name };
  }

  // The score is worked out in the browser, so reject anything that couldn't be real.
  const plausible =
    Number.isInteger(found) &&
    Number.isInteger(secondsUsed) &&
    found >= 1 &&
    found <= TOTAL_COUNTRIES &&
    secondsUsed >= 1 &&
    secondsUsed <= GAME_SECONDS &&
    found <= secondsUsed * MAX_COUNTRIES_PER_SECOND;
  if (!plausible) {
    return { status: "error", message: "That score doesn't look right.", name };
  }

  try {
    const ipHash = await clientIpHash();
    if ((await countRecentScores(ipHash, RATE_WINDOW_MINUTES)) >= RATE_LIMIT) {
      return { status: "error", message: "You've submitted a lot of scores. Try again in a bit.", name };
    }
    await addScore({ name, found, secondsUsed, ipHash });
  } catch (error) {
    console.error("Failed to submit score", error);
    return { status: "error", message: "Something went wrong. Please try again.", name };
  }

  revalidatePath("/countries");
  return { status: "success", message: "You're on the board!" };
}

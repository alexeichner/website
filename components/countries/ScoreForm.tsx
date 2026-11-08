"use client";

import { useActionState } from "react";
import { submitScore, type SubmitScoreState } from "@/app/countries/actions";

const initialState: SubmitScoreState = { status: "idle" };

export default function ScoreForm({ found, secondsUsed }: { found: number; secondsUsed: number }) {
  const [state, formAction, pending] = useActionState(submitScore, initialState);

  if (state.status === "success") {
    return <p className="text-tert">{state.message}</p>;
  }

  return (
    <form action={formAction} className="flex flex-wrap items-center gap-3">
      <input type="hidden" name="found" value={found} />
      <input type="hidden" name="secondsUsed" value={secondsUsed} />
      <input
        name="name"
        placeholder="Your name"
        maxLength={30}
        required
        defaultValue={state.name}
        aria-label="Your name for the leaderboard"
        className="w-48 rounded border border-foreground/20 bg-white/60 px-3 py-2 focus:border-accent focus:outline-none"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-accent px-4 py-2 text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Saving..." : "Add to leaderboard"}
      </button>
      {state.status === "error" && (
        <p aria-live="polite" className="w-full text-accent">
          {state.message}
        </p>
      )}
    </form>
  );
}

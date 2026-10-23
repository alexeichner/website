"use client";

import { useActionState } from "react";
import { signGuestbook, type SignState } from "@/app/guestbook/actions";

const initialState: SignState = { status: "idle" };

const inputClass =
  "w-full rounded border border-foreground/20 bg-white/60 px-3 py-2 focus:outline-none focus:border-accent";

export default function GuestbookForm() {
  const [state, formAction, pending] = useActionState(signGuestbook, initialState);

  return (
    <form action={formAction} className="space-y-3">
      <input
        name="name"
        placeholder="Your name"
        maxLength={50}
        required
        defaultValue={state.fields?.name}
        className={inputClass}
      />
      <textarea
        name="message"
        placeholder="Leave a message"
        maxLength={500}
        required
        rows={3}
        defaultValue={state.fields?.message}
        className={inputClass}
      />

      {/* Honeypot: hidden from people, tempting to bots. */}
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-accent px-4 py-2 text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Signing..." : "Sign"}
        </button>
        {state.message && (
          <p
            aria-live="polite"
            className={state.status === "error" ? "text-accent" : "text-tert"}
          >
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}

import GuestbookForm from "@/components/GuestbookForm";
import { getEntries, type GuestbookEntry } from "@/lib/guestbook";

// Entries change whenever someone signs, so render on every request.
export const dynamic = "force-dynamic";

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export default async function Guestbook() {
  let entries: GuestbookEntry[] | null = null;
  try {
    entries = await getEntries();
  } catch (error) {
    console.error("Failed to load guestbook", error);
  }

  return (
    <main className="space-y-12">
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold">Sign the guestbook.</h1>
        <p>Say hi, leave a note, or recommend a movie.</p>
        <GuestbookForm />
      </section>

      <section className="space-y-6">
        {entries === null ? (
          <p>The guestbook is taking a nap. Check back soon.</p>
        ) : entries.length === 0 ? (
          <p>No entries yet. Be the first!</p>
        ) : (
          <ul className="space-y-6">
            {entries.map((entry) => (
              <li key={entry.id} className="space-y-1">
                <p className="whitespace-pre-wrap break-words">{entry.message}</p>
                <p className="text-sm text-gray-500">
                  {entry.name} · {dateFormat.format(entry.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

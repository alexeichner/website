import { getSql } from "@/lib/db";

export type GuestbookEntry = {
  id: number;
  name: string;
  message: string;
  createdAt: Date;
};

export async function getEntries(limit = 100) {
  const sql = getSql();
  return sql<GuestbookEntry[]>`
    select id, name, message, created_at as "createdAt"
    from guestbook_entries
    where not hidden
    order by created_at desc
    limit ${limit}
  `;
}

export async function countRecentEntries(ipHash: string, minutes: number) {
  const sql = getSql();
  const [{ count }] = await sql<{ count: number }[]>`
    select count(*)::int as count
    from guestbook_entries
    where ip_hash = ${ipHash}
      and created_at > now() - make_interval(mins => ${minutes})
  `;
  return count;
}

export async function addEntry(entry: { name: string; message: string; ipHash: string }) {
  const sql = getSql();
  await sql`
    insert into guestbook_entries (name, message, ip_hash)
    values (${entry.name}, ${entry.message}, ${entry.ipHash})
  `;
}

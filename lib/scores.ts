import { getSql } from "@/lib/db";

export type Score = {
  id: number;
  name: string;
  found: number;
  secondsUsed: number;
  createdAt: Date;
};

// Most countries first; ties go to whoever finished faster, then whoever got there first.
export async function getTopScores(limit = 20) {
  const sql = getSql();
  return sql<Score[]>`
    select id, name, found, seconds_used as "secondsUsed", created_at as "createdAt"
    from country_scores
    where not hidden
    order by found desc, seconds_used asc, created_at asc
    limit ${limit}
  `;
}

export async function countRecentScores(ipHash: string, minutes: number) {
  const sql = getSql();
  const [{ count }] = await sql<{ count: number }[]>`
    select count(*)::int as count
    from country_scores
    where ip_hash = ${ipHash}
      and created_at > now() - make_interval(mins => ${minutes})
  `;
  return count;
}

export async function addScore(score: {
  name: string;
  found: number;
  secondsUsed: number;
  ipHash: string;
}) {
  const sql = getSql();
  await sql`
    insert into country_scores (name, found, seconds_used, ip_hash)
    values (${score.name}, ${score.found}, ${score.secondsUsed}, ${score.ipHash})
  `;
}

-- Run with `npm run db:setup` (safe to run more than once).

-- Guestbook entries.
-- To hide an entry, run this in the Neon SQL editor:
--   update guestbook_entries set hidden = true where id = <id>;
create table if not exists guestbook_entries (
  id serial primary key,
  name varchar(50) not null,
  message varchar(500) not null,
  ip_hash char(64) not null,
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists guestbook_entries_created_at_idx
  on guestbook_entries (created_at desc);

create index if not exists guestbook_entries_ip_hash_idx
  on guestbook_entries (ip_hash, created_at);

-- Country game leaderboard. Hide a score the same way:
--   update country_scores set hidden = true where id = <id>;
create table if not exists country_scores (
  id serial primary key,
  name varchar(30) not null,
  found smallint not null,
  seconds_used smallint not null,
  ip_hash char(64) not null,
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists country_scores_rank_idx
  on country_scores (found desc, seconds_used asc, created_at asc);

create index if not exists country_scores_ip_hash_idx
  on country_scores (ip_hash, created_at);

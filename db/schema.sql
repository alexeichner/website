-- Guestbook entries. Run with `npm run db:setup` (safe to run more than once).
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

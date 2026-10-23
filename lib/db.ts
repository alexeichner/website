import postgres from "postgres";

// Keep one client per server instance so dev hot reloads don't open new pools.
const globalForDb = globalThis as unknown as { sql?: postgres.Sql };

export function getSql() {
  if (!globalForDb.sql) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not set");
    }
    globalForDb.sql = postgres(process.env.DATABASE_URL, { max: 5 });
  }
  return globalForDb.sql;
}

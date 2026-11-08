import { createHash } from "node:crypto";
import { headers } from "next/headers";

// A salted hash of the visitor's IP, used for rate limits so no addresses are stored.
export async function clientIpHash() {
  const h = await headers();
  const ip = h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const salt = process.env.GUESTBOOK_IP_SALT ?? "";
  return createHash("sha256").update(salt + ip).digest("hex");
}

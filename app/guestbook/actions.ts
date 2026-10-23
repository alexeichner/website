"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { addEntry, countRecentEntries } from "@/lib/guestbook";

export type SignState = {
  status: "idle" | "success" | "error";
  message?: string;
  fields?: { name: string; message: string };
};

const NAME_MAX = 50;
const MESSAGE_MAX = 500;
const RATE_LIMIT = 3;
const RATE_WINDOW_MINUTES = 10;

// Store a salted hash instead of the raw IP so the table holds no addresses.
async function clientIpHash() {
  const h = await headers();
  const ip = h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const salt = process.env.GUESTBOOK_IP_SALT ?? "";
  return createHash("sha256").update(salt + ip).digest("hex");
}

export async function signGuestbook(_prev: SignState, formData: FormData): Promise<SignState> {
  // Bots tend to fill every field; people never see this one, so pretend it worked.
  if (formData.get("website")) {
    return { status: "success", message: "Thanks for signing!" };
  }

  const name = String(formData.get("name") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const fields = { name, message };

  if (!name || !message) {
    return { status: "error", message: "Please fill in your name and a message.", fields };
  }
  if (name.length > NAME_MAX || message.length > MESSAGE_MAX) {
    return {
      status: "error",
      message: `Names can be up to ${NAME_MAX} characters and messages up to ${MESSAGE_MAX}.`,
      fields,
    };
  }

  try {
    const ipHash = await clientIpHash();
    if ((await countRecentEntries(ipHash, RATE_WINDOW_MINUTES)) >= RATE_LIMIT) {
      return { status: "error", message: "You've signed a few times already. Try again in a bit.", fields };
    }
    await addEntry({ name, message, ipHash });
  } catch (error) {
    console.error("Failed to sign guestbook", error);
    return { status: "error", message: "Something went wrong. Please try again.", fields };
  }

  revalidatePath("/guestbook");
  return { status: "success", message: "Thanks for signing!" };
}

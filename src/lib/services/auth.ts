import { typUser } from "@/content/types";

export async function fetchMe(): Promise<typUser | null> {
  const res = await fetch("/api/auth/me", { credentials: "include" });
  if (!res.ok) {
    // if 401 or not authorized, just return null instead of throwing
    return null;
  }
  return res.json();
}
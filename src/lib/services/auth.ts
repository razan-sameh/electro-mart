import { typUser } from "@/content/types";

export async function fetchMe(): Promise<typUser | null> {
  const res = await fetch("/api/auth/me", { credentials: "include" });
  if (!res.ok) return null;

  const data = await res.json();
  return data.user; // ✅ return the actual user object
}

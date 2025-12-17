import { UserAdapter } from "@/adapters/UserAdapter";
import { typUser } from "@/content/types";
import { notFound } from "next/navigation";
const userAdapter = UserAdapter.getInstance();

export async function fetchMe(): Promise<typUser | null> {
  const res = await fetch("/api/auth/me", { credentials: "include" });
  if (!res.ok) return null;

  const data = await res.json();
  if (!data) {
    notFound();
  }
  return userAdapter.adapt(data.user);
}

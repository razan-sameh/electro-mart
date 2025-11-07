import { UserAdapter } from "@/adapters/UserAdapter";
import { typUser } from "@/content/types";
import { STRAPI_URL } from "../apiClient";
const userAdapter = UserAdapter.getInstance(STRAPI_URL);

export async function fetchMe(): Promise<typUser | null> {
  const res = await fetch("/api/auth/me", { credentials: "include" });
  if (!res.ok) return null;

  const data = await res.json();
  return userAdapter.adapt(data.user);
}

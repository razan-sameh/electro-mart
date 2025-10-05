// app/api/auth/me/route.ts
import { serverApiClient } from "@/app/api/serverApiClient";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwtToken")?.value;

  try {
    const user = await serverApiClient("/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return Response.json({ user });
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return Response.json({ user: null }, { status: 401 });
  }
}
// app/api/auth/login/route.ts
import { serverApiClient } from "@/app/api/serverApiClient";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { identifier, password } = await req.json();

  const data = await serverApiClient<{ jwt: string; user: any }>(
    "/auth/local",
    {
      method: "POST",
      body: JSON.stringify({ identifier, password }),
    }
  );

  const cookieStore = await cookies();
  cookieStore.set("jwtToken", data.jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });

  return Response.json({ user: data.user });
}

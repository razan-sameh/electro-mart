import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const NEXT_PUBLIC_API_URL =
  "https://romeo-pseudocollegiate-vincibly.ngrok-free.dev";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("jwtToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const res = await fetch(
      `${NEXT_PUBLIC_API_URL}/api/orders/create-setup-intent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error || "Failed to create setup intent" },
        { status: res.status }
      );
    }

    return NextResponse.json({ clientSecret: data.clientSecret });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const NEXT_PUBLIC_API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:1337/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("jwtToken")?.value;

    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const res = await fetch(`${NEXT_PUBLIC_API_URL}/orders/pay-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error || "Payment failed" },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

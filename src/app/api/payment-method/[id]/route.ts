// app/api/payment-method/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const NEXT_PUBLIC_API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:1337/api";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // ✅ await params

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("jwtToken")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(
      `${NEXT_PUBLIC_API_URL}/orders/payment-method/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    console.error("Proxy to Strapi failed:", err);
    return NextResponse.json(
      { error: err.message || "Proxy failed" },
      { status: 500 }
    );
  }
}

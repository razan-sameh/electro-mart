// app/api/buy-now/route.ts
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";
export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwtToken")?.value;

  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // نرسل request للـ Strapi controller
  const body = await req.json();
  // body الآن يحتوي على { productId, colorId }
  const res = await fetch(`${baseUrl}/api/buy-now`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data);
}

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwtToken")?.value;

  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const res = await fetch(`${baseUrl}/api/buy-now`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return NextResponse.json(data);
}
export async function DELETE(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwtToken")?.value;

  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const res = await fetch(`${baseUrl}/api/buy-now`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  const data = await res.json();
  return NextResponse.json(data);
}
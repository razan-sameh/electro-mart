// app/api/review/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { serverApiClient } from "@/app/api/serverApiClient";

// app/api/review/route.ts
export async function POST(req: Request) {
  try {
    const { rating, comment, productId } = await req.json();

    if (!productId || !rating || !comment) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("jwtToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = {
      data: {
        Rating: rating,
        Comment: comment,
        product: productId, // ⚠️ This might need to be an ID, not documentId
      },
    };

    const data = await serverApiClient("/reviews", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    console.error("Create review error:", err);
    console.error("Error details:", err.response || err); // Log full error

    return NextResponse.json(
      {
        error: err.message || "Internal Server Error",
        details: err.response?.data || null, // Include Strapi error details
      },
      { status: 500 }
    );
  }
}

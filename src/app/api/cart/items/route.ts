import { serverApiClient } from "@/app/api/serverApiClient";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// POST /api/cart/items - Add single item to cart
export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("jwtToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const { productId, quantity, productColorId } = body;

    // Validate required fields
    if (!productId || !quantity) {
      return NextResponse.json(
        { error: "productId and quantity are required" },
        { status: 400 }
      );
    }

    // Log the full request details
    const requestPayload = {
      productId,
      quantity,
      productColorId,
    };

    const data = await serverApiClient("/cart/items", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(requestPayload),
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("❌ Add to cart error:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to add to cart",
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}
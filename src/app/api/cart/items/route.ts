import { serverApiClient } from "@/app/api/serverApiClient";
import { cookies } from "next/headers";

// POST /api/cart/items - Add single item to cart
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("jwtToken")?.value;

    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("📦 Request body:", body);

    const { productId, quantity, productColorId } = body;

    // ✅ Validate required fields
    if (!productId || !quantity) {
      return Response.json(
        { error: "productId and quantity are required" },
        { status: 400 }
      );
    }

    console.log("➕ Adding to cart:", { productId, quantity, productColorId });

    // ✅ Call your Strapi endpoint with correct field names
    const data = await serverApiClient("/cart/items", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,      // Strapi expects this
        quantity,       // Strapi expects this
        productColorId, // Strapi expects this (optional)
      }),
    });

    console.log("✅ Item added:", data);

    return Response.json(data);
  } catch (error: any) {
    console.error("❌ Add to cart error:", error);
    return Response.json(
      { error: error.message || "Failed to add to cart" },
      { status: 500 }
    );
  }
}
import { serverApiClient } from "@/app/api/serverApiClient";
import { cookies } from "next/headers";

// POST /api/wishlist/items - Add single item to wishlist
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("jwtToken")?.value;

    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { productId, productColorId } = body;

    // ✅ Validate required fields
    if (!productId) {
      return Response.json(
        { error: "productId is required" },
        { status: 400 }
      );
    }

    // ✅ Call your Strapi endpoint with correct field names
    const data = await serverApiClient("/wishlist/items", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,      // Strapi expects this
        productColorId, // Optional
      }),
    });

    return Response.json(data);
  } catch (error: any) {
    console.error("❌ Add to wishlist error:", error);
    return Response.json(
      { error: error.message || "Failed to add to wishlist" },
      { status: 500 }
    );
  }
}

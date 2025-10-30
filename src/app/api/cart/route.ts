import { serverApiClient } from "@/app/api/serverApiClient";
import { cookies } from "next/headers";

// GET /api/cart - Get user's cart
export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("jwtToken")?.value;

    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const locale = searchParams.get("locale") || "en"; // fallback to English

    const data = await serverApiClient(`/cart/me?locale=${locale}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return Response.json(data);
  } catch (error: any) {
    console.error("Get cart error:", error);
    return Response.json(
      { error: error.message || "Failed to get cart" },
      { status: 500 }
    );
  }
}


// POST /api/cart/merge - Merge multiple items at once
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("jwtToken")?.value;

    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    if (!body.cart_items || !Array.isArray(body.cart_items)) {
      return Response.json(
        { error: "cart_items must be an array" },
        { status: 400 }
      );
    }

    const addedItems = [];
    const errors = [];

    for (let i = 0; i < body.cart_items.length; i++) {
      const item = body.cart_items[i];

      try {
        // Validate item structure
        if (!item.product?.id) {
          throw new Error("Missing product.id");
        }
        if (!item.quantity) {
          throw new Error("Missing quantity");
        }

        const result = await serverApiClient("/cart/items", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: item.product.id,
            quantity: item.quantity,
            productColorId: item.selectedColor?.id || null,
          }),
        });

        addedItems.push(result);
      } catch (error: any) {
        console.error(`❌ Failed to add item ${i + 1}:`, error);
        errors.push({
          item: {
            productId: item.product?.id,
            quantity: item.quantity,
          },
          error: error.message,
        });
      }
    }

    return Response.json({
      success: true,
      items: addedItems,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error("❌ Cart merge error:", error);
    return Response.json(
      { error: error.message || "Failed to merge cart" },
      { status: 500 }
    );
  }
}

// DELETE /api/cart - Clear entire cart
export async function DELETE() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("jwtToken")?.value;

    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await serverApiClient("/cart/clear", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return Response.json(data);
  } catch (error: any) {
    console.error("Clear cart error:", error);
    return Response.json(
      { error: error.message || "Failed to clear cart" },
      { status: 500 }
    );
  }
}

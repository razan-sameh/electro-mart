import { serverApiClient } from "@/app/api/serverApiClient";
import { typWishlist, typWishlistItem } from "@/content/types";
import { cookies } from "next/headers";

// GET /api/wishlist - Get user's wishlist
export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("jwtToken")?.value;

    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const locale = searchParams.get("locale") || "en";
    const data = await serverApiClient(
      "/wishlist/me",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      { },
      locale
    );

    return Response.json(data);
  } catch (error: any) {
    console.error("Get wishlist error:", error);
    return Response.json(
      { error: error.message || "Failed to get wishlist" },
      { status: 500 }
    );
  }
}

// POST /api/wishlist/merge - Merge multiple items at once (skip duplicates)
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("jwtToken")?.value;

    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    if (!body.wishlist_items || !Array.isArray(body.wishlist_items)) {
      return Response.json(
        { error: "wishlist_items must be an array" },
        { status: 400 }
      );
    }

    const mywislist: typWishlist = body.mywishlist;
    
    const existingItems : typWishlistItem[]= mywislist.items || [];

    const addedItems = [];
    const skippedItems = [];
    const errors = [];

    // ✅ 2. Loop through new items
    for (let i = 0; i < body.wishlist_items.length; i++) {
      const item = body.wishlist_items[i];

      try {
        const productId = item.product?.id;
        const colorId = item.selectedColor?.id || null;

        if (!productId) {
          throw new Error("Missing product.id");
        }

        // ✅ 3. Check if already exists (same product & color)
        const alreadyExists = existingItems.some(
          (w: any) =>
            w.product?.id === productId &&
            (w.selectedColor?.id || null) === colorId
        );

        if (alreadyExists) {
          skippedItems.push({ productId, colorId });
          continue;
        }

        // ✅ 4. Add new item if not found
        const result = await serverApiClient("/wishlist/items", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId,
            productColorId: colorId,
          }),
        });

        addedItems.push(result);
      } catch (error: any) {
        console.error(`❌ Failed to add wishlist item ${i + 1}:`, error);
        errors.push({
          item: { productId: item.product?.id },
          error: error.message,
        });
      }
    }

    // ✅ 5. Return summary
    return Response.json({
      success: true,
      addedCount: addedItems.length,
      skippedCount: skippedItems.length,
      items: addedItems,
      skipped: skippedItems,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error("❌ Wishlist merge error:", error);
    return Response.json(
      { error: error.message || "Failed to merge wishlist" },
      { status: 500 }
    );
  }
}

// DELETE /api/wishlist - Clear entire wishlist
export async function DELETE() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("jwtToken")?.value;

    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await serverApiClient("/wishlist/clear", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return Response.json(data);
  } catch (error: any) {
    console.error("Clear wishlist error:", error);
    return Response.json(
      { error: error.message || "Failed to clear wishlist" },
      { status: 500 }
    );
  }
}

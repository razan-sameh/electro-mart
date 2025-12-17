import { serverApiClient } from "@/app/api/serverApiClient";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// DELETE /api/wishlist/items/:id - Remove item from wishlist
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // ✅ await params

    const cookieStore = await cookies();
    const token = cookieStore.get("jwtToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await serverApiClient(`/wishlist/items/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Remove wishlist item error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to remove wishlist item" },
      { status: 500 }
    );
  }
}

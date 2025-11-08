import { serverApiClient } from "@/app/api/serverApiClient";
import { cookies } from "next/headers";

// DELETE /api/wishlist/items/:id - Remove item from wishlist
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("jwtToken")?.value;

    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await serverApiClient(`/wishlist/items/${params.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return Response.json(data);
  } catch (error: any) {
    console.error("Remove wishlist item error:", error);
    return Response.json(
      { error: error.message || "Failed to remove wishlist item" },
      { status: 500 }
    );
  }
}

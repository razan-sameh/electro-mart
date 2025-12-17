import { serverApiClient } from "@/app/api/serverApiClient";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


// PUT /api/cart/items/:id - Update quantity
export async function PUT(
 req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // FIX: Await params

    const cookieStore = await cookies();
    const token = cookieStore.get("jwtToken")?.value;

    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { quantity } = body;

    const data = await serverApiClient(`/cart/items/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity }),
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Update cart item error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update cart item" },
      { status: 500 }
    );
  }
}

// DELETE /api/cart/items/:id - Remove item
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // FIX: await params

    const cookieStore = await cookies();
    const token = cookieStore.get("jwtToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await serverApiClient(`/cart/items/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Remove cart item error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to remove cart item" },
      { status: 500 }
    );
  }
}
import { serverApiClient } from "@/app/api/serverApiClient";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

// GET /api/orders/:id - Get a single order by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // ✅ await params

    const cookieStore = await cookies();
    const token = cookieStore.get("jwtToken")?.value;

    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!id) {
      return Response.json({ error: "Order ID is required" }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const locale = searchParams.get("locale") || "en";

    const data = await serverApiClient(
      `/orders/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      {},
      locale
    );

    return Response.json(data);
  } catch (error: any) {
    console.error("Get single order error:", error);
    return Response.json(
      { error: error.message || "Failed to get order" },
      { status: 500 }
    );
  }
}

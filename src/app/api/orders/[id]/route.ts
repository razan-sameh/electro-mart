import { serverApiClient } from "@/app/api/serverApiClient";
import { cookies } from "next/headers";

// GET /api/orders/:id - Get a single order by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("jwtToken")?.value;

    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    if (!id) {
      return Response.json({ error: "Order ID is required" }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const locale = searchParams.get("locale") || "en";

    // Fetch from Strapi
    const data = await serverApiClient(
      `/orders/${id}`, // 🟢 Fetch a single order
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

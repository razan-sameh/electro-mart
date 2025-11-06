import { serverApiClient } from "@/app/api/serverApiClient";
import { cookies } from "next/headers";

// GET /api/orders - Get user's orders with relations
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
      "/orders",
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
    console.error("Get orders error:", error);
    return Response.json(
      { error: error.message || "Failed to get orders" },
      { status: 500 }
    );
  }
}

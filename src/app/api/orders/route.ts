import { cookies } from "next/headers";
import { serverApiClient } from "../serverApiClient";

// GET /api/orders
export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("jwtToken")?.value;

    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const locale = searchParams.get("locale") || "en";
    const order_status = searchParams.get("order_status") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");

    const data = await serverApiClient(
      "/orders",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      { page, pageSize, order_status},
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

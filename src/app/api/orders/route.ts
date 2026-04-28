import { createServer } from "../supabaseServer";

// GET /api/orders
export async function GET(req: Request) {
  try {
    const supabase = await createServer();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const order_status = searchParams.get("order_status") || null;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");

    const locale = searchParams.get("locale") || "en";

    const { data, error } = await supabase.rpc("get_user_orders", {
      p_user_id: user.id,
      p_locale: locale, // ← add this
      p_status: order_status,
      p_page: page,
      p_page_size: pageSize,
    });

    if (error) {
      console.error("RPC error:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data);
  } catch (error: any) {
    console.error("Get orders error:", error);
    return Response.json(
      { error: error.message || "Failed to get orders" },
      { status: 500 },
    );
  }
}

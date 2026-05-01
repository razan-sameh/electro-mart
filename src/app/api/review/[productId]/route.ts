import { createServer } from "../../supabaseServer";

// GET /api/review/[productId]
export async function GET(req: Request, { params }: { params: { productId: string } }) {
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

    const productId = params.productId;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const search = searchParams.get("search") || null;
    const rating = searchParams.get("rating")
      ? parseInt(searchParams.get("rating")!)
      : null;

    if (!productId) {
      return Response.json(
        { error: "productId is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.rpc("get_product_reviews", {
      p_product_id: Number(productId),
      p_page: page,
      p_page_size: pageSize,
      p_search: search,
      p_rating: rating,
    });

    if (error) {
      console.error("RPC error (get reviews):", error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data);
  } catch (error: any) {
    console.error("Get reviews error:", error);
    return Response.json(
      { error: error.message || "Failed to get reviews" },
      { status: 500 }
    );
  }
}
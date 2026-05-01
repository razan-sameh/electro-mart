import { createServer } from "../supabaseServer";
// POST /api/review
export async function POST(req: Request) {
  try {
    const supabase = await createServer();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const {
      productId,
      productVariantId,
      orderItemId,
      rating,
      comment,
    } = body;

    if (!productId || !productVariantId || !orderItemId) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.rpc("create_product_review", {
      p_product_id: productId,
      p_product_variant_id: productVariantId,
      p_order_item_id: orderItemId,
      p_user_id: user.id,
      p_rating: rating,
      p_comment: comment,
    });

    if (error) {
      console.error("RPC error (create review):", error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    if (data?.error) {
      return Response.json({ error: data.error }, { status: 400 });
    }

    return Response.json(data);
  } catch (error: any) {
    console.error("Create review error:", error);
    return Response.json(
      { error: error.message || "Failed to create review" },
      { status: 500 }
    );
  }
}
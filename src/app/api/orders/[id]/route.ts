import { NextRequest, NextResponse } from "next/server";
import { createServer } from "../../supabaseServer";

// GET /api/orders/:id - Get a single order by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: number,locale:string }> }
) {
  try {
    const { id ,locale } = await params; // ✅ await params

  const supabase = await createServer();

  const { data, error } = await supabase.rpc("get_order_by_id", {
    p_order_id: id,
    p_locale: locale
  });

  if (error) {
    console.error("RPC ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

    return Response.json(data);
  } catch (error: any) {
    console.error("Get single order error:", error);
    return Response.json(
      { error: error.message || "Failed to get order" },
      { status: 500 }
    );
  }
}

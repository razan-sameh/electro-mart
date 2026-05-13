import { NextRequest, NextResponse } from "next/server";
import { createServer } from "../../supabaseServer";

// GET /api/orders/:id
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { searchParams } = new URL(req.url);
    const locale = searchParams.get("locale") || "en";

    const supabase = await createServer();

    const { data, error } = await supabase.rpc("get_order_by_id", {
      p_order_id: Number(id),
      p_locale: locale,
    });

    if (error) {
      console.error("RPC ERROR:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.error) {
      return NextResponse.json(
        { error: data?.error || "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Get single order error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get order" },
      { status: 500 }
    );
  }
}
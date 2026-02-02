import { NextResponse } from "next/server";
import { createServer } from "../supabaseServer";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");

  if (!orderId) {
    return NextResponse.json({ error: "orderId required" }, { status: 400 });
  }
  const supabase = await createServer();

  const { data, error } = await supabase.rpc("get_checkout_step", {
    p_order_id: orderId,
  });

  if (error) {
    console.error("RPC ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const step = data ?? 0;

  return NextResponse.json({ step });
}

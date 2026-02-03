import { NextResponse } from "next/server";
import { createServer } from "../../supabaseServer";

export async function GET(req: Request) {
  const supabase = await createServer();

  const { data: orderId, error } = await supabase.rpc("get_draft_order_id");
  if (error) {
    console.error("RPC ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ orderId });
}

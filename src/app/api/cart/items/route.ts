// app/api/cart/items/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServer } from "../../supabaseServer";

export async function POST(req: NextRequest) {
  const supabase = await createServer();
  const { variantId, quantity } = await req.json();
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;
  const { data, error } = await supabase.rpc("add_cart_item", {
    p_variant_id: variantId,
    p_quantity: quantity,
    p_session_id: sessionId,
  });

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

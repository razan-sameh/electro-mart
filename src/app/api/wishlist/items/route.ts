// POST /api/wishlist/items - Add single item to wishlist
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServer } from "../../supabaseServer";

export async function POST(req: NextRequest) {
  const supabase = await createServer();
  const { variantId } = await req.json();
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;
  const { data, error } = await supabase.rpc("add_wishlist_item", {
    p_variant_id: variantId,
    p_session_id: sessionId,
  });

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

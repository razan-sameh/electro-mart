import { NextResponse } from "next/server";
import { createServer } from "../../supabaseServer";
import { typCartItem } from "@/content/types";

export async function POST(req: Request) {
  const supabase = await createServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { items, orderId } = await req.json();
  const formattedItems = items.map((item: typCartItem) => ({
    variant_id: item.variant.id,
    quantity: item.quantity,
  }));

  const { data, error } = await supabase.rpc("create_or_update_order_draft", {
    p_user_id: user?.id ?? null,
    p_phone: null,
    p_shipping_address: null,
    p_items: formattedItems,
    p_order_id: orderId,
  });

  if (error) throw error;

  return NextResponse.json({ orderId: data.orderId });
}

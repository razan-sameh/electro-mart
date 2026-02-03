import { NextResponse } from "next/server";
import { typCartItem, typShippingAddress } from "@/content/types";
import { createServer } from "../../supabaseServer";

export async function POST(req: Request) {
  try {
    const supabase = await createServer();
    const body = await req.json();

    const {
      shippingAddress,
      items,
      phone,
      orderId,
    }: {
      shippingAddress: typShippingAddress;
      items: typCartItem[];
      phone: string;
      orderId?: string | null;
    } = body;

    if (!shippingAddress || !items?.length) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("AUTH ERROR:", userError);
    }

    // ✅ convert items to { variant_id, quantity }
    const itemsForRpc = items.map((item) => ({
      variant_id: item.variant?.id,
      quantity: item.quantity,
    }));

    const { data:orderIdDB, error } = await supabase.rpc("create_or_update_order_draft", {
      p_user_id: user?.id ?? null,
      p_phone: phone,
      p_shipping_address: shippingAddress,
      p_items: itemsForRpc,
      p_order_id: orderId, // null -> create / id -> update
    });

    if (error) {
      console.error("RPC ERROR:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

  return NextResponse.json({ orderIdDB });
  } catch (err: any) {
    console.error("API CRASH:", err);
    return NextResponse.json(
      { error: err.message ?? "Server error" },
      { status: 500 },
    );
  }
}

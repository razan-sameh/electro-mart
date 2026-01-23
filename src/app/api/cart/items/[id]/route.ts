// app/api/cart/items/[id]/route.ts
import supabase from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { quantity } = await req.json();

  const { data, error } = await supabase.rpc("update_cart_item", {
    p_item_id: Number(params.id),
    p_quantity: quantity,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await supabase.rpc("remove_cart_item", {
    p_item_id: Number(params.id),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: { id: params.id } });
}

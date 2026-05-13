import { NextRequest, NextResponse } from "next/server";
import { createServer } from "@/app/api/supabaseServer";

// DELETE /api/wishlist/items/:id - Remove item from wishlist
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const supabase = await createServer();
  const { error } = await supabase.rpc("remove_wishlist_item", {
    p_item_id: Number(params.id),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: { id: params.id } });
}

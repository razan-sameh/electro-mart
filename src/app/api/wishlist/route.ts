import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServer } from "../supabaseServer";

export async function GET(req: NextRequest) {
  const supabase = await createServer();
  const locale = req.nextUrl.searchParams.get("locale");
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;

  const { data, error } = await supabase.rpc("get_wishlist", {
    p_session_id: sessionId,
    p_locale: locale,
  });

  if (error) {
    return NextResponse.json(
      { error: error.message, details: error.details, hint: error.hint },
      { status: 500 },
    );
  }

  return NextResponse.json({ data });
}


// DELETE /api/wishlist - Clear entire wishlist
export async function DELETE() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;
  const supabase = await createServer();

  const { error } = await supabase.rpc("clear_wishlist", {
    p_session_id: sessionId,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: { success: true } });
}

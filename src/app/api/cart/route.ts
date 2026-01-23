// app/api/cart/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import supabase from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const locale = req.nextUrl.searchParams.get("locale");
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;

  const { data, error } = await supabase.rpc("get_cart", {
    p_session_id: sessionId,
    p_locale: locale,
  });

  if (error) {
    return NextResponse.json(
      { error: error.message, details: error.details, hint: error.hint },
      { status: 500 }
    );
  }

  return NextResponse.json({ data });
}


// POST /api/cart/merge - Merge multiple items at once
export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session_id")?.value;

    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing session_id" },
        { status: 400 },
      );
    }

    // call the function
    const { error } = await supabase.rpc("merge_guest_cart_to_user", {
      p_session_id: sessionId,
      p_user_id: userId,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to merge cart" },
      { status: 500 },
    );
  }
}

// DELETE /api/cart - Clear entire cart
export async function DELETE() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;
  const { error } = await supabase.rpc("clear_cart", {
    p_session_id: sessionId,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: { success: true } });
}

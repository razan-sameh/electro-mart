import { createServer } from "@/app/api/supabaseServer";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  const redirect = searchParams.get("redirect") || "/";

  if (!code) {
    return NextResponse.redirect(`${origin}/login`);
  }

  const supabase = await createServer();

  // ⬅️ هنا session بيتخزن في cookies
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  const cookieStore = await cookies();
  // Merge guest cart & wishlist to user after successful login
  if (data?.user) {
    const sessionId = cookieStore.get("session_id")?.value;

    if (sessionId) {
      // Merge cart
      const { error: mergeCartError } = await supabase.rpc(
        "merge_guest_cart_to_user",
        {
          p_session_id: sessionId,
          p_user_id: data.user.id,
        },
      );

      if (mergeCartError) {
        console.error("Failed to merge cart:", mergeCartError);
      }

      // Merge wishlist
      const { error: mergeWishlistError } = await supabase.rpc(
        "merge_guest_wishlist_to_user",
        {
          p_session_id: sessionId,
          p_user_id: data.user.id,
        },
      );

      if (mergeWishlistError) {
        console.error("Failed to merge wishlist:", mergeWishlistError);
      }

      // Clear session cookie after successful merge
      cookieStore.delete("session_id");
    }
  }
  return NextResponse.redirect(`${origin}${redirect}`);
}

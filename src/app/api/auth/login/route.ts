import { cookies } from "next/headers";
import { createServer } from "../../supabaseServer";

export async function POST(req: Request) {
  try {
    const { identifier, password } = await req.json();
    const supabase = await createServer();

    let { data, error } = await supabase.auth.signInWithPassword({
      email: identifier,
      password: password,
    });

    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 400 },
      );
    }

    const cookieStore = await cookies();

    // Merge guest cart & wishlist to user after successful login
    if (data.user) {
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

    return Response.json({ success: true, user: data.user });
  } catch (error: any) {
    console.error("Login API error:", error);
    return Response.json(
      { error: error.message || "Failed to login" },
      { status: 400 },
    );
  }
}

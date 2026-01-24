import { serverApiClient } from "@/app/api/serverApiClient";
import { cookies } from "next/headers";
import { supabaseServer } from "../../supabaseServer";

export async function POST(req: Request) {
  try {
    const { identifier, password } = await req.json();
    const supabase = await supabaseServer();

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
    if (data?.session?.access_token) {
      cookieStore.set("jwtToken", data.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });
    }

    // Merge guest cart to user cart after successful login
    if (data.user) {
      const sessionId = cookieStore.get("session_id")?.value;
      
      if (sessionId) {
        const { error: mergeError } = await supabase.rpc("merge_guest_cart_to_user", {
          p_session_id: sessionId,
          p_user_id: data.user.id,
        });
        
        if (mergeError) {
          console.error("Failed to merge cart:", mergeError);
          // Don't fail the login, just log the error
        } else {
          // Clear session cookie after successful merge
          cookieStore.delete("session_id");
        }
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
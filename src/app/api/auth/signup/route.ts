import { cookies } from "next/headers";
import { supabaseServer } from "../../supabaseServer";

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session_id")?.value;

    const supabase = await supabaseServer();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: username,
          session_id: sessionId,
        },
      },
    });

    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 400 },
      );
    }

    // Save token in cookie
    if (data?.session?.access_token) {
      cookieStore.set("jwtToken", data.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });
    }

    // Return the same session object
    return new Response(
      JSON.stringify({
        success: true,
        user: data.user,
        session: data.session,
      }),
      { status: 200 },
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500 },
    );
  }
}

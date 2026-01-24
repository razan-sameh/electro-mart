import { NextResponse } from "next/server";
import { createServer } from "../../supabaseServer";

export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const redirect = searchParams.get("redirect") || "/";

  const supabase = await createServer();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/callback?redirect=${redirect}`,
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // ⬅️ Supabase بيرجع URL نعمله redirect
  return NextResponse.redirect(data.url);
}

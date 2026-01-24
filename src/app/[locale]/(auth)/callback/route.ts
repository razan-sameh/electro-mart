import { createServer } from "@/app/api/supabaseServer";
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
  await supabase.auth.exchangeCodeForSession(code);

  return NextResponse.redirect(`${origin}${redirect}`);
}

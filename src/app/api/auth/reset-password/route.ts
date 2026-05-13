import { NextResponse } from "next/server";
import { createServer } from "../../supabaseServer";

export async function POST(req: Request) {
  const { password, code } = await req.json();

  if (!code) {
    return NextResponse.json({ error: "Missing reset code" }, { status: 400 });
  }

  const supabase = await createServer();

  // ⬅️ هنا session بيتخزن في cookies
  const { error: sessionError } =
    await supabase.auth.exchangeCodeForSession(code);

  if (sessionError) {
    return NextResponse.json({ error: sessionError.message }, { status: 400 });
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}

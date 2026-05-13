// app/api/auth/change-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createServer } from "../../supabaseServer";
import { createClient } from "@supabase/supabase-js";

export async function PUT(req: NextRequest) {
  const supabase = await createServer();
  const { currentPassword, password, passwordConfirmation } = await req.json();

  if (!currentPassword || !password || !passwordConfirmation) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }
  if (password !== passwordConfirmation) {
    return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
  }
  if (password === currentPassword) {
    return NextResponse.json(
      { error: "New password must be different from current password." },
      { status: 400 }
    );
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  // Step 1: Verify current password
  const tempClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_API!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { data: signInData, error: signInError } =
    await tempClient.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword,
    });

  if (signInError || !signInData.session) {
    return NextResponse.json(
      { error: "Current password is incorrect." },
      { status: 400 }
    );
  }

  // Step 2: Update password using verified session
  const authedClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_API!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  await authedClient.auth.setSession({
    access_token: signInData.session.access_token,
    refresh_token: signInData.session.refresh_token,
  });

  const { error: updateError } = await authedClient.auth.updateUser({ password });

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Password updated successfully." });
}
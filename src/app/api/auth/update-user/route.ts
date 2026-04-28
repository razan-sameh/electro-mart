// app/api/auth/update-user/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createServer } from "../../supabaseServer";

export async function PUT(req: NextRequest) {
  const supabase = await createServer();
  const body = await req.json();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // --- USERNAME ---
    if (body.username !== undefined) {
      const { error: rpcError } = await supabase.rpc("update_user_profile", {
        p_user_id: user.id,
        p_display_name: body.username, // 👈 maps form field -> db column
      });
      if (rpcError) throw new Error(rpcError.message);
    }

    // --- PHONE ---
    if (body.phone !== undefined) {
      const { dialCode, number, countryCode } = body.phone;
      const fullPhone = `${dialCode}${number}`;

      const { error: rpcError } = await supabase.rpc("update_user_profile", {
        p_user_id: user.id,
        p_phone: fullPhone,
        p_phone_dial_code: dialCode,
        p_phone_number: number,
        p_phone_country_code: countryCode || "",
      });
      if (rpcError) throw new Error(rpcError.message);
    }

    // --- EMAIL ---
    if (body.email !== undefined) {
      // ✅ Block if same as current email
      if (body.email === user.email) {
        return NextResponse.json(
          { error: "This is already your current email." },
          { status: 400 },
        );
      }

      const { error } = await supabase.auth.updateUser({ email: body.email });

      if (error) {
        // ✅ Map Supabase error messages to friendly ones
        const msg = error.message.toLowerCase();
        if (
          msg.includes("already registered") ||
          msg.includes("already been registered")
        ) {
          return NextResponse.json(
            { error: "This email is already used by another account." },
            { status: 409 },
          );
        }
        if (msg.includes("invalid")) {
          return NextResponse.json(
            { error: "Please enter a valid email address." },
            { status: 400 },
          );
        }
        throw new Error(error.message);
      }
    }
    return NextResponse.json({ message: "Updated successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

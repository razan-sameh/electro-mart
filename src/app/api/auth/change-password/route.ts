import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { serverApiClient } from "../../serverApiClient";

export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("jwtToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { currentPassword, password, passwordConfirmation } = body;

    if (!currentPassword || !password || !passwordConfirmation) {
      return NextResponse.json(
        { error: "All password fields are required" },
        { status: 400 }
      );
    }

    console.log("🔐 Changing password...");

    // ✅ Strapi requires POST here
    const response = await serverApiClient(`/auth/change-password`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentPassword,
        password,
        passwordConfirmation,
      }),
    });

    console.log("✅ Password changed successfully:", response);

    return NextResponse.json(
      { message: "Password changed successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Change password error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

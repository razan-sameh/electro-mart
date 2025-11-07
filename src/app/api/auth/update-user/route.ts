// app/api/auth/update-user/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { typPhone, typUser } from "@/content/types";
import { serverApiClient } from "../../serverApiClient";

export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("jwtToken")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const newData = await req.json();

    // 1️⃣ Get current user info
    const user: typUser = await serverApiClient("/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    // 2️⃣ Update or create phone
    let phoneId: string | null = null;

    if (newData.phone) {
      const { dailcode, number, countryCode } = newData.phone;

      const existingPhoneRes = (await serverApiClient(
        `/phones?filters[user][id][$eq]=${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )) as { data: typPhone[]; meta?: any }; // ✅ explicit type

      const existingPhone = existingPhoneRes.data;

      if (existingPhone && existingPhone.length > 0) {
        phoneId = existingPhone[0].documentId!;

        await serverApiClient(`/phones/${phoneId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: {
              dailcode,
              number,
              countryCode,
              user: user.id,
            },
          }),
        });
      } else {
        (await serverApiClient(`/phones`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: {
              dailcode,
              number,
              countryCode,
              user: user.id,
            },
          }),
        })) as { data: { id: number } };
      }
    }

    // 3️⃣ Update user basic info (username, email)
    const payload: Record<string, any> = {};
    if (newData.username) payload.username = newData.username;
    if (newData.email) payload.email = newData.email;

    if (Object.keys(payload).length > 0) {
      const updatedUser = await serverApiClient(`/users/${user.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      return NextResponse.json({ updatedUser, phoneId }, { status: 200 });
    } else {
      return NextResponse.json(
        { message: "No changes", phoneId },
        { status: 200 }
      );
    }
  } catch (err) {
    console.error("❌ Update error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

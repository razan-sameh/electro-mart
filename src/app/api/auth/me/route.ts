// app/api/auth/me/route.ts
import { cookies } from "next/headers";
import { supabaseServer } from "../../supabaseServer";

export async function GET() {
  try {
    const supabase = await supabaseServer();
      const {
        data: { user },
      } = await supabase.auth.getUser();

    return Response.json({ user });
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return Response.json({ user: null }, { status: 401 });
  }
}

// app/api/auth/me/route.ts
import { createServer } from "../../supabaseServer";

export async function GET() {
  try {
    const supabase = await createServer();
      const {
        data: { user },
      } = await supabase.auth.getUser();

    return Response.json({ user });
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return Response.json({ user: null }, { status: 401 });
  }
}

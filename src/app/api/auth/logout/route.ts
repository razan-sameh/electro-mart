// app/api/auth/logout/route.ts
import { cookies } from "next/headers";
import { createServer } from "../../supabaseServer";

export async function POST() {
  const cookieStore = await cookies();
  const supabase = await createServer();
  let { error } = await supabase.auth.signOut();
  if (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400 },
    );
  } else {
    cookieStore.delete({ name: "jwtToken", path: "/" });
  }

  return Response.json({ success: true });
}

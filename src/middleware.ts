import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest } from "next/server";
import { createServer } from "./app/api/supabaseServer";

const intlMiddleware = createMiddleware(routing);

export async function middleware(req: NextRequest) {
  const res = intlMiddleware(req);

  const supabase = await createServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Only set session_id if user is NOT authenticated
  const sessionId = req.cookies.get("session_id")?.value;

  if (!user && !sessionId) {
    res.cookies.set("session_id", crypto.randomUUID(), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  // If user IS authenticated, remove session_id
  if (user && sessionId) {
    res.cookies.delete("session_id");
  }

  return res;
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};

// app/api/auth/google/callback/route.ts
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    const access_token = searchParams.get("access_token");
    const error = searchParams.get("error");

    if (error) {
      return NextResponse.redirect(new URL("/login?error=google_failed", req.url));
    }

    if (!access_token) {
      return NextResponse.redirect(new URL("/login?error=missing_token", req.url));
    }

    const strapiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";
    
    // Exchange Google access token for Strapi JWT
    // This calls Strapi's auth callback to get the actual JWT
    const authResponse = await fetch(
      `${strapiUrl}/api/auth/google/callback?access_token=${access_token}`,
      {
        method: 'GET',
      }
    );

    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      console.error("Strapi auth failed:", errorText);
      return NextResponse.redirect(new URL("/login?error=auth_failed", req.url));
    }

    const authData = await authResponse.json();
    
    // authData should contain: { jwt: "...", user: {...} }
    if (!authData.jwt) {
      console.error("No JWT in response:", authData);
      return NextResponse.redirect(new URL("/login?error=no_jwt", req.url));
    }

    // Set the Strapi JWT in cookies
    const cookieStore = await cookies();
    cookieStore.set("jwtToken", authData.jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
    
    return NextResponse.redirect(new URL("/", req.url));
    
  } catch (err: any) {
    console.error("Callback error:", err);
    return NextResponse.redirect(new URL("/login?error=server_error", req.url));
  }
}
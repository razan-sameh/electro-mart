import { serverApiClient } from "@/app/api/serverApiClient";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();

    let data: { jwt?: string; user?: any } = {};
    try {
      // Try to register user
      data = await serverApiClient("/auth/local/register", {
        method: "POST",
        body: JSON.stringify({ email, password, username }),
      });
      
      
    } catch (err: any) {
      console.warn("Registration error:", err.message);
      // Return error instead of continuing
      return Response.json({
        success: false,
        error: err.message || "Registration failed",
      }, { status: 400 });
    }

    // Set JWT if exists
    if (data.jwt) {
      const cookieStore = await cookies();
      cookieStore.set("jwtToken", data.jwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });
    } else {
      console.error("⚠️ No JWT returned - email confirmation likely required");
    }

    // ✅ Always respond with success
    return Response.json({
      success: true,
      message: data.jwt 
        ? "Registration successful!" 
        : "Registration successful! Please check your email to confirm your account.",
      user: data.user,
      emailConfirmationPending: !data.jwt,
    });

  } catch (err: any) {
    console.error("Signup error:", err.message);
    return Response.json({
      success: false,
      error: "Error creating user. Please try again.",
    }, { status: 500 });
  }
}
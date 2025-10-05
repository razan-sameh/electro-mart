// app/api/auth/reset-password/route.ts
import { serverApiClient } from "@/app/api/serverApiClient";

export async function POST(req: Request) {
  try {
    const { code, password, passwordConfirmation } = await req.json();

    console.log("Reset password request:", { code, password, passwordConfirmation }); // ADD THIS

    const data = await serverApiClient<{ jwt: string; user: any }>(
      "/auth/reset-password",
      {
        method: "POST",
        body: JSON.stringify({
          code,
          password,
          passwordConfirmation,
        }),
      }
    );

    console.log("Reset password success:", data); // ADD THIS

    return Response.json({ 
      message: "Password reset successfully",
      user: data.user 
    });
  } catch (error: any) {
    console.error("Reset password error:", error); // ADD THIS
    console.error("Error message:", error.message); // ADD THIS
    
    return Response.json(
      { error: error.message || "Failed to reset password" },
      { status: 400 }
    );
  }
}
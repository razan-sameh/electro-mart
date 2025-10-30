// app/api/auth/reset-password/route.ts
import { serverApiClient } from "@/app/api/serverApiClient";

export async function POST(req: Request) {
  try {
    const { code, password, passwordConfirmation } = await req.json();

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
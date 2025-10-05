import { serverApiClient } from "@/app/api/serverApiClient";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    await serverApiClient("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    return Response.json({ 
      message: "Password reset email sent successfully" 
    });
  } catch (error: any) {
    return Response.json(
      { error: error.message || "Failed to send reset email" },
      { status: 400 }
    );
  }
}
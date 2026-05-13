import { createServer } from "../../supabaseServer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const supabase = await createServer();
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/reset-password",
    });

    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 400 },
      );
    } else {
      return Response.json({
        message: "Password reset email sent successfully",
      });
    }
  } catch (error: any) {
    return Response.json(
      { error: error.message || "Failed to send reset email" },
      { status: 400 },
    );
  }
}

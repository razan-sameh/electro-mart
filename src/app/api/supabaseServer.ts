import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_API!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

export const supabaseServer = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("jwtToken")?.value;

  const options: any = {};

  if (accessToken) {
    options.global = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
  }

  return createClient(supabaseUrl, supabaseKey, options);
};

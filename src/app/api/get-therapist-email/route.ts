import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const { userId } = await req.json();

  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data } = await supabaseAdmin.auth.admin.getUserById(userId);
    const email = data?.user?.email || "";

    return NextResponse.json({ email });
  } catch (error) {
    console.error("Error fetching therapist email:", error);
    return NextResponse.json({ email: "" });
  }
}
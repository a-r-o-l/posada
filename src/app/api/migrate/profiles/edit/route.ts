import { supabaseAdmin } from "@/supabase/supabase";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { userId, availableGrades, children } = await request.json();

  // Actualizar solo los campos necesarios en profile
  const { error: profileError } = await supabaseAdmin
    .from("profile")
    .update({
      availableGrades: availableGrades,
      children: children,
    })
    .eq("id", userId);

  if (profileError) {
    return NextResponse.json({ success: false, error: profileError.message });
  }

  return NextResponse.json({ success: true, id: userId });
}

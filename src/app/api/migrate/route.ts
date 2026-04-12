import { supabaseAdmin } from "@/supabase/supabase";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { user } = await request.json();

  // Crear usuario con ID personalizado
  const { data, error } = await supabaseAdmin.rpc("create_user_direct", {
    p_id: user._id,
    p_email: user.email,
    p_password: user.password,
    p_metadata: {
      name: user.name,
      lastname: user.lastname,
      role: user.role,
    },
  });

  if (error) {
    return NextResponse.json({ success: false, error: error.message });
  }

  // Insertar en profile
  const { error: profileError } = await supabaseAdmin.from("profile").insert({
    id: user._id,
    email: user.email,
    name: user.name,
    lastname: user.lastname,
    type: user.role === "superuser" ? "admin" : user.role,
    status: "approved",
    whatsapp: user.phone,
    available_grades: user.availableGrades || [],
    verified: user.verified || false,
    children: user.children || [],
    first_login: user.isNewAccount || false,
  });

  if (profileError) {
    return NextResponse.json({ success: false, error: profileError.message });
  }

  return NextResponse.json({ success: true, id: user._id });
}

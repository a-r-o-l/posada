import { supabaseAdmin } from "@/supabase/supabase";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { user } = await request.json();

  // Crear usuario con ID personalizado
  const { error } = await supabaseAdmin.rpc("create_user_direct", {
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
    password: user.password,
    name: user.name,
    lastname: user.lastname,
    role: user.role === "superuser" ? "admin" : user.role,
    phone: user.phone,
    availableGrades: user.availableGrades || [],
    verified: user.verified || false,
    children: user.children || [],
    isNewAccount: user.isNewAccount || false,
    disabled: user.disabled || false,
  });

  if (profileError) {
    return NextResponse.json({ success: false, error: profileError.message });
  }

  return NextResponse.json({ success: true, id: user._id });
}

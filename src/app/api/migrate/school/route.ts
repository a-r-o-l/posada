import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/supabase/supabase";
import { ISchool } from "@/models/School";

export async function POST(request: NextRequest) {
  try {
    const { school } = (await request.json()) as { school: ISchool };

    // Verificar si la escuela ya existe en Supabase
    const { data: existingSchool } = await supabase
      .from("schools")
      .select("id")
      .eq("id", school._id)
      .single();

    if (existingSchool) {
      return NextResponse.json({
        success: false,
        error: "La escuela ya existe en Supabase",
      });
    }

    // Preparar datos para Supabase (mapeo de campos)
    const supabaseSchool = {
      id: school._id,
      name: school.name,
      description: school.description || null,
      password: school.password || null,
      isPrivate: school.isPrivate ?? true,
      imageUrl: school.imageUrl || null,
      folders: school.folders || [],
      createdAt: school.createdAt || new Date().toISOString(),
      updatedAt: school.updatedAt || new Date().toISOString(),
    };

    // Insertar en Supabase
    const { error } = await supabase.from("schools").insert([supabaseSchool]);

    if (error) {
      console.error("Error al insertar en Supabase:", error);
      return NextResponse.json({
        success: false,
        error: error.message,
      });
    }

    return NextResponse.json({
      success: true,
      school: supabaseSchool,
    });
  } catch (error) {
    console.error("Error en migración de escuela:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
}

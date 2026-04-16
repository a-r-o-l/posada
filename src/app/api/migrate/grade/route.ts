import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/supabase/supabase";
import { IGrade } from "@/models/Grade";

export async function POST(request: NextRequest) {
  try {
    const { grade } = (await request.json()) as { grade: IGrade };

    // Verificar si el grade ya existe en Supabase
    const { data: existingGrade } = await supabase
      .from("grades")
      .select("id")
      .eq("id", grade._id)
      .single();

    if (existingGrade) {
      return NextResponse.json({
        success: false,
        error: "El grade ya existe en Supabase",
      });
    }

    // Preparar datos para Supabase (mapeo de campos)
    const supabaseGrade = {
      id: grade._id,
      grade: grade.grade,
      division: grade.division,
      displayName: grade.displayName || `${grade.grade} ${grade.division}`,
      schoolId: grade.schoolId,
      year: grade.year || new Date().getFullYear().toString(),
    };

    // Insertar en Supabase
    const { error } = await supabase.from("grades").insert([supabaseGrade]);

    if (error) {
      console.error("Error al insertar en Supabase:", error);
      return NextResponse.json({
        success: false,
        error: error.message,
      });
    }

    return NextResponse.json({
      success: true,
      grade: supabaseGrade,
    });
  } catch (error) {
    console.error("Error en migración de grade:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
}

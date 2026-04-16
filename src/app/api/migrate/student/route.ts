// app/api/migrate/student/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/supabase/supabase";
import { IStudent } from "@/models/Student";

export async function POST(request: NextRequest) {
  try {
    const { student } = (await request.json()) as { student: IStudent };

    // Verificar si el estudiante ya existe en Supabase
    const { data: existingStudent } = await supabase
      .from("students")
      .select("id")
      .eq("id", student._id)
      .single();

    if (existingStudent) {
      return NextResponse.json({
        success: false,
        error: "El estudiante ya existe en Supabase",
      });
    }

    // Mapear campos de MongoDB a Supabase (snake_case)
    const supabaseStudent = {
      id: student._id,
      name: student.name,
      lastname: student.lastname,
      displayName: student.displayName,
      gradeId: student.gradeId,
      schoolId: student.schoolId,
    };

    // Insertar en Supabase
    const { error } = await supabase.from("students").insert([supabaseStudent]);

    if (error) {
      console.error("Error al insertar estudiante en Supabase:", error);
      return NextResponse.json({
        success: false,
        error: error.message,
      });
    }

    return NextResponse.json({
      success: true,
      student: supabaseStudent,
    });
  } catch (error) {
    console.error("Error en migración de estudiante:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/supabase/supabase";

export async function POST(request: NextRequest) {
  try {
    const { studentId, gradeId, schoolId } = await request.json();

    if (!studentId) {
      return NextResponse.json({
        success: false,
        error: "studentId es requerido",
      });
    }

    // Actualizar solo los campos necesarios en students
    const { error } = await supabase
      .from("students")
      .update({
        gradeId: gradeId,
        schoolId: schoolId,
      })
      .eq("id", studentId);

    if (error) {
      console.error("Error al actualizar estudiante en Supabase:", error);
      return NextResponse.json({
        success: false,
        error: error.message,
      });
    }

    return NextResponse.json({
      success: true,
      id: studentId,
      updatedFields: { gradeId, schoolId },
    });
  } catch (error) {
    console.error("Error en edición de estudiante:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
}

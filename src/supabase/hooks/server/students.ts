import { Student } from "@/supabase/models/student";
import { createClient } from "@/supabase/server";

export async function getStudents() {
  const supabase = await createClient();

  const { data: students, error } = await supabase.from("students").select("*");

  if (error) throw new Error(error.message);

  return students;
}

export async function getStudentsByGrade(gradeId: string) {
  if (!gradeId) {
    return { data: [] };
  }
  const supabase = await createClient();

  const { data: students, error } = await supabase
    .from("students")
    .select("*, grade:grades(*)")
    .eq("grade_id", gradeId);

  if (error) throw new Error(error.message);

  return { data: students };
}

export async function getStudent(id: string) {
  const supabase = await createClient();

  const { data: students, error } = await supabase
    .from("students")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  return { students };
}

export const createManyStudents = async (students: Partial<Student>[]) => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("students")
      .upsert(students, {
        onConflict: "id", // o el campo que identifique duplicados
        ignoreDuplicates: false, // false: actualiza, true: ignora
      })
      .select();

    if (error) {
      throw error;
    }
    return {
      success: true,
      message: "Estudiantes creados/actualizados",
      data: data,
    };
  } catch (error) {
    console.error("Error creando estudiantes:", error);
    return {
      success: false,
      message: "Error al crear los estudiantes",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

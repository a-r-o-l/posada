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

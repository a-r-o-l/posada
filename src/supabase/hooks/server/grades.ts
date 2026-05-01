import { Grade } from "@/supabase/models/grade";
import { createClient } from "@/supabase/server";

export async function getGrades() {
  const supabase = await createClient();

  const { data: grades, error } = await supabase.from("grades").select("*");

  if (error) throw new Error(error.message);

  return grades;
}

export async function getGradesBySchoolId(schoolId: string): Promise<Grade[]> {
  if (!schoolId) return [];

  const supabase = await createClient();

  const { data: grades, error } = await supabase
    .from("grades")
    .select("*")
    .eq("school_id", schoolId);

  if (error) {
    console.error("Error fetching grades:", error);
    return [];
  }

  return grades || [];
}

export async function getGradesBySchoolIdYear(schoolId: string, year: string) {
  const supabase = await createClient();

  const { data: grades, error } = await supabase
    .from("grades")
    .select("*")
    .eq("school_id", schoolId)
    .eq("year", year);

  if (error) throw new Error(error.message);

  return { data: grades };
}

export async function getGrade(id: string) {
  const supabase = await createClient();

  const { data: grade, error } = await supabase
    .from("grades")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  return { grade };
}

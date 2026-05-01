import { createClient } from "@/supabase/server";

export async function getProfileStudents() {
  const supabase = await createClient();

  const { data: profileStudents, error } = await supabase
    .from("profile_students")
    .select("*");

  if (error) throw new Error(error.message);

  return profileStudents;
}

export async function getProfileStudentsByAccountId(id: string) {
  const supabase = await createClient();

  const { data: profileStudents, error } = await supabase
    .from("profile_students")
    .select("*")
    .eq("account_id", id);

  if (error) throw new Error(error.message);

  return profileStudents;
}

export async function getProfileStudent(id: string) {
  const supabase = await createClient();

  const { data: profileStudent, error } = await supabase
    .from("profile_students")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  return { profileStudent };
}

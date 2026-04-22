import { createClient } from "@/supabase/server";

export async function getSchools() {
  const supabase = await createClient();

  const { data: schools, error } = await supabase.from("schools").select("*");

  if (error) throw new Error(error.message);

  return schools;
}

export async function getSchool(id: string) {
  const supabase = await createClient();

  const { data: school, error } = await supabase
    .from("schools")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  return { school };
}

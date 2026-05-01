import { createClient } from "@/supabase/server";

export async function getProfiles() {
  const supabase = await createClient();

  const { data: profiles, error } = await supabase.from("profile").select("*");

  if (error) throw new Error(error.message);

  return profiles;
}

export async function searchProfiles(searchTerm: string) {
  const supabase = await createClient();

  const { data: profiles, error } = await supabase
    .from("profile")
    .select(
      "*, children:profile_students(*, student:student_id(*, school:school_id(*), grade:grade_id(*)))",
    )
    .ilike("email", `%${searchTerm}%`)
    .ilike("name", `%${searchTerm}%`)
    .ilike("lastname", `%${searchTerm}%`);

  if (error) throw new Error(error.message);

  return profiles;
}

export async function getProfile(id: string) {
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("profile")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  return { profile };
}

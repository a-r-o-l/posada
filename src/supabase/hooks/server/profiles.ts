import { createClient } from "@/supabase/server";
import { ProfileFullDetails } from "@/supabase/models/profile";

export async function getProfiles() {
  const supabase = await createClient();

  const { data: profiles, error } = await supabase.from("profile").select("*");

  if (error) throw new Error(error.message);

  return profiles;
}

export async function searchProfiles(
  searchTerm: string,
): Promise<ProfileFullDetails[]> {
  const supabase = await createClient();
  const term = searchTerm.trim();
  const pageSize = 1000;
  let from = 0;
  const profiles: ProfileFullDetails[] = [];

  while (true) {
    let query = supabase
      .from("profile")
      .select(
        "*, children:profile_students(*, student:student_id(*, school:school_id(*), grade:grade_id(*)))",
      )
      .order("id", { ascending: true })
      .range(from, from + pageSize - 1);

    if (term) {
      query = query.or(
        `email.ilike.%${term}%,name.ilike.%${term}%,lastname.ilike.%${term}%`,
      );
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);
    if (!data || data.length === 0) break;

    profiles.push(...(data as ProfileFullDetails[]));

    if (data.length < pageSize) break;
    from += pageSize;
  }

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

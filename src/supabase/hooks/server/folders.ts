import { Folder } from "@/supabase/models/folder";
import { createClient } from "@/supabase/server";

export async function getFolders() {
  const supabase = await createClient();

  const { data: folders, error } = await supabase.from("folders").select("*");

  if (error) throw new Error(error.message);

  return folders;
}

export async function getFoldersBySchoolId(
  id: string,
  level?: string,
  year?: string,
): Promise<Folder[]> {
  if (!id) {
    return [];
  }

  const supabase = await createClient();

  let query = supabase
    .from("folders")
    .select("*")
    .eq("school_id", id)
    .order("year", { ascending: false })
    .order("title", { ascending: true });

  if (level !== undefined) {
    query = query.eq("level", level);
  }

  if (year !== undefined) {
    query = query.eq("year", year);
  }

  const { data: folders, error } = await query;

  if (error) {
    console.error("Error fetching folders:", error);
    return [];
  }

  return folders || [];
}

export async function getFolder(id: string) {
  const supabase = await createClient();

  const { data: folder, error } = await supabase
    .from("folders")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  return folder;
}

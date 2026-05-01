import { File } from "@/supabase/models/file";
import { Folder } from "@/supabase/models/folder";
import { createClient } from "@/supabase/server";

export async function getFiles() {
  const supabase = await createClient();
  const { data: files, error } = await supabase.from("files").select("*");
  if (error) throw new Error(error.message);
  return files;
}

export async function getFilesAndFoldersByFolderId(
  folderId: string,
): Promise<{ folders: Folder[]; files: File[] }> {
  if (!folderId) return { folders: [], files: [] };
  const supabase = await createClient();

  const { data: files, error } = await supabase
    .from("files")
    .select("*")
    .eq("folder_id", folderId);

  if (error) {
    console.error("Error fetching files:", error);
    return { folders: [], files: [] };
  }

  const { data: folders, error: folderError } = await supabase
    .from("folders")
    .select("*")
    .eq("parent_folder", folderId);

  if (folderError) {
    console.error("Error fetching folders:", folderError);
    return { folders: [], files: files || [] };
  }

  return { folders: folders || [], files: files || [] };
}

export async function getFile(id: string) {
  const supabase = await createClient();
  const { data: file, error } = await supabase
    .from("files")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return { file };
}

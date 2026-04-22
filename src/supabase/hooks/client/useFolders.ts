import { useState } from "react";
import { supabase } from "@/supabase/supabase";
import { Folder } from "@/supabase/models/folder";

export const useFolders = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [folder, setFolder] = useState<Folder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFoldersBySchoolYearLevel = async (
    schoolId: string,
    year: string,
    level: string,
  ) => {
    try {
      setLoading(true);
      setError(null);
      const query = supabase
        .from("folders")
        .select(`*`)
        .eq("school_id", schoolId)
        .eq("year", year)
        .eq("level", level)
        .order("title", { ascending: true });
      const { data, error } = await query;
      if (error) throw error;
      setFolders(data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al obtener carpetas",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchGradesBySchoolId = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("folders")
        .select("*")
        .eq("school_id", id);
      if (error) throw error;
      setFolders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al obtener cursos");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    folders,
    folder,
    loading,
    error,
    fetchFoldersBySchoolYearLevel,
    fetchGradesBySchoolId,
  };
};
